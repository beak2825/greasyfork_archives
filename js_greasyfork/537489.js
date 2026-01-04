// ==UserScript==
// @name         Premium Quillbot bro
// @namespace    quillbot.taozhiyu.gitee.io
// @version      1.0.0
// @description  Unlocks Quillbot Premium features with improved stability and compatibility
// @author       longkidkoolstar
// @match        https://quillbot.com/*
// @icon         https://quillbot.com/favicon.png
// @require      https://greasyfork.org/scripts/455943-ajaxhooker/code/ajaxHooker.js?version=1124435
// @run-at       document-start
// @grant        GM_setValue
// @grant        GM_getValue
// @license      none
// @downloadURL https://update.greasyfork.org/scripts/537489/Premium%20Quillbot%20bro.user.js
// @updateURL https://update.greasyfork.org/scripts/537489/Premium%20Quillbot%20bro.meta.js
// ==/UserScript==
/* global ajaxHooker*/
(function() {
    'use strict';

    // Configuration
    const CONFIG = {
        debug: false, // Enable for additional console logging
        notificationDuration: 5000, // How long to show status notifications (ms)
        theme: {
            primary: "#4CAF50", // Primary color - green
            text: "#333333",
            background: "#f9f9f9",
            shadow: "0 2px 5px rgba(0, 0, 0, 0.1)"
        },
        premiumFeatures: [
            "Word Count Limit",
            "Premium Modes",
            "Grammar Checker",
            "Premium Synonyms",
            "Sentence Rephraser"
        ]
    };

    // Logger utility
    const logger = {
        log: (message) => CONFIG.debug && console.log(`[QuillbotUnlocker] ${message}`),
        success: (message) => CONFIG.debug && console.log(`[QuillbotUnlocker] %c${message}`, "color: green"),
        error: (message, err) => CONFIG.debug && console.error(`[QuillbotUnlocker] ${message}`, err)
    };

    // Enhanced API interceptor module
    const apiInterceptor = {
        init: () => {
            try {
                ajaxHooker.hook((request) => {
                    // Account details endpoint (main premium flag)
                    if (request.url.endsWith("get-account-details")) {
                        logger.log("Intercepting account details request");

                        request.response = (response) => {
                            try {
                                const responseData = JSON.parse(response.responseText);
                                const accountData = "data" in responseData ? responseData.data : responseData;

                                // Set premium status flags
                                accountData.profile.accepted_premium_modes_tnc = true;
                                accountData.profile.premium = true;
                                accountData.profile.client_type = "premium";
                                accountData.profile.premium_tier = "premium_plus";

                                // Enhanced word limits
                                if (accountData.limits) {
                                    const enhancedLimits = {
                                        limit: 250000,
                                        premium_limit: 250000,
                                        used: 0,
                                    };

                                    // Apply to all limit types
                                    accountData.limits.paraphrase = { ...accountData.limits.paraphrase, ...enhancedLimits };
                                    accountData.limits.grammar = { ...accountData.limits.grammar, ...enhancedLimits };
                                    accountData.limits.cowrite = { ...(accountData.limits.cowrite || {}), ...enhancedLimits };
                                    accountData.limits.summarizer = { ...(accountData.limits.summarizer || {}), ...enhancedLimits };
                                }

                                // Unlock subscription features
                                if (accountData.user) {
                                    accountData.user.subscription = {
                                        type: "premium_plus",
                                        status: "active",
                                    };
                                }

                                // Update response with modified data
                                response.responseText = JSON.stringify(
                                    "data" in responseData ? ((responseData.data = accountData), responseData) : accountData
                                );

                                logger.success("Premium status enabled successfully");
                                uiManager.showStatusNotification("Premium features unlocked successfully!");
                            } catch (err) {
                                logger.error("Error processing account details response", err);
                                uiManager.showStatusNotification("Error unlocking premium features");
                            }
                        };
                    }

                    // Additional endpoints for premium features
                    if (
                        request.url.includes("/billing/") ||
                        request.url.includes("/subscription/") ||
                        request.url.includes("/premium-access")
                    ) {
                        logger.log("Intercepting premium endpoint request");

                        request.response = (response) => {
                            try {
                                // Return a successful premium status
                                response.responseText = JSON.stringify({
                                    success: true,
                                    data: {
                                        has_premium_access: true,
                                        status: "active",
                                        tier: "premium_plus",
                                    },
                                });
                                logger.success("Premium access granted successfully");
                            } catch (err) {
                                logger.error("Error processing premium endpoint response", err);
                            }
                        };
                    }
                });
                logger.success("API interceptors initialized");
            } catch (err) {
                logger.error("Failed to initialize API interceptors", err);
                uiManager.showStatusNotification("Failed to initialize premium unlocker");
            }
        }
    };

    // UI Manager with minimal interface
    const uiManager = {
        // Lightweight status notification
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

                // Remove after duration
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.parentNode.removeChild(notification);
                    }
                }, CONFIG.notificationDuration);
            }
        },

        // Simple info popup
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

            // Add header
            const header = document.createElement("h3");
            header.textContent = "Quillbot Premium Unlocker";
            header.style.margin = "0 0 10px";
            header.style.color = CONFIG.theme.primary;
            header.style.fontSize = "16px";

            // Add features list
            const featuresHeader = document.createElement("p");
            featuresHeader.textContent = "Unlocked features:";
            featuresHeader.style.margin = "10px 0 5px";
            featuresHeader.style.fontWeight = "bold";

            const featuresList = document.createElement("ul");
            featuresList.style.margin = "0 0 15px";
            featuresList.style.paddingLeft = "20px";

            CONFIG.premiumFeatures.forEach(feature => {
                const item = document.createElement("li");
                item.textContent = feature;
                item.style.margin = "3px 0";
                featuresList.appendChild(item);
            });

            // Add Discord link
            const communityMsg = document.createElement("p");
            communityMsg.textContent = "Join our Discord community for support and additional resources:";
            communityMsg.style.margin = "10px 0 5px";
            communityMsg.style.fontSize = "13px";

            const link = document.createElement("a");
            link.href = "https://discord.gg/JrweGzdjwA";
            link.textContent = "Join Discord";
            link.style.color = "#0366d6";
            link.style.textDecoration = "none";
            link.target = "_blank";
            link.style.display = "inline-block";
            link.style.marginTop = "5px";

            // Add close button
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

            // Assemble elements
            popup.appendChild(header);
            popup.appendChild(featuresHeader);
            popup.appendChild(featuresList);
            popup.appendChild(communityMsg);
            popup.appendChild(link);
            popup.appendChild(closeButton);

            document.body.appendChild(popup);

            // Auto-close after 15 seconds
            setTimeout(() => {
                if (popup.parentNode) {
                    document.body.removeChild(popup);
                }
            }, 15000);
        }
    };

    // Initialize the premium unlocker
    (function init() {
        // Start API interception immediately
        apiInterceptor.init();

        // Show info popup after page loads
        window.addEventListener("load", () => {
            setTimeout(() => {
                uiManager.showInfoPopup();
            }, 2000);
        });

        logger.log("Quillbot Premium Unlocker initialized");
    })();
})();