// ==UserScript==
// @name         Focus youtube search bar
// @namespace    http://tampermonkey.net/
// @version      2024-06-09
// @description  Focus youtube's search bar
// @author       paolodelfino
// @match        *://*.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/497463/Focus%20youtube%20search%20bar.user.js
// @updateURL https://update.greasyfork.org/scripts/497463/Focus%20youtube%20search%20bar.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.addEventListener('keydown', function(event) {
        if (event.shiftKey && event.keyCode === 55) {
            const textArea = document.querySelector("input#search")
            if (document.activeElement != textArea) {
              textArea.focus()
              event.preventDefault()
            }
        }
    });
})();