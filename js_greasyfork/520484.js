// ==UserScript==
// @name         Raw Mic Input
// @namespace    https://6942020.xyz/
// @version      1.4
// @description  Disables WebRTC audio processing to allow raw mic input.
// @author       Joey Watts
// @author       WadeGrimridge
// @match        *://*/*
// @grant        none
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/520484/Raw%20Mic%20Input.user.js
// @updateURL https://update.greasyfork.org/scripts/520484/Raw%20Mic%20Input.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let globalRawAudioTrack = null;

    const rawConfig = {
        echoCancellation: false,
        noiseSuppression: false,
        autoGainControl: false,
        voiceIsolation: false,
        googEchoCancellation: false,
        googAutoGainControl: false,
        googAutoGainControl2: false,
        googNoiseSuppression: false,
        googHighpassFilter: false,
        googTypingNoiseDetection: false
    };

    function disableAutogain(constraints) {
        if (!constraints) return;
        if (constraints.audio === true) constraints.audio = {};
        if (constraints.audio && typeof constraints.audio === 'object') {
            Object.assign(constraints.audio, rawConfig);
            if (constraints.audio.mandatory) {
                Object.assign(constraints.audio.mandatory, rawConfig);
            }
        }
    }

    if (navigator.mediaDevices) {
        const origGetUserMedia = navigator.mediaDevices.getUserMedia;
        navigator.mediaDevices.getUserMedia = function(constraints) {
            disableAutogain(constraints);
            return origGetUserMedia.call(this, constraints).then(stream => {
                const track = stream.getAudioTracks()[0];
                if (track) {
                    globalRawAudioTrack = track;
                }
                return stream;
            });
        };
    }

    if (window.RTCPeerConnection) {
        const origAddTransceiver = RTCPeerConnection.prototype.addTransceiver;
        RTCPeerConnection.prototype.addTransceiver = function(trackOrKind, init) {
            if (globalRawAudioTrack && typeof trackOrKind === 'object' && trackOrKind.kind === 'audio') {
                return origAddTransceiver.call(this, globalRawAudioTrack, init);
            }
            return origAddTransceiver.call(this, trackOrKind, init);
        };
    }

    if (window.RTCRtpSender) {
        const origReplaceTrack = RTCRtpSender.prototype.replaceTrack;
        RTCRtpSender.prototype.replaceTrack = function(track) {
            if (track && globalRawAudioTrack && track.kind === 'audio') {
                return origReplaceTrack.call(this, globalRawAudioTrack);
            }
            return origReplaceTrack.call(this, track);
        };
    }

    if (navigator.getUserMedia) {
        const patchLegacy = (orig) => function(constraints, success, error) {
            disableAutogain(constraints);
            return orig.call(this, constraints, (stream) => {
                const track = stream.getAudioTracks()[0];
                if (track) globalRawAudioTrack = track;
                if (success) success(stream);
            }, error);
        };
        navigator.getUserMedia = patchLegacy(navigator.getUserMedia);
        if (navigator.webkitGetUserMedia) navigator.webkitGetUserMedia = patchLegacy(navigator.webkitGetUserMedia);
        if (navigator.mozGetUserMedia) navigator.mozGetUserMedia = patchLegacy(navigator.mozGetUserMedia);
    }
})();