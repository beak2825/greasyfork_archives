// ==UserScript==
// @name         YoutubeOnlyVideo
// @namespace    http://tampermonkey.net/
// @version      2025-01-30
// @description  Keep only the video on youtube
// @author       Alcor
// @match        https://www.youtube.com/watch*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/528373/YoutubeOnlyVideo.user.js
// @updateURL https://update.greasyfork.org/scripts/528373/YoutubeOnlyVideo.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let video = document.querySelector('video')

    function copyVideo(){
        if (video){
            suite()
        }else{
            setTimeout(copyVideo,500)
        }
    }

    function suite(){
        do {
            document.body.removeChild(document.body.firstChild)
        } while (document.body.hasChildNodes())
            document.body.appendChild(video)
        video.addEventListener("mousemove", function(){this.setAttribute('controls','true')})
    }

    copyVideo()
})();