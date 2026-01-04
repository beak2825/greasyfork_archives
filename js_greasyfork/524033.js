// ==UserScript==
// @name         webcam size checker
// @namespace    http://tampermonkey.net/
// @version      2.4
// @description  Observes WebSocket traffic, getUserMedia, and WebRTC connections. Logs quality and resolution of webcams, only reporting webcam sizes.
// @author       MeKLiN
// @match        https://stumblechat.com/room/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=stumblechat.com
// @grant        none
// @license      MIT
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/524033/webcam%20size%20checker.user.js
// @updateURL https://update.greasyfork.org/scripts/524033/webcam%20size%20checker.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Ensure the DOM is ready before manipulating it
    window.addEventListener('DOMContentLoaded', function () {

        // Override getUserMedia before the page loads
        const originalGetUserMedia = navigator.mediaDevices.getUserMedia;
        navigator.mediaDevices.getUserMedia = async function (constraints) {
            console.log('getUserMedia called with constraints:', constraints);

            // Check if video constraints are provided
            if (constraints.video) {
                // Enforce resolution settings
                constraints.video.width = { ideal: 320 };
                constraints.video.height = { ideal: 240 };
            }

            try {
                return await originalGetUserMedia.call(this, constraints);
            } catch (err) {
                console.error('getUserMedia error:', err);
                throw err;
            }
        };

        // User popups object to store user-specific stats
        const userPopups = {};

        // Main overlay to hold all user buttons
        function createUserHandleOverlay() {
            const overlay = document.createElement("div");
            overlay.id = "userHandleOverlay";
            Object.assign(overlay.style, {
                position: "fixed",
                bottom: "10px",
                left: "10px",
                width: "300px",
                maxHeight: "500px",
                backgroundColor: "rgba(0, 0, 0, 0.8)",
                color: "white",
                overflowY: "auto",
                padding: "10px",
                fontSize: "14px",
                zIndex: "10000",
                borderRadius: "5px",
            });

            document.body.appendChild(overlay);
        }

        // Add a user button to the overlay
        function addUserHandleButton(handle) {
            const overlay = document.getElementById("userHandleOverlay");
            if (!overlay) return; // Ensure the overlay is available before proceeding

            if (userPopups[handle]) return; // Prevent duplicates

            const userDiv = document.createElement("div");
            userDiv.style.marginBottom = "10px";

            const button = document.createElement("button");
            button.textContent = `User: ${handle}`;
            Object.assign(button.style, {
                marginRight: "10px",
                padding: "5px 10px",
            });

            const statsButton = document.createElement("button");
            statsButton.textContent = "Get Stats";
            Object.assign(statsButton.style, {
                padding: "5px 10px",
            });

            // Create a popup for the user's stats
            const popup = document.createElement("div");
            popup.id = `popup-${handle}`;
            Object.assign(popup.style, {
                display: "none",
                position: "fixed",
                bottom: "60px",
                left: "10px",
                width: "300px",
                maxHeight: "300px",
                overflowY: "auto",
                backgroundColor: "rgba(0, 0, 0, 0.9)",
                color: "white",
                padding: "10px",
                borderRadius: "5px",
                zIndex: "10001",
            });
            popup.textContent = `Stats for ${handle}`;
            document.body.appendChild(popup);

            // Toggle the user's popup
            button.addEventListener("click", () => {
                popup.style.display = popup.style.display === "none" ? "block" : "none";
            });

            // Fetch and display webcam resolution only
            statsButton.addEventListener("click", () => {
                fetchStatsForUser(handle, popup);
            });

            userDiv.appendChild(button);
            userDiv.appendChild(statsButton);
            overlay.appendChild(userDiv);

            userPopups[handle] = popup;
        }

        // Peer connections mapped by user handle
        const peerConnections = {};

        // Monitor WebSocket traffic
        const OriginalWebSocket = window.WebSocket;
        window.WebSocket = function (url, protocols) {
            const webSocket = new OriginalWebSocket(url, protocols);

            webSocket.addEventListener("message", (event) => {
                try {
                    const data = JSON.parse(event.data);
                    if (data.stumble && data.stumble === "subscribe" && data.type === "consume") {
                        const handle = data.consume?.producerId || "Unknown";
                        addUserHandleButton(handle);
                    }
                } catch (err) {
                    console.error("Error parsing WebSocket message:", err);
                }
            });

            return webSocket;
        };

        // Intercept RTCPeerConnection
        const OriginalPeerConnection = window.RTCPeerConnection;
        window.RTCPeerConnection = function (config) {
            const pc = new OriginalPeerConnection(config);

            // Add track event listener and update peerConnections
            pc.addEventListener('track', (event) => {
                const handle = event.track.id || "Unknown";
                peerConnections[handle] = pc;
                addUserHandleButton(handle);
            });

            return pc;
        };

        // Fetch stats for a user and display only the webcam resolution
        async function fetchStatsForUser(handle, popup) {
            const pc = peerConnections[handle];
            if (pc) {
                try {
                    const stats = await pc.getStats();
                    popup.innerHTML = `<strong>Stats for ${handle}:</strong><br>`;

                    stats.forEach(report => {
                        if (report.kind === "video") {
                            const videoStats = {
                                width: report.frameWidth,
                                height: report.frameHeight
                            };
                            popup.innerHTML += `<pre>${JSON.stringify(videoStats, null, 2)}</pre>`;
                        }
                    });
                } catch (err) {
                    popup.innerHTML = `Error fetching stats: ${err.message}`;
                }
            } else {
                popup.innerHTML = `No active connection for ${handle}`;
            }
        }

        // Initialize overlays
        createUserHandleOverlay();
    });

})();
