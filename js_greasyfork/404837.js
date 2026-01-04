// ==UserScript==
// @name         Plex "f" for Fullscreen
// @namespace    https://greasyfork.org/en/users/555204-bcldvd
// @version      0.1
// @description  Press key "f" to toggle fullscreen while watching Plex !
// @author       David Boclé
// @match        https://app.plex.tv/desktop
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/404837/Plex%20%22f%22%20for%20Fullscreen.user.js
// @updateURL https://update.greasyfork.org/scripts/404837/Plex%20%22f%22%20for%20Fullscreen.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.addEventListener('keyup', function (event) {
        if (event.defaultPrevented) {
            return;
        }

        let key = event.key;
        if (key === 'f') openFullscreen()
    });

    function openFullscreen() {
        let elem = document.documentElement;
        if (elem.requestFullscreen) {
            elem.requestFullscreen();
        } else if (elem.mozRequestFullScreen) { /* Firefox */
            elem.mozRequestFullScreen();
        } else if (elem.webkitRequestFullscreen) { /* Chrome, Safari & Opera */
            elem.webkitRequestFullscreen();
        } else if (elem.msRequestFullscreen) { /* IE/Edge */
            elem.msRequestFullscreen();
        }
    }
})();