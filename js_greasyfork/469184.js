// ==UserScript==
// @name         Wanikani: Press K for Audio
// @namespace    http://tampermonkey.net/
// @version      2
// @description  Allows Wanikani to play another voice.
// @author       You
// @match        https://www.wanikani.com/subject-lessons/*
// @match        https://www.wanikani.com/subjects/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=greasyfork.org
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/469184/Wanikani%3A%20Press%20K%20for%20Audio.user.js
// @updateURL https://update.greasyfork.org/scripts/469184/Wanikani%3A%20Press%20K%20for%20Audio.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Register a hotkey with the "k" key
    window.keyboardManager.registerHotKey({
        key: 'k',
        callback: function() {
            // Get the list item element with the audio button that has auto-play disabled
            let listItem = document.querySelector('.reading-with-audio__audio-item[data-audio-player-auto-play-value="false"]');
            if (!listItem) {
                listItem = document.querySelector('.reading-with-audio__audio-item');
            }

            if (listItem) {
                // Get the button element inside the list item
                const button = listItem.querySelector('.reading-with-audio__icons');

                // Simulate a click on the button element
                button.click();
            }
        }
    });
})();