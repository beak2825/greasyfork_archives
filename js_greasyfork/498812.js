// ==UserScript==
// @name         Discord Web Stereo and High Bitratde
// @namespace    http://tampermonkey.net/
// @version      0.7
// @description  Enable stereo microphone input and set the highest bitrate for Discord Web.
// @match        https://discord.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/498812/Discord%20Web%20Stereo%20and%20High%20Bitratde.user.js
// @updateURL https://update.greasyfork.org/scripts/498812/Discord%20Web%20Stereo%20and%20High%20Bitratde.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Search for the appropriate methods dynamically
    const findAndHookMethods = () => {
        const searchInterval = 5000;

        const hookMethod = (object, methodName, hookFunction) => {
            if (object && typeof object[methodName] === 'function') {
                const originalMethod = object[methodName];
                object[methodName] = function() {
                    hookFunction.apply(this, arguments);
                    return originalMethod.apply(this, arguments);
                };
                console.log(`Hooked ${methodName} on`, object);
                return true;
            }
            return false;
        };

        const hookSetTransceiverEncodingParameters = () => {
            const hookFunction = function(parameters) {
                console.log('hookSetTransceiverEncodingParameters called with parameters:', parameters);
                if (parameters && parameters.encodings) {
                    for (const encoding of parameters.encodings) {
                        encoding.maxBitrate = 1329600; // Set this to the desired bitrate (1329.60 kbps)
                        encoding.channels = 2; // Enable stereo
                        console.log('Updated encoding:', encoding);
                    }
                }
            };

            let hooked = false;
            const potentialObjects = [window, ...Object.values(window)];

            for (const obj of potentialObjects) {
                if (hookMethod(obj, 'setTransceiverEncodingParameters', hookFunction)) {
                    hooked = true;
                    break;
                }
            }

            if (!hooked) {
                console.error('setTransceiverEncodingParameters method not found. Retrying in 5 seconds.');
                setTimeout(hookSetTransceiverEncodingParameters, searchInterval);
            }
        };

        const hookSetTransportOptions = () => {
            const hookFunction = function(options) {
                console.log('hookSetTransportOptions called with options:', options);
                if (options && options.audio && options.audio.transportOptions) {
                    options.audio.transportOptions.encodingParams = {
                        channels: 2 // Enable stereo
                    };
                    console.log('Updated audio transport options:', options.audio.transportOptions);
                }
            };

            let hooked = false;
            const potentialObjects = [window, ...Object.values(window)];

            for (const obj of potentialObjects) {
                if (hookMethod(obj, 'setTransportOptions', hookFunction)) {
                    hooked = true;
                    break;
                }
            }

            if (!hooked) {
                console.error('setTransportOptions method not found. Retrying in 5 seconds.');
                setTimeout(hookSetTransportOptions, searchInterval);
            }
        };

        // Initialize hooks
        const init = () => {
            console.log('Initializing hooks');
            hookSetTransceiverEncodingParameters();
            hookSetTransportOptions();
            console.log('Hooks initialization attempted');
        };

        // Wait for the Discord Web app to fully load before initializing
        window.addEventListener('load', init);
        console.log('Event listener added for window load');
    };

    findAndHookMethods();
})();
