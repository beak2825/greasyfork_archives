// ==UserScript==
// @name            Twitch Player Quality Changer
// @description     Automatically change the quality of the Twitch player to your liking.
// @namespace       https://github.com/ramhaidar/Twitch-Player-Quality-Changer
// @version         0.0.7
// @author          ramhaidar
// @homepageURL     https://github.com/ramhaidar/Twitch-Player-Quality-Changer
// @icon            https://www.google.com/s2/favicons?sz=64&domain=twitch.tv
// @license         MIT
// @match           https://www.twitch.tv/*
// @match           https://player.twitch.tv/*
// @grant           none
// @run-at          document-end
// @downloadURL https://update.greasyfork.org/scripts/465887/Twitch%20Player%20Quality%20Changer.user.js
// @updateURL https://update.greasyfork.org/scripts/465887/Twitch%20Player%20Quality%20Changer.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Set the desired auto-quality.
    /* Available Quality Options:
       - 1080p60
       - 936p60
       - 720p60
       - 720p
       - 480p
       - 360p
       - 160p
    */
    const PreferedQuality = "480p"; // Change this to your Prefered Quality

    const AllQuality = ["1080p60", "936p60", "720p60", "720p", "480p", "360p", "160p"];
    const PreferredIndex = AllQuality.indexOf(PreferedQuality);

    // A function that waits for an element to exist in the DOM and then executes a callback function.
    function waitForElement(selector, maxAttempts = 10, callback) {
        let attempts = 0;
        const intervalId = setInterval(function () {
            const element = document.querySelector(selector);
            if (element) {
                clearInterval(intervalId);
                callback(element);
            } else {
                attempts++;
                if (attempts >= maxAttempts) {
                    clearInterval(intervalId);
                    console.warn('Element ' + selector + ' not found after ' + maxAttempts + ' attempts');
                }
            }
        }, 500);
    }

    // Get the element that indicates if a channel is live or offline.
    const elem = document.querySelector('.tw-channel-status-text-indicator, .channel-status-info');

    // A callback function to execute when the element is found.
    function onElementFound(elem) {
        console.warn('Element found:', elem);
        main();
    }

    // A function that waits until the element exists in the DOM, then executes a callback function.
    function waitUntilElementExists(elem, callback) {
        elem = document.querySelector('.tw-channel-status-text-indicator, .channel-status-info');
        if (elem !== null) {
            callback(elem);
        } else {
            setTimeout(function () {
                waitUntilElementExists(elem, callback);
            }, 500);
        }
    }

    waitUntilElementExists(elem, onElementFound);

    function main() {

        // Check if the channel is live or offline.
        if (document.querySelector('.tw-channel-status-text-indicator')?.textContent === "LIVE" || document.querySelector('.channel-status-info')?.textContent === "Offline") {
            console.warn("Channel is live or offline.");

            let settingsButton = null;
            let settingsMenuButton = null;

            // Click the settings button.
            waitForElement('[data-a-target="player-settings-button"]', 25, function (element) {
                settingsButton = element;
                settingsButton.click();
            });

            // Click the quality settings button.
            waitForElement('[data-a-target="player-settings-menu-item-quality"]', 25, function (element) {
                settingsMenuButton = element;
                settingsMenuButton.click();
            });

            // Wait for the quality options to load and select the preferred quality option.
            waitForElement('[data-a-target="tw-radio"]', 25, function (element) {
                const inputs = document.querySelectorAll('input[type="radio"]');
                var qualityFound = false;

                var inputsx = document.querySelectorAll('input[type="radio"]')
                for (let i = 0; i < inputsx.length; i++) {
                    if (inputsx[i].parentNode.textContent.includes(AllQuality[PreferredIndex])) {
                        qualityFound = true;
                    }
                }

                console.warn("Preferred Quality Found: " + qualityFound);

                // If the preferred quality is available, select it.
                if (qualityFound == true) {
                    for (let i = 0; i < inputs.length; i++) {
                        const label = inputs[i].parentNode.querySelector('label');
                        if (label && label.textContent.trim().includes(AllQuality[PreferredIndex])) {
                            inputs[i].checked = true;
                            inputs[i].click();

                            console.warn("Quality Used: " + inputs[i].parentNode.querySelector('label').textContent);

                            // Click the settings button again.
                            waitForElement('[data-a-target="player-settings-button"]', Infinity, function (element) {
                                var settingsButton = element;
                                settingsButton.click();
                                console.warn("Clicked Settings Button");
                            });
                        }
                    }
                }

                // If the preferred quality is not available, select the lowest available quality.
                if (qualityFound == false) {
                    var lastQualityIndex = AllQuality.length - 1;

                    var lastInputIndex = inputsx.length - 1;
                    inputsx[lastInputIndex].checked = true;
                    inputsx[lastInputIndex].click();

                    console.warn("Quality Used: " + inputsx[lastInputIndex].parentNode.querySelector('label').textContent);

                    // Click the settings button again.
                    waitForElement('[data-a-target="player-settings-button"]', Infinity, function (element) {
                        var settingsButton = element;
                        settingsButton.click();
                        console.warn("Clicked Settings Button");
                    });
                }
            });
        } else {
            console.warn("Can't detect whether Channel is live or offline.");
        }
    }
})();