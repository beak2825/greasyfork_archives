// ==UserScript==
// @name         jeuxvideo.com anti autoplay
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Supprime l'autoplay des vidéos sur jeuxvideo.com
// @author       You
// @match        https://www.jeuxvideo.com/*
// @grant        none
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/419496/jeuxvideocom%20anti%20autoplay.user.js
// @updateURL https://update.greasyfork.org/scripts/419496/jeuxvideocom%20anti%20autoplay.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /*document.querySelectorAll('.player-jv[data-srcset-video]').forEach((item) => {
        item.setAttribute('data-srcset-video', item.getAttribute('data-srcset-video').replace(/(?<=\?|&)autostart=[^&]+&?/,''));
    })*/
    document.querySelectorAll('.player-jv[data-src-video]').forEach((item) => {
        item.setAttribute('data-src-video', item.getAttribute('data-src-video').replace(/(?<=\?|&)autostart=[^&]+&?/,''));
    })

})();