// ==UserScript==
// @name         Leonardo AI Token Unlocker
// @namespace    leonardoai.test
// @version      1.0.0
// @description  Tests Leonardo AI token system for vulnerabilities by attempting to unlock premium token limits
// @author       EthicalHacker
// @match        https://app.leonardo.ai/*
// @icon         https://app.leonardo.ai/favicon.ico
// @require      https://greasyfork.org/scripts/455943-ajaxhooker/code/ajaxHooker.js?version=1124435
// @run-at       document-start
// @grant        GM_setValue
// @grant        GM_getValue
// @license      none
// @downloadURL https://update.greasyfork.org/scripts/536675/Leonardo%20AI%20Token%20Unlocker.user.js
// @updateURL https://update.greasyfork.org/scripts/536675/Leonardo%20AI%20Token%20Unlocker.meta.js
// ==/UserScript==

/* global ajaxHooker */
(function() {
    'use strict';

    // Configuration
    const CONFIG = {
        debug: true, // Enable for detailed console logging
        notificationDuration: 5000, // Duration for status notifications (ms)
        targetTokenCount: 10000, // Token count to test
        theme: {
            primary: "#4CAF50", // Green for success
            text: "#333333",
            background: "#f9f9f9",
            shadow: "0 2px 5px rgba(0, 0, 0, 0.1)"
        },
        testedFeatures: [
            "Token Balance",
            "Image Generation",
            "Model Training",
            "Premium Features"
        ]
    };

    // Logger utility
    const logger = {
        log: (message) => CONFIG.debug && console.log(`[LeonardoAIUnlocker] ${message}`),
        success: (message) => CONFIG.debug && console.log(`[LeonardoAIUnlocker] %c${message}`, "color: green"),
        error: (message, err) => CONFIG.debug && console.error(`[LeonardoAIUnlocker] ${message}`, err)
    };

    // API interceptor module
    const apiInterceptor = {
        init: () => {
            try {
                ajaxHooker.hook((request) => {
                    // Intercept user info endpoint (token balance)
                    if (request.url.includes("/api/rest/v1/user/self")) {
                        logger.log("Intercepting user info request");

                        request.response = (response) => {
                            try {
                                const responseData = JSON.parse(response.responseText);
                                const userData = "data" in responseData ? responseData.data : responseData;

                                // Attempt to manipulate token balance
                                if (userData) {
                                    userData.subscription_tokens = CONFIG.targetTokenCount;
                                    userData.subscription_tokens_used = 0;
                                    userData.subscription_plan = "premium_pro";
                                    userData.is_premium = true;
                                }

                                // Update response
                                response.responseText = JSON.stringify(
                                    "data" in responseData ? ((responseData.data = userData), responseData) : userData
                                );

                                logger.success(`Set token balance to ${CONFIG.targetTokenCount}`);
                                uiManager.showStatusNotification("Token balance manipulation attempted!");
                            } catch (err) {
                                logger.error("Error processing user info response", err);
                                uiManager.showStatusNotification("Error manipulating token balance");
                            }
                        };
                    }

                    // Intercept generation endpoint
                    if (request.url.includes("/api/rest/v1/generations")) {
                        logger.log("Intercepting generation request");

                        request.response = (response) => {
                            try {
                                const responseData = JSON.parse(response.responseText);
                                // Ensure generation proceeds without token deduction
                                if (responseData) {
                                    responseData.status = "success";
                                    responseData.token_cost = 0; // Attempt to bypass token cost
                                }

                                response.responseText = JSON.stringify(responseData);
                                logger.success("Generation request processed with zero token cost");
                            } catch (err) {
                                logger.error("Error processing generation response", err);
                            }
                        };
                    }

                    // Intercept subscription or billing endpoints
                    if (request.url.includes("/billing/") || request.url.includes("/subscription/")) {
                        logger.log("Intercepting subscription endpoint");

                        request.response = (response) => {
                            try {
                                response.responseText = JSON.stringify({
                                    success: true,
                                    data: {
                                        has_premium_access: true,
                                        subscription_plan: "premium_pro",
                                        token_balance: CONFIG.targetTokenCount,
                                        status: "active"
                                    }
                                });
                                logger.success("Premium subscription access granted");
                            } catch (err) {
                                logger.error("Error processing subscription response", err);
                            }
                        };
                    }
                });
                logger.success("API interceptors initialized");
            } catch (err) {
                logger.error("Failed to initialize API interceptors", err);
                uiManager.showStatusNotification("Failed to initialize token unlocker");
            }
        }
    };

    // UI Manager for notifications
    const uiManager = {
        showStatusNotification: (message) => {
            if (document.body) {
                const notification = document.createElement("div");
                notification.style.position = "fixed";
                notification.style.bottom = "20px";
                notification.style.right = "20px";
                notification.style.padding = "10px 15px";
                notification.style.backgroundColor = CONFIG.theme.background;
                notification.style.color = CONFIG.theme.text;
                notification.style.border = "1px solid #ccc";
                notification.style.borderLeft = `4px solid ${CONFIG.theme.primary}`;
                notification.style.borderRadius = "4px";
                notification.style.boxShadow = CONFIG.theme.shadow;
                notification.style.fontFamily = "Arial, sans-serif";
                notification.style.fontSize = "14px";
                notification.style.zIndex = "10000";

                notification.textContent = message;

                document.body.appendChild(notification);

                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.parentNode.removeChild(notification);
                    }
                }, CONFIG.notificationDuration);
            }
        },

        showInfoPopup: () => {
            const popup = document.createElement("div");
            popup.style.position = "fixed";
            popup.style.bottom = "20px";
            popup.style.right = "20px";
            popup.style.padding = "15px";
            popup.style.backgroundColor = CONFIG.theme.background;
            popup.style.boxShadow = CONFIG.theme.shadow;
            popup.style.border = "1px solid #ccc";
            popup.style.borderRadius = "8px";
            popup.style.zIndex = "10000";
            popup.style.fontFamily = "Arial, sans-serif";
            popup.style.color = CONFIG.theme.text;
            popup.style.width = "280px";

            const header = document.createElement("h3");
            header.textContent = "Leonardo AI Token Unlocker";
            header.style.margin = "0 0 10px";
            header.style.color = CONFIG.theme.primary;
            header.style.fontSize = "16px";

            const featuresHeader = document.createElement("p");
            featuresHeader.textContent = "Tested features:";
            featuresHeader.style.margin = "10px 0 5px";
            featuresHeader.style.fontWeight = "bold";

            const featuresList = document.createElement("ul");
            featuresList.style.margin = "0 0 15px";
            featuresList.style.paddingLeft = "20px";

            CONFIG.testedFeatures.forEach(feature => {
                const item = document.createElement("li");
                item.textContent = feature;
                item.style.margin = "3px 0";
                featuresList.appendChild(item);
            });

            const closeButton = document.createElement("button");
            closeButton.textContent = "×";
            closeButton.style.position = "absolute";
            closeButton.style.top = "5px";
            closeButton.style.right = "5px";
            closeButton.style.background = "none";
            closeButton.style.border = "none";
            closeButton.style.cursor = "pointer";
            closeButton.style.fontSize = "18px";
            closeButton.style.color = "#666";

            closeButton.addEventListener("click", () => {
                if (popup.parentNode) {
                    document.body.removeChild(popup);
                }
            });

            popup.appendChild(header);
            popup.appendChild(featuresHeader);
            popup.appendChild(featuresList);
            popup.appendChild(closeButton);

            document.body.appendChild(popup);

            setTimeout(() => {
                if (popup.parentNode) {
                    document.body.removeChild(popup);
                }
            }, 15000);
        }
    };

    // Initialize the unlocker
    (function init() {
        apiInterceptor.init();

        window.addEventListener("load", () => {
            setTimeout(() => {
                uiManager.showInfoPopup();
            }, 2000);
        });

        logger.log("Leonardo AI Token Unlocker initialized");
    })();
})();