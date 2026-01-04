// ==UserScript==
// @name         Youtube Video Max Volume Patch
// @namespace    http://github.com/jaytohe/
// @version      0.2
// @description  Override the html5 video volume to 1 when player's volume slider is set to 100%.
// @author       jaytohe
// @license      MIT
// @match        https://www.youtube.com/*
// @run-at       document-idle
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/437951/Youtube%20Video%20Max%20Volume%20Patch.user.js
// @updateURL https://update.greasyfork.org/scripts/437951/Youtube%20Video%20Max%20Volume%20Patch.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const curr_volume = () => document.querySelector('div[class^="ytp-volume-panel"]').getAttribute('aria-valuenow');
    const get_video = () => document.querySelector('video[src]'); //video[src] is used to prevent accidental firing on bogus video in homepage

    const forceMaxVol = (event) => {
        if (curr_volume() === '100') {
            event.target.volume = 1;
        }

    }
    const initHijack = (video) => {
        if (video !== null && curr_volume() !== null) {
            console.log('Patching max volume...');

            if (curr_volume() === '100') //in case video autoplays
                video.volume = 1;

            if (video.onplay === null)
                video.onplay = forceMaxVol;

            if(video.onvolumechange === null)
                video.onvolumechange = forceMaxVol;
        }
    }
    const wait_for_video = setInterval(function() {
        if (get_video() !== null) {
            console.log('[YOTUBE MAX VOLUME PATCH] -- FOUND VIDEO.');
            setTimeout(()=>initHijack(get_video()), 1000);
            clearInterval(wait_for_video);
        }
    }, 500);
})();