// ==UserScript==
// @name           YouTube AdBlock Ban Bypass
// @namespace      http://tampermonkey.net/
// @version        0.1.1
// @description    Bypass YouTube Adblock Ban
// @author         JJJ
// @match          https://www.youtube.com/*
// @match          https://www.youtube-nocookie.com/embed/*
// @exclude        https://www.youtube.com/*/community
// @icon           https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant          GM_getValue
// @grant          GM_setValue
// @grant          GM_registerMenuCommand
// @license        MIT
// @downloadURL https://update.greasyfork.org/scripts/511381/YouTube%20AdBlock%20Ban%20Bypass.user.js
// @updateURL https://update.greasyfork.org/scripts/511381/YouTube%20AdBlock%20Ban%20Bypass.meta.js
// ==/UserScript==

(() => {
    'use strict';

    const CONSTANTS = {
        IFRAME_ID: 'adblock-bypass-player',
        DELAY: 300,
        MAX_TRIES: 150,
        DUPLICATE_CHECK_INTERVAL: 7000
    };

    const SELECTORS = {
        PLAYABILITY_ERROR: '.yt-playability-error-supported-renderers',
        ERROR_SCREEN: '#error-screen',
        PLAYER_CONTAINER: '#movie_player'
    };

    let currentUrl = window.location.href;
    let tries = 0;

    const urlUtils = {
        extractParams(url) {
            try {
                const params = new URL(url).searchParams;
                return { videoId: params.get('v') };
            } catch (e) {
                console.error('Failed to extract URL parameters:', e);
                return {};
            }
        },

        getEmbedUrl(videoId) {
            return `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&modestbranding=1`;
        }
    };

    const playerManager = {
        createIframe(videoId) {
            const iframe = document.createElement('iframe');
            iframe.id = CONSTANTS.IFRAME_ID;
            iframe.src = urlUtils.getEmbedUrl(videoId);
            iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
            iframe.allowFullscreen = true;
            iframe.style.cssText = `
                height: 100%;
                width: 100%;
                border: none;
                display: block;
                margin: 0;
                padding: 0;
            `;
            return iframe;
        },

        replacePlayer(videoId) {
            const errorScreen = document.querySelector(SELECTORS.ERROR_SCREEN);
            if (!errorScreen) return;

            let iframe = document.getElementById(CONSTANTS.IFRAME_ID);
            if (!iframe) {
                iframe = this.createIframe(videoId);
                errorScreen.appendChild(iframe);
            }
        },

        removeDuplicateIframes() {
            const iframes = document.querySelectorAll(`#${CONSTANTS.IFRAME_ID}`);
            if (iframes.length > 1) {
                Array.from(iframes).slice(1).forEach(iframe => iframe.remove());
            }
        }
    };

    function handleAdBlockError() {
        const playabilityError = document.querySelector(SELECTORS.PLAYABILITY_ERROR);
        if (playabilityError) {
            playabilityError.remove();
            const { videoId } = urlUtils.extractParams(currentUrl);
            if (videoId) {
                playerManager.replacePlayer(videoId);
            }
        } else if (tries < CONSTANTS.MAX_TRIES) {
            tries++;
            setTimeout(handleAdBlockError, CONSTANTS.DELAY);
        }
    }

    function setupEventListeners() {
        document.addEventListener('yt-navigate-finish', () => {
            const newUrl = window.location.href;
            if (newUrl !== currentUrl) {
                currentUrl = newUrl;
                handleAdBlockError();
            }
        });

        const observer = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                if (mutation.type === 'childList' &&
                    document.querySelector(SELECTORS.PLAYABILITY_ERROR)) {
                    handleAdBlockError();
                    return;
                }
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });

        setInterval(() => playerManager.removeDuplicateIframes(), CONSTANTS.DUPLICATE_CHECK_INTERVAL);
    }

    function initialize() {
        setupEventListeners();
        handleAdBlockError();
    }

    initialize();
})();