// ==UserScript==
// @name         YouTube Volume Slider Fix
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Keeps YouTube's video volume perfectly in sync with the volume slider, preventing YouTube from capping the volume below 100% even when the slider is maxed out.
// @author       Zeridiant
// @match        *://www.youtube.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/495620/YouTube%20Volume%20Slider%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/495620/YouTube%20Volume%20Slider%20Fix.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let lastSliderValue = -1;

    function syncVolumeToSlider() {
        const video = document.querySelector('video');
        const volumePanel = document.querySelector('.ytp-volume-panel[role="slider"]');

        if (!video || !volumePanel) return;

        const sliderValueStr = volumePanel.getAttribute('aria-valuenow');
        if (!sliderValueStr) return;

        const sliderValue = parseInt(sliderValueStr, 10);
        if (isNaN(sliderValue)) return;

        if (sliderValue !== lastSliderValue) {
            lastSliderValue = sliderValue;
            const newVolume = sliderValue / 100;

            if (video.volume !== newVolume) {
                video.volume = newVolume;
                console.log(`[OK] Slider: ${sliderValue} : Volume: ${newVolume.toFixed(2)}`);
            }
        }
    }

    setInterval(syncVolumeToSlider, 200);

    const observer = new MutationObserver(() => {
        if (!document.querySelector('video')) return;
        lastSliderValue = -1;
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();
