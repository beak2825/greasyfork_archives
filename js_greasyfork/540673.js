// ==UserScript==
// @name         DuckDuckGo Remove AI
// @namespace    http://tampermonkey.net/
// @version      2025-06-28
// @description  Removes AI functionality from duckduckgo
// @author       Cherokee Parker
// @license      MIT
// @match        *://duckduckgo.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=duckduckgo.com
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/540673/DuckDuckGo%20Remove%20AI.user.js
// @updateURL https://update.greasyfork.org/scripts/540673/DuckDuckGo%20Remove%20AI.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /**
     * Creates a Duck.ai-like link to this script
     */
    function addScriptLink() {
        const duckBar = document.getElementById("react-duckbar");
        if (duckBar) {
            const rightSideList = duckBar.children[0]?.children[0]?.children[0]?.children[0]?.children[1];
            if (rightSideList) {
                const buttons = rightSideList.getElementsByTagName("button");
                let className;
                if (buttons) {
                    className = buttons[0].className;
                }

                const newItem = document.createElement("li");
                const newLink = document.createElement("a");
                newLink.href = "https://greasyfork.org/en/scripts/540673-duckduckgo-remove-ai";
                newLink.textContent = "Fuck.ai";
                newLink.className = className;
                newItem.appendChild(newLink);
                rightSideList.insertBefore(newItem, rightSideList.firstChild);
            }
        }
    }

    // Set cookies to disable AI
    if (document.cookie.search("bg=-1") < 0 || document.cookie.search("be=0") < 0) {
        document.cookie = "bg=-1"; // This cookie disables duck.ai
        document.cookie = "be=0"; // This cookie disables AI assist
    }

    // Make it clear that the script is active with a link back to the script
    setTimeout(() => {addScriptLink()}, 500);
})();