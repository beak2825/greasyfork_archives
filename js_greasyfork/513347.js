// ==UserScript==
// @name         Search on RDLP for F95Zone
// @namespace    Violentmonkey Scripts
// @match        https://f95zone.to/threads/*
// @grant        none
// @version      1.2
// @author       UglyOldLazyBastard
// @license      WTFPL http://www.wtfpl.net/faq/
// @description  Adds a search button to F95Zone threads for RDLP torrents
// @run-at       document-ready
// @downloadURL https://update.greasyfork.org/scripts/513347/Search%20on%20RDLP%20for%20F95Zone.user.js
// @updateURL https://update.greasyfork.org/scripts/513347/Search%20on%20RDLP%20for%20F95Zone.meta.js
// ==/UserScript==

(function () {
    "use strict";

    const CONFIG = {
        selectors: {
            title: "h1.p-title-value", // CSS selector to find the main title element on F95Zone
            buttonGroup: ".buttonGroup", // CSS selector to find where the new button should be added
            textNodes: Node.TEXT_NODE, // Node type constant for extracting raw text
        },
        classes: {
            button: "button--link button rpdl-button", // CSS classes for the main button element
            buttonText: "button-text", // CSS class for the button's inner text element
        },
        urls: {
            baseSearch: "https://dl.rpdl.net/torrents", // Base URL for the RDLP search page
        },
        regex: {
            bracketContent: /\[.*\]/, // Regex pattern to find and remove content inside [square brackets]
            specialChars: /[^\w\s]/g, // Regex pattern to find special characters (for cleaning text)
        },
    };

    class TextProcessor {
        /**
         * Remove special characters while preserving letters and spaces
         * @param {string} str - Input string to process
         * @returns {string} - Processed string without special characters
         */
        static removeSpecialCharacters(str) {
            if (typeof str !== "string") {
                throw new TypeError("Input must be a string");
            }

            // Remove characters that are the same in upper and lower case (special chars)
            // and preserve only alphanumeric characters and spaces
            return str
                .split("")
                .filter((char) => {
                    const lower = char.toLowerCase();
                    const upper = char.toUpperCase();
                    return lower !== upper || char.trim() === "";
                })
                .join("");
        }

        /**
         * Extract text content from title element
         * @param {Element} titleElement - The title element to extract text from
         * @returns {string} - Cleaned text content
         */
        static extractTitleText(titleElement) {
            if (!titleElement) {
                throw new Error("Title element is required");
            }

            const textNodes = Array.from(titleElement.childNodes)
                .filter((node) => node.nodeType === CONFIG.selectors.textNodes)
                .map((node) => node.textContent.trim());

            return textNodes.join(" ").trim();
        }

        /**
         * Clean and process the search text
         * @param {string} rawText - Raw text to process
         * @returns {string} - Processed search text
         */
        static processSearchText(rawText) {
            if (typeof rawText !== "string") {
                throw new TypeError("Raw text must be a string");
            }

            // Remove content in brackets and clean special characters
            let cleaned = rawText
                .replace(CONFIG.regex.bracketContent, "")
                .trim();
            cleaned = TextProcessor.removeSpecialCharacters(cleaned);

            return cleaned.trim();
        }
    }

    class RDLPButtonCreator {
        /**
         * Create the RDLP search button
         * @param {string} searchText - Text to use in the search query
         * @returns {HTMLAnchorElement} - Created button element
         */
        static createButton(searchText) {
            if (typeof searchText !== "string") {
                throw new TypeError("Search text must be a string");
            }

            const button = document.createElement("a");
            button.href = `${
                CONFIG.urls.baseSearch
            }?search=${encodeURIComponent(searchText)}`;
            button.className = CONFIG.classes.button;
            button.target = "_blank"; // Open in new tab
            button.rel = "noopener noreferrer"; // Security & privacy tags for new tab
            button.title = `Search "${searchText}" on RDLP`;

            const buttonText = document.createElement("span");
            buttonText.className = CONFIG.classes.buttonText;
            buttonText.textContent = "Search on RDLP";

            button.appendChild(buttonText);
            return button;
        }

        /**
         * Add the RDLP search button to the page
         * @param {string} searchText - Text to use in the search query
         */
        static addButton(searchText) {
            const buttonGroup = document.querySelector(
                CONFIG.selectors.buttonGroup
            );
            if (!buttonGroup) {
                console.warn("Button group not found, RDLP button not added");
                return;
            }

            const existingButton = buttonGroup.querySelector(
                `a[href*="${CONFIG.urls.baseSearch}"]`
            );
            if (existingButton) {
                console.info("RDLP button already exists, skipping creation");
                return;
            }

            const newButton = RDLPButtonCreator.createButton(searchText);
            buttonGroup.appendChild(newButton);
        }
    }

    class F95ZoneRDLPIntegration {
        /**
         * Main method to run the script
         */
        static run() {
            try {
                const titleElement = document.querySelector(
                    CONFIG.selectors.title
                );
                if (!titleElement) {
                    console.warn("Title element not found");
                    return;
                }

                const rawText = TextProcessor.extractTitleText(titleElement);
                if (!rawText) {
                    console.warn("No text content found in title element");
                    return;
                }

                const searchText = TextProcessor.processSearchText(rawText);
                if (!searchText) {
                    console.warn("No valid search text found after processing");
                    return;
                }

                RDLPButtonCreator.addButton(searchText);
            } catch (error) {
                console.error("Error in F95Zone RDLP integration:", error);
            }
        }

        /**
         * Initialize the script with proper timing
         */
        static initialize() {
            // Check if DOM is already ready
            if (document.readyState === "loading") {
                document.addEventListener("DOMContentLoaded", () => {
                    F95ZoneRDLPIntegration.run();
                });
            } else {
                // DOM is already ready
                F95ZoneRDLPIntegration.run();
            }
        }
    }

    // Initialize the script
    F95ZoneRDLPIntegration.initialize();
})();
