// ==UserScript==
// @name         MilkyWayIdle MB Meme Maker
// @namespace    http://tampermonkey.net/
// @version      1.7.1
// @description  Moodify the content of MWI
// @author       Guzzelchen
// @match        https://www.milkywayidle.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/529529/MilkyWayIdle%20MB%20Meme%20Maker.user.js
// @updateURL https://update.greasyfork.org/scripts/529529/MilkyWayIdle%20MB%20Meme%20Maker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Global array of search-replacement pairs
    const itemreplacements = [
        { search: /^Purple\'s/g, replacement: "Lurpa\'s" },
        { search: /Coin/g, replacement: "Morpcoin" },
        { search: /Star Fragment/g, replacement: "Mooney Essence" },
        { search: /^Pearl/g, replacement: "Eww Pearls" },
        { search: /Book/g, replacement: "Portapotty" },
        { search: /Moderator/g, replacement: "Mooderator" },
        { search: /^Cowbell/g, replacement: "Combuff Token" },
        { search: /^Bag of 10 Cowbells/g, replacement: "Bag of 10 Combuff Token" },
        { search: /Frost Staff/g, replacement: "Maiden\'s Scourge" },
        { search: /Turuto/g, replacement: "Dr. L. Roxxx" },
        { search: /Holy/g, replacement: "Cheddar" },
        { search: /Shoebill Shoes/g, replacement: "Shoobs" },
    ];

    const uireplacements = [
        { search: /General/g, replacement: "#UwU" },
        { search: /Marketplace/g, replacement: "Champ\'s Warehouse" },
        { search: /Brewing/g, replacement: "Brewscamming" },
        { search: /Tasks/g, replacement: "Peak Gameplay" },
        { search: /tasks/g, replacement: "peak gameplay" },
        { search: /task /g, replacement: "peak gameplay" },
        { search: /Alchemy/g, replacement: "Philo Gamba" },
        { search: /Enhancing/g, replacement: "OG Gamba" },
        { search: /^Intelligence/g, replacement: "Smort" },
        { search: /^Power/g, replacement: "Pow-Woah" },
        { search: /^Ranged$/g, replacement: "Ranged OP" },
        { search: /^Cowbell/g, replacement: "Combuff" },
    ];

    function replaceTextInElement(element, replacements) {
        if (!element) return;

        element.childNodes.forEach(node => {
            if (node.nodeType === Node.TEXT_NODE) {
                // Apply all replacements for the current text node
                let newText = node.nodeValue;
                replacements.forEach(({ search, replacement }) => {
                    newText = newText.replace(search, replacement);
                });
                node.nodeValue = newText;
            } else if (node.nodeType === Node.ELEMENT_NODE) {
                replaceTextInElement(node, replacements);
            }
        });
    }


    // Function to modify content on the page
    function modifyContent() {
        // Select elements to modify
        const selectors = [
            "div[class^='TasksPanel_purplesGift']",
            "[class^='Item_name']",
            "[class^='ItemTooltipText_name']",
            "[class^='ItemDictionary_title']",
            "[class^='CharacterName_name']",
        ];

        selectors.forEach(selector => {
            document.querySelectorAll(selector).forEach(element => {
                replaceTextInElement(element,itemreplacements);
            });
        });

        const uiselectors = [
            "span.MuiBadge-root",
            "span[class^='NavigationBar_label']",
            "div[class^='Skill_name']",
            "div[class^='NavigationBar_name']",
            "div[class^='GameGuideContent_gameGuideContent']",
        ];

        uiselectors.forEach(uiselector => {
            document.querySelectorAll(uiselector).forEach(element => {
                replaceTextInElement(element,uireplacements);
            });
        });
    }

    let lastRun = 0;
    function throttleModifyContent() {
        const now = Date.now();
        if (now - lastRun > 20) {
            modifyContent(); // Execute modifyContent if 20ms have passed since last run
            lastRun = now; // Update lastRun time to now
        }
    }

    // Run the modification initially
    modifyContent();

    // Observe the page for dynamic changes
    const observer = new MutationObserver(throttleModifyContent);
    observer.observe(document.body, { childList: true, subtree: true });
})();