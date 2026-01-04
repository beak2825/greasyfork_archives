// ==UserScript==
// @name         Twitch Latency on Player Controls
// @namespace    http://tampermonkey.net/
// @version      0.8
// @description  Takes the Latency to Broadcaster in the video settings menu and places it in the player controls
// @author       tunacan_man
// @match        https://www.twitch.tv/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/391680/Twitch%20Latency%20on%20Player%20Controls.user.js
// @updateURL https://update.greasyfork.org/scripts/391680/Twitch%20Latency%20on%20Player%20Controls.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    const LATENCY_UPDATE_INTERVAL = 1000; // 1 seconds
    const REINITIALIZE_INTERVAL = 2000;
    let initialized = false;
    let latencyDiv = null;
    let chatLatencyDiv = null;
    let updateIntervalId = null;

    function waitForElement(selector) {
        return new Promise(resolve => {
            if (document.querySelector(selector)) {
                return resolve(document.querySelector(selector));
            }
            const observer = new MutationObserver(mutations => {
                if (document.querySelector(selector)) {
                    observer.disconnect();
                    resolve(document.querySelector(selector));
                }
            });
            observer.observe(document.body, { childList: true, subtree: true });
        });
    }

    async function createLatencyDiv() {
        const controlGroup = await waitForElement(".player-controls__right-control-group");
        if (!controlGroup) return null;
        const existingDiv = document.getElementById('userScript_latencyDiv');
        if (existingDiv) return existingDiv;
        const latencyDiv = document.createElement('div');
        latencyDiv.id = 'userScript_latencyDiv';
        latencyDiv.textContent = '0:00';
        controlGroup.insertAdjacentElement("afterbegin", latencyDiv);
        return latencyDiv;
    }

    async function createChatLatencyDiv() {
        const chatTextArea = await waitForElement(".chat-input__textarea");
        if (!chatTextArea) return null;
        const existingDiv = document.getElementById('userScript_chatLatencyDiv');
        if (existingDiv) return existingDiv;
        const chatLatencyDiv = document.createElement('span');
        chatLatencyDiv.id = 'userScript_chatLatencyDiv';
        chatLatencyDiv.textContent = '0.00';
        chatLatencyDiv.setAttribute("style", "position: absolute;top: -6px;left: 40px;font-size: smaller;color: #eb0400;background-color: #18181b; padding:0px 4px;display: none;");
        chatTextArea.insertAdjacentElement("beforeend", chatLatencyDiv);
        return chatLatencyDiv;
    }

    async function openVideoStats() {
        const settingsButton = await waitForElement("button[data-a-target='player-settings-button']");
        settingsButton.click();
        const advancedButton = await waitForElement("button[data-a-target='player-settings-menu-item-advanced']");
        advancedButton.click();
        const toggleInput = await waitForElement("div[data-a-target='player-settings-submenu-advanced-video-stats']");
        toggleInput.children[0].click();
        const videoStatsDiv = await waitForElement("div[data-a-target='player-overlay-video-stats']");
        videoStatsDiv.style.display = "none";
        settingsButton.click(); // Close the settings menu
    }

    function updateLatency() {
        if (!latencyDiv) return;
        if (!chatLatencyDiv) return;
        const latencyElement = document.querySelector("p[aria-label='Latency To Broadcaster']");
        if (latencyElement) {
            latencyDiv.textContent = latencyElement.textContent;
            let latency = parseFloat(latencyDiv.textContent.slice(0, -5));
            if (latency > 12) {
                // latencyDiv.style.color = "#eb0400";
                chatLatencyDiv.textContent = "⚠️" + latency.toFixed(2);
                chatLatencyDiv.style.display = "inherit";
                chatLatencyDiv.style.border = "1px solid #eb0400";
                chatLatencyDiv.style.color = "#eb0400";
                // document.querySelector("div[data-a-target='chat-input']").style.borderTop = "2px solid #eb0400";
                document.querySelector("div[data-a-target='chat-input']").style.borderRadius = "inherit";
            } else if (latency > 7) {
                // latencyDiv.style.color = "#eb0400";
                chatLatencyDiv.textContent = "⚠️" + latency.toFixed(2);
                chatLatencyDiv.style.display = "inherit";
                // chatLatencyDiv.style.border = "1px solid #eacb00";
                chatLatencyDiv.style.border = "none";
                chatLatencyDiv.style.color = "#eacb00";
                // document.querySelector("div[data-a-target='chat-input']").style.borderTop = "1px solid #eacb00";
                document.querySelector("div[data-a-target='chat-input']").style.borderRadius = "inherit";
            } else {
                latencyDiv.style.color = "#ececec";
                chatLatencyDiv.style.display = "none";
                // document.querySelector("div[data-a-target='chat-input']").style.borderTop = "inherit";
                document.querySelector("div[data-a-target='chat-input']").style.borderRadius = "inherit";
            }
        }
    }

    function startUpdatingLatency() {
        if (updateIntervalId !== null) {
            clearInterval(updateIntervalId);
        }
        updateIntervalId = setInterval(updateLatency, LATENCY_UPDATE_INTERVAL);
    }

    async function init() {
        if (initialized) return;
        latencyDiv = await createLatencyDiv();
        if (!latencyDiv) {
            console.error('LATENCY SCRIPT: Failed to create latency div');
            return;
        }
        chatLatencyDiv = await createChatLatencyDiv();
        if (!chatLatencyDiv) {
            console.error('LATENCY SCRIPT: Failed to create chat latency div');
            return;
        }
        await openVideoStats();
        startUpdatingLatency();
        initialized = true;
        console.log('LATENCY SCRIPT: initialized');
    }

    function reinitialize() {
        if (!document.querySelector(".player-controls__right-control-group") || !document.body.contains(latencyDiv) || !document.querySelector("div[data-a-target='player-overlay-video-stats']") || !document.body.contains(chatLatencyDiv)) {
            initialized = false;
            latencyDiv = null;
            chatLatencyDiv = null;
            if (updateIntervalId !== null) {
                clearInterval(updateIntervalId);
                updateIntervalId = null;
            }
            console.log('LATENCY SCRIPT: Reinitializing script due to missing elements');
            init();
        }
    }

    // Initial setup
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Periodic reinitialization check
    setInterval(reinitialize, REINITIALIZE_INTERVAL);
})();
