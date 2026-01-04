// ==UserScript==
// @name         Show Twitch TV latency to streamer
// @namespace    http://tampermonkey.net/
// @license MIT
// @version      1.6
// @description  Shows latency to broadcaster and adapts to theater/normal mode.
// @author       You
// @match        https://www.twitch.tv/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/509864/Show%20Twitch%20TV%20latency%20to%20streamer.user.js
// @updateURL https://update.greasyfork.org/scripts/509864/Show%20Twitch%20TV%20latency%20to%20streamer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle(`
            div[data-a-target='player-overlay-video-stats'] {
            display: none !important;
        }
        .latency-button {
            cursor: pointer;
            padding: 3px 4px;
            border-radius: 4px;
            background-color: #6441A5; /* Twitch dark purple */
            color: #fff;
            font-size: 12px;
            margin-left: 5px;
            display: inline-block;
            transition: transform 0.1s, background-color 0.2s;
            user-select: none;
        }
        .latency-button:hover {
            background-color: #7E5DBA; /* Darker shade of Twitch purple on hover */
        }
        .latency-button:active {
            transform: scale(0.95);
        }
    `);

    var lastKnownLatency = "N/A"; // Initialize with "N/A" as the initial value
    var isLowLatencyAvailable = false;

    window.addEventListener('load', function () {
        console.log("Script loaded.");
        openVideoStats();
        monitorTheaterMode(); // Start monitoring theater mode changes
    });

    function openVideoStats() {
        console.log("Opening video stats...");
        var settingsButton = document.querySelector("button[data-a-target='player-settings-button']");
        if (settingsButton) {
            settingsButton.click();
            setTimeout(function(){
                var advancedOption = document.querySelector("button[data-a-target='player-settings-menu-item-advanced']");
                if (advancedOption) {
                    advancedOption.click();
                    setTimeout(function(){
                        var videoStatsOption = document.querySelector("div[data-test-selector='video-stats-toggle']");
                        if (videoStatsOption) {
                            var checkbox = videoStatsOption.querySelector("input[type='checkbox']");
                            if (checkbox) {
                                checkbox.click();
                                setTimeout(function(){
                                    closeSettingsMenu(); // Close the settings menu
                                    checkLowLatencyAvailability(); // Check if low latency option is available
                                }, 1000);
                            } else {
                                console.error("Checkbox not found for video stats option.");
                            }
                        } else {
                            console.error("Video stats option not found.");
                        }
                    }, 1000);
                } else {
                    console.error("Advanced option not found.");
                }
            }, 1000);
        } else {
            console.error("Settings button not found.");
        }
    }

    function closeSettingsMenu() {
        console.log("Closing settings menu...");
        var closeButton = document.querySelector("button[data-a-target='player-settings-button']");
        if (closeButton) {
            closeButton.click();
        } else {
            console.error("Close button not found.");
        }
    }

    function checkLowLatencyAvailability() {
        var lowLatencyOption = Array.from(document.querySelectorAll("div[role='menuitemcheckbox']")).find(el => el.innerText.includes("Low Latency"));
        if (lowLatencyOption) {
            isLowLatencyAvailable = true;
        } else {
            isLowLatencyAvailable = false;
        }
        console.log("Low Latency Available:", isLowLatencyAvailable);
    }

    function updateLatency() {
        console.log("Updating latency...");
        var latencyElement = document.querySelector("p[aria-label='Latency To Broadcaster']");
        if (latencyElement) {
            console.log("Latency element found.");
            var latencyText = latencyElement.innerText;
            lastKnownLatency = latencyText; // Update the last known latency value

            // Check for theater mode by monitoring the appropriate div class
            var theaterModeDiv = document.querySelector(".channel-root__scroll-area--theatre-mode");
            if (theaterModeDiv) {
                displayLatencyByChannelPoints(latencyText); // Display latency near channel points if theater mode is active
            } else {
                displayLatencyBelowViewerCount(latencyText); // Otherwise display latency below the viewer count
            }
        } else {
            console.error("Latency element not found.");
        }
    }

    function displayLatencyBelowViewerCount(latencyText) {
        console.log("Displaying latency below viewer count...");
        var viewerCountElement = document.querySelector("[data-a-target='animated-channel-viewers-count']");
        if (viewerCountElement) {
            var latencyBelowDiv = document.getElementById("userScript_latencyBelowDiv");
            if (!latencyBelowDiv) {
                latencyBelowDiv = document.createElement("div");
                latencyBelowDiv.id = "userScript_latencyBelowDiv";
                latencyBelowDiv.className = "latency-button";
                latencyBelowDiv.style.zIndex = "9999";
                viewerCountElement.parentElement.appendChild(latencyBelowDiv);
                latencyBelowDiv.addEventListener("click", toggleLatency);
            }
            latencyBelowDiv.innerText = "Latency: " + (latencyText || lastKnownLatency); // Display last known latency if current latency is undefined
            latencyBelowDiv.style.color = getLatencyColor(latencyText || lastKnownLatency);
            latencyBelowDiv.style.display = "block"; // Ensure it's displayed

            // Hide latency by channel points if it's shown
            var latencyChannelPointsDiv = document.getElementById("userScript_latencyChannelPointsDiv");
            if (latencyChannelPointsDiv) {
                latencyChannelPointsDiv.style.display = "none";
            }
        } else {
            console.error("Viewer count element not found.");
        }
    }

    function displayLatencyByChannelPoints(latencyText) {
        console.log("Displaying latency in chat input buttons container");

        var channelPointsContainer = document.querySelector("div[data-test-selector='chat-input-buttons-container']");
        if (channelPointsContainer) {
            var latencyChannelPointsDiv = document.getElementById("userScript_latencyChannelPointsDiv");
            if (!latencyChannelPointsDiv) {
                latencyChannelPointsDiv = document.createElement("div");
                latencyChannelPointsDiv.id = "userScript_latencyChannelPointsDiv";
                latencyChannelPointsDiv.className = "latency-button";
                latencyChannelPointsDiv.style.zIndex = "9999";
                channelPointsContainer.insertBefore(latencyChannelPointsDiv, channelPointsContainer.firstChild);
                latencyChannelPointsDiv.addEventListener("click", toggleLatency);
            }
            latencyChannelPointsDiv.innerText = (latencyText || lastKnownLatency); // Display last known latency if current latency is undefined
            latencyChannelPointsDiv.style.color = getLatencyColor(latencyText || lastKnownLatency);
            latencyChannelPointsDiv.style.display = "block"; // Ensure it's displayed

            // Hide latency below viewer count if it's shown
            var latencyBelowDiv = document.getElementById("userScript_latencyBelowDiv");
            if (latencyBelowDiv) {
                latencyBelowDiv.style.display = "none";
            }
        } else {
            console.error("Channel points container not found.");
        }
    }

    function toggleLatency() {
        console.log("Toggling latency...");
        if (isLowLatencyAvailable) {
            toggleLowLatency();
        } else {
            pauseAndUnpauseStream();
        }
    }

    function toggleLowLatency() {
        console.log("Toggling low latency...");
        var settingsButton = document.querySelector("button[data-a-target='player-settings-button']");
        if (settingsButton) {
            settingsButton.click();
            setTimeout(function(){
                var advancedOption = document.querySelector("button[data-a-target='player-settings-menu-item-advanced']");
                if (advancedOption) {
                    advancedOption.click();
                    setTimeout(function(){
                        var lowLatencyOption = Array.from(document.querySelectorAll("div[role='menuitemcheckbox']")).find(el => el.innerText.includes("Low Latency"));
                        if (lowLatencyOption) {
                            var checkbox = lowLatencyOption.querySelector("input[type='checkbox']");
                            if (checkbox) {
                                checkbox.click();
                                setTimeout(function(){
                                    checkbox.click();
                                    setTimeout(function(){
                                        closeSettingsMenu(); // Close the settings menu
                                    }, 500);
                                }, 500);
                            } else {
                                console.error("Checkbox not found for low latency option.");
                            }
                        } else {
                            console.error("Low latency option not found.");
                        }
                    }, 1000);
                } else {
                    console.error("Advanced option not found.");
                }
            }, 1000);
        } else {
            console.error("Settings button not found.");
        }
    }

    function pauseAndUnpauseStream() {
        console.log("Pausing and unpausing stream...");
        var playPauseButton = document.querySelector("button[data-a-target='player-play-pause-button']");
        if (playPauseButton) {
            playPauseButton.click(); // Pause the stream
            setTimeout(function(){
                playPauseButton.click(); // Unpause the stream after a short delay
            }, 1000);
        } else {
            console.error("Play/pause button not found.");
        }
    }

    function getLatencyColor(latencyText) {
        var latencyValue = parseFloat(latencyText.replace('s', ''));
        if (latencyValue <= 5) {
            return "white";
        } else if (latencyValue <= 10) {
            return "yellow";
        } else {
            return "red";
        }
    }

    function monitorTheaterMode() {
        console.log("Monitoring theater mode...");
        var observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                    updateLatency(); // Update latency position when theater mode changes
                }
            });
        });

        var targetElement = document.querySelector('body'); // Body class changes for theater mode
        if (targetElement) {
            observer.observe(targetElement, { attributes: true }); // Observe attribute changes (for class)
        } else {
            console.error("Body element not found.");
        }
    }
})();
