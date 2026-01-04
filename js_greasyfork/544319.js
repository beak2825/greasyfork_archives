// ==UserScript==
// @name         Old ROBLOX Topbar Names
// @namespace    https://roblox.com
// @version      1.0
// @description  Changes Roblox topbar text to old-school names from 2016. Can be used with other old ROBLOX Themes, like Legacy Old Theme and others.
// @author       DrCoolZomboi
// @match        https://www.roblox.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/544319/Old%20ROBLOX%20Topbar%20Names.user.js
// @updateURL https://update.greasyfork.org/scripts/544319/Old%20ROBLOX%20Topbar%20Names.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // updates the links to match the names
    const replacements = {
        "Charts": { text: "Games", url: "/games" },
        "Marketplace": { text: "Catalog", url: "/catalog" },
        "Create": { text: "Develop", url: "/develop" },
        "Robux": { text: "ROBUX", url: "/my/money.aspx" } // balance page
    };

    function replaceTopbar() {
        // Select all anchor tags (links) in the topbar
        const navLinks = document.querySelectorAll('a');

        navLinks.forEach(el => {
            const originalText = el.innerText.trim();
            if (replacements.hasOwnProperty(originalText)) {
                // Change text
                el.innerText = replacements[originalText].text;
                // Update link href to the correct page
                el.href = replacements[originalText].url;
            }
        });
    }

    // Run on page load
    window.addEventListener('load', replaceTopbar);

    // Also run when DOM changes (Roblox SPA behavior)
    const observer = new MutationObserver(replaceTopbar);
    observer.observe(document.body, { childList: true, subtree: true });
})();