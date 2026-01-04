// ==UserScript==
// @name         Crackle ads auto skip
// @namespace    http://tampermonkey.net/
// @version      0.1.5
// @author       Thesunfei
// @match        *://*.crackle.com
// @match        *://*.crackle.com/*
// @license      MIT
// @description Auto skip Crackle video ads
// @downloadURL https://update.greasyfork.org/scripts/427935/Crackle%20ads%20auto%20skip.user.js
// @updateURL https://update.greasyfork.org/scripts/427935/Crackle%20ads%20auto%20skip.meta.js
// ==/UserScript==

(function() {
    'use strict';
    setInterval(() => {
        let videoContainer=document.querySelector(".cracklePlayerContainer>div");
        if (videoContainer){
            videoContainer.style.display="block";
            videoContainer.querySelector("video").play();
        }
        let video = document.querySelector("video[id*=ad-player]");
        if (video) {
            video.style.display="none";
            video.muted=true;
            if (video.duration){
                video.currentTime=video.duration;
            }
        }
    }, 500)
})();