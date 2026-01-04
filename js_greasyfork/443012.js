// ==UserScript==
// @name         CJXXX AUTO DOWNLOAD
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Downloads CJXXX videos when the video is opened into a tab
// @author       GP Downloads
// @match        https://asia-pass.com/newcms/members/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=asia-pass.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/443012/CJXXX%20AUTO%20DOWNLOAD.user.js
// @updateURL https://update.greasyfork.org/scripts/443012/CJXXX%20AUTO%20DOWNLOAD.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.hasDownloadedVideo=false
    function StartVideo(){
        document.querySelector('.fp-play.fp-visible').click()
    }

    function downloadVideo(vTitle, tries=0){
        if(tries > 3){
            alert("DOWNLOAD FAIL");
            return;
        }

        StartVideo();
        setTimeout(()=>{
            const src = document.querySelector('video').src;
            if(!src){
                setTimeout(()=>{
                    downloadVideo(vTitle, tries+1)
                }, 1000);
                return;
            }

            let newelement = document.createElement('a');
            newelement.setAttribute('href', src);
            newelement.setAttribute('download', vTitle+'.mp4');
            newelement.click();
        }, 1500);
    }

    function start(){
        setTimeout(()=>{
            const vTitle = document.querySelector('.video_title').innerText;
            downloadVideo(vTitle);
        }, 500);
    }
    // Your code here...
    window.onfocus = function(){
        if(window.hasDownloadedVideo) return;
        window.hasDownloadedVideo=true
        start();
    }

    if(document.hasFocus()){
        start();
    }
})();