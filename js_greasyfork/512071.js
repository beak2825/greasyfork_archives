// ==UserScript==
// @name         🤮Sick Of It - Combination KSI "Thick Of It" Muter & Subway Surfers Player
// @namespace    https://greasyfork.org/en/users/1306960-viv-vee-media
// @version      1.0
// @description  Mutes KSI's song "Thick Of It" on YouTube and plays Subway Surfers in the bottom-right corner
// @author       viv
// @match        *://www.youtube.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/512071/%F0%9F%A4%AESick%20Of%20It%20-%20Combination%20KSI%20%22Thick%20Of%20It%22%20Muter%20%20Subway%20Surfers%20Player.user.js
// @updateURL https://update.greasyfork.org/scripts/512071/%F0%9F%A4%AESick%20Of%20It%20-%20Combination%20KSI%20%22Thick%20Of%20It%22%20Muter%20%20Subway%20Surfers%20Player.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const subwaySurfersURL = "https://www.youtube.com/embed/_bwtEtYQwgc?autoplay=1";
    let subwayIframe;
    function checkTitle() {
        const video = document.querySelector('video');
        const title = document.title.toLowerCase();
        if (video) {
            if (title.includes('ksi') && title.includes('thick of it')) {
                video.muted = true;
                if (!subwayIframe) {
                    embedSubwaySurfers();
                }
            } else {
                video.muted = false;
                removeSubwaySurfers();
            }
        }
    }
    function embedSubwaySurfers() {
        subwayIframe = document.createElement('iframe');
        subwayIframe.src = subwaySurfersURL;
        subwayIframe.width = "540";
        subwayIframe.height = "375";
        subwayIframe.style.position = "fixed";
        subwayIframe.style.bottom = "10px";
        subwayIframe.style.right = "10px";
        subwayIframe.style.zIndex = "9999";
        subwayIframe.allow = "autoplay";
        document.body.appendChild(subwayIframe);
    }
    function removeSubwaySurfers() {
        if (subwayIframe) {
            subwayIframe.remove();
            subwayIframe = null;
        }
    }
    function trackUserMute() {
        const video = document.querySelector('video');
        if (video) {
            video.addEventListener('volumechange', function() {
                if (video.muted) {
                    video.mutedByUser = true;
                } else {
                    video.mutedByUser = false;
                }
            });
        }
    }
    setInterval(checkTitle, 1000);
    window.addEventListener('load', trackUserMute);
})();
