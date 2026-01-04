// ==UserScript==
// @name        Telegram Message Content Styler
// @namespace   https://github.com/mefengl
// @match       https://web.telegram.org/a/*
// @grant       none
// @version     1.2
// @description This script adjusts the width and max-width of all elements with the class 'message-content' to 100% every second.
// @auther      mefengl
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/500389/Telegram%20Message%20Content%20Styler.user.js
// @updateURL https://update.greasyfork.org/scripts/500389/Telegram%20Message%20Content%20Styler.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function adjustMessageContentWidth() {
        const elements = document.querySelectorAll('.message-content');
        elements.forEach(element => {
            element.style.width = '100%';
            element.style.maxWidth = '100%';
        });
    }

    setInterval(adjustMessageContentWidth, 1000);
})();