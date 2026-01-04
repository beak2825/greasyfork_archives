// ==UserScript==
// @name         YT P-I-P
// @namespace    none
// @version      0.1
// @description  Adds a picture in picture button to youtube videos.
// @author       Beastwick18
// @match        https://www.youtube.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/406838/YT%20P-I-P.user.js
// @updateURL https://update.greasyfork.org/scripts/406838/YT%20P-I-P.meta.js
// ==/UserScript==
function pip() {

    }
(function() {
    'use strict';


    var rightControls = document.getElementsByClassName('ytp-right-controls')[0];
    rightControls.lastChild.insertAdjacentHTML('beforebegin','<button class="ytp-popout-button ytp-button" aria-label="Picture-in-picture" title="Picture-in-picture" id="popout-player-control-button" onclick=""><svg width="100%" height="100%" viewBox="0 0 36 36" version="1.1"><use class="ytp-svg-shadow" xlink:href="#ytp-svg-pop-frame"></use><path id="ytp-svg-pop-frame" d="m 9,10 v 16 h 18 v -4 h -2 v 2 H 11 V 12 h 3 v -2 z" class="ytp-svg-fill"></path><use class="ytp-svg-shadow" xlink:href="#ytp-svg-pop-popout"></use><path id="ytp-svg-pop-popout" d="M 16,9 V 20 H 28 V 9 Z m 2,2 h 8 v 7 h -8 z" class="ytp-svg-fill"></path></svg></button>');

    var pipButton = document.getElementById("popout-player-control-button");
    pipButton.addEventListener('click',() => {
        if (document.pictureInPictureElement) {
            document.exitPictureInPicture();
            pipButton.style = "background: none;";
        } else {
            document.getElementsByTagName('video')[0].requestPictureInPicture();
            pipButton.style = "background: rgba(255,255,255,.3);";
        }
    })

    document.addEventListener("leavepictureinpicture", e => {
        pipButton.style = "background: none;";
    });
})();