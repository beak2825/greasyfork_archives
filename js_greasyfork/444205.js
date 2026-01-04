// ==UserScript==
// @name         Magoosh GRE App Keyboard Shortcut
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Adds shortcuts to Magoosh GRE Vocab Web App
// @author       You
// @match        https://gre.magoosh.com/flashcards/vocabulary/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=magoosh.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/444205/Magoosh%20GRE%20App%20Keyboard%20Shortcut.user.js
// @updateURL https://update.greasyfork.org/scripts/444205/Magoosh%20GRE%20App%20Keyboard%20Shortcut.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function doc_keyUp(e) {
        switch (e.keyCode) {
            case 32:
                // SPACE
                document.getElementsByClassName("front card flashcard-card")[0].childNodes[1].click()
                break;
            case 89:
                // Y
                document.getElementsByClassName("card-footer card-footer-success text-center")[0].click()
                break;
            case 82:
                // R
                document.getElementsByClassName("card-footer card-footer-danger text-center")[0].click()
                break;
            default:
                break;
        }
    }
    document.addEventListener('keyup', doc_keyUp, false);
})();