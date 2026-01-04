// ==UserScript==
// @name         YouTube NoAds / TCScripts
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Denemekten Zarar Gelmez.
// @author       Asosyal
// @match        https://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=omerbozdi.com.tr
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/452529/YouTube%20NoAds%20%20TCScripts.user.js
// @updateURL https://update.greasyfork.org/scripts/452529/YouTube%20NoAds%20%20TCScripts.meta.js
// ==/UserScript==

    // YouTube Web Tabanlı Reklam Engelleme Sistemi...

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
            //console.log("Reklam Afişi Gizlendi!")
        }
        if(document.getElementsByClassName("style-scope ytd-watch-next-secondary-results-renderer sparkles-light-cta GoogleActiveViewElement")[0]!==undefined){
            let sideAd=document.getElementsByClassName("style-scope ytd-watch-next-secondary-results-renderer sparkles-light-cta GoogleActiveViewElement")[0];
            sideAd.style.display="none";
            //console.log("Reklam Kaldırıldı!")
        }
        if(document.getElementsByClassName("style-scope ytd-item-section-renderer sparkles-light-cta")[0]!==undefined){
            let sideAd_ = document.getElementsByClassName("style-scope ytd-item-section-renderer sparkles-light-cta")[0];
            sideAd_.style.display="none";
            //console.log("Reklam Kaldırıldı!")
        }
        if(document.getElementsByClassName("ytp-ad-text ytp-ad-skip-button-text")[0]!==undefined){
            let skipBtn=document.getElementsByClassName("ytp-ad-text ytp-ad-skip-button-text")[0];
            skipBtn.click();
            //console.log("Geçilebilir Reklam Kapatıldı!")
        }
        if(document.getElementsByClassName("ytp-ad-message-container")[0]!==undefined){
            let incomingAd=document.getElementsByClassName("ytp-ad-message-container")[0];
            incomingAd.style.display="none";
            //console.log("Gelen Reklam Uyarısı Kaldırıldı!")
        }
        if(document.getElementsByClassName("style-scope ytd-companion-slot-renderer")[0]!==undefined){
            document.getElementsByClassName("style-scope ytd-companion-slot-renderer")[0].remove();
            //console.log("Yan Sanayi Reklamlar Kaldırıldı!")
        }
        if(ad!==undefined){
            if(ad.children.length>0){
                if(document.getElementsByClassName("ytp-ad-text ytp-ad-preview-text")[0]!==undefined){
                    vid.playbackRate=16;
                    //console.log("Atlanamayan Reklamlar Atlandı!")
                }
            }
        }
    }
},100)