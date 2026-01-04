// ==UserScript==
// @name         Discord - Do Not Mention on Replies By Default
// @version      3
// @description  Sets Mention on Reply to Off by default, and adds Alt+m as a keyboard shortcut to toggle
// @author       Suyooo
// @license      Apache-2.0
// @match        https://discordapp.com/*
// @match        https://discord.com/*
// @grant        none
// @require      http://code.jquery.com/jquery-latest.js
// @namespace https://greasyfork.org/users/825842
// @downloadURL https://update.greasyfork.org/scripts/433989/Discord%20-%20Do%20Not%20Mention%20on%20Replies%20By%20Default.user.js
// @updateURL https://update.greasyfork.org/scripts/433989/Discord%20-%20Do%20Not%20Mention%20on%20Replies%20By%20Default.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let mutationObserver = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            mutation.addedNodes.forEach( function(currentValue, currentIndex, listObj) {
                if (currentValue.nodeType == Node.ELEMENT_NODE) {
                    $("div[class*='mentionButton-'][style*='color: var(--text-link);']", currentValue).click();
                }
            });
        });
    });
    mutationObserver.observe(document.documentElement, {
        childList: true,
        subtree: true
    });

    function onKeyDown(e) {
        if (e.key == "m" && e.altKey) {
            $("div[class*='mentionButton-']").click();
        }
    }
    window.addEventListener("keydown", onKeyDown, true);
})();