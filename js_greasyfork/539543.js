"use strict";
// ==UserScript==
// @name         RTO EAC Validator
// @namespace    https://example.com/
// @version      1.1
// @description  Validates EAC log on a webpage
// @match        https://rutracker.org/forum/viewtopic.php
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/539543/RTO%20EAC%20Validator.user.js
// @updateURL https://update.greasyfork.org/scripts/539543/RTO%20EAC%20Validator.meta.js
// ==/UserScript==
const VERIFY_ICON_SVG = `<svg fill="#000000" width="64px" height="64px" viewBox="0 0 1920 1920" xmlns="http://www.w3.org/2000/svg" stroke="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M320.006 960.032c0 352.866 287.052 639.974 640.026 639.974 173.767 0 334.093-69.757 451.938-188.072l-211.928-211.912h480.019v479.981l-155.046-155.114C1377.649 1672.883 1177.24 1760 960.032 1760 518.814 1760 160 1401.134 160 960.032ZM959.968 160C1401.186 160 1760 518.866 1760 959.968h-160.006c0-352.866-287.052-639.974-640.026-639.974-173.767 0-334.093 69.757-451.938 188.072l211.928 211.912H239.94V239.997L394.985 395.03C542.351 247.117 742.76 160 959.968 160Z" fill-rule="evenodd"></path> </g></svg>`;
const EAC_LOG_KEYWORDS = [
    "Exact Audio Copy",
    "EAC extraction",
    "Отчет EAC",
    "Отчёт EAC"
];
let BBCodeData = null;
const fetchBBCodeData = async () => {
    try {
        const postElement = document.querySelector("tbody[id^='post_']");
        if (!postElement) {
            throw new Error("Post ID not found in the page.");
        }
        const postId = postElement.id.replace("post_", "");
        const formTokenInput = document.querySelector("input[name='form_token']");
        if (!formTokenInput || !formTokenInput.value) {
            throw new Error("Form token not found in the page.");
        }
        const formToken = formTokenInput.value;
        const response = await fetch("https://rutracker.org/forum/ajax.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                "Cookie": document.cookie,
            },
            body: `action=view_post&post_id=${postId}&mode=text&form_token=${formToken}`,
        });
        if (!response.ok) {
            throw new Error(`Failed to fetch BB-code data: ${response.statusText}`);
        }
        const data = await response.json();
        if (!data.post_text) {
            throw new Error("BB-code data not found in the response.");
        }
        return data.post_text;
    }
    catch (error) {
        console.error("Error fetching BB-code data:", error);
        return null;
    }
};
const findEACLog = (bbCodeData) => {
    const spoilerRegex = /\[spoiler(?:="[^"]*")?\](.*?)\[\/spoiler\]/gs;
    let match;
    while ((match = spoilerRegex.exec(bbCodeData)) !== null) {
        const spoilerContent = match[1];
        if (EAC_LOG_KEYWORDS.some(keyword => spoilerContent.includes(keyword))) {
            // if it has [pre]...content...[/pre] return only content
            const preRegex = /\[pre\](.*?)\[\/pre\]/gs;
            const preMatch = preRegex.exec(spoilerContent);
            if (preMatch) {
                return preMatch[1];
            }
            // if it has [code]...content...[/code] return only content
            const codeRegex = /\[code\](.*?)\[\/code\]/gs;
            const codeMatch = codeRegex.exec(spoilerContent);
            if (codeMatch) {
                return codeMatch[1];
            }
        }
    }
    console.error("No EAC log found in the BBCode data.");
    return null;
};
(() => {
    const validateEAC = async (event, EACNode) => {
        event.preventDefault();
        event.stopPropagation();
        console.log("Validating EAC...");
        if (!BBCodeData) {
            BBCodeData = await fetchBBCodeData();
        }
        if (BBCodeData) {
            const eacLog = findEACLog(BBCodeData);
            if (!eacLog) {
                console.error("No EAC log found in the BBCode data.");
                return;
            }
            if (eacLog) {
                const lines = eacLog.split("\n");
                const validationResults = [];
                for (const eacLine of lines) {
                    const trimmedLine = eacLine.trim();
                    if (trimmedLine.length === 0) {
                        continue;
                    }
                    // Used drive  : HL-DT-STDVDRAM GH22NS40   Adapter: 0  ID: 0
                    const UsedDriveRegex = /Used drive\s+:\s+(.*)$/;
                    // Read mode   : Secure with NO C2, accurate stream, disable cache
                    const ReadModeRegex = /Read mode\s+:\s+(.*)$/;
                    // Read offset correction : 667
                    const ReadOffsetRegex = /Read offset correction\s+:\s+(.*)$/;
                    // Overread into Lead-In and Lead-Out : No
                    const OverreadRegex = /Overread into Lead-In and Lead-Out\s+:\s+(.*)$/;
                    const UsedDriveMatch = trimmedLine.match(UsedDriveRegex);
                    const ReadModeMatch = trimmedLine.match(ReadModeRegex);
                    const ReadOffsetMatch = trimmedLine.match(ReadOffsetRegex);
                    const OverreadMatch = trimmedLine.match(OverreadRegex);
                    if (UsedDriveMatch) {
                        validationResults.push(`Used drive: ${UsedDriveMatch[1]}`);
                    }
                    if (ReadModeMatch) {
                        validationResults.push(`Read mode: ${ReadModeMatch[1]}`);
                    }
                    if (ReadOffsetMatch) {
                        validationResults.push(`Read offset correction: ${ReadOffsetMatch[1]}`);
                    }
                    if (OverreadMatch) {
                        validationResults.push(`Overread into Lead-In and Lead-Out: ${OverreadMatch[1]}`);
                    }
                }
                console.log("EAC Validation Results: ", validationResults);
            }
        }
    };
    // Function to add the validation button to the spoiler element
    const addValidationButtonToSpoilers = () => {
        const spoilers = document.querySelectorAll(".sp-head");
        spoilers.forEach((spoiler) => {
            const nextSibling = spoiler.nextElementSibling;
            // Check if the next sibling is the correct spoiler body
            if (nextSibling && nextSibling.classList.contains("sp-body")) {
                const textContent = Array.from(nextSibling.childNodes)
                    .filter((node) => !(node instanceof HTMLElement && node.classList.contains("sp-wrap")))
                    .map((node) => node.textContent || "")
                    .join("");
                if (EAC_LOG_KEYWORDS.some(keyword => textContent.includes(keyword))) {
                    // Create the validation button
                    const button = document.createElement("button");
                    button.innerHTML = VERIFY_ICON_SVG;
                    button.style.marginLeft = "10px";
                    button.style.lineHeight = "0";
                    button.style.width = "16px";
                    button.style.height = "16px";
                    button.style.padding = "0";
                    button.style.display = "flex";
                    button.style.alignItems = "center";
                    button.style.justifyContent = "center";
                    button.style.cursor = "pointer";
                    button.style.marginBottom = "-3px";
                    // Ensure the SVG scales properly
                    const svgElement = button.querySelector("svg");
                    if (svgElement) {
                        svgElement.setAttribute("width", "100%");
                        svgElement.setAttribute("height", "100%");
                    }
                    // Add rotation to the SVG on hover
                    button.addEventListener("mouseover", () => {
                        if (svgElement) {
                            svgElement.style.transform = "rotate(90deg)"; // Rotate clockwise
                            svgElement.style.transition = "transform 0.5s"; // Smooth transition
                        }
                    });
                    button.addEventListener("mouseout", () => {
                        if (svgElement) {
                            svgElement.style.transform = "rotate(0deg)"; // Reset rotation
                        }
                    });
                    button.addEventListener("click", (event) => validateEAC(event, nextSibling));
                    // Append the button to the spoiler element
                    spoiler.appendChild(button);
                    spoiler.style.display = "flex";
                    spoiler.style.justifyContent = "space-between";
                    spoiler.style.alignItems = "center";
                }
            }
        });
    };
    // Initialize the script
    const init = () => {
        console.log("EAC Validator script loaded.");
        addValidationButtonToSpoilers();
    };
    // Run the script when the DOM is fully loaded
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    }
    else {
        init();
    }
})();
