// ==UserScript==
// @name         ChatGPT Blurry
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Make chat content and input blurry
// @author       Sky Jin
// @match        https://www.chatwithgpt.ai/*
// @match        https://chat.openai.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/465914/ChatGPT%20Blurry.user.js
// @updateURL https://update.greasyfork.org/scripts/465914/ChatGPT%20Blurry.meta.js
// ==/UserScript==

(function () {
    "use strict";

    let isBlurred = false;
    let lastPath = window.location.pathname.split('/').pop();
    const config = { childList: true, subtree: true };
    const chatContentClass = (() => {
        if (window.location.hostname === 'chat.openai.com') {
            return '.whitespace-pre-wrap';
        } else if (window.location.hostname === 'www.chatwithgpt.ai') {
            return '.prose';
        }
    })();
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === "childList") {
                const currentPath = window.location.pathname.split('/').pop();
                if (currentPath !== lastPath) {
                    if (lastPath) {
                        isBlurred = false;
                    }
                    lastPath = currentPath;
                }
                applyBlur();
            }
        });
    });

    function applyBlur() {
        const chatContents = document.querySelectorAll(chatContentClass);
        const inputBox = document.querySelector("textarea");
        if (chatContents && inputBox) {
            for (const chatContent of chatContents) {
                chatContent.style.filter = isBlurred ? "blur(5px)" : "";
            }
            inputBox.style.filter = isBlurred ? "blur(5px)" : "";
        }
    }
    function toggleBlur() {
        isBlurred = !isBlurred;
        applyBlur();
    }

    function startObserving() {
        const outerContainer = document.querySelector("body");
        if (outerContainer) {
            observer.observe(outerContainer, config);
        } else {
            setTimeout(startObserving, 1000);
        }
    }

    startObserving();

    const btn = document.createElement("button");
    btn.innerHTML = "Toggle Blur";
    btn.style.position = "fixed";
    btn.style.bottom = "10px";
    btn.style.right = "10px";
    btn.style.zIndex = "1000";
    btn.onclick = toggleBlur;

    document.body.appendChild(btn);
})();
