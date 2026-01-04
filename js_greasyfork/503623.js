// ==UserScript==
// @name        Messenger Hide Chat List
// @namespace   imxitiz's-Script
// @version     3.0.2
// @grant       none
// @license     GNU GPLv3
// @author      imxitiz
// @contributor imxitiz
// @match       https://www.messenger.com/*
// @description Hide or show the Messenger chat list based on user interaction. Includes features for resizing and locking Chat list visibility.
// @downloadURL https://update.greasyfork.org/scripts/503623/Messenger%20Hide%20Chat%20List.user.js
// @updateURL https://update.greasyfork.org/scripts/503623/Messenger%20Hide%20Chat%20List.meta.js
// ==/UserScript==

(() => {
    ("use strict");

    let hasInitialized = false;
    const hideThreshold = 20; // Threshold in pixels to determine if sidebar should be hidden
    let eventParent;
    let isResizing = false;
    let userDefinedFlexBasis =
        parseFloat(getLocalStorageItem("userDefinedFlexBasis")) || 30;
    let userResizedOnce =
        getSessionStorageItem("userResizedOnce") === "true" || false;
    let active = parseInt(getSessionStorageItem("active"), 10) || 0;
    // active states:
    // 0 - Normal behavior: sidebar hidden on hover
    // 1 - Always visible
    // 2 - Always hidden(lock)
    // 3 - Always hidden(hiddent but not locked)

    let blurEffect = getSessionStorageItem("blurEffect") === "true" || false;

    let lockPosition = JSON.parse(getSessionStorageItem("lockPosition")) || {
        x: 0,
        y: 0,
    };
    const clickThreshold = 80; // Threshold in pixels for precise unlocking
    let wrongLockedPlaceAttempt = 0;

    const sidebarElementSelector = "div[aria-label='Thread list']";
    const inboxSwitcherElementSelector = "div[aria-label='Inbox switcher']";

    // Helper functions for storage
    function setSessionStorageItem(key, value) {
        sessionStorage.setItem(key, value);
    }

    function getSessionStorageItem(key) {
        return sessionStorage.getItem(key);
    }

    function setLocalStorageItem(key, value) {
        localStorage.setItem(key, value);
    }

    function getLocalStorageItem(key) {
        return localStorage.getItem(key);
    }

    // Create and append the resize handle to the sidebar
    function createResizeHandle() {
        try {
            const sidebar = document.querySelector(sidebarElementSelector);
            if (!sidebar) {
                throw new Error("Sidebar element not found");
            }

            // Create resize handle only if it doesn't already exist
            if (!document.getElementById("resize-handle")) {
                const resizeHandle = document.createElement("div");
                resizeHandle.id = "resize-handle";
                resizeHandle.style.width = "10px";
                resizeHandle.style.height = "100%";
                resizeHandle.style.position = "absolute";
                resizeHandle.style.top = "0";
                resizeHandle.style.right = "0";
                resizeHandle.style.cursor = "ew-resize";
                resizeHandle.style.backgroundColor = userResizedOnce
                    ? "transparent"
                    : "red";
                resizeHandle.style.zIndex = "1000";
                sidebar.appendChild(resizeHandle);

                // Add event listeners for resizing
                resizeHandle.addEventListener("mousedown", () => {
                    isResizing = true;
                    document.addEventListener("mousemove", resizeChatList);
                    document.addEventListener("mouseup", stopResize);
                });
            }
        } catch (error) {
            console.error("Error creating resize handle: ", error);
            setTimeout(createResizeHandle, 1000); // Retry after 1 second if there's an error
        }
    }

    function changeVisibility(sidebar, show) {
        sidebar.style.margin = "0";
        if (show) {
            sidebar.style.maxWidth = `${userDefinedFlexBasis}%`;
            sidebar.style.minWidth = `${userDefinedFlexBasis}%`;
        } else {
            sidebar.style.maxWidth = "0";
            sidebar.style.minWidth = "0";
        }
    }

    function initialize() {
        const sidebar = document.querySelector(sidebarElementSelector);
        if (sidebar) {
            if (!hasInitialized) {
                if (sidebar.style.maxWidth !== "0px") {
                    changeVisibility(sidebar, active === 1);
                    createBlurEffect(blurEffect);
                    setTimeout(initialize, 1000);
                }
                if (sidebar.style.maxWidth === "0px") {
                    setTimeout(() => {
                        changeVisibility(sidebar, active === 1);
                        createBlurEffect(blurEffect);
                    }, 2000);
                }
            }
        } else {
            setTimeout(initialize, 1000);
        }
    }

    // Update sidebar visibility based on user interactions and settings
    function updateSidebarVisibility() {
        const sidebar = document.querySelector(sidebarElementSelector);
        const inboxSwitcher = document.querySelector(inboxSwitcherElementSelector);

        if (sidebar && inboxSwitcher) {
            if (!hasInitialized) {
                sidebar.style.maxWidth = "0"; // Initial max-width
                sidebar.style.minWidth = "0"; // Ensure consistent width
                sidebar.style.margin = "0";
                hasInitialized = true;

                createResizeHandle(); // Create resize handle on initial setup
            }
            const isMouseOverSidebar =
                isMouseOver(sidebar) || isMouseOver(inboxSwitcher);

            if (active === 1) {
                // Always show the sidebar
                changeVisibility(sidebar, true);
            } else if (active === 2 || active === 3) {
                // Always hide the sidebar
                changeVisibility(sidebar, false);
            } else {
                // Normal behavior
                if (
                    isMouseOverSidebar ||
                    eventParent.clientX <= hideThreshold ||
                    isResizing
                ) {
                    // Show sidebar
                    changeVisibility(sidebar, true);
                } else {
                    // Hide sidebar
                    changeVisibility(sidebar, false);
                }
            }
        }
    }

    // Resize the chat list while the mouse is moving
    function resizeChatList(e) {
        if (isResizing) {
            const sidebar = document.querySelector(sidebarElementSelector);
            const containerWidth = sidebar.parentElement.clientWidth;
            const newFlexBasis =
                ((e.clientX - sidebar.getBoundingClientRect().left) / containerWidth) *
                100;

            if (newFlexBasis >= 10 && newFlexBasis <= 100) {
                userDefinedFlexBasis = newFlexBasis;
                sidebar.style.maxWidth = `${userDefinedFlexBasis}%`;
                sidebar.style.minWidth = `${userDefinedFlexBasis}%`;
            }

            if (!userResizedOnce) {
                userResizedOnce = true;
                setSessionStorageItem("userResizedOnce", "true");
                const resizeHandle = document.getElementById("resize-handle");
                resizeHandle.style.backgroundColor = "transparent";
            }
            setLocalStorageItem("userDefinedFlexBasis", userDefinedFlexBasis);
        }
    }

    // Stop resizing when the mouse button is released
    function stopResize() {
        isResizing = false;
        document.removeEventListener("mousemove", resizeChatList);
        document.removeEventListener("mouseup", stopResize);
    }

    // Check if mouse is over the element or its children
    function isMouseOver(element) {
        return element.contains(eventParent.target);
    }

    // Calculate distance between two points
    function calculateDistance(pos1, pos2) {
        return Math.sqrt((pos1.x - pos2.x) ** 2 + (pos1.y - pos2.y) ** 2);
    }

    // Check if mouse is near the locked position
    function isNearLockPosition(x, y, lockPosition) {
        const distance = calculateDistance(lockPosition, { x, y });
        return distance <= clickThreshold;
    }

    // Helper function to show notifications
    function showNotification(message, time = 5000) {
        // if previous notification found, remove it
        const previousNotification = document.querySelector(
            "div.notification[role='alert']",
        );
        if (previousNotification) {
            document.body.removeChild(previousNotification);
        }

        const notification = document.createElement("div");
        notification.setAttribute("role", "alert");
        notification.classList.add("notification");
        notification.innerHTML = message;
        notification.style.position = "fixed";
        notification.style.top = "50%";
        notification.style.left = "50%";
        notification.style.transform = "translate(-50%, -50%)";
        notification.style.padding = "10px";
        notification.style.backgroundColor = "#333";
        notification.style.color = "#fff";
        notification.style.fontFamily = "Arial, sans-serif";
        notification.style.fontSize = "20px";
        notification.style.borderRadius = "5px";
        notification.style.zIndex = "100000";
        notification.style.opacity = "0";
        notification.style.transition = "opacity 0.5s";
        document.body.appendChild(notification);

        // Fade in the notification
        setTimeout(() => {
            notification.style.opacity = "1";
        }, 100);

        // Fade out and remove the notification after 3 seconds
        setTimeout(() => {
            notification.style.opacity = "0";
            setTimeout(() => {
                if (document.body.contains(notification))
                    document.body.removeChild(notification);
            }, 500);
        }, time);
    }

    function changeActiveState(newactivestate, message = null, time = 3000) {
        active = newactivestate;
        setSessionStorageItem("active", active);
        if (message === null) {
            message = notificationBasedOnActiveState(active);
        }
        if (message) {
            showNotification(message, time);
        }
    }

    function changeBlurEffectState(newBlurEffectState) {
        blurEffect = newBlurEffectState;
        setSessionStorageItem("blurEffect", blurEffect);
    }

    function createToolBar() {
        const customToolbar = document.createElement("div");
        customToolbar.id = "customToolbar";
        document.body.appendChild(customToolbar);

        const overlay = document.createElement("div");
        overlay.id = "overlay";
        document.body.appendChild(overlay);

        const overlayButton = document.createElement("button");
        overlayButton.id = "overlayButton";
        overlayButton.classList.add("eye");
        if (blurEffect) {
            overlayButton.innerHTML = "🙈";
        } else {
            overlayButton.innerHTML = "🐵";
        }
        overlayButton.addEventListener("click", () => {
            const overlayButton = document.getElementById("overlayButton");
            if (blurEffect) {
                overlayButton.innerHTML = "🐵";
                createBlurEffect(false);
            } else {
                overlayButton.innerHTML = "🙈";
                createBlurEffect(true);
            }
        });
        customToolbar.appendChild(overlayButton);

        const githubLink = document.createElement("a");
        githubLink.id = "githubLink";
        githubLink.href = "https://kshitizsharma.com.np/userscriptsupport";
        githubLink.innerHTML = "imxitiz<br><h6>(Support)</h6>";
        customToolbar.appendChild(githubLink);
    }

    function changeVisibilityOfToolbar(show = true) {
        const customToolbar = document.getElementById("customToolbar");
        if (show) {
            customToolbar.style.right = "0";
        } else {
            customToolbar.style.right = "-200px";
        }
    }

    function updateToolBarVisibility() {
        // if hovering in right side
        if (
            eventParent.clientX >= window.innerWidth - hideThreshold ||
            isMouseOver(document.getElementById("customToolbar"))
        ) {
            changeVisibilityOfToolbar(true);
        } else {
            changeVisibilityOfToolbar(false);
        }
    }

    createToolBar();
    function createBlurEffect(show = false) {
        let blurEffectElement = document.getElementById("blur-effect");
        changeBlurEffectState(show);

        if (!blurEffectElement) {
            // Create the blur effect element only once
            blurEffectElement = document.createElement("div");
            blurEffectElement.id = "blur-effect";
            blurEffectElement.style.position = "fixed";
            blurEffectElement.style.top = "0";
            blurEffectElement.style.left = "0";
            blurEffectElement.style.width = "100%";
            blurEffectElement.style.height = "100%";
            blurEffectElement.style.backgroundColor = "rgba(0, 0, 0, 0)";
            blurEffectElement.style.zIndex = "100000";
            blurEffectElement.style.backdropFilter = "blur(0px)";
            blurEffectElement.style.transition =
                "background-color 0.5s ease, backdrop-filter 0.5s ease";
            blurEffectElement.style.display = "none"; // Initially hidden

            function preventDefaultAndStopPropagation(event) {
                event.preventDefault();
                event.stopPropagation();
            }

            // Add common event listeners
            blurEffectElement.addEventListener(
                "click",
                preventDefaultAndStopPropagation,
            );
            blurEffectElement.addEventListener(
                "contextmenu",
                preventDefaultAndStopPropagation,
            );
            blurEffectElement.addEventListener(
                "mousedown",
                preventDefaultAndStopPropagation,
            );
            blurEffectElement.addEventListener("mousemove", (event) => {
                if (event.clientX >= window.innerWidth - hideThreshold) {
                    changeVisibilityOfToolbar(true);
                } else {
                    changeVisibilityOfToolbar(false);
                }
                preventDefaultAndStopPropagation(event);
            });
            document.body.appendChild(blurEffectElement);
        }

        // Toggle the visibility of the blur effect
        if (show) {
            blurEffectElement.style.display = "block";
            setTimeout(() => {
                blurEffectElement.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
                blurEffectElement.style.backdropFilter = "blur(10px)";
            }, 10); // Slight delay to trigger transition
            activateShortcutBlocker();
        } else {
            blurEffectElement.style.backgroundColor = "rgba(0, 0, 0, 0)";
            blurEffectElement.style.backdropFilter = "blur(0px)";
            setTimeout(() => {
                blurEffectElement.style.display = "none";
            }, 500); // Hide element after transition completes
            deactivateShortcutBlocker();
        }
    }

    function blockKeyboardShortcuts(event) {
        event.preventDefault();
        event.stopPropagation();
    }

    function activateShortcutBlocker() {
        document.addEventListener("keydown", blockKeyboardShortcuts, true);
    }

    function deactivateShortcutBlocker() {
        document.removeEventListener("keydown", blockKeyboardShortcuts, true);
    }

    function notificationBasedOnActiveState(activeState) {
        if (activeState === 0) {
            return "Now chat list is shown on hover.";
        } else if (activeState === 1) {
            return "Now chat list is always visible.";
        } else if (activeState === 2) {
            return "Now chat list is always hidden, but locked.";
        } else if (activeState === 3) {
            return "Now chat list is always hidden, but not locked.";
        } else {
            return null;
        }
    }

    // Triple click event listener
    function handleClick(event, clickcount = 0) {
        if (event.detail === 3 || clickcount === 3) {
            const inboxSwitcher = document.querySelector(
                inboxSwitcherElementSelector,
            );
            if (active === 0) {
                if (isMouseOver(inboxSwitcher)) {
                    changeActiveState(1);
                } else {
                    // if triple right click then lock hidden
                    if (event.button === 2) {
                        active = 2;
                        lockPosition = { x: event.clientX, y: event.clientY };
                        setSessionStorageItem("lockPosition", JSON.stringify(lockPosition));
                        showNotification(
                            "You have to triple click exactly here to unlock the chat list.",
                        );
                    } else {
                        // else or if triple left click then unlocked hidden
                        changeActiveState(3);
                    }
                }
            } else if (active === 1) {
                if (isMouseOver(inboxSwitcher)) {
                    changeActiveState(0);
                } else {
                    if (event.button === 2) {
                        active = 2;
                        lockPosition = { x: event.clientX, y: event.clientY };
                        setSessionStorageItem("lockPosition", JSON.stringify(lockPosition));
                        showNotification(
                            "You have to triple click exactly here to unlock the chat list.",
                        );
                    } else {
                        changeActiveState(3);
                    }
                }
            } else if (active === 2) {
                if (wrongLockedPlaceAttempt > 16) {
                    // no ned to check anything, just leave
                    return;
                }
                if (isNearLockPosition(event.clientX, event.clientY, lockPosition)) {
                    // only right triple click can open the lock
                    if (event.button === 2) {
                        wrongLockedPlaceAttempt = 0;
                        changeActiveState(0);
                    }
                } else {
                    if (wrongLockedPlaceAttempt <= 16) {
                        wrongLockedPlaceAttempt++;
                    }
                    if (wrongLockedPlaceAttempt >= 15) {
                        console.log("You're banned!");
                        showNotification(
                            "You're banned! Please refresh the page to start again. <br>OR<br> You can always logout and login again to reset the lock position.",
                        );
                    } else if (wrongLockedPlaceAttempt >= 10) {
                        showNotification(
                            "You can always logout and login again to reset the lock position.",
                        );
                    } else {
                        if (wrongLockedPlaceAttempt >= 5) {
                            showNotification(
                                "Please logout and login again to reset the lock position.",
                            );
                        }
                    }
                    const clickPosition = {
                        x: event.clientX,
                        y: event.clientY,
                    };
                    const distance = calculateDistance(lockPosition, clickPosition);
                    if (distance <= clickThreshold * 1.2) {
                        showNotification("You are near the locked position, try again!!!");
                    }
                }
            } else if (active === 3) {
                if (isMouseOver(inboxSwitcher)) {
                    changeActiveState(1);
                } else {
                    if (event.button === 2) {
                        active = 2;
                        lockPosition = { x: event.clientX, y: event.clientY };
                        setSessionStorageItem("lockPosition", JSON.stringify(lockPosition));
                        showNotification(
                            "You have to triple click exactly here to unlock the chat list.",
                        );
                    } else {
                        changeActiveState(0);
                    }
                }
            }
            // Immediately reflect the change
            changeVisibility(
                document.querySelector(sidebarElementSelector),
                active === 1,
            );
            setSessionStorageItem("active", active);
        }
    }

    // Initialize the script
    function init() {
        initialize();
        document.addEventListener("mousemove", (event) => {
            eventParent = event;
            updateSidebarVisibility();
            updateToolBarVisibility();
        });

        document.addEventListener("click", handleClick);

        let lastRightClickTime = 0;
        let rightClickCount = 0;

        document.addEventListener("contextmenu", (event) => {
            const avoidElements = [
                "IMG",
                "VIDEO",
                "AUDIO",
                "SOURCE",
                "A",
                "BUTTON",
                "INPUT",
                "SELECT",
                "TEXTAREA",
                "IFRAME",
                "EMBED",
                "OBJECT",
                "CANVAS",
                "SVG",
            ];
            if (
                avoidElements.includes(event.target.tagName) ||
                event.target.isContentEditable ||
                event.target.getAttribute("role") === "textbox" ||
                window.getSelection().toString().trim().length > 0
            ) {
                return;
            }
            event.preventDefault();

            const currentTime = new Date().getTime();
            if (currentTime - lastRightClickTime < 500) {
                rightClickCount++;
            } else {
                rightClickCount = 1;
            }
            lastRightClickTime = currentTime;

            handleClick(event, rightClickCount);
        });
    }

    // Add styles
    const styles = `
        #customToolbar {
            position: fixed;
            top: 48%;
            right: -200px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            background: linear-gradient(
                            45deg, 
                            rgba(255, 69, 0, 0.8), /* Red-Orange */
                            rgba(255, 140, 0, 0.8), /* Orange */
                            rgba(255, 215, 0, 0.8)  /* Yellow */
                        );
            z-index: 1000000;
            padding: 5px;
            border-radius: 10px;
            transition: right 0.5s ease;
        }
        
        
        #overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            display: none;
            z-index: 99999;
        }
            
        #overlayButton {
            background-color: #333;
            color: #fff;
            border: none;
            padding: 8px;
            margin: 5px 10px;
            cursor: pointer;
            border-radius: 10px;
            font-size: 2.5rem;
        }
        
        #overlayButton:hover {
            background-color: #555;
            filter: drop-shadow(0 0 5px #fff);
        }
            
        #githubLink {
            color: #285ed0;
            text-decoration: none;
            font-size: 1.5rem;
            font-weight: bold;
            margin: 5px 0;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            text-align: center;
        }

        #githubLink h6 {
            margin: 0;
            font-size: 1rem;
            font-weight: normal;
        }
    `;

    const styleElement = document.createElement("style");
    styleElement.textContent = styles;
    document.head.appendChild(styleElement);

    init();
})();
