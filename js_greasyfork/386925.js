// ==UserScript==
// @name         Youtube Ad Cleaner(Include Non-Skippable Ads- works)
// @namespace    http://tampermonkey.net/
// @version      1.50.9
// @description  (Be Tested Daily) Bypass all youtube ads (skippable and non-skippable Ads) plus download youtube video on the fly
// @ Please add youtube.com to the whitelist if you are using any adblocker to avoid reload loops
// @author       BjDanny
// @run-at          document-start
// @match        *://*.youtube.com/*
// @downloadURL https://update.greasyfork.org/scripts/386925/Youtube%20Ad%20Cleaner%28Include%20Non-Skippable%20Ads-%20works%29.user.js
// @updateURL https://update.greasyfork.org/scripts/386925/Youtube%20Ad%20Cleaner%28Include%20Non-Skippable%20Ads-%20works%29.meta.js
// ==/UserScript==
'use strict';
var currentTime, duration, yt;


function myWindow()
{
    let y = window.location.href.replace("youtube", "youtube5s");
    let myWin = window.open(y,"Download Youtube Video","directories=no,titlebar=no,toolbar=no,location=no,status=no,menubar=no,scrollbars=no,resizable=no,width=800, height=900");
    myWin.onload = setInterval(clearPage,1000);
}

function clearPage()
{
    try{
        document.querySelectorAll(".col-xs-12")[8].remove();
        document.querySelector("footer").remove();
        document.querySelector("ul").remove();
        document.querySelector(".navbar-header").remove();
        document.querySelector("#logo-icon").remove();
    }
    catch(e)
    {
        return;
    }
}


function createButton()
{
    try{
    let css = document.createElement('style');
    //Thanks GreenSheep3 for the css style
    css.innerHTML = `
    .myButton {
    font-size: 14px;
    font-weight: 300;
    color: #eee;
    text-align: center;
    vertical-align: middle;
    border: 1px solid #555;
    border-radius: 50px;
    background-color: rgba(0, 0, 0, 0);
    height: 36px;
    width: 135px;
    padding: 0;
    margin: 8px
    }
    `;
    document.head.appendChild(css);
    let btn = document.createElement("BUTTON");
    btn.className = "myButton";
    btn.id = "mybutton";
    btn.innerHTML = "DOWNLOAD";
    btn.addEventListener("click", myWindow);
    document.querySelector("#owner").appendChild(btn);
    }
    catch(e)
    {
    }
}

function adOverlay(){
const ad = document.querySelector(".ytp-ad-text");
const video = document.querySelector("video");
if (ad){
video.currentTime = video.duration;
}
let btn = document.querySelector(".ytp-ad-skip-button-icon-modern");
if(btn){document.querySelector(".ytp-ad-skip-button-icon-modern").click();console.log("Skipped Video Ad");}
}


function removeSp()
{
    try
    {
        if (document.getElementById("support").innerText.includes("Ad") == true)
        {
            document.getElementsByClassName("ytd-rich-item-renderer")[0].innerHTML = ""
            console.log('Sponsor Ad removed!');
        }
    }
    catch(e)
    {
        return;
    }
}

var Ads = {
    "aId":["masthead-ad","player-ads","top-container","offer-module","pyv-watch-related-dest-url","ytd-promoted-video-renderer","sparkles-container","fulfilled-layout"],
    "aClass":["style-scope ytd-search-pyv-renderer","ytd-compact-promoted-video-renderer","style-scope ytd-carousel-ad-renderer","ytp-ad-overlay-container","ytp-ad-message-container","style-scope ytd-engagement-panel-section-list-renderer"],
    "aTag":["ytd-promoted-sparkles-text-search-renderer"],
    "vdoAd":["ytp-ad-text ytp-ad-preview-text","ytp-ad-skip-button ytp-button","ytp-ad-text ytp-ad-skip-button-text-centered ytp-ad-skip-button-text"],
    "removeByID":function(){this.aId.forEach(i=>{ let AdId = document.getElementById(i);if(AdId) AdId.remove();})},
    "removeByClassName":function(){this.aClass.forEach(c=>{ let AdClass = document.getElementsByClassName(c);if(AdClass[0]) AdClass[0].remove();})},
    "removeByTagName":function(){this.aTag.forEach(t=>{ let AdTag = document.getElementsByTagName(t);if(AdTag[0]) AdTag[0].remove();})},
    "removeVdoAd":function(){this.vdoAd.forEach(v=>{let AdVdo = document.getElementsByClassName(v)[0];if(AdVdo) {AdVdo.click(); console.log("Skipped a clickable Ad")}})} //handles skippable video Ad
}

function killAd()
{
    Ads.removeByID();
    Ads.removeByClassName();
    Ads.removeByTagName();
    Ads.removeVdoAd();
    removeSp();
    adOverlay();
}

document.addEventListener('DOMContentLoaded', ()=>{setInterval(killAd, 100); setTimeout(createButton, 5000);});