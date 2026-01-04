// ==UserScript==
// @name         Improved ChatGPT Autoscroll
// @namespace    http://tampermonkey.net/
// @version      2025-03-10
// @description  Improved Autoscroll for ChatGPT
// @author       jockel09
// @match        https://chat.openai.com*/*
// @match        https://*chatgpt.com*/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/529393/Improved%20ChatGPT%20Autoscroll.user.js
// @updateURL https://update.greasyfork.org/scripts/529393/Improved%20ChatGPT%20Autoscroll.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Konfigurationsoptionen
    const config = {
        autoDisableOnScrollUp: true, // Automatisches Ausschalten, wenn nach oben gescrollt wird
        autoEnableOnScrollBottom: true, // Automatisches Einschalten, wenn bis ganz unten gescrollt wird
        activeColor: "#383838", // Button-Farbe, wenn Auto-Scroll aktiv ist
        inactiveColor: "#7D1E1E" // Button-Farbe, wenn Auto-Scroll nicht aktiv ist
    };

    function createScrollButton() {
        const button = document.createElement("button");
        button.id = "autoScrollButton";
        button.textContent = "🔽 Auto-Scroll";
        button.style.position = "fixed";
        button.style.bottom = "20px";
        button.style.right = "20px";
        button.style.padding = "10px 15px";
        button.style.backgroundColor = config.inactiveColor;
        button.style.color = "white";
        button.style.border = "none";
        button.style.borderRadius = "5px";
        button.style.cursor = "pointer";
        button.style.zIndex = "1000";
        button.style.fontSize = "14px";
        button.style.boxShadow = "0px 4px 6px rgba(0, 0, 0, 0.1)";
        document.body.appendChild(button);
        return button;
    }

    function getChatWindow() {
        return document.querySelector("div.flex.h-full.flex-col.overflow-y-auto");
    }

    let autoScrollEnabled = false;
    let lastScrollTop = 0;
    let ignoreNextScroll = false;

    function updateButtonState() {
        const button = document.getElementById("autoScrollButton");
        if (button) {
            if (autoScrollEnabled) {
                button.textContent = "✅ Auto-Scroll ON";
                button.style.backgroundColor = config.activeColor;
            } else {
                button.textContent = "🔽 Auto-Scroll";
                button.style.backgroundColor = config.inactiveColor;
            }
        }
    }

    function scrollToBottom() {
        const chatWindow = getChatWindow();
        if (chatWindow && autoScrollEnabled) {
            ignoreNextScroll = true;
            chatWindow.scrollTo({
                top: chatWindow.scrollHeight,
                behavior: "smooth"
            });
            setTimeout(() => {
                ignoreNextScroll = false;
            }, 500);
        }
    }

    function toggleAutoScroll() {
        autoScrollEnabled = !autoScrollEnabled;
        const chatWindow = getChatWindow();
        lastScrollTop = chatWindow ? chatWindow.scrollTop : 0;
        updateButtonState();
        if (autoScrollEnabled) {
            scrollToBottom();
        }
    }

    function handleUserScroll() {
        const chatWindow = getChatWindow();
        if (!chatWindow) return;
        const currentScrollTop = chatWindow.scrollTop;
        const tolerance = 10;

        if (!ignoreNextScroll) {
            if (config.autoDisableOnScrollUp && currentScrollTop < lastScrollTop) {
                if (autoScrollEnabled) {
                    autoScrollEnabled = false;
                    updateButtonState();
                }
            }
            else if (config.autoEnableOnScrollBottom && chatWindow.scrollHeight - (currentScrollTop + chatWindow.clientHeight) < tolerance) {
                if (!autoScrollEnabled) {
                    autoScrollEnabled = true;
                    updateButtonState();
                    scrollToBottom();
                }
            }
        }
        lastScrollTop = currentScrollTop;
    }

    const scrollButton = createScrollButton();
    scrollButton.addEventListener("click", toggleAutoScroll);

    function addScrollListener() {
        const chatWindow = getChatWindow();
        if (chatWindow) {
            chatWindow.addEventListener("scroll", handleUserScroll);
        }
    }

    const listenerInterval = setInterval(() => {
        const chatWindow = getChatWindow();
        if (chatWindow) {
            addScrollListener();
            clearInterval(listenerInterval);
        }
    }, 500);

    setInterval(scrollToBottom, 500);

    function observeAndRemoveUndesiredButton() {
        const targetNode = document.body;
        const observerConfig = { childList: true, subtree: true };
        const undesiredSelector = 'button.cursor-pointer.absolute.z-10.rounded-full.bg-clip-padding.border.text-token-text-secondary.border-token-border-light.right-1\\/2.translate-x-1\\/2.bg-token-main-surface-primary.w-8.h-8.flex.items-center.justify-center.bottom-5';

        const callback = function(mutationsList, observer) {
            for (const mutation of mutationsList) {
                if (mutation.addedNodes.length) {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === 1) { // Elementknoten
                            if (node.matches && node.matches(undesiredSelector)) {
                                node.remove();
                            }
                            const undesiredChild = node.querySelector(undesiredSelector);
                            if (undesiredChild) {
                                undesiredChild.remove();
                            }
                        }
                    });
                }
            }
        };

        const observer = new MutationObserver(callback);
        observer.observe(targetNode, observerConfig);
    }

    observeAndRemoveUndesiredButton();
})();
