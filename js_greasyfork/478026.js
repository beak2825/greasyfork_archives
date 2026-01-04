// ==UserScript==
// @name         Youtube Ad Skipper
// @namespace    https://greasyfork.org/en/scripts/478026-youtube-ad-skipper
// @version      1
// @description  Skips ads on youtube
// @author       LEGENDBOSS123 + left paren + mastery3
// @match        *://*.youtube.com/*
// @license MIT
// @run-at       document-idle
// @grant        none
// @unwrap
// @downloadURL https://update.greasyfork.org/scripts/478026/Youtube%20Ad%20Skipper.user.js
// @updateURL https://update.greasyfork.org/scripts/478026/Youtube%20Ad%20Skipper.meta.js
// ==/UserScript==
 
function skipAdd(){
    if(document.querySelector("button.ytp-ad-overlay-close-button")){
        document.querySelector("button.ytp-ad-overlay-close-button").click();
    }
    if(document.querySelector("div.ad-showing")){
        try{    
            for(var i=0; i<document.getElementsByClassName("video-stream html5-main-video").length;i++){
                document.getElementsByClassName("video-stream html5-main-video")[i].currentTime = 999999999999999999999999999999
            }
            for(var i = 0; i<document.getElementsByClassName("ytp-ad-skip-button ytp-button").length;i++){
                document.getElementsByClassName("ytp-ad-skip-button ytp-button")[i].click()
            }
        }
        catch{
        }
    }
}
 
setInterval(skipAdd,25);