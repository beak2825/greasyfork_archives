// ==UserScript==
// @name         Reasonable Instagram video player
// @namespace    uls
// @version      0.3
// @description  Enable video player controls and set default volume to 40%.
// @author       uls
// @include      *instagram.com*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/411761/Reasonable%20Instagram%20video%20player.user.js
// @updateURL https://update.greasyfork.org/scripts/411761/Reasonable%20Instagram%20video%20player.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function videoFixer() {
        var player = document.querySelector('video:not([fixed])')
        if(!player)
            return
        console.log('updating player')
        player.style.zIndex = 99999
        player.setAttribute('controls', 1)
        player.setAttribute('autoplay', 1)
        player.muted = false
        player.volume = 0.4
        player.setAttribute('fixed', 1)
    }

    setInterval(videoFixer, 1000)
})();