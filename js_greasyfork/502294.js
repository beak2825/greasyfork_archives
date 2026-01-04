// ==UserScript==
// @name        Recam Enhancer addon for Bodega Bot
// @version     1.2.1
// @description Enhances the reCam button to detect network disconnections, server closes, and other potential disconnection events on Tinychat, with detailed notifications and colored alerts in the chat.
// @author      Bort
// @match       https://tinychat.com/room/*
// @match       https://tinychat.com/*
// @exclude     https://tinychat.com/settings/*
// @exclude     https://tinychat.com/subscription/*
// @exclude     https://tinychat.com/promote/*
// @exclude     https://tinychat.com/coins/*
// @exclude     https://tinychat.com/gifts*
// @grant       none
// @run-at      document-start
// @namespace https://greasyfork.org/users/1024912
// @downloadURL https://update.greasyfork.org/scripts/502294/Recam%20Enhancer%20addon%20for%20Bodega%20Bot.user.js
// @updateURL https://update.greasyfork.org/scripts/502294/Recam%20Enhancer%20addon%20for%20Bodega%20Bot.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to hijack the reCam button
    function enhanceReCamButton() {
        setTimeout(function() {
            var reCamButton = document.getElementById("button-reCam");

            if (reCamButton) {
                reCamButton.addEventListener("click", function() {
                    if (!CTS.ReCam) {
                        if (!window.chrome && !CTS.allowReCamAllBrowsers) {
                            coloredAlert("This function is less reliable on non-chromium browsers.<br>To override, type:<br>!toggleReCamAllBrowsers", "orange");
                            return;
                        }
                        CTS.ReCam = true;
                        reCamButton.style.backgroundColor = "green";
                        coloredAlert("<b><u>CAUTION</u>:</b> ReCam enabled", "green");
                    } else {
                        reCamButton.style.backgroundColor = "transparent";
                        CTS.ReCam = false;
                        coloredAlert("<b><u>INFO</u>:</b> ReCam disabled", "blue");
                    }
                    Save("ReCam", CTS.ReCam);
                });
            }

            // Enhance with network failure detection
            window.addEventListener("offline", function() {
                console.log("Network connection lost.");
                handleNetworkDisconnection();
            });

            window.addEventListener("online", function() {
                console.log("Network connection restored.");
            });

            // Enhance with Chatroom.Disconnected and ws.onclose detection
            const originalWebSocket = window.WebSocket;
            window.WebSocket = function(...args) {
                const ws = new originalWebSocket(...args);

                ws.addEventListener('close', function(event) {
                    console.log("WebSocket closed.");
                    handleNetworkDisconnection();
                });

                return ws;
            };

            // Monitor for Chatroom.Disconnected in console logs
            const originalConsoleError = console.error;
            console.error = function(...args) {
                if (args[0] && args[0].includes("Chatroom.Disconnected")) {
                    console.log("Chatroom.Disconnected detected.");
                    handleNetworkDisconnection();
                }
                originalConsoleError.apply(console, args);
            };

            // Monitor for unexpected client-side errors that might indicate disconnection
            window.addEventListener("error", function(event) {
                console.log("Error detected:", event);
                if (event.message.includes("NetworkError") || event.message.includes("Failed to fetch")) {
                    handleNetworkDisconnection();
                }
            });

        }, 3000);
    }

    // Function to handle network disconnection
    function handleNetworkDisconnection() {
        var reCamButton = document.getElementById("button-reCam");
        if (CTS.ReCam) {
            reCamButton.style.backgroundColor = "orange";
            coloredAlert("<b><u>CAUTION</u>:</b> Network disconnection detected. Attempting to reCam...", "orange");
            attemptReCam();
        }
    }

    // Function to attempt reCam after disconnection
    function attemptReCam() {
        var attempts = 0;
        var maxAttempts = 10;

        function tryReCam() {
            if (navigator.onLine && attempts < maxAttempts) {
                attempts++;
                console.log("Attempting to reCam... Attempt " + attempts);
                VideoListElement.querySelector("#videos-footer-broadcast").click();
                coloredAlert(`<b><u>INFO</u>:</b> Attempting to reCam... Attempt ${attempts}`, "blue");
                setTimeout(tryReCam, 1000);
            } else {
                console.log("Max reCam attempts reached or network still offline.");
                if (attempts >= maxAttempts) {
                    coloredAlert("<b><u>ERROR</u>:</b> Max reCam attempts reached. Please check your connection and try again.", "red");
                    reCamButton.style.backgroundColor = "red";
                }
            }
        }

        tryReCam();
    }

    // Function to display colored alerts in the chat
    function coloredAlert(message, color) {
        var chatElement = GetActiveChat();
        if (chatElement) {
            var alertDiv = document.createElement("div");
            alertDiv.innerHTML = message;
            alertDiv.style.color = color;
            chatElement.appendChild(alertDiv);
        }
    }

    // Run the enhancement after the DOM is fully loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', enhanceReCamButton);
    } else {
        enhanceReCamButton();
    }

})();
