// ==UserScript==
// @name         YouTube & Youtube Music volume fix
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Makes the YouTube music volume slider exponential so it's easier to select lower volumes.
// @author       Virtual-Maisie
// @match        https://*.youtube.com/*
// @match        https://youtube.com/*
// @match        https://youtu.be/*
// @match        https://music.youtube.com/*
// @run-at       document-start
// @grant        none

// @downloadURL https://update.greasyfork.org/scripts/534353/YouTube%20%20Youtube%20Music%20volume%20fix.user.js
// @updateURL https://update.greasyfork.org/scripts/534353/YouTube%20%20Youtube%20Music%20volume%20fix.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // manipulation exponent, higher value = lower volume
    // 3 is the value used by pulseaudio, which Barteks2x figured out this gist here: https://gist.github.com/Barteks2x/a4e189a36a10c159bb1644ffca21c02a
    // 0.05 (or 5%) is the lowest you can select in the UI which with an exponent of 3 becomes 0.000125 or 0.0125%
    const EXPONENT = 3;

    //once the page is loaded grab the volume slider to see if any normolization is applied
    var el ;
    window.onload = function(){el = document.getElementsByClassName('ytp-volume-panel')[0];};

    var normalized = 1;

    const storedOriginalVolumes = new WeakMap();
    const {get, set} = Object.getOwnPropertyDescriptor(HTMLMediaElement.prototype, 'volume');
    Object.defineProperty(HTMLMediaElement.prototype, 'volume', {
        get () {
            const lowVolume = get.call(this);

            // devide by normalized to account for the multiplication in the set method
            const calculatedOriginalVolume = (lowVolume / normalized) ** (1 / EXPONENT);

            // The calculated value has some accuracy issues which can lead to problems for implementations that expect exact values.
            // To avoid this, I'll store the unmodified volume to return it when read here.
            // This mostly solves the issue, but the initial read has no stored value and the volume can also change though external influences.
            // To avoid ill effects, I check if the stored volume is somewhere in the same range as the calculated volume.
            const storedOriginalVolume = storedOriginalVolumes.get(this);
            const storedDeviation = Math.abs(storedOriginalVolume - calculatedOriginalVolume);

            const originalVolume = storedDeviation < 0.01 ? storedOriginalVolume : calculatedOriginalVolume;
            //console.log('manipulated volume from', lowVolume.toFixed(2), 'to  ', originalVolume.toFixed(2), storedDeviation);
            return originalVolume;
        },
        set (originalVolume) {
            storedOriginalVolumes.set(this, originalVolume);

            //check for volume slider
            if(el != null){
                //convert percentage to decimal
                var sliderVol = Number(el.ariaValueNow) /100;
                //calculate the difference
                normalized = originalVolume / sliderVol;
                //swap the volumes so we are working with volume out of 1 instead of whatever youtubes normalized max is
                originalVolume = sliderVol;
            };

            //apply the exponent and re normalize it prezerving the max volume and making the slider act the same accross sites
            const lowVolume = (originalVolume ** EXPONENT) * normalized;

            //console.log('manipulated volume to  ', lowVolume.toFixed(2), 'from', originalVolume.toFixed(2));
            set.call(this, lowVolume);
        }
    });
})();