// ==UserScript==
// @name         PGsc
// @namespace    pgsc
// @description  Snapchat tweak made by PG
// @version      1.1.20
// @author       PG
// @source       https://discord.gg/g4bE4aK75b
// @license      PG
// @supportURL   https://discord.gg/g4bE4aK75b
// @match        *://web.snapchat.com/*
// @match        *://www.snapchat.com/*
// @match        https://www.snapchat.com/web/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=snapchat.com
// @run-at       document-start
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/539881/PGsc.user.js
// @updateURL https://update.greasyfork.org/scripts/539881/PGsc.meta.js
// ==/UserScript==

const SCRIPT_VERSION = "1.1.20"; // Updated version

(function (window) {
    // Utility to hook object methods
    function simpleHook(object, name, proxy) {
        const old = object[name];
        object[name] = proxy(old, object);
    }

    // Custom notification system with stacking (newest on top, anchored at the top of the screen)
    function showNotification(message, type = "info") {
        // Create the notification element
        const notification = document.createElement("div");
        notification.className = "pgsc-notification";
        notification.style = `
            position: relative;
            background: ${type === "success" ? "#28A745" : type === "error" ? "#FF4444" : "#2A2D31"};
            color: #FFFFFF;
            padding: 10px 20px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif;
            font-size: 14px;
            z-index: 10004; /* Higher than the injected popup backdrop (10002) */
            opacity: 0;
            transition: opacity 0.3s ease, transform 0.3s ease;
            margin-bottom: 10px; /* Space between notifications */
            width: 300px; /* Fixed width for consistency */
        `;
        notification.textContent = message;

        // Append the notification to a container (create container if it doesn't exist)
        let notificationContainer = document.querySelector("#pgsc-notification-container");
        if (!notificationContainer) {
            notificationContainer = document.createElement("div");
            notificationContainer.id = "pgsc-notification-container";
            notificationContainer.style = `
                position: fixed;
                top: 20px;
                right: 20px;
                display: flex;
                flex-direction: column;
                align-items: flex-end;
                z-index: 10004; /* Higher than the injected popup backdrop (10002) */
                max-height: 80vh; /* Limit the height to 80% of the viewport height */
                overflow-y: auto; /* Enable scrolling if there are too many notifications */
                scrollbar-width: none; /* Hide scrollbar in Firefox */
                -ms-overflow-style: none; /* Hide scrollbar in IE/Edge */
            `;
            // Hide scrollbar in Webkit browsers (Chrome, Safari)
            const style = document.createElement("style");
            style.textContent = `
                #pgsc-notification-container::-webkit-scrollbar {
                    display: none;
                }
            `;
            document.head.appendChild(style);
            document.body.appendChild(notificationContainer);
        }

        // Prepend the new notification (so it appears at the top)
        notificationContainer.prepend(notification);

        // Update z-index of all notifications
        const notifications = notificationContainer.querySelectorAll(".pgsc-notification");
        notifications.forEach((notif, index) => {
            notif.style.zIndex = 10004 + (notifications.length - index); // Newer notifications have higher z-index
        });

        // Fade in
        setTimeout(() => {
            notification.style.opacity = "1";
        }, 10);

        // Fade out and remove after 3 seconds
        setTimeout(() => {
            notification.style.opacity = "0";
            setTimeout(() => {
                notification.remove();
                // Update z-index of remaining notifications
                const remainingNotifications = notificationContainer.querySelectorAll(".pgsc-notification");
                remainingNotifications.forEach((notif, index) => {
                    notif.style.zIndex = 10004 + (remainingNotifications.length - index);
                });
            }, 300);
        }, 3000);
    }

    // Function to show the "injected successfully" popup
    function showInjectedSuccessfullyPopup() {
        // Create the backdrop
        const backdrop = document.createElement("div");
        backdrop.id = "pgsc-injected-backdrop";
        backdrop.style = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            backdrop-filter: blur(5px);
            z-index: 10002;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;
        document.body.appendChild(backdrop);

        // Create the popup
        const popup = document.createElement("div");
        popup.id = "pgsc-injected-popup";
        popup.style = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(42, 45, 49, 0.5); /* #2A2D31 with 50% transparency */
            color: #FFFFFF;
            padding: 20px;
            border-radius: 12px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif;
            text-align: center;
            z-index: 10003;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;
        popup.innerHTML = `
            <div style="font-size: 24px; font-weight: 600; margin-bottom: 10px;">PGsc</div>
            <div style="font-size: 16px;">injected successfully</div>
        `;
        document.body.appendChild(popup);

        // Fade in
        setTimeout(() => {
            backdrop.style.opacity = "1";
            popup.style.opacity = "1";
        }, 10);

        // Fade out and remove after 3 seconds
        setTimeout(() => {
            backdrop.style.opacity = "0";
            popup.style.opacity = "0";
            setTimeout(() => {
                backdrop.remove();
                popup.remove();
            }, 500);
        }, 5000);
    }

    // Show the "injected successfully" popup when the script loads
    function waitForBodyAndShowPopup() {
        if (document.body) {
            showInjectedSuccessfullyPopup();
        } else {
            // If document.body isn't ready, wait and retry
            setTimeout(waitForBodyAndShowPopup, 100);
        }
    }

    // Trigger the popup when the script loads
    if (document.readyState === "complete" || document.readyState === "interactive") {
        waitForBodyAndShowPopup();
    } else {
        document.addEventListener("DOMContentLoaded", waitForBodyAndShowPopup);
    }

    // Bypass upload size limit
    Object.defineProperty(File.prototype, "size", {
        get: function () {
            return 500;
        }
    });

    // Combined fetch hook for interceptions and slow request logging
    const SLOW_THRESHOLD = 400; // 400ms threshold for slow requests
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
        const startTime = performance.now();
        const url = args[0].url;

        // Log all fetch requests for network diagnosis
        if (typeof url === "string") {
            console.log(`Fetch Request: ${url}`);

            // Log potential media requests (e.g., images or videos)
            if (url.includes("cf-st.sc-cdn.net") && (url.includes(".jpg") || url.includes(".mp4"))) {
                console.log(`Potential Snap Media URL: ${url}`);
            }

            // Bypass story read receipt
            if (url.endsWith("readreceipt-indexer/batchuploadreadreceipts")) {
                showNotification("Bypassed story read receipt", "success");
                return new Promise((resolve) => resolve(new Response(null, { status: 200 })));
            }

            // Fix failed requests to gcp.api.snapchat.com (status 0 in HAR file)
            if (url.includes("gcp.api.snapchat.com/web/metrics")) {
                showNotification("Bypassed metrics request to fix status 0 issue", "success");
                return new Promise((resolve) => resolve(new Response(null, { status: 200 })));
            }

            // Bypass snap read receipt (stealth mode for snaps) - targeting UpdateContentMessage
            if (url.endsWith("messagingcoreservice.MessagingCoreService/UpdateContentMessage")) {
                showNotification("Bypassed snap read receipt (stealth mode) - UpdateContentMessage", "success");
                return new Promise((resolve) => resolve(new Response(null, { status: 200 })));
            }

            // Log all gRPC requests to identify message-sending endpoint
            if (url.includes("application/grpc-web+proto")) {
                showNotification(`gRPC Request: ${url}`);
                // Check for message-sending endpoint (e.g., SendMessage)
                if (url.endsWith("messagingcoreservice.MessagingCoreService/SendMessage")) {
                    const response = await originalFetch(...args);
                    const duration = performance.now() - startTime;
                    if (duration > SLOW_THRESHOLD) {
                        console.warn(`Slow fetch request: ${url} took ${duration.toFixed(2)}ms`);
                    }
                    showNotification("Message sent successfully!", "success");
                    return response;
                }
            }
        }

        // Perform the fetch and log slow requests
        const response = await originalFetch(...args);
        const duration = performance.now() - startTime;
        if (duration > SLOW_THRESHOLD) {
            console.warn(`Slow fetch request: ${url || args[0]} took ${duration.toFixed(2)}ms`);
        }
        return response;
    };

    // Inject into worker for additional request hooking
    function workerInjected() {
        try {
            // Ensure we're in a worker context by using `self`
            const oldFetch = self.fetch;

            // Define the hook functions
            function hookPreRequest(request) {
                if (request.url.endsWith("messagingcoreservice.MessagingCoreService/SendTypingNotification")) {
                    showNotification("Bypassed typing notification", "success");
                    return null;
                }
                if (request.url.endsWith("messagingcoreservice.MessagingCoreService/UpdateConversation")) {
                    showNotification("Bypassed conversation read receipt", "success");
                    return null;
                }
                if (request.url.endsWith("messagingcoreservice.MessagingCoreService/UpdateContentMessage")) {
                    showNotification("Bypassed snap read receipt in worker (stealth mode) - UpdateContentMessage", "success");
                    return null;
                }
                // Allow SendMessage to pass through without interception
                if (request.url.endsWith("messagingcoreservice.MessagingCoreService/SendMessage")) {
                    return request;
                }
                return request;
            }

            async function hookPostRequest(request, response) {
                if (request.headers && request.headers.get("content-type") === "application/grpc-web+proto") {
                    const arrayBuffer = await response.arrayBuffer();
                    response.arrayBuffer = async () => arrayBuffer;
                }
                return response;
            }

            // Hook WebSocket for network diagnosis
            self.WebSocket.prototype.send = new Proxy(self.WebSocket.prototype.send, {
                apply: function (target, thisArg, argumentsList) {
                    showNotification(`WebSocket send: ${argumentsList[0]}`);
                    return target.apply(thisArg, argumentsList);
                }
            });

            // Hook worker fetch requests using self.fetch
            self.fetch = async function (...args) {
                // Hook the request before sending
                args[0] = hookPreRequest(args[0]);
                if (args[0] == null) {
                    return new Response(null, { status: 200 });
                }

                // Skip body reading for SendMessage to reduce latency
                if (!args[0].url.endsWith("messagingcoreservice.MessagingCoreService/SendMessage")) {
                    const requestBody = args[0].body;
                    if (requestBody && !requestBody.locked) {
                        try {
                            const reader = requestBody.getReader();
                            const { value: buffer } = await reader.read();
                            if (buffer) {
                                args[0] = new Request(args[0], {
                                    body: buffer,
                                    headers: args[0].headers
                                });
                            }
                        } catch (e) {
                            showNotification(`Failed to read request body in worker: ${e.message}`, "error");
                            // Proceed with the original request if reading fails
                        }
                    }
                }

                // Perform the fetch
                const result = await oldFetch.apply(this, args);

                // Hook the response
                try {
                    return await hookPostRequest(args[0], result);
                } catch (e) {
                    showNotification(`Fetch error in hookPostRequest in worker: ${e.message}`, "error");
                    throw e; // Re-throw the error to let the caller handle it
                }
            };
        } catch (e) {
            showNotification(`Error in workerInjected: ${e.message}`, "error");
        }
    }

    // Inject worker code
    const oldBlobClass = window.Blob;
    window.Blob = class HookedBlob extends Blob {
        constructor(...args) {
            const data = args[0][0];
            if (typeof data === "string" && data.startsWith("importScripts")) {
                try {
                    args[0][0] += `${workerInjected.toString()};workerInjected();`;
                    window.Blob = oldBlobClass;
                } catch (e) {
                    showNotification(`Error injecting worker code: ${e.message}`, "error");
                }
            }
            super(...args);
        }
    };

    // Enhanced screenshot detection bypass
    window.addEventListener("keydown", (event) => {
        if (event.metaKey && event.shiftKey) {
            event.preventDefault();
            event.stopImmediatePropagation();
            showNotification("Blocked Command + Shift combination to prevent screenshot detection", "success");
        }
        if (
            event.key === "PrintScreen" ||
            (event.metaKey && event.shiftKey && (event.key === "3" || event.key === "4")) ||
            (event.altKey && event.key === "PrintScreen")
        ) {
            event.preventDefault();
            event.stopImmediatePropagation();
            showNotification("Blocked screenshot keyboard shortcut detection", "success");
        }
    }, true);

    const originalSetData = Clipboard.prototype.write;
    Clipboard.prototype.write = function (...args) {
        showNotification("Intercepted Clipboard.write call (potential screenshot detection)");
        return originalSetData.apply(this, args);
    };

    window.addEventListener("beforeprint", (event) => {
        event.preventDefault();
        event.stopImmediatePropagation();
        showNotification("Blocked beforeprint event (potential screenshot detection)", "success");
    }, true);

    const originalToDataURL = HTMLCanvasElement.prototype.toDataURL;
    HTMLCanvasElement.prototype.toDataURL = function (...args) {
        showNotification("Intercepted canvas.toDataURL call (potential screenshot detection)");
        return originalToDataURL.apply(this, args);
    };

    const originalGetImageData = CanvasRenderingContext2D.prototype.getImageData;
    CanvasRenderingContext2D.prototype.getImageData = function (...args) {
        showNotification("Intercepted canvas.getImageData call (potential screenshot detection)");
        return originalGetImageData.apply(this, args);
    };

    // Add download button, open in new tab button, and audio support to media modals
    simpleHook(document, "createElement", (proxy, instance) => (...args) => {
        const result = proxy.call(instance, ...args);

        if (args[0] === "audio" || args[0] === "video" || args[0] === "img") {
            simpleHook(result, "setAttribute", (proxy2, instance2) => (...args2) => {
                result.style = "pointer-events: auto;";
                if (args2[0] === "controlsList") return;
                proxy2.call(instance2, ...args2);
            });

            result.addEventListener("load", (_) => {
                result.parentElement?.addEventListener("contextmenu", (event) => {
                    event.stopImmediatePropagation();
                });
            });
            result.addEventListener("contextmenu", (event) => {
                event.stopImmediatePropagation();
            });

            result.addEventListener("load", () => {
                let parent = result.parentElement;
                let isInSnapModal = false;
                while (parent) {
                    if (parent.classList && parent.classList.contains("RdKti")) {
                        isInSnapModal = true;
                        break;
                    }
                    parent = parent.parentElement;
                }

                if (isInSnapModal) {
                    if (!parent.querySelector(".pgsc-download-btn")) {
                        const downloadBtn = document.createElement("button");
                        downloadBtn.className = "pgsc-download-btn";
                        downloadBtn.style = `
                            position: absolute;
                            bottom: 16px;
                            right: 16px;
                            background: #1E2023;
                            border: 1px solid #FFFFFF;
                            padding: 10px;
                            cursor: pointer;
                            border-radius: 50%;
                            transition: background 0.2s ease;
                            width: 40px;
                            height: 40px;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                        `;
                        downloadBtn.innerHTML = `
                            <svg width="20" height="20" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M7 9.5 3.5 6 4.9 4.6 6.3 6V1h1.4v5l1.4-1.4L10.5 6 7 9.5Zm-5.5 4v-4h1.4v2.6h8.2V9.5H12.5v4H1.5Z" fill="#FFFFFF"></path>
                            </svg>
                        `;
                        downloadBtn.addEventListener("mouseover", () => {
                            downloadBtn.style.background = "#3A3D41";
                        });
                        downloadBtn.addEventListener("mouseout", () => {
                            downloadBtn.style.background = "#1E2023";
                        });
                        downloadBtn.addEventListener("click", () => {
                            const url = result.src;
                            if (url) {
                                const a = document.createElement("a");
                                a.href = url;
                                a.download = url.split("/").pop() || "snapchat-media";
                                document.body.appendChild(a);
                                a.click();
                                document.body.removeChild(a);
                                showNotification("Snap downloaded successfully!", "success");
                            }
                        });
                        parent.style.position = "relative";
                        parent.appendChild(downloadBtn);
                    }

                    if (!parent.querySelector(".pgsc-open-tab-btn")) {
                        const openTabBtn = document.createElement("button");
                        openTabBtn.className = "pgsc-open-tab-btn";
                        openTabBtn.style = `
                            position: absolute;
                            bottom: 16px;
                            right: 64px;
                            background: #1E2023;
                            border: 1px solid #FFFFFF;
                            padding: 10px;
                            cursor: pointer;
                            border-radius: 50%;
                            transition: background 0.2s ease;
                            width: 40px;
                            height: 40px;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                        `;
                        openTabBtn.innerHTML = `
                            <svg width="20" height="20" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M11 1H3C2.45 1 2 1.45 2 2V12C2 12.55 2.45 13 3 13H11C11.55 13 12 12.55 12 12V2C12 1.45 11.55 1 11 1ZM11 12H3V2H11V12ZM7 3H4V4H7V3ZM7 5H4V6H7V5ZM7 7H4V8H7V7ZM10 3H8V8H10V3Z" fill="#FFFFFF"></path>
                            </svg>
                        `;
                        openTabBtn.addEventListener("mouseover", () => {
                            openTabBtn.style.background = "#3A3D41";
                        });
                        openTabBtn.addEventListener("mouseout", () => {
                            openTabBtn.style.background = "#1E2023";
                        });
                        openTabBtn.addEventListener("click", () => {
                            const url = result.src;
                            if (url) {
                                window.open(url, "_blank");
                                showNotification("Snap opened in new tab!", "success");
                            } else {
                                showNotification("Could not find the media URL.", "error");
                            }
                        });
                        parent.style.position = "relative";
                        parent.appendChild(openTabBtn);
                    }
                }
            });

            if (args[0] === "audio") {
                result.addEventListener("load", () => {
                    let parent = result.parentElement;
                    let isInSnapModal = false;
                    while (parent) {
                        if (parent.classList && parent.classList.contains("RdKti")) {
                            isInSnapModal = true;
                            break;
                        }
                        parent = parent.parentElement;
                    }

                    if (isInSnapModal && !parent.querySelector(".pgsc-audio-wip")) {
                        const wipLabel = document.createElement("div");
                        wipLabel.className = "pgsc-audio-wip";
                        wipLabel.style = "position: absolute; top: 10px; left: 10px; background: #fff; padding: 5px; font-size: 12px; border-radius: 5px;";
                        wipLabel.textContent = "Audio Playback: Work in Progress";
                        parent.style.position = "relative";
                        parent.appendChild(wipLabel);
                    }
                });
            }
        }

        return result;
    });

    // Load the name of the person/bot to remove from localStorage
    let nameToRemovePersistently = localStorage.getItem("pgsc-nameToRemovePersistently") || "";

    // Variables to store the state of removal toggles, loaded from localStorage
    let removeNotificationBanner = JSON.parse(localStorage.getItem("pgsc-removeNotificationBanner") || "false");
    let removeSpotlightButton = JSON.parse(localStorage.getItem("pgsc-removeSpotlightButton") || "false");
    let removeSendToMyAIButton = JSON.parse(localStorage.getItem("pgsc-removeSendToMyAIButton") || "false");

    // Load the selected theme from localStorage
    let selectedTheme = localStorage.getItem("pgsc-selectedTheme") || "default";

    // Define available themes with more specific styling
    const themes = {
        default: {
            name: "Default",
            background: "", // Use Snapchat's default
            text: "", // Use Snapchat's default
            secondaryBackground: "",
            buttonBackground: "",
            buttonText: "",
            accent: ""
        },
        skyBlue: {
            name: "Sky Blue",
            background: "#E6F0FA", // Light sky blue for main background
            text: "#1A3C5A", // Darker blue for text
            secondaryBackground: "#B3DFFA", // Slightly darker sky blue for secondary elements
            buttonBackground: "#4A90E2", // Medium blue for buttons
            buttonText: "#FFFFFF", // White text on buttons
            accent: "#1A73E8" // Vibrant blue for accents
        },
        deepPurple: {
            name: "Deep Purple",
            background: "#2A1B3D", // Deep purple for main background
            text: "#E6D9FA", // Light purple for text
            secondaryBackground: "#3F2A5D", // Slightly lighter purple for secondary elements
            buttonBackground: "#6A4E9C", // Medium purple for buttons
            buttonText: "#FFFFFF", // White text on buttons
            accent: "#9C27B0" // Vibrant purple for accents
        }
    };

    // Function to apply the selected theme to the Snapchat UI with more specific selectors
    function applyCustomThemeToSnapchat() {
        try {
            // Remove any existing theme styles
            const existingStyle = document.querySelector("#pgsc-theme-style");
            if (existingStyle) {
                existingStyle.remove();
            }

            const theme = themes[selectedTheme] || themes.default;
            if (theme.name === "Default") {
                // If Default theme, do not apply any custom styles
                showNotification("Reverted to Default theme.", "success");
                return;
            }

            // Create a new style element to inject the theme
            const style = document.createElement("style");
            style.id = "pgsc-theme-style";
            style.textContent = `
                /* Main background (target specific container instead of body/html) */
                .chat-container, .main-content {
                    background: ${theme.background} !important;
                }

                /* Text color for chat list items */
                .O4POs .mYSR9.nonIntl .FiLwP .nonIntl {
                    color: ${theme.text} !important;
                }

                /* Chat list background */
                .O4POs {
                    background: ${theme.secondaryBackground} !important;
                }

                /* Buttons (Spotlight button, Send to MyAI button) */
                .dg8Lv, .Vhq_T {
                    background: ${theme.buttonBackground} !important;
                    color: ${theme.buttonText} !important;
                    border-color: ${theme.accent} !important;
                }

                /* Button hover effect */
                .dg8Lv:hover, .Vhq_T:hover {
                    background: ${theme.accent} !important;
                }

                /* Chat input area */
                .chat-input-container {
                    background: ${theme.secondaryBackground} !important;
                }

                /* Chat input text */
                .chat-input-container input, .chat-input-container textarea {
                    color: ${theme.text} !important;
                }

                /* Accent color for icons */
                .dg8Lv svg path, .Vhq_T svg path {
                    fill: ${theme.accent} !important;
                }

                /* Notification banner */
                .wHvEy {
                    background: ${theme.secondaryBackground} !important;
                    color: ${theme.text} !important;
                }
            `;
            document.head.appendChild(style);
            showNotification(`Applied ${theme.name} theme to Snapchat UI.`, "success");
            console.log(`[PGsc] Applied ${theme.name} theme successfully.`);
        } catch (e) {
            showNotification(`Failed to apply theme: ${e.message}`, "error");
            console.error(`[PGsc] Error applying theme: ${e.message}`);
        }
    }

    // Function to replace a person/bot's chat item with a placeholder
    function removePersonFromChatList(nameToRemove) {
        const chatItems = document.querySelectorAll(".O4POs");
        let found = false;

        chatItems.forEach(item => {
            const nameElement = item.querySelector(".mYSR9.nonIntl .FiLwP .nonIntl");
            if (nameElement && nameElement.textContent.trim().toLowerCase() === nameToRemove.toLowerCase()) {
                // Clear the existing content of the chat item
                item.innerHTML = "";

                // Create a placeholder div with the self-promotion text
                const placeholder = document.createElement("div");
                placeholder.className = "pgsc-removed-placeholder";
                placeholder.style = `
                    padding: 12px 16px;
                    color: #FF4444;
                    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif;
                    font-size: 14px;
                    font-weight: 500;
                    display: flex;
                    align-items: center;
                    height: 100%;
                `;
                placeholder.textContent = "Removed person/bot by PGsc";
                item.appendChild(placeholder);

                // Disable any click events on the item to prevent interaction
                item.style.pointerEvents = "none";
                item.style.cursor = "default";

                found = true;
            }
        });

        return found;
    }

    // Function to remove the notification banner
    function removeNotificationBannerElement() {
        const banners = document.querySelectorAll(".wHvEy");
        banners.forEach(banner => {
            banner.remove();
        });
    }

    // Function to remove the Spotlight button
    function removeSpotlightButtonElement() {
        const buttons = document.querySelectorAll(".dg8Lv");
        buttons.forEach(button => {
            button.remove();
        });
    }

    // Function to remove the "Send to MyAI" button
    function removeSendToMyAIButtonElement() {
        const buttons = document.querySelectorAll('button.Vhq_T[aria-label="Send denne tekst til MyAI"]');
        buttons.forEach(button => {
            button.remove();
        });
    }

    // Set up a MutationObserver to continuously monitor the DOM (without reapplying theme)
    function setupChatListObserver() {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.addedNodes.length) {
                    // Remove person/bot if specified
                    if (nameToRemovePersistently) {
                        const found = removePersonFromChatList(nameToRemovePersistently);
                        if (found) {
                            showNotification(`Removed ${nameToRemovePersistently} from the chat list (auto).`, "success");
                        }
                    }
                    // Remove notification banner if enabled
                    if (removeNotificationBanner) {
                        removeNotificationBannerElement();
                    }
                    // Remove Spotlight button if enabled
                    if (removeSpotlightButton) {
                        removeSpotlightButtonElement();
                    }
                    // Remove Send to MyAI button if enabled
                    if (removeSendToMyAIButton) {
                        removeSendToMyAIButtonElement();
                    }
                    // Note: Removed theme reapplication here to prevent freezing
                }
            });
        });

        // Target the body to monitor all DOM changes
        observer.observe(document.body, { childList: true, subtree: true });

        // Initial removal on page load
        if (nameToRemovePersistently) {
            const found = removePersonFromChatList(nameToRemovePersistently);
            if (found) {
                showNotification(`Removed ${nameToRemovePersistently} from the chat list (on page load).`, "success");
            }
        }
        if (removeNotificationBanner) {
            removeNotificationBannerElement();
        }
        if (removeSpotlightButton) {
            removeSpotlightButtonElement();
        }
        if (removeSendToMyAIButton) {
            removeSendToMyAIButtonElement();
        }
        // Apply the theme on page load
        applyCustomThemeToSnapchat();
    }

    // Function to detect Snapchat's theme (dark or light mode) for the PGsc UI
    function detectSnapchatTheme() {
        // Check for theme classes on html or body
        const htmlElement = document.documentElement;
        const bodyElement = document.body;

        if (htmlElement.classList.contains("dark") || bodyElement.classList.contains("dark")) {
            return "dark";
        }
        if (htmlElement.classList.contains("light") || bodyElement.classList.contains("light")) {
            return "light";
        }

        // Check the body background color
        const computedStyle = window.getComputedStyle(bodyElement);
        const backgroundColor = computedStyle.backgroundColor;

        // Snapchat uses #fff for light mode and #121212 for dark mode
        if (backgroundColor === "rgb(255, 255, 255)") {
            return "light";
        } else if (backgroundColor === "rgb(18, 18, 18)") {
            return "dark";
        }

        // Fallback: Check the prefers-color-scheme media query
        if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
            return "dark";
        }

        // Default to light mode if detection fails
        return "light";
    }

    // Add PGsc UI as a pop-up with backdrop
    function addSnapEnhanceUI() {
        // Wait a short time to ensure Snapchat has applied its theme
        setTimeout(() => {
            // Detect Snapchat's theme for the PGsc UI
            const theme = detectSnapchatTheme();
            const isDarkMode = theme === "dark";

            // Define colors and gradients for the PGsc UI (not affected by Snapchat theme)
            const colors = {
                gradient: isDarkMode
                    ? "linear-gradient(135deg, #2A1B3D 0%, #1B3D3A 100%)" // Dark mode gradient: deep purple to dark teal
                    : "linear-gradient(135deg, #FFF9E6 0%, #E6F0FA 100%)", // Light mode gradient: soft yellow to light blue
                text: isDarkMode ? "#DEDEDE" : "#16191C",
                inputBackground: isDarkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.05)",
                inputBorder: isDarkMode ? "1px solid rgba(255, 255, 255, 0.3)" : "1px solid rgba(0, 0, 0, 0.2)",
                sectionTitle: isDarkMode ? "#FFFFFF" : "#000000",
                buttonHover: isDarkMode ? "rgba(255, 255, 255, 0.2)" : "rgba(0, 0, 0, 0.1)",
                sidebarBackground: isDarkMode ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.05)",
                tabActiveBackground: isDarkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)",
                contentBackground: isDarkMode ? "rgba(255, 255, 255, 0.03)" : "rgba(0, 0, 0, 0.03)"
            };

            // Create the backdrop overlay
            const backdrop = document.createElement("div");
            backdrop.id = "pgsc-backdrop";
            backdrop.style = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.7);
                backdrop-filter: blur(5px);
                z-index: 9999;
                display: none;
            `;
            document.body.appendChild(backdrop);

            // Create the pop-up container
            const popupContainer = document.createElement("div");
            popupContainer.id = "pgsc-popup";
            popupContainer.style = `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: ${colors.gradient};
                color: ${colors.text};
                border-radius: 12px;
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif;
                font-size: 13px;
                width: 500px;
                height: 400px;
                display: none;
                z-index: 10000;
            `;

            // Create the header with icon, title, Discord button, and close button
            const header = document.createElement("div");
            header.style = `
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 10px 14px;
                border-bottom: 1px solid ${isDarkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)"};
            `;

            // Create the left side of the header (title and Discord button)
            const headerLeft = document.createElement("div");
            headerLeft.style = `
                display: flex;
                align-items: center;
                gap: 8px;
            `;

            // Add the title
            const titleDiv = document.createElement("div");
            titleDiv.style = `
                display: flex;
                align-items: center;
            `;
            titleDiv.innerHTML = `
                <span style="font-size: 18px; margin-right: 6px;">🛠️</span>
                <span style="font-weight: 600; font-size: 14px;">PGsc v${SCRIPT_VERSION}</span>
            `;
            headerLeft.appendChild(titleDiv);

            // Add the Discord button
            const discordButton = document.createElement("a");
            discordButton.href = "https://discord.gg/g4bE4aK75b";
            discordButton.target = "_blank";
            discordButton.style = `
                display: inline-flex;
                align-items: center;
                background: #5865F2; /* Discord's official brand color */
                color: #FFFFFF;
                padding: 4px 8px;
                border-radius: 6px;
                text-decoration: none;
                font-weight: 500;
                font-size: 12px;
                transition: background 0.2s ease;
            `;
            discordButton.innerHTML = `
                <svg style="margin-right: 4px;" width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20.317 4.3698C18.944 3.7638 17.472 3.3188 15.897 3C15.695 3.3298 15.466 3.7798 15.301 4.1298C13.629 3.8798 11.979 3.8798 10.329 4.1298C10.164 3.7798 9.926 3.3298 9.724 3C8.148 3.3188 6.677 3.7638 5.304 4.3698C2.558 8.3398 1.859 12.2298 2.208 16.0698C3.986 17.4798 5.708 18.3198 7.399 18.9998C7.829 18.4298 8.218 17.8198 8.557 17.1798C7.917 16.9298 7.297 16.6198 6.697 16.2498C6.862 16.1198 7.024 15.9798 7.179 15.8398C10.529 17.4198 14.101 17.4198 17.421 15.8398C17.576 15.9798 17.738 16.1198 17.903 16.2498C17.293 16.6198 16.673 16.9298 16.033 17.1798C16.372 17.8198 16.761 18.4298 17.191 18.9998C18.892 18.3198 20.614 17.4798 22.392 16.0698C22.791 11.5698 21.692 7.7198 20.317 4.3698ZM8.529 14.2398C7.529 14.2398 6.699 13.3098 6.699 12.1898C6.699 11.0698 7.509 10.1398 8.529 10.1398C9.549 10.1398 10.379 11.0698 10.359 12.1898C10.359 13.3098 9.549 14.2398 8.529 14.2398ZM15.471 14.2398C14.471 14.2398 13.641 13.3098 13.641 12.1898C13.641 11.0698 14.451 10.1398 15.471 10.1398C16.491 10.1398 17.321 11.0698 17.301 12.1898C17.301 13.3098 16.491 14.2398 15.471 14.2398Z" fill="white"/>
                </svg>
                Discord
            `;
            discordButton.addEventListener("mouseover", () => {
                discordButton.style.background = "#7289DA"; // Lighter Discord color for hover
            });
            discordButton.addEventListener("mouseout", () => {
                discordButton.style.background = "#5865F2"; // Back to Discord's official color
            });
            headerLeft.appendChild(discordButton);

            header.appendChild(headerLeft);

            // Add the close button
            const closeButton = document.createElement("button");
            closeButton.id = "pgsc-close-btn";
            closeButton.style = `
                background: transparent;
                border: none;
                color: ${colors.text};
                font-size: 14px;
                cursor: pointer;
                padding: 5px;
                transition: color 0.2s ease;
            `;
            closeButton.textContent = "✕";
            header.appendChild(closeButton);

            popupContainer.appendChild(header);

            // Create the main content area with sidebar and tabs
            const mainContent = document.createElement("div");
            mainContent.style = `
                display: flex;
                height: calc(100% - 40px); /* Subtract header height */
            `;

            // Create the sidebar for tabs
            const sidebar = document.createElement("div");
            sidebar.style = `
                width: 120px;
                background: ${colors.sidebarBackground};
                border-right: 1px solid ${isDarkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)"};
                padding: 10px 0;
            `;

            // Create the tabs
            const tabs = [
                { id: "features-tab", label: "Features", active: true },
                { id: "ui-customization-tab", label: "UI Customization", active: false },
                { id: "themes-tab", label: "Themes", active: false }
            ];

            tabs.forEach(tab => {
                const tabButton = document.createElement("button");
                tabButton.id = tab.id;
                tabButton.style = `
                    width: 100%;
                    padding: 8px 12px;
                    background: ${tab.active ? colors.tabActiveBackground : "transparent"};
                    color: ${colors.text};
                    border: none;
                    text-align: left;
                    font-size: 13px;
                    font-weight: 500;
                    cursor: pointer;
                    transition: background 0.2s ease;
                `;
                tabButton.textContent = tab.label;
                tabButton.addEventListener("mouseover", () => {
                    if (!tabButton.classList.contains("active")) {
                        tabButton.style.background = colors.buttonHover;
                    }
                });
                tabButton.addEventListener("mouseout", () => {
                    if (!tabButton.classList.contains("active")) {
                        tabButton.style.background = "transparent";
                    }
                });
                sidebar.appendChild(tabButton);
            });

            mainContent.appendChild(sidebar);

            // Create the content area for tab panels
            const contentArea = document.createElement("div");
            contentArea.style = `
                flex: 1;
                padding: 10px 14px;
                background: ${colors.contentBackground};
                overflow-y: auto;
            `;

            // Create the Features tab content
            const featuresTabContent = document.createElement("div");
            featuresTabContent.id = "features-tab-content";
            featuresTabContent.style = `
                display: block;
            `;
            const features = [
                { label: "Bypass Upload Size Limit", enabled: true },
                { label: "Stealth Mode for Snaps", enabled: true },
                { label: "Bypass Story Read Receipts", enabled: true },
                { label: "Bypass Conversation Read Receipts", enabled: true },
                { label: "Bypass Typing Notifications", enabled: true },
                { label: "Bypass Metrics Requests", enabled: true },
                { label: "Download Button for Snaps", enabled: true },
                { label: "Open Snap in New Tab", enabled: true },
                { label: "Slow Request Logging", enabled: true },
                { label: "Bypass Screenshot Detection", enabled: true }
            ];
            features.forEach(feature => {
                const featureDiv = document.createElement("div");
                featureDiv.className = "pgsc-setting";
                featureDiv.style = `
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 6px 0;
                `;
                featureDiv.innerHTML = `
                    <span style="color: ${colors.text};">${feature.label}</span>
                    <label style="display: flex; align-items: center; opacity: 0.5; cursor: not-allowed;">
                        <input type="checkbox" ${feature.enabled ? "checked" : ""} disabled>
                        <span style="margin-left: 6px; color: ${colors.text}; font-size: 12px;">${feature.enabled ? "On" : "Off"}</span>
                    </label>
                `;
                featuresTabContent.appendChild(featureDiv);
            });
            contentArea.appendChild(featuresTabContent);

            // Create the UI Customization tab content
            const uiCustomizationTabContent = document.createElement("div");
            uiCustomizationTabContent.id = "ui-customization-tab-content";
            uiCustomizationTabContent.style = `
                display: none;
            `;

            // Add the UI Customization toggles
            const uiFeatures = [
                { label: "Remove Notification Banner", id: "remove-notification-banner", enabled: removeNotificationBanner },
                { label: "Remove Spotlight Button", id: "remove-spotlight-button", enabled: removeSpotlightButton },
                { label: "Remove Send to MyAI Button", id: "remove-send-to-myai-button", enabled: removeSendToMyAIButton }
            ];
            uiFeatures.forEach(feature => {
                const featureDiv = document.createElement("div");
                featureDiv.className = "pgsc-ui-setting";
                featureDiv.style = `
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 6px 0;
                `;
                featureDiv.innerHTML = `
                    <span style="color: ${colors.text};">${feature.label}</span>
                    <label style="display: flex; align-items: center;">
                        <input type="checkbox" id="${feature.id}" ${feature.enabled ? "checked" : ""}>
                        <span style="margin-left: 6px; color: ${colors.text}; font-size: 12px;">${feature.enabled ? "On" : "Off"}</span>
                    </label>
                `;
                uiCustomizationTabContent.appendChild(featureDiv);

                const checkbox = featureDiv.querySelector(`#${feature.id}`);
                checkbox.addEventListener("change", () => {
                    if (feature.id === "remove-notification-banner") {
                        removeNotificationBanner = checkbox.checked;
                        localStorage.setItem("pgsc-removeNotificationBanner", JSON.stringify(removeNotificationBanner));
                        if (removeNotificationBanner) {
                            removeNotificationBannerElement();
                            showNotification("Notification banner removed.", "success");
                        }
                    } else if (feature.id === "remove-spotlight-button") {
                        removeSpotlightButton = checkbox.checked;
                        localStorage.setItem("pgsc-removeSpotlightButton", JSON.stringify(removeSpotlightButton));
                        if (removeSpotlightButton) {
                            removeSpotlightButtonElement();
                            showNotification("Spotlight button removed.", "success");
                        }
                    } else if (feature.id === "remove-send-to-myai-button") {
                        removeSendToMyAIButton = checkbox.checked;
                        localStorage.setItem("pgsc-removeSendToMyAIButton", JSON.stringify(removeSendToMyAIButton));
                        if (removeSendToMyAIButton) {
                            removeSendToMyAIButtonElement();
                            showNotification("Send to MyAI button removed.", "success");
                        }
                    }
                    // Update the label text
                    const labelSpan = featureDiv.querySelector("span:last-child");
                    labelSpan.textContent = checkbox.checked ? "On" : "Off";
                });
            });

            // Add the Custom Bitmoji Background section (greyed out)
            const bitmojiSection = document.createElement("div");
            bitmojiSection.style = `
                padding: 6px 0;
                margin-top: 8px;
                opacity: 0.5;
                pointer-events: none;
            `;
            bitmojiSection.innerHTML = `
                <div style="font-weight: 600; margin-bottom: 6px; color: ${colors.sectionTitle};">Custom Bitmoji Background</div>
                <div style="display: flex; align-items: center; gap: 6px;">
                    <input type="text" id="pgsc-bitmoji-url" placeholder="Enter image URL (Disabled)" style="
                        background: ${colors.inputBackground};
                        border: ${colors.inputBorder};
                        color: ${colors.text};
                        font-size: 12px;
                        padding: 6px;
                        border-radius: 6px;
                        width: 100%;
                        outline: none;
                    ">
                    <button id="pgsc-bitmoji-apply-btn" style="
                        background: #28A745;
                        color: #FFFFFF;
                        border: none;
                        padding: 6px 10px;
                        border-radius: 6px;
                        cursor: not-allowed;
                        font-weight: 500;
                        transition: background 0.2s ease;
                    ">Apply</button>
                </div>
            `;
            uiCustomizationTabContent.appendChild(bitmojiSection);

            // Add the Remove Person/Bot section
            const removeSection = document.createElement("div");
            removeSection.style = `
                margin-top: 8px;
            `;
            removeSection.innerHTML = `
                <div style="font-weight: 600; margin-bottom: 6px; color: ${colors.sectionTitle};">Remove Person/Bot</div>
                <div style="display: flex; align-items: center; gap: 6px;">
                    <input type="text" id="pgsc-remove-name" placeholder="Enter name (e.g., Luder)" style="
                        background: ${colors.inputBackground};
                        border: ${colors.inputBorder};
                        color: ${colors.text};
                        font-size: 12px;
                        padding: 6px;
                        border-radius: 6px;
                        width: 100%;
                        outline: none;
                    ">
                    <button id="pgsc-remove-btn" style="
                        background: #FF4444;
                        color: #FFFFFF;
                        border: none;
                        padding: 6px 10px;
                        border-radius: 6px;
                        cursor: pointer;
                        font-weight: 500;
                        transition: background 0.2s ease;
                    ">Remove</button>
                </div>
                <div id="pgsc-currently-removed" style="margin-top: 6px; color: ${colors.text}; font-size: 11px;">
                    ${nameToRemovePersistently ? `Currently removing: ${nameToRemovePersistently}` : "No one is currently being removed."}
                </div>
                <button id="pgsc-clear-removed-btn" style="
                    display: ${nameToRemovePersistently ? "block" : "none"};
                    background: #666;
                    color: #FFFFFF;
                    border: none;
                    padding: 5px 8px;
                    border-radius: 6px;
                    cursor: pointer;
                    font-weight: 500;
                    margin-top: 6px;
                    transition: background 0.2s ease;
                ">Clear Removed Person/Bot</button>
            `;
            uiCustomizationTabContent.appendChild(removeSection);

            contentArea.appendChild(uiCustomizationTabContent);

            // Create the Themes tab content
            const themesTabContent = document.createElement("div");
            themesTabContent.id = "themes-tab-content";
            themesTabContent.style = `
                display: none;
            `;

            // Add the theme selection dropdown
            const themeSection = document.createElement("div");
            themeSection.style = `
                padding: 6px 0;
            `;
            themeSection.innerHTML = `
                <div style="font-weight: 600; margin-bottom: 6px; color: ${colors.sectionTitle};">Select Theme</div>
                <select id="pgsc-theme-select" style="
                    background: ${colors.inputBackground};
                    border: ${colors.inputBorder};
                    color: ${colors.text};
                    font-size: 12px;
                    padding: 6px;
                    border-radius: 6px;
                    width: 100%;
                    outline: none;
                ">
                    ${Object.keys(themes).map(themeKey => `
                        <option value="${themeKey}" ${selectedTheme === themeKey ? "selected" : ""}>
                            ${themes[themeKey].name}
                        </option>
                    `).join("")}
                </select>
            `;
            themesTabContent.appendChild(themeSection);

            // Add event listener for theme selection
            const themeSelect = themeSection.querySelector("#pgsc-theme-select");
            themeSelect.addEventListener("change", () => {
                selectedTheme = themeSelect.value;
                localStorage.setItem("pgsc-selectedTheme", selectedTheme);
                applyCustomThemeToSnapchat();
            });

            contentArea.appendChild(themesTabContent);

            mainContent.appendChild(contentArea);

            // Append main content to the popup
            popupContainer.appendChild(mainContent);

            // Append the pop-up to the body
            document.body.appendChild(popupContainer);

            // Add tab switching functionality
            const tabButtons = sidebar.querySelectorAll("button");
            const tabContents = contentArea.querySelectorAll("div[id$='-tab-content']");
            tabButtons.forEach(button => {
                button.addEventListener("click", () => {
                    // Remove active state from all tabs
                    tabButtons.forEach(btn => {
                        btn.classList.remove("active");
                        btn.style.background = "transparent";
                    });
                    // Hide all tab contents
                    tabContents.forEach(content => {
                        content.style.display = "none";
                    });
                    // Set active state for the clicked tab
                    button.classList.add("active");
                    button.style.background = colors.tabActiveBackground;
                    // Show the corresponding tab content
                    const tabId = button.id.replace("-tab", "");
                    const targetContent = contentArea.querySelector(`#${tabId}-tab-content`);
                    if (targetContent) {
                        targetContent.style.display = "block";
                    }
                });
            });

            // Add remove person/bot functionality
            const removeInput = popupContainer.querySelector("#pgsc-remove-name");
            const removeBtn = popupContainer.querySelector("#pgsc-remove-btn");
            removeBtn.addEventListener("mouseover", () => {
                removeBtn.style.background = "#FF6666";
            });
            removeBtn.addEventListener("mouseout", () => {
                removeBtn.style.background = "#FF4444";
            });
            removeBtn.addEventListener("click", () => {
                const nameToRemove = removeInput.value.trim();
                if (!nameToRemove) {
                    showNotification("Please enter a name to remove.", "error");
                    return;
                }

                nameToRemovePersistently = nameToRemove;
                localStorage.setItem("pgsc-nameToRemovePersistently", nameToRemovePersistently);
                const found = removePersonFromChatList(nameToRemove);
                if (found) {
                    showNotification(`Successfully removed ${nameToRemove} from the chat list.`, "success");
                    removeInput.value = "";
                    // Update the "Currently removing" text
                    const currentlyRemovedDiv = popupContainer.querySelector("#pgsc-currently-removed");
                    currentlyRemovedDiv.textContent = `Currently removing: ${nameToRemovePersistently}`;
                    // Show the "Clear Removed Person/Bot" button
                    const clearBtn = popupContainer.querySelector("#pgsc-clear-removed-btn");
                    clearBtn.style.display = "block";
                } else {
                    showNotification(`Could not find ${nameToRemove} in the chat list.`, "error");
                }
            });

            // Add clear removed person/bot functionality
            const clearBtn = popupContainer.querySelector("#pgsc-clear-removed-btn");
            clearBtn.addEventListener("mouseover", () => {
                clearBtn.style.background = "#888";
            });
            clearBtn.addEventListener("mouseout", () => {
                clearBtn.style.background = "#666";
            });
            clearBtn.addEventListener("click", () => {
                nameToRemovePersistently = "";
                localStorage.removeItem("pgsc-nameToRemovePersistently");
                showNotification("Cleared the removed person/bot. They will reappear on refresh.", "success");
                // Update the "Currently removing" text
                const currentlyRemovedDiv = popupContainer.querySelector("#pgsc-currently-removed");
                currentlyRemovedDiv.textContent = "No one is currently being removed.";
                // Hide the "Clear Removed Person/Bot" button
                clearBtn.style.display = "none";
            });

            // Create the toggle button in the top bar
            const waitForLogo = setInterval(() => {
                const logoSvg = document.querySelector('svg.yLNNg');
                if (logoSvg && logoSvg.parentElement) {
                    clearInterval(waitForLogo);

                    const toggleBtn = document.createElement("button");
                    toggleBtn.id = "pgsc-toggle-btn";
                    toggleBtn.style = `
                        background: transparent;
                        color: ${colors.text};
                        border: none;
                        padding: 6px 8px;
                        cursor: pointer;
                        font-size: 14px;
                        font-weight: 500;
                        display: flex;
                        align-items: center;
                        gap: 5px;
                        transition: background 0.2s, transform 0.1s;
                    `;
                    toggleBtn.innerHTML = `
                        <span style="font-size: 16px;">🛠️</span>
                        PGsc
                    `;
                    toggleBtn.addEventListener("mouseover", () => {
                        toggleBtn.style.background = colors.buttonHover;
                        toggleBtn.style.borderRadius = "10px";
                        toggleBtn.style.transform = "scale(1.05)";
                    });
                    toggleBtn.addEventListener("mouseout", () => {
                        toggleBtn.style.background = "transparent";
                        toggleBtn.style.transform = "scale(1)";
                    });

                    toggleBtn.addEventListener("click", () => {
                        const isVisible = popupContainer.style.display === "block";
                        popupContainer.style.display = isVisible ? "none" : "block";
                        backdrop.style.display = isVisible ? "none" : "block";
                    });

                    const parentElement = logoSvg.parentElement;
                    parentElement.replaceChild(toggleBtn, logoSvg);
                }
            }, 100);

            // Close the pop-up and backdrop when clicking outside
            backdrop.addEventListener("click", () => {
                popupContainer.style.display = "none";
                backdrop.style.display = "none";
            });

            // Close the pop-up when clicking the close button
            const closeBtn = popupContainer.querySelector("#pgsc-close-btn");
            closeBtn.addEventListener("mouseover", () => {
                closeBtn.style.color = "#FF4444";
            });
            closeBtn.addEventListener("mouseout", () => {
                closeBtn.style.color = colors.text;
            });
            closeBtn.addEventListener("click", () => {
                popupContainer.style.display = "none";
                backdrop.style.display = "none";
            });

            // Set up a MutationObserver to detect theme changes dynamically (for the PGsc UI)
            const themeObserver = new MutationObserver(() => {
                const newTheme = detectSnapchatTheme();
                const newIsDarkMode = newTheme === "dark";
                if (newIsDarkMode !== isDarkMode) {
                    // Update the gradient and colors for the PGsc UI
                    const newColors = {
                        gradient: newIsDarkMode
                            ? "linear-gradient(135deg, #2A1B3D 0%, #1B3D3A 100%)"
                            : "linear-gradient(135deg, #FFF9E6 0%, #E6F0FA 100%)",
                        text: newIsDarkMode ? "#DEDEDE" : "#16191C",
                        inputBackground: newIsDarkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.05)",
                        inputBorder: newIsDarkMode ? "1px solid rgba(255, 255, 255, 0.3)" : "1px solid rgba(0, 0, 0, 0.2)",
                        sectionTitle: newIsDarkMode ? "#FFFFFF" : "#000000",
                        buttonHover: newIsDarkMode ? "rgba(255, 255, 255, 0.2)" : "rgba(0, 0, 0, 0.1)",
                        sidebarBackground: newIsDarkMode ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.05)",
                        tabActiveBackground: newIsDarkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)",
                        contentBackground: newIsDarkMode ? "rgba(255, 255, 255, 0.03)" : "rgba(0, 0, 0, 0.03)"
                    };
                    popupContainer.style.background = newColors.gradient;
                    popupContainer.style.color = newColors.text;
                    document.querySelectorAll("#pgsc-popup span, #pgsc-popup input, #pgsc-popup select").forEach(el => {
                        el.style.color = newColors.text;
                    });
                    document.querySelectorAll("#pgsc-popup input, #pgsc-popup select").forEach(el => {
                        el.style.background = newColors.inputBackground;
                        el.style.border = newColors.inputBorder;
                    });
                    document.querySelectorAll("#pgsc-popup .section-title").forEach(el => {
                        el.style.color = newColors.sectionTitle;
                    });
                    sidebar.style.background = newColors.sidebarBackground;
                    sidebar.style.borderRight = `1px solid ${newIsDarkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)"}`;
                    contentArea.style.background = newColors.contentBackground;
                    const activeTab = sidebar.querySelector("button.active");
                    if (activeTab) {
                        activeTab.style.background = newColors.tabActiveBackground;
                    }
                    tabButtons.forEach(btn => {
                        if (!btn.classList.contains("active")) {
                            btn.style.background = "transparent";
                        }
                        btn.style.color = newColors.text;
                    });
                    const toggleBtn = document.querySelector("#pgsc-toggle-btn");
                    if (toggleBtn) {
                        toggleBtn.style.color = newColors.text;
                    }
                }
            });

            themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
            themeObserver.observe(document.body, { attributes: true, attributeFilter: ["class", "style"] });
        }, 1000); // Delay to ensure Snapchat has applied its theme
    }

    // Wait for the DOM to load before adding the UI and setting up observers
    if (document.readyState === "complete" || document.readyState === "interactive") {
        addSnapEnhanceUI();
        setupChatListObserver();
    } else {
        document.addEventListener("DOMContentLoaded", () => {
            addSnapEnhanceUI();
            setupChatListObserver();
        });
    }
})(window.unsafeWindow || window);