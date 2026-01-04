// ==UserScript==
// @name            Prime Video Ad Blocker [ESP]
// @name:es         Prime Video Ad Blocker [ESP]
// @namespace       https://greasyfork.org/en/users/5102-jeau
// @version         0.3.2
// @description     Skip Ads and self Promotionals in Prime Video.
// @description:es  Bloquea los anuncios y promociones en Prime Video.
// @author          Jeau
// @license         MIT
// @match           https://*.amazon.co.jp/Amazon-Video/*
// @match           https://*.amazon.co.uk/Amazon-Video/*
// @match           https://*.amazon.com/Amazon-Video/*
// @match           https://*.amazon.de/Amazon-Video/*
// @match           https://*.amazon.com/*instant-video*
// @match           https://*.primevideo.com/*
// @icon            https://m.media-amazon.com/images/G/01/digital/video/DVUI/favicons/favicon-32x32.png
// @grant           none
// @downloadURL https://update.greasyfork.org/scripts/448597/Prime%20Video%20Ad%20Blocker%20%5BESP%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/448597/Prime%20Video%20Ad%20Blocker%20%5BESP%5D.meta.js
// ==/UserScript==

/*
-----------------------------------------------------------------------------------
  Adapted for Amazon Prime Video Spain site. It might also work in other countries.
  Based on RawMeatEater's script:
  https://greasyfork.org/es/scripts/446723-amazon-video-ad-blocker
-----------------------------------------------------------------------------------
*/

(function() {
    'use strict';
    // This value when true shows that the Ad has been skipped
    var adSkipped = false;
    // Time pattern
    var adTimeRegExp = /(\d?\d:){0,2}\d?\d/;

    setInterval(function() {
        var video;
        var adTime;
        // In case of multiple video elements look for the one which is currently playing
        var renderers = document.getElementsByClassName("atvwebplayersdk-video-surface");
        if (renderers.length) {
            for (let i = renderers.length - 1; i >= 0; i--) {
                video = renderers[i].querySelector('video');
                if (video && video.currentTime) break;
            }
        }
        var promoTimeElement = document.getElementsByClassName("atvwebplayersdk-adtimeindicator-text")[0];
        var adTimeElement = document.getElementsByClassName("atvwebplayersdk-ad-timer-remaining-time")[0];
        // When detected stores the ad time in adTime
        if (adTimeElement && adTimeRegExp.test(adTimeElement.innerHTML)) adTime = adTimeElement;
        if (promoTimeElement && adTimeRegExp.test(promoTimeElement.innerHTML)) adTime = promoTimeElement;
        // If video started playing and a 'Time to Skip' element is detected
        if (video && video.currentTime && adTime) {
            // Has it been skipped aready? (To be sure that you don't skip forward twice)
            if (adSkipped == false) {
                // Grab the Ad timer in HH:MM:SS format and split it into an array as soon as it is detected
                var currentAdTime = adTime.innerHTML.match(adTimeRegExp)[0].split(':');
                // Calculate the Ad time in seconds
                var adTimeInSecs = 0;
                for (let i = 0; i < currentAdTime.length; i++) {
                    adTimeInSecs += parseInt(currentAdTime[i]) * Math.pow(60, currentAdTime.length - 1 - i);
                }
                // Forward the video by how much Ad time the timer shows
                video.currentTime += adTimeInSecs;
                // Mark the Ad as skipped
                adSkipped = true;
                // DEBUG
                console.log('==========================');
                console.log('PRIME VIDEO AD SKIPPED !!!');
                console.log('==========================');
            }
        } else {
            // When Ad timer disappers, reset the Ad skip value
            adSkipped = false;
        }
    }, 200);
})();
