// ==UserScript==
// @name         TikTok Expand All Comments
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Don't want to spam that "View More" button? Expand all comments with one click!
// @author       LL-Studio
// @match        *://*.tiktok.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tiktok.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/483343/TikTok%20Expand%20All%20Comments.user.js
// @updateURL https://update.greasyfork.org/scripts/483343/TikTok%20Expand%20All%20Comments.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const INTERVAL_TIME = 500;
    const MAX_TIME = 1e4;

    // Styles
    // CSS styling for the "Expand All" button
    var style = document.createElement('style');
    style.innerHTML = `
        .expand-button {
            color: rgba(22, 24, 35, 0.5);
            font-family: TikTokFont, Arial, Tahoma, PingFangSC, sans-serif;
            font-weight: 600;
            font-size: 14px;
            line-height: 18px;
            cursor: pointer;
        }
        .expand-button:hover {
            text-decoration: underline;
        }
    `;
    document.head.appendChild(style);

    // Elements
    // Add custom elements to the webpage
    const waitForElement = (parent, selector) => {
        return new Promise((resolve, reject) => {
            const results = parent.querySelector(selector);
            if (results) return resolve(results);
            const observer = new MutationObserver((mutationsList, observer) => {
                const element = parent.querySelector(selector);
                if (element) {
                    observer.disconnect();
                    resolve(element);
                }
            });
            observer.observe(parent, { childList: true, subtree: true });
        });
    };

    const hydrateActionContainer = (container) => {
        // Create button
        var expandButton = document.createElement("p");
        expandButton.setAttribute("role", "button");
        expandButton.style.color = "rgba(22, 24, 35, 0.5)";
        expandButton.style.fontFamily = "TikTokFont, Arial, Tahoma, PingFangSC, sans-serif";
        expandButton.style.fontWeight = "600";
        expandButton.style.fontSize = "14px";
        expandButton.style.lineHeight = "18px";
        expandButton.style.cursor = "pointer";

        expandButton.innerText = "Expand All";
        expandButton.onclick = () => {
            expandButton.innerText = "Expanding...";
            expandButton.style.pointerEvents = "none";

            let time = 0;
            const id = setInterval(() => {
                const paragraphs = Array.from(container.querySelectorAll('p'));
                const viewMoreButton = paragraphs.find(p => /^View/.test(p.textContent));
                if (viewMoreButton) {
                    time = 0;
                    viewMoreButton.click();
                } else if (time <= MAX_TIME) {
                    time += INTERVAL_TIME;
                } else {
                    clearInterval(id);
                    expandButton.innerText = "Expand All";
                    expandButton.style.pointerEvents = "auto";
                }
            }, INTERVAL_TIME);
        };

        // Update element when container changes
        const updateElement = () => {
            if (expandButton.parentNode) expandButton.parentNode.removeChild(expandButton);
            if (container.childNodes.length > 1) container.insertBefore(expandButton, container.childNodes[1]);
        };

        var observer = new MutationObserver(() => {
            observer.disconnect();
            updateElement();
            observer.observe(container, { childList: true });
        });
        updateElement();
        observer.observe(container, { childList: true });
    }

    waitForElement(document.body, 'div[data-e2e="search-comment-container"]').then((element) => {
        // Observe and add button to all action containers
        const actionContainers = new Set();
        const onContainer = (container) => {
            if (actionContainers.has(container)) return;
            hydrateActionContainer(container);
            actionContainers.add(container);
        };
        const observer = new MutationObserver((mutationsList) => {
            for (const mutation of mutationsList) {
                if (mutation.addedNodes.length) {
                    const container = document.querySelectorAll("div.css-1for4nf-DivReplyActionContainer");
                    container.forEach((container) => onContainer(container));
                }
            }
        });
        element.querySelectorAll("div.css-1for4nf-DivReplyActionContainer").forEach((container) => onContainer(container));
        observer.observe(element, { childList: true, subtree: true });
    });
})();