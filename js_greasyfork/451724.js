// ==UserScript==
// @name         Animelon shortcuts
// @namespace    https://github.com/sahlaysta/
// @version      0.2
// @description  Adds several shortcuts to Animelon
// @author       sahlaysta
// @match        https://*.animelon.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=animelon.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/451724/Animelon%20shortcuts.user.js
// @updateURL https://update.greasyfork.org/scripts/451724/Animelon%20shortcuts.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //adds a shortcut operation
    function addShortcutFunction(keyCodes, shortcutFn) {
        document.addEventListener('keydown', event => {
            if (!event.altKey && !event.ctrlKey && !event.isComposing
                && !/^(?:input|textarea|select|button)$/i.test(event.target.tagName)
                && keyCodes.includes(event.keyCode)) {
                shortcutFn();
                event.preventDefault();
            }
        });
    }

    //returns the angularjs ng controller for the video player
    function getVideoController() {
        return window.angular.element(document.getElementById('video-player-container')).scope();
    }

    // Spacebar and K to pause/unpause
    addShortcutFunction([32, 75], () => {
        const ngCtrl = getVideoController();
        ngCtrl.playerValues.triggers.play(!(ngCtrl.playerValues.playing));
    });

    // M to mute/unmute
    addShortcutFunction([77], () => {
        const ngCtrl = getVideoController();
        ngCtrl.playerValues.triggers.volume(ngCtrl.playerValues.storage.volume === 0 ? 1 : 0);
    });

    // P to show/unshow the Discord panel
    addShortcutFunction([80], () => {
        document.getElementsByClassName('discordButton')[0].click();
    });

    // J to jump to previous dialogue
    addShortcutFunction([74], () => {
        const ngCtrl = getVideoController();
        ngCtrl.playerValues.triggers.backward();
    });

    // L to jump to next dialogue
    addShortcutFunction([76], () => {
        const ngCtrl = getVideoController();
        ngCtrl.playerValues.triggers.forward();
    });

})();
