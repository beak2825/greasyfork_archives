// ==UserScript==
// @name         Space mute no cam
// @namespace    http://tampermonkey.net/
// @description  Press space to get muted and close camera in google meet
// @version      0.2
// @author       You
// @match        https://meet.google.com/*
// @downloadURL https://update.greasyfork.org/scripts/431352/Space%20mute%20no%20cam.user.js
// @updateURL https://update.greasyfork.org/scripts/431352/Space%20mute%20no%20cam.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function onspace() {
        var camera = document.querySelectorAll('[aria-label="Désactiver la caméra (Ctrl+e)"]');
        if (camera.length > 0) {
            camera[0].click()
        }
        document.querySelectorAll('[aria-label="Désactiver le micro (Ctrl+d)"]')[0].click();
    }
//https://jsfiddle.net/paolobasso/x3hdaf1d/
    function onKeydown(evt) {
        // Use https://keycode.info/ to get keys
        if (evt.keyCode == 32) {
            onspace();
        }
    }
    document.addEventListener('keydown', onKeydown, true);
})();