// ==UserScript==
// @name         Change Likes to Heart
// @namespace    http://tampermonkey.net/
// @version      0.001002
// @description  Изменение иконки лайка на иконку симпатии
// @author       molihan
// @license      MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=lolz.live
// @match        https://lolz.live/threads/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/512002/Change%20Likes%20to%20Heart.user.js
// @updateURL https://update.greasyfork.org/scripts/512002/Change%20Likes%20to%20Heart.meta.js
// ==/UserScript==
(function() {
    'use strict';
    const elements = document.querySelectorAll('.userCounter.item.muted');
    elements.forEach(element => {
        const thumbsUpIcon = element.querySelector('.userCounterIcon.fas.fa-thumbs-up');
        if (thumbsUpIcon) {
            thumbsUpIcon.classList.remove('fa-thumbs-up');
            thumbsUpIcon.classList.add('fa-heart');
        }
    });
})();