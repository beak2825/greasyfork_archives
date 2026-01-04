// ==UserScript==
// @name         YouTube Automix Remover
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Remove Automix/autoplay junk from YouTube video URLs
// @author       bloxy
// @match        https://www.youtube.com/*
// @match        https://m.youtube.com/*
// @match        https://music.youtube.com/*
// @grant        none
// @compatible   firefox
// @compatible   chrome
// @compatible   opera
// @compatible   safari
// @compatible   edge
// @homepage https://greasyfork.org/en/scripts/539118-youtube-automix-remover
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/539118/YouTube%20Automix%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/539118/YouTube%20Automix%20Remover.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const CLEAN_FLAG = 'yt_cleaned';

    function isAutomixPlaylist(url) {
        const list = url.searchParams.get('list');
        return list && list.startsWith('RD');
    }

    function cleanURL() {
        const url = new URL(window.location.href);

        if (url.pathname !== '/watch') return; // only act on video pages

        if (isAutomixPlaylist(url) && !url.searchParams.has(CLEAN_FLAG)) {
            url.searchParams.delete('list');
            url.searchParams.delete('index');
            url.searchParams.delete('start_radio');
            url.searchParams.set(CLEAN_FLAG, '1');

            const newURL = url.pathname + url.search;

            // Use YouTube's internal router for smooth nav, fallback to reload
            if (window.yt && window.yt.navigate) {
                window.yt.navigate(newURL);
            } else {
                window.location.replace(url.toString());
            }
        }
    }

    function hookNavigation() {
        ['pushState', 'replaceState'].forEach(fn => {
            const original = history[fn];
            history[fn] = function () {
                original.apply(this, arguments);
                setTimeout(cleanURL, 100);
            };
        });

        window.addEventListener('yt-navigate-finish', cleanURL);
    }

    // YouTube's internals can take a second to load, wait for them
    const waitForYouTube = setInterval(() => {
        if (window.yt && window.yt.config_) {
            clearInterval(waitForYouTube);
            cleanURL();
            hookNavigation();
        }
    }, 250);
})();
