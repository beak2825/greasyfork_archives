// ==UserScript==
// @name         Pixiv Favorite Key
// @namespace    pixiv-favorite-key-e18f7be2ab0ba7d160427dd69d313fe7819819b830dde89b544f1c169ad20225
// @description  Enables pressing the F key to favorite/bookmark a post.
// @author       Pwalpac
// @version      0.1
// @icon         https://www.pixiv.net/favicon.ico
// @match        https://www.pixiv.net/*
// @license MIT
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/442159/Pixiv%20Favorite%20Key.user.js
// @updateURL https://update.greasyfork.org/scripts/442159/Pixiv%20Favorite%20Key.meta.js
// ==/UserScript==


(function() {
    'use strict';

    function setupKeyPressHandler() {
        const mouseClickEvent = new MouseEvent("click", {
            bubbles: true,
        })

        function handleKeyPress(event) {
            if (event.key === 'f') {
                document.getElementsByClassName("gtm-main-bookmark")[0].dispatchEvent(mouseClickEvent)
            }
        }

        document.addEventListener('keydown', handleKeyPress)
    }

    setupKeyPressHandler()
})();