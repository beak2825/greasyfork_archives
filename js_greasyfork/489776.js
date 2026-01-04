// ==UserScript==
// @name         Unpause video player
// @namespace    http://tampermonkey.net/
// @version      0.8
// @description  Unpause all video players every 10 seconds
// @author       You
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/489776/Unpause%20video%20player.user.js
// @updateURL https://update.greasyfork.org/scripts/489776/Unpause%20video%20player.meta.js
// ==/UserScript==

(function() {
    'use strict';

    setInterval(function() {
        var videos = document.getElementsByTagName('video');
        for (var i = 0; i < videos.length; i++) {
            if (videos[i].paused) {
                videos[i].play();
            }
        }
    }, 10000);
})();