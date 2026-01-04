// ==UserScript==
// @name         Screenshare with Audio
// @namespace    https://github.com/edisionnano
// @version      0.6
// @description  Screenshare with Audio on Discord
// @author       Guest271314 and Samantas5855
// @match        https://*.discord.com/*
// @icon         https://www.google.com/s2/favicons?domain=discord.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/436013/Screenshare%20with%20Audio.user.js
// @updateURL https://update.greasyfork.org/scripts/436013/Screenshare%20with%20Audio.meta.js
// ==/UserScript==

/* jshint esversion: 11 */

(async () => {
    'use strict';

    async function getVirtMicTrack() {
        await navigator.mediaDevices.getUserMedia({
            audio: true
        });
        await new Promise(r => setTimeout(r, 500));
        const devices = await navigator.mediaDevices.enumerateDevices();
        const virtmic = devices.find(d => d.kind === "audioinput" && d.label.toLowerCase().includes("virtmic"));
        if (!virtmic) {
            return null;
        }
        const stream = await navigator.mediaDevices.getUserMedia({
            audio: {
                deviceId: {
                    exact: virtmic.deviceId
                },
                channelCount: 2,
                autoGainControl: false,
                echoCancellation: false,
                noiseSuppression: false
                // You can set more audio constraints here, bellow are some examples
                // just don't forget to add a comma at every option other than the last
                //latency: 0,
                //sampleRate: 48000,
                //sampleSize: 16,
                //volume: 1.0
            }
        });
        return stream.getAudioTracks()[0];
    }

    const hookDisplayMedia = async () => {
        if (!navigator.mediaDevices?.getDisplayMedia) {
            return;
        }

        const original = navigator.mediaDevices.getDisplayMedia;
        navigator.mediaDevices.getDisplayMedia = async function(constraints) {
            const displayStream = await original.call(navigator.mediaDevices, constraints);
            const virtmicTrack = await getVirtMicTrack();
            if (!virtmicTrack) return displayStream;
            displayStream.getAudioTracks().forEach(track => displayStream.removeTrack(track));
            displayStream.addTrack(virtmicTrack);
            return displayStream;
        };
    };

    let retries = 0;
    const interval = setInterval(() => {
        if (retries++ > 10) {
            clearInterval(interval);
            return;
        }
        if (navigator.mediaDevices?.getDisplayMedia) {
            clearInterval(interval);
            hookDisplayMedia();
        }
    }, 500);

    //Stereo support thanks to @dakrk
    const originalSetRemoteDescription = RTCPeerConnection.prototype.setRemoteDescription;
    RTCPeerConnection.prototype.setRemoteDescription = function(...args) {
        if (args[0]?.sdp) {
            args[0].sdp = args[0].sdp.replaceAll('useinbandfec=1', 'useinbandfec=1;stereo=1');
        }
        return originalSetRemoteDescription.apply(this, args);
    };
})();