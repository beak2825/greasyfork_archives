// ==UserScript==
// @name         YouTube No Subtitles
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Отключает субтитры на YouTube
// @author       Алехан
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @match        https://www.youtube.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/533620/YouTube%20No%20Subtitles.user.js
// @updateURL https://update.greasyfork.org/scripts/533620/YouTube%20No%20Subtitles.meta.js
// ==/UserScript==

(function() {
    'use strict';
    setInterval(() => {
        const subtitlesButton = document.querySelector('.ytp-subtitles-button');
        if (subtitlesButton && subtitlesButton.getAttribute('aria-pressed') === 'true') {
            subtitlesButton.click();
        }
    }, 1000);
})();