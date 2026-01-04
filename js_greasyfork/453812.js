// ==UserScript==
// @name         AARP - Go To Next Video
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  trying to skip to the next video during the AARP driver-ed class
// @author       You
// @license  MIT
// @match        https://app.aarpdriversafety.org/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=aarpdriversafety.org
// @grant        none
// @require http://code.jquery.com/jquery-3.5.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/453812/AARP%20-%20Go%20To%20Next%20Video.user.js
// @updateURL https://update.greasyfork.org/scripts/453812/AARP%20-%20Go%20To%20Next%20Video.meta.js
// ==/UserScript==
/* globals jQuery, $, waitForKeyElements */

(function() {
    'use strict';
    const wait = 5000; // 5 seconds
    var counter = 0;

    setInterval(function(){
        const currentUrl = window.location.href;
        // we are in the table of contents page
        if(currentUrl.indexOf('/dash/index') > 0) {
            console.log('going to the next section');
            // go to the next available section
            $("div[data-test='currentIcon'] div.gritIcon__wrap").click();
        }
        const video = document.querySelector("video");
        if(video) {
            console.log('hello video');
            video.muted = true;
            video.play();
            video.pause();
            video.currentTime = video.duration; // go to the end of the video

            const isDisabled = $('#arrow-next').is(":disabled");
            if (!isDisabled) {
                let arrow = $('.icon.gritIcon--arrow-forward');
                arrow.click();
            }
        } else {
            console.log('hello: ' + counter);
            const timer = $('div.isTimer span.children div').text();
            if (timer == "00:00") {
                let arrow = $('.icon.gritIcon--arrow-forward');
                arrow.click();
                counter++;
                console.log('goodbye: ' + counter);
            }
    }
    }, wait);
})();