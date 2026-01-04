// ==UserScript==
// @name         陌桥网视频自动播放器
// @namespace    http://tampermonkey.net/
// @version      1
// @description  A script for JS practice purpose.
// @author       HBC
// @match        https://www.ahamojo.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/443228/%E9%99%8C%E6%A1%A5%E7%BD%91%E8%A7%86%E9%A2%91%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/443228/%E9%99%8C%E6%A1%A5%E7%BD%91%E8%A7%86%E9%A2%91%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE%E5%99%A8.meta.js
// ==/UserScript==


(function () {
    'use strict';

    console.log('Tampermonkey script started running!');

    window.addEventListener('load', function (event) {
        console.log('[info] DOM and resources fully loaded and parsed');
        console.log('[info] starting Autoplayer...');
        setInterval(mainFunc, 1000);
    });

    let intcode = null;
    let videoId = null;
    let began = false;
    let N=0;
    
    let mainFunc = function () {
        console.log('mainFunc running');
        
        let video = document.getElementsByTagName('video')[N];
        let allvideo = document.getElementsByTagName('video');
        let lastvideo=allvideo[allvideo.length-1];
        if (video == null) {
            
            
              console.log('[error] Video not found! terminate');
               return;
           
        }
        videoId = parseInt(top.location.href.split('#auId=').pop());
        console.log("[info] Video id: " + videoId);
        if (!video.ended) {
            if (video.paused) {
                console.log("[step] 1/5: start playing");
                video.play();
                video.playbackRate = 15;
            }
            console.log('[step] 2/5: wait until Video finished...');
        } else {
            
            if(video==lastvideo){
              video = document.getElementsByTagName('video')[0];
              videoId = parseInt(top.location.href.split('#auId=').pop());
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
            
            N++;
            console.log('N='+N);
            began=false;
            console.log('video ended');
            
        }
    }


    let backupStarter = function () {
        if (began) return;
        console.log('[warning] event `load` not triggered! try starting Autoplayer...')
        mainFunc();
    }

    setTimeout(backupStarter, 3000);
})();
