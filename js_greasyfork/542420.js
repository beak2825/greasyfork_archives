// ==UserScript==
// @name         YouTube Dim Watched
// @namespace    http://tampermonkey.net/
// @version      3.4
// @license MIT
// @description  Dim watched YouTube videos with per-section toggles.
// @match        *://www.youtube.com/*
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/542420/YouTube%20Dim%20Watched.user.js
// @updateURL https://update.greasyfork.org/scripts/542420/YouTube%20Dim%20Watched.meta.js
// ==/UserScript==

(() => {
    const DIM_OPACITY = 0.1;
    const CLASS = 'yt-dimmed';

    // Internal section keys
    const sections = {
        grid: 'yt-dim-grid',
        channel: 'yt-dim-channel',
        playlist: 'yt-dim-playlist',
        sidebar: 'yt-dim-sidebar',
        search: 'yt-dim-search'
    };

    // names
    const sectionNames = {
        grid: 'Home & Subs',
        channel: 'Channel',
        playlist: 'Playlist',
        sidebar: 'Sidebar',
        search: 'Search'
    };

    const selectors = {
        grid: ['ytd-rich-item-renderer'],
        channel: ['ytd-grid-video-renderer'],
        playlist: ['ytd-playlist-video-renderer'],
        sidebar: ['yt-lockup-view-model'],
        search: ['ytd-video-renderer']
    };

    let enabled = {};
    let menuIds = {};

    for (const [key, storageKey] of Object.entries(sections)) {
        enabled[key] = GM_getValue(storageKey, true);
    }

    const updateToggleMenu = () => {
        for (const [key, storageKey] of Object.entries(sections)) {
            if (menuIds[key]) GM_unregisterMenuCommand(menuIds[key]);

            const statusEmoji = enabled[key] ? '🟢' : '🔴';
            const label = `${statusEmoji} ${sectionNames[key]}`;

            menuIds[key] = GM_registerMenuCommand(label, () => {
                enabled[key] = !enabled[key];
                GM_setValue(storageKey, enabled[key]);
                update();
                updateToggleMenu();
            });
        }
    };

    updateToggleMenu();

    const style = document.createElement('style');
    style.textContent = `
        ytd-rich-grid-media,
        ytd-rich-item-renderer,
        ytd-grid-video-renderer,
        ytd-playlist-video-renderer,
        ytd-video-renderer,
        yt-lockup-view-model {
            transition: opacity 0.3s ease;
        }
        .${CLASS} {
            opacity: ${DIM_OPACITY} !important;
        }
    `;
    document.head.appendChild(style);

    const isWatched = (el) => {
        return el.querySelector('ytd-thumbnail-overlay-resume-playback-renderer #progress') ||
               el.querySelector('.ytThumbnailOverlayProgressBarHostWatchedProgressBarSegment');
    };

   const update = () => {
    const seen = new WeakSet();

    for (const [section, selList] of Object.entries(selectors)) {
        if (!enabled[section]) continue;

        selList.forEach(selector => {
            document.querySelectorAll(selector).forEach(el => {
                if (seen.has(el)) return;

                // Avoid double-dimming:
                if (
                    section === 'grid' &&
                    el.tagName === 'YTD-RICH-GRID-MEDIA' &&
                    el.closest('ytd-rich-item-renderer')
                ) {
                    return;
                }

                if (
                    section === 'sidebar' &&
                    el.tagName === 'YT-LOCKUP-VIEW-MODEL' &&
                    el.closest('ytd-rich-item-renderer')?.classList.contains(CLASS)
                ) {
                    return;
                }

                seen.add(el);
                const watched = isWatched(el);
                el.classList.toggle(CLASS, watched);
            });
        });
    }

    // Remove dimming from disabled sections
    for (const [section, selList] of Object.entries(selectors)) {
        if (enabled[section]) continue;

        selList.forEach(selector => {
            document.querySelectorAll(selector).forEach(el => {
                el.classList.remove(CLASS);
            });
        });
    }
};


    let pending = false;
    const debouncedUpdate = () => {
        if (pending) return;
        pending = true;
        requestAnimationFrame(() => {
            update();
            pending = false;
        });
    };

    new MutationObserver(debouncedUpdate).observe(document.body, {
        childList: true,
        subtree: true
    });

    update();
})();
