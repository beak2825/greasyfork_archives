// ==UserScript==
// @name         Discord Web Stereo and High Bitrate
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  Enable stereo microphone input and set the highest bitrate for Discord Web.
// @match        https://discord.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/498808/Discord%20Web%20Stereo%20and%20High%20Bitrate.user.js
// @updateURL https://update.greasyfork.org/scripts/498808/Discord%20Web%20Stereo%20and%20High%20Bitrate.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Hook into UnifiedConnection.setTransceiverEncodingParameters
    const hookSetTransceiverEncodingParameters = () => {
        const originalSetParameters = UnifiedConnection.prototype.setTransceiverEncodingParameters;
        UnifiedConnection.prototype.setTransceiverEncodingParameters = function(parameters) {
            if (parameters && parameters.encodings) {
                for (const encoding of parameters.encodings) {
                    encoding.maxBitrate = 1329600; // Set this to the desired bitrate (1329.60 kbps)
                    encoding.channels = 2; // Enable stereo
                }
            }
            return originalSetParameters.apply(this, arguments);
        };
    };

    // Hook into setTransportOptions
    const hookSetTransportOptions = () => {
        const originalSetTransportOptions = RTCRtpSender.prototype.setTransportOptions;
        RTCRtpSender.prototype.setTransportOptions = function(options) {
            if (options && options.audio && options.audio.transportOptions) {
                options.audio.transportOptions.encodingParams = {
                    channels: 2 // Enable stereo
                };
            }
            return originalSetTransportOptions.apply(this, arguments);
        };
    };

    // Initialize hooks when the page loads
    const init = () => {
        hookSetTransceiverEncodingParameters();
        hookSetTransportOptions();
    };

    // Wait for the Discord Web app to fully load before initializing
    window.addEventListener('load', init);
})();
