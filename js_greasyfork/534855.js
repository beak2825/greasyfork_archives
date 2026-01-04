// ==UserScript==
// @name        aniworld.to - searchfield auto opener
// @namespace   Violentmonkey Scripts
// @match       https://aniworld.to/*
// @grant       none
// @version     1.0
// @author      Martin-R
// @license MIT
// @description 4.5.2025, 00:27:11
// @downloadURL https://update.greasyfork.org/scripts/534855/aniworldto%20-%20searchfield%20auto%20opener.user.js
// @updateURL https://update.greasyfork.org/scripts/534855/aniworldto%20-%20searchfield%20auto%20opener.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.addEventListener('load', () => {
        const searchIcon = document.querySelector('.menuSearchButton i');
        if (searchIcon) {
            searchIcon.click();
            console.log('Suchfeld durch Klick auf <i> automatisch geöffnet.');
        } else {
            console.warn('Such-Icon (<i>) nicht gefunden.');
        }
    });
})();