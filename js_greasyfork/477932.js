// ==UserScript==
// @name         Replace YouTube Player with iFrame
// @version      1.0
// @description  繞過 YouTube 禁用廣告攔截器 (簡易版)
// @license      MIT
// @homepage     https://github.com/Jacky97s
// @homepageURL  https://github.com/Jacky97s
// @website      https://github.com/Jacky97s
// @source       https://github.com/Jacky97s/bypass-youtube-adblock-blocker/raw/main/src/ReplaceYouTubePlayerWithIFrame.js
// @namespace    https://github.com/Jacky97s/bypass-youtube-adblock-blocker/raw/main/src/ReplaceYouTubePlayerWithIFrame.js
// @match        https://www.youtube.com/watch*
// @author       Jacky97s
// @run-at       document-idle
// @icon         https://www.google.com/s2/favicons?sz=64&domain=sinopac.com
// @downloadURL https://update.greasyfork.org/scripts/477932/Replace%20YouTube%20Player%20with%20iFrame.user.js
// @updateURL https://update.greasyfork.org/scripts/477932/Replace%20YouTube%20Player%20with%20iFrame.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Check if player element exists
    function isPlayerExists() {
        const playerXPath = '//*[@id="player"]';
        const player = document.evaluate(playerXPath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;

        if (player) {
            return player;
        }
    }

    // Replace Player with iframe
    function replacePlayer() {
        const player = isPlayerExists();

        if (player == null) {
            return;
        }

        // Define the video ID from the URL
        const urlParams = new URLSearchParams(window.location.search);
        const videoId = urlParams.get('v');

        // Create the iFrame element
        const iframe = document.createElement('iframe');
        const width = player.offsetWidth;
        const height = width * 0.56;

        iframe.id = "iframe-player"
        iframe.width = '100%';
        iframe.height = height.toString();
        iframe.src = `https://www.youtube.com/embed/${videoId}?feature=oembed&autoplay=1`;
        iframe.frameBorder = '0';
        iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
        iframe.allowFullscreen = true;

        // Replace player with iframe
        player.parentNode.replaceChild(iframe, player);
    }

    // Add a debounce function to limit the rate of execution
    function debounce(func, delay) {
        let timeout;
        return function () {
            const context = this;
            const args = arguments;
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                func.apply(context, args);
            }, delay);
        };
    }

    const debouncedReplacePlayer = debounce(replacePlayer, 500); // Adjust the delay as needed

    // Listen for the 'DOMNodeRemoved' event
    document.addEventListener('DOMNodeRemoved', debouncedReplacePlayer);
})();
