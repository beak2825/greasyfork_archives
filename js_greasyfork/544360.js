// ==UserScript==
// @name         Roblox - Replace "Connections" and "Connect" with "Friends"
// @namespace    https://roblox.com
// @version      1.01
// @description  Replaces "Connections" and "Connect" with "Friends" on Roblox, including page title
// @author       Synocism
// @license     MIT
// @match        https://www.roblox.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/544360/Roblox%20-%20Replace%20%22Connections%22%20and%20%22Connect%22%20with%20%22Friends%22.user.js
// @updateURL https://update.greasyfork.org/scripts/544360/Roblox%20-%20Replace%20%22Connections%22%20and%20%22Connect%22%20with%20%22Friends%22.meta.js
// ==/UserScript==

(function() {
    function replaceText() {
        const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
        let node;
        while ((node = walker.nextNode())) {
            // Replace exact matches
            node.nodeValue = node.nodeValue
                .replace(/\bConnections\b/g, "Friends")
                .replace(/\bConnect\b/g, "Friends")
            .replace(/\bAdd Connection\b/g, "Add Friend")
            .replace(/\Remove Connection\b/g, "Remove Friend")
            .replace(/\bSearch Connections\b/g, "Search Friends");
        }
    }

    function replaceTitle() {
        if (document.title.includes("Connections")) {
            document.title = document.title.replace("Connections", "Friends");
        }
        if (document.title.includes("Connect")) {
            document.title = document.title.replace("Connect", "Friends");
        }
    }

    // Initial run
    replaceText();
    replaceTitle();

    // Rerun on DOM changes
    const observer = new MutationObserver(() => {
        replaceText();
        replaceTitle();
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();