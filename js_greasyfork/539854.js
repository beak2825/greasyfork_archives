// ==UserScript==
// @name         Ryuugames Fixer
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Extension to fix Ryuugames titles and highlight links
// @author       Olexandro
// @icon         data:image/png;base64, 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
// @match        https://www.ryuugames.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/539854/Ryuugames%20Fixer.user.js
// @updateURL https://update.greasyfork.org/scripts/539854/Ryuugames%20Fixer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function log(message) {
        console.log(message);
    }

    // Function to check if a version looks like a date
    function isDateLikeVersion(version) {
        // Remove any prefix like 'v', 'ver', 'version', etc. (case-insensitive)
        let versionNum = version;

        // Check for 'v' prefix (case-insensitive)
        if (versionNum.toLowerCase().startsWith('v')) {
            versionNum = versionNum.substring(1);
        }
        // Check for other prefixes like 'ver', 'version', etc.
        else if (versionNum.toLowerCase().match(/^(ver|version)/)) {
            // Find the index where the numbers start
            const numIndex = versionNum.search(/\d/);
            if (numIndex > 0) {
                versionNum = versionNum.substring(numIndex);
            }
        }

        // Skip further checks if versionNum doesn't contain numbers or dots
        if (!/[\d.]/.test(versionNum)) {
            return false;
        }

        // Check if version contains spaces, which might indicate a complex version number
        if (versionNum.includes(' ')) {
            return false;
        }

        // FIRST check for common software version patterns and exclude them
        const parts = versionNum.split('.');

        // Common software version patterns:
        // 1. X.Y.Z format where all are single digits (e.g., 1.7.1)
        // 2. X.Y format with only 2 parts

        // Check for X.Y.Z format with single digits in Y and Z
        if (parts.length === 3) {
            // Pattern like 1.7.1 or 2.0.3 (common for software)
            if (parts[1].length === 1 && parts[2].length === 1) {
                return false;
            }

            // If any part is larger than 31, it can't be a day in a date
            if (parts.some(part => parseInt(part, 10) > 31)) {
                return false;
            }
        }

        // Only 2 parts is almost certainly a version, not a date (1.7, 2.0)
        if (parts.length === 2) {
            return false;
        }

        // NOW check for date patterns
        // Function to check if a string looks like a valid day, month or year
        const isValidDatePart = (part, type) => {
            const num = parseInt(part, 10);

            if (isNaN(num)) return false;

            if (type === 'day') {
                return num >= 1 && num <= 31;
            } else if (type === 'month') {
                return num >= 1 && num <= 12;
            } else if (type === 'year') {
                // Years can be 2-digit (like 22) or 4-digit (like 2022)
                return (num >= 0 && num <= 99) || (num >= 1900 && num <= 2099);
            }

            return false;
        };

        // If exactly 3 parts, check if they look like a date
        if (parts.length === 3) {
            // For specific patterns like YY.MM.DD with 2-digit parts, strongly favor date
            if (parts.every(part => part.length === 2 && /^\d{2}$/.test(part))) {
                // Check for valid date parts
                const p1 = parseInt(parts[0], 10);
                const p2 = parseInt(parts[1], 10);
                const p3 = parseInt(parts[2], 10);

                // If middle part is 1-12 (month) and the other parts are reasonable
                if (p2 >= 1 && p2 <= 12 && p1 >= 1 && p1 <= 31 && p3 >= 0 && p3 <= 99) {
                    return true;
                }
            }

            // For versions like 25.04.06 (very likely a date)
            if (parts[0].length === 2 && parts[1].length === 2 && parts[2].length === 2) {
                // Check if middle part looks like a month (01-12)
                const month = parseInt(parts[1], 10);
                if (month >= 1 && month <= 12) {
                    return true;
                }
            }
        }

        return false;
    }

    // Function to clean the final title string
    function cleanTitle(title) {
        // Replace colons with tildes
        let cleanedTitle = title.replace(/:/g, ' ~ ');

        // Replace multiple spaces with a single space
        cleanedTitle = cleanedTitle.replace(/\s+/g, ' ');

        // Replace "Uncensored" with "UNC"
        cleanedTitle = cleanedTitle.replace(/Uncensored/gi, 'UNC');

        return cleanedTitle.trim();
    }

    // Function to modify the title element
    function modifyTitle() {
        // Find the title element
        const titleElement = document.querySelector('h1.entry-title');

        if (titleElement) {
            let originalText = titleElement.textContent;

            // Extract parts of the title
            let titleName = originalText;
            let rjCode = "";
            let versions = [];
            let languageTag = "";

            // Extract the language tag [ENG]
            const langTagMatch = titleName.match(/\[ENG\]/i);
            if (langTagMatch) {
                languageTag = langTagMatch[0];
                titleName = titleName.replace(langTagMatch[0], '').trim();
            }

            // Extract the RJ code
            const rjCodeMatch = titleName.match(/\(RJ\d+(?:\/RJ\d+)*\)/);
            if (rjCodeMatch) {
                rjCode = rjCodeMatch[0];
                // Replace slashes with plus signs in RJ codes
                rjCode = rjCode.replace(/\/RJ/g, '+RJ');
                titleName = titleName.replace(rjCodeMatch[0], '').trim();
            }

            // Extract all versions - improved regex to catch versions with letters (e.g., 1.0.0a)
            // Look for patterns like (v1.0), (v1.0a), (ver1.0), (Ver1.0.0a), (V1.0), etc.
            const versionRegex = /\((v|ver|Ver|V|VER|VERSION|Version)?\.?\s*(\d+(?:\.\d+)*(?:[a-z]+)?(?:\s+\d+(?:\.\d+)*(?:[a-z]+)?)*)\)/gi;

            // Find all version patterns
            let match;
            while ((match = titleName.match(versionRegex)) !== null) {
                if (!match || match.length === 0) break;

                const fullMatch = match[0];

                // Extract the version number with possible letter suffix
                const versionNumMatch = fullMatch.match(/\((?:(v|ver|Ver|V|VER|VERSION|Version))?\.?\s*([\d\s\.\w]+)\)/i);
                if (versionNumMatch) {
                    const prefixFromMatch = versionNumMatch[1] || '';
                    const versionNum = versionNumMatch[2];

                    // Set the prefix based on what was found
                    let prefix = "v"; // Default prefix

                    if (prefixFromMatch) {
                        // If it's a single letter prefix, standardize to lowercase 'v'
                        if (prefixFromMatch.toLowerCase() === 'v') {
                            prefix = "v";
                        } else {
                            // For longer prefixes like 'ver', 'version', keep them as is
                            prefix = prefixFromMatch;
                        }
                    }

                    // Replace spaces with underscores in version numbers
                    const versionNumFormatted = versionNum.replace(/\s+/g, '_');

                    // Add version to versions array with appropriate prefix
                    const formattedVersion = `${prefix}${versionNumFormatted}`;

                    // Add to versions array without additional parentheses
                    versions.push(formattedVersion);

                    // Remove this version from title name
                    titleName = titleName.replace(fullMatch, '').trim();
                }
            }

            // Check for "Uncensored" text in title and move it to versions list
            const uncensoredMatch = titleName.match(/\(Uncensored\)|[^\(]Uncensored[^\)]/i);
            let hasUncensored = false;
            if (uncensoredMatch) {
                // Удаляем Uncensored вместе со скобками, если они есть
                if (uncensoredMatch[0].includes('(Uncensored)')) {
                    titleName = titleName.replace(/\(Uncensored\)/i, '').trim();
                } else {
                    titleName = titleName.replace(/Uncensored/i, '').trim();
                }
                hasUncensored = true;
            }

            // Separate versions into regular versions and date-like versions
            const regularVersions = [];
            const dateLikeVersions = [];

            versions.forEach(version => {
                const isDate = isDateLikeVersion(version);
                if (isDate) {
                    dateLikeVersions.push(version);
                } else {
                    regularVersions.push(version);
                }
            });

            // Construct the new title in the required format
            let newTitle = "";

            // Add language tag at the very beginning if it exists
            if (languageTag) {
                newTitle += `${languageTag} `;
            }

            // Add RJ code next
            if (rjCode) {
                newTitle += `${rjCode} `;
            }

            // Add the title name
            newTitle += titleName;

            // Add UNC tag after title but before versions
            if (hasUncensored) {
                newTitle += ` UNC`;
            }

            // Add regular versions first
            if (regularVersions.length > 0) {
                newTitle += ` ${regularVersions.join(' ')}`;
            }

            // Add date-like versions at the very end
            if (dateLikeVersions.length > 0) {
                newTitle += ` ${dateLikeVersions.join(' ')}`;
            }

            // Clean the title (replace colons with tildes, remove multiple spaces)
            newTitle = cleanTitle(newTitle);

            // Update the title
            titleElement.textContent = newTitle;
        }
    }

    // Function to highlight non-ryuugames links
    function highlightNonRyuugamesLinks(container) {
        // Add styles for highlighted links
        const style = document.createElement('style');
        style.textContent = `
            .non-ryuugames-link {
                background-color: #ffeb3b;
                padding: 2px 4px;
                border-radius: 3px;
                border: 1px solid #fbc02d;
            }
        `;
        document.head.appendChild(style);

        // Find all links in the container
        const allLinks = container.querySelectorAll('a');

        allLinks.forEach(link => {
            const href = link.href.toLowerCase();
            if (!href.includes('ryuugames.com')) {
                link.classList.add('non-ryuugames-link');
            }
        });
    }

    // Function to highlight ryuugames links
    function highlightRyuugamesLinks() {
        // First find the div with dir="ltr"
        const ltrDiv = document.querySelector('div[dir="ltr"]');

        if (!ltrDiv) {
            return;
        }

        // Find all links to ryuugames.com within this div
        const ryuugamesLinks = ltrDiv.querySelectorAll('a[href*="www.ryuugames.com"]');

        if (!ryuugamesLinks || ryuugamesLinks.length === 0) {
            return;
        }

        // Get the highest parent div of the first found link
        let currentElement = ryuugamesLinks[0];
        let highestDiv = null;

        // Traverse up the DOM tree until we reach the ltr div
        while (currentElement && currentElement !== ltrDiv) {
            if (currentElement.tagName === 'DIV') {
                // Store the first div we find (it will be the highest one)
                if (!highestDiv) {
                    highestDiv = currentElement;
                }
            }
            currentElement = currentElement.parentElement;
        }

        // Highlight non-ryuugames links in the found div
        if (highestDiv) {
            highlightNonRyuugamesLinks(highestDiv);
        }
    }

    // Function to convert text URLs to clickable links
    function convertTextToLinks() {
        // Target the main content area instead of a specific container
        // This will find all possible paragraphs containing URLs
        const containers = document.querySelectorAll('.td-post-content');

        if (!containers || containers.length === 0) {
            return;
        }

        // Process each container
        containers.forEach((container, containerIndex) => {
            // Find all paragraph elements and div elements (which might contain text with URLs)
            const elements = container.querySelectorAll('p, div');

            // Regular expression to match URLs but avoid HTML tags
            // This looks for http/https/www URLs but stops matching at HTML tag characters
            const urlRegex = /(https?:\/\/[^<>\s]+)|(www\.[^<>\s]+\.[^<>\s]+)/gi;

            // Process each element
            elements.forEach((element, index) => {
                // Function to process text nodes only
                const processTextNodes = (node) => {
                    if (node.nodeType === Node.TEXT_NODE) {
                        // Only process text nodes for URL replacement
                        const textContent = node.textContent;

                        // Skip empty or whitespace-only text nodes
                        if (!textContent.trim()) {
                            return false;
                        }

                        // Check if the text contains a URL
                        if (!urlRegex.test(textContent)) {
                            urlRegex.lastIndex = 0; // Reset regex state
                            return false;
                        }

                        // Reset regex state
                        urlRegex.lastIndex = 0;

                        // Replace URLs in text
                        const newContent = textContent.replace(urlRegex, (match) => {
                            let href = match;

                            // Add https:// to URLs starting with www.
                            if (match.toLowerCase().startsWith('www.')) {
                                href = 'https://' + match;
                            }

                            // Remove .html from dlsite URLs
                            if (href.toLowerCase().includes('dlsite') && href.toLowerCase().endsWith('.html')) {
                                href = href.substring(0, href.length - 5); // Remove .html
                            }

                            return `<a href="${href}" target="_blank">${match}</a>`;
                        });

                        if (textContent !== newContent) {
                            // Create a temporary container
                            const fragment = document.createElement('div');
                            fragment.innerHTML = newContent;

                            // Replace the text node with the new content
                            const parent = node.parentNode;
                            while (fragment.firstChild) {
                                parent.insertBefore(fragment.firstChild, node);
                            }
                            parent.removeChild(node);
                            return true; // Changes were made
                        }
                    } else if (node.nodeType === Node.ELEMENT_NODE) {
                        // Skip if this is already a link or an element inside a link
                        let parent = node;
                        while (parent) {
                            if (parent.nodeName === 'A') {
                                return false;
                            }
                            parent = parent.parentNode;
                        }

                        // Recursively process child nodes
                        let changed = false;
                        Array.from(node.childNodes).forEach(child => {
                            changed = processTextNodes(child) || changed;
                        });
                        return changed;
                    }
                    return false;
                };

                // Create a clone to work with
                const elementClone = element.cloneNode(true);

                // Process all text nodes in the element
                const changed = processTextNodes(elementClone);

                // If changes were made, update the original element
                if (changed) {
                    element.innerHTML = elementClone.innerHTML;
                }
            });
        });
    }

    // Main execution function
    function main() {
        modifyTitle();
        convertTextToLinks();
        highlightRyuugamesLinks();
    }

    // Run the modification when the page is loaded
    document.addEventListener('DOMContentLoaded', main);

    // Sometimes DOMContentLoaded might have already fired, so run immediately as well
    if (document.readyState === 'loading') {
        // Document is still loading, wait for DOMContentLoaded
        document.addEventListener('DOMContentLoaded', main);
    } else {
        // Document has already loaded, run immediately
        main();
    }

})();