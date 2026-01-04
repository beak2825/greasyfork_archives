// ==UserScript==
// @name            CDA No Ads
// @namespace       http://tampermonkey.net/
// @version         1.2
// @description     Easy way to skip ads on cda.pl
// @description:pl  Prosty sposób na pozbycie się reklam z cda.pl
// @author          lxst-one
// @match           http*://www.cda.pl/video/*
// @match           http*://ebd.cda.pl/*
// @icon            https://scdn2.cda.pl/img/icon/fav/favicon-16x16.png
// @grant           none
// @run-at          document-idle
// @license         MIT
// @downloadURL https://update.greasyfork.org/scripts/503102/CDA%20No%20Ads.user.js
// @updateURL https://update.greasyfork.org/scripts/503102/CDA%20No%20Ads.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function skipAdPlayer() {
        const adPlayer = document.querySelector('video.pb-ad-video-player');

        if(adPlayer === null || adPlayer.currentTime === 0 || adPlayer.duration === Infinity) {
            return;
        }

        adPlayer.currentTime = adPlayer.duration;
    }

    async function startAdsWatcher() {
        while(true) {
            skipAdPlayer();
            await new Promise(r => setTimeout(r, 100));
        }
    }

    startAdsWatcher();
})();