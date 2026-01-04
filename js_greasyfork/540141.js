// ==UserScript==
// @name         Enhanced youtube
// @namespace    Index
// @version      1.0
// @description  Automatically skips YouTube ads, mutes them, disables autoplay, removes end screens, expands descriptions, and hides Up Next.
// @author       Joel
// @match        *://www.youtube.com/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/540141/Enhanced%20youtube.user.js
// @updateURL https://update.greasyfork.org/scripts/540141/Enhanced%20youtube.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function skipAd() {
        const skipButton = document.querySelector('.ytp-ad-skip-button');
        if (skipButton) {
            skipButton.click();
            console.log('Skipped an ad.');
        }
    }

    function muteAd() {
        const isAdPlaying = document.querySelector('.ad-showing');
        const video = document.querySelector('video');
        if (isAdPlaying && video && !video.muted) {
            video.muted = true;
            console.log('Muted video during ad.');
        } else if (!isAdPlaying && video && video.muted) {
            video.muted = false;
            console.log('Unmuted video after ad.');
        }
    }

    function removeEndScreens() {
        const elements = document.querySelectorAll('.ytp-ce-element');
        elements.forEach(el => el.remove());
    }

    function disableAutoplayToggle() {
        const autoplayButton = document.querySelector('.ytp-autonav-toggle-button[aria-checked="true"]');
        if (autoplayButton) {
            autoplayButton.click();
            console.log('Autoplay disabled.');
        }
    }

    function expandDescription() {
        const moreButton = document.querySelector('#expand .more-button');
        if (moreButton) {
            moreButton.click();
            console.log('Expanded description.');
        }
    }

    function hideUpNextSection() {
        const upNext = document.getElementById('related');
        if (upNext) {
            upNext.style.display = 'none';
            console.log('Hiding Up Next section.');
        }
    }

    function applyEnhancements() {
        skipAd();
        muteAd();
        removeEndScreens();
        disableAutoplayToggle();
        expandDescription();
        hideUpNextSection();
    }

    setInterval(applyEnhancements, 1000);
})();