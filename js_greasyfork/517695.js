// ==UserScript==
// @name         (YouTube Videos▶️ & Shorts🩳)Elements 💬Hider
// @namespace    http://tampermonkey.net/
// @version      1.0005
// @description  Hides shorts info, video controls bar, near-end & end cards on YouTube unless hovered.
// @author       xKuusouka
// @match        https://www.youtube.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/517695/%28YouTube%20Videos%E2%96%B6%EF%B8%8F%20%20Shorts%F0%9F%A9%B3%29Elements%20%F0%9F%92%ACHider.user.js
// @updateURL https://update.greasyfork.org/scripts/517695/%28YouTube%20Videos%E2%96%B6%EF%B8%8F%20%20Shorts%F0%9F%A9%B3%29Elements%20%F0%9F%92%ACHider.meta.js
// ==/UserScript==
(function () {
    'use strict';

    function setVisibility(selector, visible) {
        const elements = document.querySelectorAll(selector);
        elements.forEach(el => {
            el.style.opacity = visible ? '1' : '0';
        });
    }

const css = `
 
    #movie_player > div.html5-endscreen.ytp-player-content.videowall-endscreen.ytp-show-tiles,
    #movie_player > div.ytp-chrome-bottom,
    #movie_player .ytp-ce-element { /* Near-end suggestions */
        opacity: 0;
        transition: opacity 0.3s ease;
    }
    #movie_player:hover > div.html5-endscreen.ytp-player-content.videowall-endscreen.ytp-show-tiles,
    #movie_player:hover > div.ytp-chrome-bottom,
    #movie_player:hover .ytp-ce-element { /* Show on hover */
        opacity: 1 !important;
    }

    #shorts-inner-container .metadata-container {
        opacity: 0;
        transition: opacity 0.3s ease;
    }
    #shorts-inner-container:hover .metadata-container {
        opacity: 1 !important;
    }
    .YtProgressBarLinePlayed,
    yt-progress-bar {
        visibility: visible !important;
        opacity: 1 !important;
        display: block !important;
    }
`;

    const style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);

    function isShortsPage() {
        return window.location.pathname.startsWith('/shorts');
    }

    function handleVisibility() {
        if (isShortsPage()) {

            setVisibility('#shorts-inner-container .metadata-container', false);
        } else {
            setVisibility('#movie_player > div.html5-endscreen.ytp-player-content.videowall-endscreen.ytp-show-tiles', false); // Endscreen suggestions
            setVisibility('#movie_player > div.ytp-chrome-bottom', false); // Control bar
            setVisibility('#movie_player .ytp-ce-element', false); // Near-end suggestions
        }
    }
    const observer = new MutationObserver(handleVisibility);
    observer.observe(document.body, { childList: true, subtree: true });
    handleVisibility();
})();