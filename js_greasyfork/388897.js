// ==UserScript==
// @name         Youtube PiP
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Enable PiP in YouTube
// @author       samuelleung123
// @match        https://www.youtube.com/watch?v=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/388897/Youtube%20PiP.user.js
// @updateURL https://update.greasyfork.org/scripts/388897/Youtube%20PiP.meta.js
// ==/UserScript==

(function() {
    'use strict';
    console.log('add pip keyup event listener');
    document.body.addEventListener('keyup', function(e){
        if(e.altKey && e.ctrlKey && e.key === 'p') {
            var video = document.querySelector('video');
            video.requestPictureInPicture();
        }
    })
})();