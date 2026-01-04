// ==UserScript==
// @name         Discord Web Stereo and High Bitratezzz
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  Enable stereo microphone input and set the highest bitrate for Discord Web.
// @match        https://discord.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/498810/Discord%20Web%20Stereo%20and%20High%20Bitratezzz.user.js
// @updateURL https://update.greasyfork.org/scripts/498810/Discord%20Web%20Stereo%20and%20High%20Bitratezzz.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to hook into UnifiedConnection.setTransceiverEncodingParameters
    const hookSetTransceiverEncodingParameters = () => {
        if (typeof UnifiedConnection !== 'undefined' && UnifiedConnection.prototype.setTransceiverEncodingParameters) {
            const originalSetParameters = UnifiedConnection.prototype.setTransceiverEncodingParameters;
            UnifiedConnection.prototype.setTransceiverEncodingParameters = function(parameters) {
                console.log('hookSetTransceiverEncodingParameters called with parameters:', parameters);
                if (parameters && parameters.encodings) {
                    for (const encoding of parameters.encodings) {
                        encoding.maxBitrate = 1329600; // Set this to the desired bitrate (1329.60 kbps)
                        encoding.channels = 2; // Enable stereo
                        console.log('Updated encoding:', encoding);
                    }
                }
                return originalSetParameters.apply(this, arguments);
            };
            console.log('UnifiedConnection.setTransceiverEncodingParameters hooked');
        } else {
            console.error('UnifiedConnection.setTransceiverEncodingParameters not found. Retrying in 1 second.');
            setTimeout(hookSetTransceiverEncodingParameters, 1000);
        }
    };

    // Function to hook into RTCRtpSender.setTransportOptions
    const hookSetTransportOptions = () => {
        if (typeof RTCRtpSender !== 'undefined' && RTCRtpSender.prototype.setTransportOptions) {
            const originalSetTransportOptions = RTCRtpSender.prototype.setTransportOptions;
            RTCRtpSender.prototype.setTransportOptions = function(options) {
                console.log('hookSetTransportOptions called with options:', options);
                if (options && options.audio && options.audio.transportOptions) {
                    options.audio.transportOptions.encodingParams = {
                        channels: 2 // Enable stereo
                    };
                    console.log('Updated audio transport options:', options.audio.transportOptions);
                }
                return originalSetTransportOptions.apply(this, arguments);
            };
            console.log('RTCRtpSender.setTransportOptions hooked');
        } else {
            console.error('RTCRtpSender.setTransportOptions not found. Retrying in 1 second.');
            setTimeout(hookSetTransportOptions, 1000);
        }
    };

    // Initialize hooks when the page loads
    const init = () => {
        console.log('Initializing hooks');
        hookSetTransceiverEncodingParameters();
        hookSetTransportOptions();
        console.log('Hooks initialized');
    };

    // Wait for the Discord Web app to fully load before initializing
    window.addEventListener('load', init);
    console.log('Event listener added for window load');
})();
