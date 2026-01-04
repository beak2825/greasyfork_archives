// ==UserScript==
// @name         Enhanced Plex.tv Album Art Resizer
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  Apply dynamic resizing to album art on Plex.tv.
// @author       M19.ca
// @match        *://app.plex.tv/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/487270/Enhanced%20Plextv%20Album%20Art%20Resizer.user.js
// @updateURL https://update.greasyfork.org/scripts/487270/Enhanced%20Plextv%20Album%20Art%20Resizer.meta.js
// ==/UserScript==

class PlexAlbumArtResizer {
    constructor() {
        this.savedSize = parseFloat(localStorage.getItem('plexAlbumArtSize')) || 1.0;
        this.SCROLL_SENSITIVITY = -0.3;
    }

    init() {
        this.addEventListeners();
        window.addEventListener('load', () => this.adjustAlbumArtSize(true));
        this.observeDOMChanges();
    }

    isMiniPlayerActive() {
        return !!document.querySelector('[class*="Player-miniPlayerContainer-"]');
    }

    adjustAlbumArtSize(useTransition = true) {
        const albumArt = document.querySelector('[class*="MetadataPosterCardFace-face-"]');
        if (!albumArt || this.isMiniPlayerActive()) return;

        albumArt.style.transform = `scale(${this.savedSize})`;
        albumArt.style.transition = useTransition ? 'transform 0.3s ease' : '';
    }

    addEventListeners() {
        document.addEventListener('wheel', (event) => this.handleScroll(event), { passive: false });
        document.addEventListener('contextmenu', (event) => this.handleContextMenu(event));
    }

    handleScroll(event) {
        if (this.isMiniPlayerActive()) return;

        const albumArt = event.target.closest('[class*="MetadataPosterCardFace-face-"]');
        if (!albumArt) return;

        event.preventDefault();
        const direction = Math.sign(event.deltaY);
        this.savedSize = Math.max(0.5, Math.min(2.0, this.savedSize + direction * this.SCROLL_SENSITIVITY));
        localStorage.setItem('plexAlbumArtSize', this.savedSize.toString());
        this.adjustAlbumArtSize();
    }

    handleContextMenu(event) {
        const albumArt = event.target.closest('[class*="MetadataPosterCardFace-face-"]');
        if (!albumArt || this.isMiniPlayerActive()) return;

        event.preventDefault();
        this.savedSize = 1.0;
        localStorage.setItem('plexAlbumArtSize', '1.0');
        this.adjustAlbumArtSize(true);
    }

    observeDOMChanges() {
        const observer = new MutationObserver(() => this.adjustAlbumArtSize(!this.isMiniPlayerActive()));
        observer.observe(document.body, { childList: true, subtree: true });
    }
}

(new PlexAlbumArtResizer()).init();