// ==UserScript==
// @name         Spotify Play Random Album
// @namespace    http://spotify.com/
// @version      1.0
// @description  Load all of your albums and play random ones
// @author       b2kdaman
// @match        https://open.spotify.com/collection/albums
// @grant        none
// @require http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/373350/Spotify%20Play%20Random%20Album.user.js
// @updateURL https://update.greasyfork.org/scripts/373350/Spotify%20Play%20Random%20Album.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let albums;
    let lastAlbumsLength = 0;
    const SCROLL_NODE_SELECTOR = '.main-view-container__scroll-node';
    const LOADING_GIF_SELECTOR = 'img[src="/static/assets/images/loading.gif"]';
    const CONTROLS_SELECTOR = '.player-controls__buttons';
    const ALBUMS_PLAYBUTTON_SELECTOR = 'button[aria-label="Play"]';

    const loaderInterval = setInterval(checkIfStillLoading.bind(window), 1000);
    const buttonConfig = {
        className: 'control-button spoticon-track-16',
        attributes: {
            title: 'Play Random Album',
        },
        css: {
            cursor: 'pointer',
            'background-color': '#444',
            color: '#fff',
        }
    }

    function scrollToBottom() {
        document.querySelector(SCROLL_NODE_SELECTOR).scroll(0, 99999);
    }

    function checkIfStillLoading() {
        scrollToBottom();
        if (!$(LOADING_GIF_SELECTOR).length) {
            loadAlbums();
        }
    }

    function applyConfig(ref, config) {
        const attributes = Object.entries(config.attributes);
        const css = Object.entries(config.css);
        ref.addClass(config.className);

        for (const attribute of attributes) {
            ref.attr(attribute.shift(), attribute.shift());
        }

        for (const cssProp of css) {
            ref.attr(cssProp.shift(), cssProp.shift());
        }
    }

    function addButton() {
        clearInterval(loaderInterval);
        const playButton = document.createElement('button');
        const buttonRef = $(playButton);
        buttonRef.click(playRandomAlbum);
        applyConfig(buttonRef, buttonConfig);
        $(CONTROLS_SELECTOR).prepend(playButton);
    }

    function loadAlbums() {
        albums = $(ALBUMS_PLAYBUTTON_SELECTOR);
        if (albums.length !== 0 && lastAlbumsLength === albums.length) {
            addButton();
        } else {
            lastAlbumsLength = albums.length;
            scrollToBottom();
        }
    }

    function playRandomAlbum() {
        albums[Math.round(Math.random() * albums.length)].click();
    }
})();