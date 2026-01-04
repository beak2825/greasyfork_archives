// ==UserScript==
// @name         iYoutube Ad Blocker
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  Work in progress ad blocker utility (Ad Skipper)
// @author       https://github.com/IrisV3rm
// @match        http://youtube.com/*
// @match        http://www.youtube.com/*
// @match        https://youtube.com/*
// @match        https://www.youtube.com/*
// @icon         https://www.youtube.com/favicon.ico
// @grant        none
// @run-at       document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/479509/iYoutube%20Ad%20Blocker.user.js
// @updateURL https://update.greasyfork.org/scripts/479509/iYoutube%20Ad%20Blocker.meta.js
// ==/UserScript==
(function() {
    'use strict';
    let reloading = false;
    function checkAndBlockAds() {
        if (document.getElementById("player-ads")){
            document.getElementById("player-ads").remove();
        }
        document.querySelectorAll('.yt-spec-button-shape-next__button-text-content').forEach(element =>{
             if (element.innerText == "Allow YouTube Ads" && !reloading) {
                 reloading = true;
                 location.reload();
             }
        });
        document.querySelectorAll('.ytd-ad-slot-renderer').forEach(element => {
            element.remove();
        });
        //ytp-ad-skip-button-icon-modern
        document.querySelectorAll('.ytp-skip-ad-button').forEach(element => {
            if (element.innerText == "Skip"){
                element.click();
            }
            else if(element.innerText == "Skip Ad") {
                element.click();
            }
            else if (element.innerText == "Skip Ads") {
                element.click();
            }
        });
        document.querySelectorAll('.ytp-button').forEach(element => {
            if (element.innerText == "Skip"){
                element.click();
            }
            else if(element.innerText == "Skip Ad") {
                element.click();
            }
            else if (element.innerText == "Skip Ads") {
                element.click();
            }
        });
        document.querySelectorAll('.ytp-skip-ad-button').forEach(element => {
            try{
                document.querySelectorAll('video')[0].currentTime = document.querySelectorAll('video')[0].duration;
            }
            catch{}
        });
    }
    new MutationObserver(checkAndBlockAds).observe(document.body, { childList: true, subtree: true, attributes: true});
})();