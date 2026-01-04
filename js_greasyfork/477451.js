// ==UserScript==
// @name         YouTube Redirect
// @description  Working 2023 adblock for YouTube video. Redirects all "youtube.com" links to yout-ube.com.
// @author       YelloNox
// @version      0.2
// @date         2023-10-10
// @namespace    https://yello.zip
// @homepage     https://github.com/YelloNox/YouTube-Adblock
// @match        *://www.youtube.com/*
// @match        *://www.yout-ube.com/*
// @match        *://www.youtube-nocookie.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/477451/YouTube%20Redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/477451/YouTube%20Redirect.meta.js
// ==/UserScript==

(function () {
    'use strict';
    // Redirect clicked links to new tab and from "youtube.com" to "yout-ube.com"
    document.addEventListener('click', function (event) {
        let target = event.target;
        while (target && target.nodeName !== 'A') {
            target = target.parentElement;
        }

        if (target && target.href) {
            const youtubeVideoRegex = /https:\/\/www\.youtube\.com\/watch\?v=[^&]+/;
            if (youtubeVideoRegex.test(target.href)) {
                event.preventDefault();
                event.stopPropagation();

                const modifiedUrl = target.href.replace('youtube.com', 'yout-ube.com');
                window.open(modifiedUrl, '_blank');
            }
        }
    }, true);

    // Check for text "This video is unavailable" and reload page if found
    function checkForText() {
        const textToFind = "This video is unavailable";
        const pageText = document.body.textContent;

        if (pageText.includes(textToFind)) {
            location.reload();
        }
    }

    window.addEventListener('load', checkForText);
})();
