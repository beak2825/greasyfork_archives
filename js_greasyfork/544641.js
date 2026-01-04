// ==UserScript==
// @name         Roblox Classic Word Replacer
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  Replaces Connection(s) and Charts back to Friends and Games
// @author       Jay_0512
// @match        *://*.roblox.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/544641/Roblox%20Classic%20Word%20Replacer.user.js
// @updateURL https://update.greasyfork.org/scripts/544641/Roblox%20Classic%20Word%20Replacer.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function replaceText(text) {
        return text
            .replace(/\bSearch Connections\b/g, 'Search Friends')
            .replace(/\bConnections\b/g, 'Friends')
            .replace(/\bConnection\b/g, 'Friend')
            .replace(/\bConnect\b/g, 'Friends')
            .replace(/\bCharts\b/g, 'Games');
    }

    function replaceInTextNode(node) {
        if (node.nodeType === Node.TEXT_NODE) {
            const oldText = node.textContent;
            const newText = replaceText(oldText);
            if (newText !== oldText) {
                node.textContent = newText;
            }
        }
    }

    function replaceAttributes(node) {
        if (node.nodeType === Node.ELEMENT_NODE) {
            const attributesToCheck = ['placeholder', 'value', 'title', 'aria-label'];

            for (let attr of attributesToCheck) {
                if (node.hasAttribute(attr)) {
                    const original = node.getAttribute(attr);
                    const replaced = replaceText(original);
                    if (replaced !== original) {
                        node.setAttribute(attr, replaced);
                    }
                }
            }
        }
    }

    function walkAndReplace(node) {
        if (
            node.nodeType === Node.ELEMENT_NODE &&
            ['SCRIPT', 'STYLE', 'NOSCRIPT', 'IFRAME'].includes(node.tagName)
        ) {
            return;
        }

        replaceAttributes(node);

        if (node.nodeType === Node.TEXT_NODE) {
            replaceInTextNode(node);
        } else if (node.nodeType === Node.ELEMENT_NODE) {
            for (let child of node.childNodes) {
                walkAndReplace(child);
            }
        }
    }

    function enforceTitleReplacement() {
        const rawTitle = document.title;
        const replacedTitle = replaceText(rawTitle);
        if (rawTitle !== replacedTitle) {
            document.title = replacedTitle;
        }
    }

    // Initial run
    walkAndReplace(document.body);
    enforceTitleReplacement();

    // Observe body content for changes
    const observer = new MutationObserver(mutations => {
        for (let mutation of mutations) {
            for (let node of mutation.addedNodes) {
                walkAndReplace(node);
            }
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // Keep title updated if Roblox rewrites it
    const titleTag = document.querySelector('title');
    if (titleTag) {
        const titleObserver = new MutationObserver(() => {
            enforceTitleReplacement();
        });

        titleObserver.observe(titleTag, {
            childList: true,
            characterData: true,
            subtree: true
        });
    }

    // As extra defense, refresh title every 500ms (if they rewrite it aggressively)
    setInterval(enforceTitleReplacement, 500);

})();
