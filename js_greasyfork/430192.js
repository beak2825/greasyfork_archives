// ==UserScript==
// @name         8D - Panning audio
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  This script will pan the audio left to right to make the sound look moving around you! 
// @author       Moreless
// @match        *://*/*
// @icon         http://example.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/430192/8D%20-%20Panning%20audio.user.js
// @updateURL https://update.greasyfork.org/scripts/430192/8D%20-%20Panning%20audio.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const result = new Map()
    function update_players() {
        for (const el of document.querySelectorAll('video, audio')) {
            if (!el.hasAttribute('data-8dscript')) {
                el.setAttribute('data-8dscript', Math.random().toString(36).substr(2, 10))
            }
            result.set(el.getAttribute('data-8dscript'), {
                type: el.tagName.toLowerCase(),
                settings: el.xSoundFixerSettings
            })
        }
    }

    update_players();
    setInterval(update_players, 5000)

    var current_pan = 0;
    var direction = 1;
    var sidepause = false;
    var jumpmode = false;

    function pan_pause(duration) {
        sidepause = true;
        setTimeout(function() { sidepause=false; }, duration);
    }

    setInterval(function() {
        for (const [elid, el] of result) {
            if(jumpmode) {
                current_pan = current_pan == 0.6 ? -0.6 : 0.6;
                applySettings(elid, { pan: current_pan});
            } else {
                if(sidepause) return false;
                if (direction === 1) {
                    current_pan += 0.02;
                    if (current_pan > 0.8) { direction = 0; pan_pause(1500); }
                } else{
                    current_pan -= 0.02;
                    if (current_pan < -0.8){ direction = 1; pan_pause(1500); }
                }
                applySettings(elid, { pan: current_pan, gain: 1 + Math.abs(current_pan) / 3});
            }
        }
    }, 150);

    function applySettings (elid, newSettings) {
        var el = document.querySelector('[data-8dscript="' + elid + '"]')
        if (!el.xSoundFixerContext) {
            el.xSoundFixerContext = new AudioContext()
            el.xSoundFixerGain = el.xSoundFixerContext.createGain()
            el.xSoundFixerPan = el.xSoundFixerContext.createStereoPanner()
            el.xSoundFixerSplit = el.xSoundFixerContext.createChannelSplitter(2)
            el.xSoundFixerMerge = el.xSoundFixerContext.createChannelMerger(2)
            el.xSoundFixerSource = el.xSoundFixerContext.createMediaElementSource(el)
            el.xSoundFixerSource.connect(el.xSoundFixerGain)
            el.xSoundFixerGain.connect(el.xSoundFixerPan)
            el.xSoundFixerPan.connect(el.xSoundFixerContext.destination)
            el.xSoundFixerOriginalChannels = el.xSoundFixerContext.destination.channelCount
        }
        if (newSettings.gain) {
            el.xSoundFixerGain.gain.value = newSettings.gain
        }
        if (newSettings.pan) {
            el.xSoundFixerPan.pan.value = newSettings.pan
        }
        if ('mono' in newSettings) {
            el.xSoundFixerContext.destination.channelCount = newSettings.mono ? 1 : el.xSoundFixerOriginalChannels
        }
        if ('flip' in newSettings) {
            el.xSoundFixerFlipped = newSettings.flip
            el.xSoundFixerMerge.disconnect()
            el.xSoundFixerPan.disconnect()
            if (el.xSoundFixerFlipped) {
                el.xSoundFixerPan.connect(el.xSoundFixerSplit)
                el.xSoundFixerSplit.connect(el.xSoundFixerMerge, 0, 1)
                el.xSoundFixerSplit.connect(el.xSoundFixerMerge, 1, 0)
                el.xSoundFixerMerge.connect(el.xSoundFixerContext.destination)
            } else {
                el.xSoundFixerPan.connect(el.xSoundFixerContext.destination)
            }
        }
        el.xSoundFixerSettings = {
            gain: el.xSoundFixerGain.gain.value,
            pan: el.xSoundFixerPan.pan.value,
            mono: el.xSoundFixerContext.destination.channelCount == 1,
            flip: el.xSoundFixerFlipped,
        }
    }


})();