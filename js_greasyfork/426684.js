// ==UserScript==
// @name         Youtube Music Logarithmic/Exponential volume
// @namespace    http://tampermonkey.net/
// @version      0.3.3
// @description  Makes the YouTube music volume slider logarithmic.
// @author       Andrew Rosiclair <git@arosiclair>
// @match        https://music.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/426684/Youtube%20Music%20LogarithmicExponential%20volume.user.js
// @updateURL https://update.greasyfork.org/scripts/426684/Youtube%20Music%20LogarithmicExponential%20volume.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const useExpScale = false; // set to true for exponential scaling
    const expScalePower = 2;
    const sliderWidth = '200px'; // default: 100px

    function scaleExp (volume) {
        const newVolume = (volume / 1) ** expScalePower;
        return newVolume;
    }

    function scaleLog (volume) {
        if (volume === 0) {
            return 0;
        }

        var minp = 0;
        var maxp = 1;

        // The result should be between 1 an 100
        var minv = Math.log(1);
        var maxv = Math.log(100);

        // calculate adjustment factor
        var scale = (maxv-minv) / (maxp-minp);

        const newVolume = Math.exp(minv + scale*(volume-minp)) / 100;
        return newVolume;
    }

    const {get, set} = Object.getOwnPropertyDescriptor(HTMLMediaElement.prototype, 'volume');

    setTimeout(() => {
        Object.defineProperty(HTMLMediaElement.prototype, 'volume', {
            get () {
                const volume = get.call(this);
                const newVolume = useExpScale ? scaleExp(volume) : scaleLog(volume);
                console.log(`[YouTube Music Volume Fix] volume: ${volume} newVolume ${newVolume.toFixed(2)}`);
                return newVolume;
            },
            set (volume) {
                const newVolume = useExpScale ? scaleExp(volume) : scaleLog(volume);
                console.log(`[YouTube Music Volume Fix] volume: ${volume} newVolume ${newVolume.toFixed(2)}`);
                return set.call(this, newVolume);
            }
        });

        const volumeSlider = document.querySelector("#volume-slider");
        if (volumeSlider) {
            volumeSlider.style.width = sliderWidth;
        } else {
            console.error("[YouTube Music Volume Fix] couldn't find the slider element");
        }

        console.log(`[YouTube Music Volume Fix] initialized`);
    }, 1000);
})();
