// ==UserScript==
// @name         YouTube - Ad Skip, Close popup ad and Confirm presence
// @version      1.3
// @description  Skips and removes ads on YouTube automatically
// @author       Keyzee
// @match        https://www.youtube.com/watch*
// @grant        none
// @namespace    keyzee.youTubeAdSkipper
// @license      GNU
// @downloadURL https://update.greasyfork.org/scripts/395639/YouTube%20-%20Ad%20Skip%2C%20Close%20popup%20ad%20and%20Confirm%20presence.user.js
// @updateURL https://update.greasyfork.org/scripts/395639/YouTube%20-%20Ad%20Skip%2C%20Close%20popup%20ad%20and%20Confirm%20presence.meta.js
// ==/UserScript==


(function() {
    'use strict';
    function showmsg(msg) {
        console.log(msg)
    }
    setInterval(function (){
        if(document.querySelector('.ytp-ad-skip-button-slot')) {
            document.querySelector('.ytp-ad-skip-button-slot').click();
            showmsg('Bro, I just skipped an ad for you ;)');
        }
        if(document.querySelector('#confirm-button')) {
            if(document.querySelector('.html5-main-video').paused) {
                document.querySelector('#confirm-button').click();
                showmsg('Hey, I made sure that you can continue watching videos!');
            }
        }
        if(document.querySelector('.ytp-ad-overlay-close-button')) {
            document.querySelector('.ytp-ad-overlay-close-button').click();
            showmsg('Hey, I just closed and in-video ad for you, thank me later!');
        }
    }, 2500);
})();