// ==UserScript==
// @name         Discord Web Stereo Audio Enhancer
// @namespace    http://tampermonkey.net/
// @version      1.7
// @description  Attempt to force stereo audio and disable filters on Discord web
// @match        https://discord.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/498649/Discord%20Web%20Stereo%20Audio%20Enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/498649/Discord%20Web%20Stereo%20Audio%20Enhancer.meta.js
// ==/UserScript==

/*
MIT License

Copyright (c) 2024 [Your Name]

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

(function() {
    'use strict';

    const enhanceAudioConstraints = (constraints) => {
        if (constraints.audio) {
            constraints.audio = {
                channelCount: 2,
                echoCancellation: false,
                noiseSuppression: false,
                autoGainControl: false
            };
        }
        return constraints;
    };

    // Override getUserMedia
    const originalGetUserMedia = navigator.mediaDevices.getUserMedia.bind(navigator.mediaDevices);
    navigator.mediaDevices.getUserMedia = async (constraints) => {
        console.log('Original constraints:', JSON.stringify(constraints));
        const enhancedConstraints = enhanceAudioConstraints(constraints);
        console.log('Enhanced constraints:', JSON.stringify(enhancedConstraints));
        return await originalGetUserMedia(enhancedConstraints);
    };

    // Override RTCPeerConnection
    const originalRTCPeerConnection = window.RTCPeerConnection;
    window.RTCPeerConnection = function(...args) {
        const pc = new originalRTCPeerConnection(...args);
        
        const originalCreateOffer = pc.createOffer;
        pc.createOffer = async function(options) {
            const offer = await originalCreateOffer.apply(this, arguments);
            offer.sdp = offer.sdp.replace('useinbandfec=1', 'useinbandfec=1; stereo=1; maxaveragebitrate=510000');
            return offer;
        };

        return pc;
    };

    // Attempt to override audio processing
    const originalAudioContext = window.AudioContext || window.webkitAudioContext;
    window.AudioContext = window.webkitAudioContext = function(...args) {
        const context = new originalAudioContext(...args);
        const originalCreateMediaStreamSource = context.createMediaStreamSource.bind(context);
        context.createMediaStreamSource = function(stream) {
            const source = originalCreateMediaStreamSource(stream);
            if (source.channelCount !== 2) {
                source.channelCount = 2;
            }
            return source;
        };
        return context;
    };

    // Monitor audio processing
    const originalCreateScriptProcessor = AudioContext.prototype.createScriptProcessor;
    AudioContext.prototype.createScriptProcessor = function(...args) {
        const processor = originalCreateScriptProcessor.apply(this, args);
        processor.onaudioprocess = function(e) {
            console.log('Audio processed:', e.inputBuffer.numberOfChannels, 'channels');
        };
        return processor;
    };

    console.log('Discord Web Stereo Audio Enhancer loaded');

    // Attempt to disable high pass filter and other processing
    if (window.MediaStreamTrack && window.MediaStreamTrack.prototype.getConstraints) {
        const originalGetConstraints = window.MediaStreamTrack.prototype.getConstraints;
        window.MediaStreamTrack.prototype.getConstraints = function() {
            const constraints = originalGetConstraints.call(this);
            if (constraints.audio) {
                constraints.audio.googHighpassFilter = false;
                constraints.audio.noiseSuppression = false;
                constraints.audio.echoCancellation = false;
                constraints.audio.autoGainControl = false;
            }
            return constraints;
        };
    }

    // Additional attempt to force stereo on MediaStreamTrack
    if (window.MediaStreamTrack && window.MediaStreamTrack.prototype.applyConstraints) {
        const originalApplyConstraints = window.MediaStreamTrack.prototype.applyConstraints;
        window.MediaStreamTrack.prototype.applyConstraints = function(constraints) {
            if (constraints.audio) {
                constraints.audio.channelCount = 2;
            }
            return originalApplyConstraints.call(this, constraints);
        };
    }
})();