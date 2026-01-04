// ==UserScript==
// @name         Reasonable Instagram video player (fix)
// @namespace    Violentmonkey scripts
// @version      1.0
// @description  Automatically enable video player controls and set default volume to 20%.
// @author       uls (fix by goldnick7)
// @include      *instagram.com*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/417065/Reasonable%20Instagram%20video%20player%20%28fix%29.user.js
// @updateURL https://update.greasyfork.org/scripts/417065/Reasonable%20Instagram%20video%20player%20%28fix%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function videoFixer() {
        var player = document.querySelector('video:not([fixed])')
        if(!player)
            return
        console.log('updating player');
        player.style.zIndex = 1;
        player.setAttribute('controls', 1);
        player.setAttribute('autoplay', 1);
        player.muted = false;
        player.volume = 0.2;
        player.setAttribute('fixed', 1);
        player.pause();
    }

    setInterval(videoFixer, 100);
})();