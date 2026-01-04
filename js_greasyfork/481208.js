// ==UserScript==
// @name         YouTube Auto Skip Video ADS
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  Auto skip ads in YouTube videos | YouTube Video AD BLOCKER
// @author       YGN
// @match        https://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/481208/YouTube%20Auto%20Skip%20Video%20ADS.user.js
// @updateURL https://update.greasyfork.org/scripts/481208/YouTube%20Auto%20Skip%20Video%20ADS.meta.js
// ==/UserScript==

setInterval(()=>{
    document.querySelector(".ytp-ad-preview-container")?document.querySelector("video").currentTime=document.querySelector("video").duration:0;
    document.querySelector(".ytp-ad-skip-button-modern.ytp-button")?document.querySelector(".ytp-ad-skip-button-modern.ytp-button").click():0;
},200)