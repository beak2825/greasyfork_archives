// ==UserScript==
// @name         VideoPass player fix for MotoGP.com
// @namespace    http://tampermonkey.net/
// @version      2024-02-08
// @description  Remove the dark overlay from videos
// @author       MotoTiming.live
// @match        https://*.motogp.com/*
// @match        http://*.motogp.com/*
// @icon         https://www.google.com/s2/favicons?domain=mototiming.live
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/503863/VideoPass%20player%20fix%20for%20MotoGPcom.user.js
// @updateURL https://update.greasyfork.org/scripts/503863/VideoPass%20player%20fix%20for%20MotoGPcom.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function removeBlackOverlay() {
        const overlay = document.querySelector(".vjs-background ");
        const controlBar = document.querySelector(".vjs-control-bar");

        if (overlay && controlBar) {
            overlay.remove();
            controlBar.style.backgroundColor = "rgba(0,0,0,0.3)";
            console.log('MotoGP video overlay removed');
            return true;
        }
        return false;
    }

    const intervalId = setInterval(function() {
        const video = document.querySelector('video');
        if (video && !video.paused) {
            if (removeBlackOverlay()) {
                clearInterval(intervalId);
            }
        }
    }, 1000);
})();
