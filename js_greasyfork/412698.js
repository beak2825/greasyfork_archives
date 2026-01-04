// ==UserScript==
// @name         YouTube Auto Skip Ads
// @version      0.9
// @description  autoclicks on youtube's skip ad buttons once they appear, also auto-closes banner ads
// @author       RustyPrimeLUX
// @match        https://www.youtube.com/*
// @license      MIT
// @namespace    none
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/412698/YouTube%20Auto%20Skip%20Ads.user.js
// @updateURL https://update.greasyfork.org/scripts/412698/YouTube%20Auto%20Skip%20Ads.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var currentVideoTime = 0;

    var videoPlayer = document.querySelector(".video-stream.html5-main-video");
    var skipAdBtn = document.querySelector("div.ytp-ad-text.ytp-ad-skip-button-text") || document.querySelector(".ytp-skip-ad-button") || document.querySelector(".ytp-skip-ad-button__text") || document.querySelector(".ytp-ad-skip-button-text-centered");
    var closeBannerBtn = document.querySelector("button.ytp-ad-overlay-close-button");
    var errorScreen = document.querySelector("#error-screen");

    setInterval(function(){
        if (getVideoPlayer() && isVisible(videoPlayer)){
            var currentTime = Math.floor(videoPlayer.currentTime);
            if (currentTime > 30)
            {
                currentVideoTime = currentTime;
            }
        }

        if(getSkipAdsButton() && isVisible(skipAdBtn)){
            skipAdBtn.click();
        }

        if(getCloseBannerButton() && isVisible(closeBannerBtn)){
            closeBannerBtn.click();
        }

        if (getErrorScreen() && isVisible(errorScreen)){
            if (currentVideoTime == 0)
            {
                window.location.reload();
            }
            else{
                var currentLink = window.location.href;
                var playAtTimestampQuery = "&t=";

                if (currentLink.includes(playAtTimestampQuery)){
                    currentLink = currentLink.split(playAtTimestampQuery)[0];
                }

                var linkWithTimestamp = currentLink + playAtTimestampQuery + currentVideoTime;
                window.location.href = linkWithTimestamp;
            }
        }
    }, 1000);

    function getVideoPlayer(){
        if (videoPlayer == null || (videoPlayer != null && !document.body.contains(videoPlayer))){
            videoPlayer = document.querySelector(".video-stream.html5-main-video");
        }
        return videoPlayer != null;
    }

    function getSkipAdsButton() {
        if (skipAdBtn == null || (skipAdBtn != null && !document.body.contains(skipAdBtn))){
            skipAdBtn = document.querySelector("div.ytp-ad-text.ytp-ad-skip-button-text") || document.querySelector(".ytp-skip-ad-button") || document.querySelector(".ytp-skip-ad-button__text") || document.querySelector(".ytp-ad-skip-button-text-centered");
        }
        return skipAdBtn != null;
    }

    function getCloseBannerButton() {
        if (closeBannerBtn == null || (closeBannerBtn != null && !document.body.contains(closeBannerBtn))){
            closeBannerBtn = document.querySelector("button.ytp-ad-overlay-close-button");
        }
        return closeBannerBtn != null;
    }

    function getErrorScreen(){
        if (errorScreen == null || (errorScreen != null && !document.body.contains(errorScreen))){
            errorScreen = document.querySelector("#error-screen");
        }
        return errorScreen != null;
    }

    function isVisible(el) {
        return (el.offsetParent !== null)
    }
})();
