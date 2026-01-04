// ==UserScript==
// @name         Collapsible GPT List for ChatGPT.com
// @namespace    https://chatgpt.com/
// @version      1.1
// @description  Enhances the sidebar functionality by enabling the GPT List to collapse.
// @author       Seth Rose
// @homepage     https://x.com/TheSethRose
// @supportURL   https://bsky.app/profile/sethrose.dev
// @supportURL   https://x.com/TheSethRose
// @match        https://chatgpt.com/*
// @match        https://chat.com/*
// @match        https://chat.openai.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/522133/Collapsible%20GPT%20List%20for%20ChatGPTcom.user.js
// @updateURL https://update.greasyfork.org/scripts/522133/Collapsible%20GPT%20List%20for%20ChatGPTcom.meta.js
// ==/UserScript==

(function () {
    "use strict";

    let isFirstTargetProcessed = false;

    function getElementByXPath(xpath) {
        const result = document.evaluate(
            xpath,
            document,
            null,
            XPathResult.FIRST_ORDERED_NODE_TYPE,
            null
        );
        return result.singleNodeValue;
    }

    function makeCollapsible() {
        if (isFirstTargetProcessed) return;

        const targetXPath = "/html/body/div[1]/div[1]/div/div/div/nav/div[2]/div/div[4]";
        const targetDiv = getElementByXPath(targetXPath);
        if (!targetDiv) return;

        // Avoid duplicates
        if (
            targetDiv.previousElementSibling &&
            targetDiv.previousElementSibling.classList.contains("collapsible-toggle")
        ) {
            return;
        }

        // Create the toggle container
        const toggleButton = document.createElement("div");
        toggleButton.className =
            "collapsible-toggle z-20 select-none text-xs font-semibold text-token-text-primary " +
            "flex items-center justify-between h-[26px] px-2 pl-";
        toggleButton.style.cursor = "pointer";
        toggleButton.style.margin = "0";
        toggleButton.style.paddingBottom = "0"; // extra attempt at removing spacing

        // Inner HTML: start collapsed
        toggleButton.innerHTML = `
            <span id="toggleText">Expand GPT List</span>
            <div class="flex h-[26px] w-[26px] items-center justify-center text-token-text-secondary" style="margin:0;padding:0;">
                <button aria-label="Toggle GPTs" class="ml-3 flex rounded-lg items-center text-token-text-primary">
                    <svg class="w-6 h-6 text-gray-800 dark:text-white"
                         aria-hidden="true"
                         xmlns="http://www.w3.org/2000/svg"
                         width="24" height="24"
                         fill="none"
                         viewBox="0 0 24 24">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                              stroke-width="2" d="m8 10 4 4 4-4"/>
                    </svg>
                </button>
            </div>
        `;

        // Style the div to be collapsible
        targetDiv.style.maxHeight = "0";
        targetDiv.style.overflow = "hidden";
        targetDiv.style.transition = "max-height 0.3s ease";
        targetDiv.style.margin = "0";
        targetDiv.style.padding = "0";

        // Insert the toggle button
        targetDiv.parentNode.insertBefore(toggleButton, targetDiv);

        // References for text/icon
        const toggleTextSpan = toggleButton.querySelector("#toggleText");
        const svgPath = toggleButton.querySelector("svg path");

        // Click event toggles everything
        toggleButton.addEventListener("click", () => {
            if (targetDiv.style.maxHeight === "0px") {
                // Expand
                targetDiv.style.maxHeight = targetDiv.scrollHeight + "px";
                toggleTextSpan.textContent = "Collapse GPT List";
                svgPath.setAttribute("d", "m16 14-4-4-4 4"); // Arrow up
            } else {
                // Collapse
                targetDiv.style.maxHeight = "0";
                toggleTextSpan.textContent = "Expand GPT List";
                svgPath.setAttribute("d", "m8 10 4 4 4-4"); // Arrow down
            }
        });

        isFirstTargetProcessed = true;
    }

    // Delay to ensure the target element is rendered
    window.addEventListener("load", () => {
        setTimeout(makeCollapsible, 500);
    });
})();