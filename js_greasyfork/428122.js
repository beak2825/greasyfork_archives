// ==UserScript==
// @name         Ahamojo Autoplayer
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  A script for JS practice purpose.
// @author       You
// @match        https://www.ahamojo.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/428122/Ahamojo%20Autoplayer.user.js
// @updateURL https://update.greasyfork.org/scripts/428122/Ahamojo%20Autoplayer.meta.js
// ==/UserScript==

(function () {
    'use strict';

    console.log('Tampermonkey script started running!');

    window.addEventListener('load', function (event) {
        console.log('[info] DOM and resources fully loaded and parsed');
        console.log('[info] starting Autoplayer...');
        setTimeout(mainFunc, 1000);
    });

    let intcode = null;
    let videoId = null;
    let began = false;
    let mainFunc = function () {
        if (began == true) return;
        else began = true;
        let video = document.getElementsByTagName('video')[0];
        if (video == null) {
            console.log('[error] Video not found! terminate');
            return;
        }
        videoId = parseInt(top.location.href.split('#auId=').pop());
        console.log("[info] Video id: " + videoId);
        intcode = setInterval(worker, 1000, video);
    }

    let worker = function (video) {
        //console.log(video.playbackRate);
        if (!video.ended) {
            if (video.paused) {
                console.log("[step] 1/5: start playing");
                video.play();
                video.playbackRate = 2;
            }
            console.log('[step] 2/5: wait until Video finished...');
        } else {
            clearInterval(intcode);
            console.log('[step] 3/5: open next Video in new tab');
            window.open(top.location.pathname + '#auId=' + (videoId + 1));
            let finish_btn = $('#terminate');
            if (finish_btn[0] == null) {
                console.log('[warning] Finish Button not found! skip step 4');
            } else {
                finish_btn.click();
                console.log('[step] 4/5: submitted');
            }
            console.log('[step] 5/5: kill self, bye~');
            setTimeout(() => { top.close(); }, 1000);
        }
    };

    let backupStarter = function () {
        if (began) return;
        console.log('[warning] event `load` not triggered! try starting Autoplayer...')
        mainFunc();
    }

    setTimeout(backupStarter, 3000);
})();
