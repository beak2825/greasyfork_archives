// ==UserScript==
// @name         2 in 1 PiP Tool
// @version      3.0
// @description  Allows Picture-in-Picture on any website even if blocked `alt+ctrl+p`
// @author       Edward D
// @include      http://*
// @include      https://*
// @namespace    https://edwarddk.github.io/EdwardD-Portfolio/
// @downloadURL https://update.greasyfork.org/scripts/475305/2%20in%201%20PiP%20Tool.user.js
// @updateURL https://update.greasyfork.org/scripts/475305/2%20in%201%20PiP%20Tool.meta.js
// ==/UserScript==


//FOR THE PIP PRESS ALT + CTRL + P

(function() {
    'use strict';

    window.addEventListener("play", function(e) {
    e.target.removeAttribute("disablePictureInPicture")
}, true)

window.addEventListener("pause", function(e) {
    e.target.removeAttribute("disablePictureInPicture")
}, true)

    console.log('RUNNING . . .');
    document.body.addEventListener('keyup', function(e){
        if(e.altKey && e.ctrlKey && e.key === 'p') {
            var video = document.querySelector('video');
            video.requestPictureInPicture();
        }
    })
})();