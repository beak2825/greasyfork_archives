// ==UserScript==
// @name         Trello link replacer
// @namespace    http://tampermonkey.net/
// @match        https://phabricator.clockwise.info/*
// @description  Function to replace text matching (c/ID) with a link
// @version 0.0.1.20241216091059
// @downloadURL https://update.greasyfork.org/scripts/520877/Trello%20link%20replacer.user.js
// @updateURL https://update.greasyfork.org/scripts/520877/Trello%20link%20replacer.meta.js
// ==/UserScript==

// Function to replace text matching (c/ID) with a link
setTimeout(() => {
    const replaceTrelloLinks = () => {
        // Regex to match (c/ID) pattern
        const regex = /\(c\/([a-zA-Z0-9]+)\)/g;

        // Recursive function to process text nodes
        const processNode = (node) => {
            if (node.nodeType === Node.TEXT_NODE) {
                const matches = [...node.textContent.matchAll(regex)];

                if (matches.length > 0) {
                    const parent = node.parentNode;
                    const fragments = [];
                    let lastIndex = 0;

                    matches.forEach((match) => {
                        const [fullMatch, id] = match;
                        const startIndex = match.index;

                        // Text before the match
                        if (startIndex > lastIndex) {
                            fragments.push(document.createTextNode(node.textContent.slice(lastIndex, startIndex)));
                        }

                        // Create the link
                        const link = document.createElement("a");
                        link.href = `https://trello.com/c/${id}`;
                        link.textContent = fullMatch;
                        fragments.push(link);

                        lastIndex = startIndex + fullMatch.length;
                    });

                    // Text after the last match
                    if (lastIndex < node.textContent.length) {
                        fragments.push(document.createTextNode(node.textContent.slice(lastIndex)));
                    }

                    // Replace the original text node with the new content
                    fragments.forEach((fragment) => parent.insertBefore(fragment, node));
                    parent.removeChild(node);
                }
            } else if (node.nodeType === Node.ELEMENT_NODE) {
                // Avoid replacing text inside <a> tags
                if (node.tagName.toLowerCase() !== "a") {
                    Array.from(node.childNodes).forEach(processNode);
                }
            }
        };

        // Start processing the body of the document
        Array.from(document.body.childNodes).forEach(processNode);
    };

    replaceTrelloLinks();
}, 500);
