// ==UserScript==
// @name         Roblox OG Name Restorer (Ultimate Edition)
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Reverts Roblox's new naming system to OG terms (Catalog, Games, Friends, Groups)
// @author       Emree
// @match        https://*.roblox.com/*
// @grant        none
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/543648/Roblox%20OG%20Name%20Restorer%20%28Ultimate%20Edition%29.user.js
// @updateURL https://update.greasyfork.org/scripts/543648/Roblox%20OG%20Name%20Restorer%20%28Ultimate%20Edition%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const replacements = {
        "Marketplace": "Catalog",
        "Charts": "Games",
        "Connections": "Friends",
        "Connection": "Friend",
        "Connect": "Friends",
        "Communities": "Groups",
        "Community": "Group"
    };

    function replaceText(node) {
        if (node.nodeType === 3) {
            let text = node.textContent;
            let replaced = false;

            for (let [key, value] of Object.entries(replacements)) {
                if (text.includes(key)) {
                    text = text.replaceAll(key, value);
                    replaced = true;
                }
            }

            if (replaced) node.textContent = text;
        } else if (node.nodeType === 1 || node.nodeType === 9 || node.nodeType === 11) {
            for (let child of node.childNodes) {
                replaceText(child);
            }
        }
    }

    const observer = new MutationObserver(mutations => {
        for (let mutation of mutations) {
            for (let node of mutation.addedNodes) {
                replaceText(node);
            }
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    replaceText(document.body); // Initial run
})();
