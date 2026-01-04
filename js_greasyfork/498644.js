// ==UserScript==
// @name         Discord High-Quality Stereo Audio
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Set higher audio quality and stereo in Discord
// @author       YourName
// @license      MIT
// @match        https://discord.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/498644/Discord%20High-Quality%20Stereo%20Audio.user.js
// @updateURL https://update.greasyfork.org/scripts/498644/Discord%20High-Quality%20Stereo%20Audio.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const modifyAudioConstraints = (constraints) => {
        if (constraints.audio) {
            // Modify the audio constraints for higher quality and stereo
            constraints.audio = {
                channelCount: 2, // Stereo
                sampleRate: 48000, // 48000 Hz (Standard for Opus codec)
                sampleSize: 16, // 16-bit samples
                volume: 1.0,
                echoCancellation: true,
                noiseSuppression: true,
                autoGainControl: true
            };
        }
        return constraints;
    };

    // Save original getUserMedia function
    const originalGetUserMedia = navigator.mediaDevices.getUserMedia.bind(navigator.mediaDevices);

    // Override getUserMedia
    navigator.mediaDevices.getUserMedia = (constraints) => {
        return originalGetUserMedia(modifyAudioConstraints(constraints));
    };

    // Hook into getUserMedia to modify audio constraints in RTCPeerConnection
    const originalRTCPeerConnection = window.RTCPeerConnection;

    function ModifiedRTCPeerConnection(config) {
        const pc = new originalRTCPeerConnection(config);

        const originalAddTrack = pc.addTrack.bind(pc);
        pc.addTrack = function(track, ...streams) {
            if (track.kind === 'audio') {
                const constraints = track.getConstraints();
                track.applyConstraints(modifyAudioConstraints(constraints));
            }
            return originalAddTrack(track, ...streams);
        };

        return pc;
    }

    window.RTCPeerConnection = ModifiedRTCPeerConnection;
})();
