// ==UserScript==
// @name         No ADS - YouTube
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  - Skips all youtube ads - | - undetectable - | - skips ads instantly -
// @author       GSRHackZ
// @match        https://www.youtube.com/*
// @match        https://m.youtube.com/*
// @license MIT
// @icon         https://i.ibb.co/X5f50Cg/Screen-Shot-2021-07-19-at-9-31-54-PM.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/477728/No%20ADS%20-%20YouTube.user.js
// @updateURL https://update.greasyfork.org/scripts/477728/No%20ADS%20-%20YouTube.meta.js
// ==/UserScript==

let ogVolume=1;
let pbRate = 1;

setInterval(function(){
    if(document.getElementsByClassName("video-stream html5-main-video")[0]!==undefined){
        let ad = document.getElementsByClassName("video-ads ytp-ad-module")[0];
        let vid = document.getElementsByClassName("video-stream html5-main-video")[0];
        if(ad==undefined){
            pbRate = vid.playbackRate;
        }
        let closeAble = document.getElementsByClassName("ytp-ad-overlay-close-button");
        for(let i=0;i<closeAble.length;i++){
            closeAble[i].click();
            //console.log("ad banner closed!")
        }
        if(document.getElementsByClassName("style-scope ytd-watch-next-secondary-results-renderer sparkles-light-cta GoogleActiveViewElement")[0]!==undefined){
            let sideAd=document.getElementsByClassName("style-scope ytd-watch-next-secondary-results-renderer sparkles-light-cta GoogleActiveViewElement")[0];
            sideAd.style.display="none";
            //console.log("side ad removed!")
        }
        if(document.getElementsByClassName("style-scope ytd-item-section-renderer sparkles-light-cta")[0]!==undefined){
            let sideAd_ = document.getElementsByClassName("style-scope ytd-item-section-renderer sparkles-light-cta")[0];
            sideAd_.style.display="none";
            //console.log("side ad removed!")
        }
        if(document.getElementsByClassName("ytp-ad-text ytp-ad-skip-button-text")[0]!==undefined){
            let skipBtn=document.getElementsByClassName("ytp-ad-text ytp-ad-skip-button-text")[0];
            skipBtn.click();
            //console.log("skippable ad skipped!")
        }
        if(document.getElementsByClassName("ytp-ad-message-container")[0]!==undefined){
            let incomingAd=document.getElementsByClassName("ytp-ad-message-container")[0];
            incomingAd.style.display="none";
            //console.log("removed incoming ad alert!")
        }
        if(document.getElementsByClassName("style-scope ytd-companion-slot-renderer")[0]!==undefined){
            document.getElementsByClassName("style-scope ytd-companion-slot-renderer")[0].remove();
            //console.log("side ad removed!")
        }
        if(ad!==undefined){
            if(ad.children.length>0){
                if(document.getElementsByClassName("ytp-ad-text ytp-ad-preview-text")[0]!==undefined){
                    vid.playbackRate=16;
                    //console.log("Incrementally skipped unskippable ad!")
                }
            }
        }
    }
},100)
