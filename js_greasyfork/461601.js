// ==UserScript==
// @name         y2monkey
// @namespace    https://github.com/jijirae/y2monkey
// @version      2
// @description  Pressing "CTRL+SHIFT+D" opens the current YouTube video in y2mate, allowing you to download.
// @author       jijirae
// @match        https://www.youtube.com/*
// @grant        none
// @icon         https://i.imgur.com/z8zguyi.png
// @downloadURL https://update.greasyfork.org/scripts/461601/y2monkey.user.js
// @updateURL https://update.greasyfork.org/scripts/461601/y2monkey.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.addEventListener('keydown', function(event) {
        if (event.ctrlKey && event.shiftKey && event.key === 'D') {
            event.preventDefault();
            let currentUrl = window.location.href;
            let modifiedUrl = currentUrl.replace('youtube', 'youtubepp');
            window.open(modifiedUrl, '_blank');
        }
    });
})();