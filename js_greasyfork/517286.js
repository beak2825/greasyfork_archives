// ==UserScript==
// @name        BlueSky Correct Terminology
// @description Ensures BlueSky is using the correct terminology by replacing all instances of "post" with "skeet".
// @namespace   vivelin.net
// @match       https://bsky.app/*
// @grant       none
// @version     1.0.7
// @author      Vivelin
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/517286/BlueSky%20Correct%20Terminology.user.js
// @updateURL https://update.greasyfork.org/scripts/517286/BlueSky%20Correct%20Terminology.meta.js
// ==/UserScript==
(function () {
    "use strict";

    /**
     * An object containing an array of RegExp patterns and string replacements for each language.
     */
    const allReplacements = {
        en: [
            { pattern: /\bPost(s)?\b/g, replacement: "Skeet$1" },
            { pattern: /\b([Rr]e)?post(s|ed)?\b/g, replacement: "$1skeet$2" },
        ],
    };

    /**
     * Controls whether user-generated content should be processed (true) or left alone (false, default).
     */
    const shouldReplaceSkeetContent = false;

    /**
     * Replaces the string, if necessary.
     * @param {string} text The original text to replace.
     * @param replacements An array of objects with the RegExp pattern and string replacement.
     * @returns {string} The replaced text.
     */
    function replaceText(text, replacements) {
        if (!text) return text;

        for (const replacement of replacements) {
            if (text.match(replacement.pattern)) {
                text = text.replaceAll(
                    replacement.pattern,
                    replacement.replacement,
                );
            }
        }

        return text;
    }

    /**
     * Recursively processes and replaces all instances of text.
     * @param {Node} node The node to process.
     * @returns {void}
     */
    function processNode(node, replacements) {
        node = node || document.body;

        if (node instanceof Text) {
            node.data = replaceText(node.data, replacements);
        } else if (node instanceof HTMLElement) {
            if (
                node.isContentEditable ||
                (!shouldReplaceSkeetContent &&
                    (node.dataset.wordWrap === "1" ||
                        node.dataset.testid === "profileHeaderDisplayName" ||
                        node.ariaLabel === "Expand alt text" ||
                        (node instanceof HTMLAnchorElement &&
                            node.href &&
                            node.href.match(/\/profile\//))))
            ) {
                return;
            }

            for (const child of node.childNodes) {
                processNode(child, replacements);
            }
        }
    }

    function observeCallback(_mutationList, _observer) {
        const lang = document.getElementsByTagName("html")[0].lang || "en";
        const replacements = allReplacements[lang];
        if (replacements) {
            processNode(document.body, replacements);
        }
    }

    const observer = new MutationObserver(observeCallback);
    observer.observe(document.body, { childList: true, subtree: true });
})();
