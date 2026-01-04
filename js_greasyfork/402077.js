// ==UserScript==
// @name         ComicBus KeyInput
// @namespace    Yr
// @version      1.0
// @author       Yanagiragi
// @description  Allow left/right key input
// @match        https://comicbus.live/online/manga_*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/402077/ComicBus%20KeyInput.user.js
// @updateURL https://update.greasyfork.org/scripts/402077/ComicBus%20KeyInput.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.addEventListener('keydown', function(event) {
        if(event.keyCode == 37) {
            jp()
        }
        else if(event.keyCode == 39) {
            jn();
        }
    });
})();