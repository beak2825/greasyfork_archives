// ==UserScript==
// @name            Cda ad skipper
// @name:en         Cda ad skipper
// @name:pl         Pomijacz reklam z Cda
// @namespace       CdaAdSkipper
// @version         1.4
// @description:en  Skip ads on Cda
// @description:pl  Pomija reklamy na Cda
// @author          TheUnsleepingAlchemist
// @include         /https:\/\/www\.cda\.pl\/video\/[0-9]+.+/
// @include         /https:\/\/ebd\.cda\.pl\/[0-9a-z]+\/[0-9]+.+/
// @grant           none
// @run-at          document-idle
// @description     Skip ads on Cda
// @downloadURL https://update.greasyfork.org/scripts/401545/Cda%20ad%20skipper.user.js
// @updateURL https://update.greasyfork.org/scripts/401545/Cda%20ad%20skipper.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let loopCount = 0,
        searchAds = setInterval(() => {
            loopCount++;
            let videoAd = document.querySelector("video.pb-ad-video-player") || document.querySelector("video.pb-block-video-player");
            if (loopCount === 30) clearInterval(searchAds);
            if (videoAd) {
                videoAd.style.dispaly = "none";
                videoAd.currentTime = videoAd.duration + 1;
                console.log("ad skipped")
                clearInterval(searchAds);
            }
        }, 100);
})();