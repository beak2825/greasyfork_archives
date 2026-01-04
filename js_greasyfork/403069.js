// ==UserScript==
// @name         CDA
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  try to take over the world!
// @author       You
// @include      /(ebd\.cda|cda)\.pl\/(video|[0-9a-z]+)\/[0-9]+.+/
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/403069/CDA.user.js
// @updateURL https://update.greasyfork.org/scripts/403069/CDA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let loopCount = 0;

    let checkExist = setInterval(function() {
        loopCount++;
        let videoAd = document.querySelector("video.pb-ad-video-player");
        if (videoAd) {
            videoAd.style.dispaly = "none";
            videoAd.currentTime = 50;
            console.log("ad skipped")
        }
        if (loopCount === 30 || videoAd) {
            clearInterval(checkExist);
        }
    }, 100);


    $(document).on('ready', function(){
        $('.wrapqualitybtn')
            .append('<a href="'+$('video')[0].src+'" download="'+$('.title-name').text() + '.mp4" class="quality-btn">Pobierz</a>');
    });
})();


