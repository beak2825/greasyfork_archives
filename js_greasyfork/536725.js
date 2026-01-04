// ==UserScript==
// @name         MilkyWayIdle MB Meme Maker
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Moodify the content of MWI
// @author       Guzzelchen (remade by MrLeafYT/JuniorLeafYT)
// @match        https://www.milkywayidle.com/*
// @grant        none
// @license      none
// @downloadURL https://update.greasyfork.org/scripts/536725/MilkyWayIdle%20MB%20Meme%20Maker.user.js
// @updateURL https://update.greasyfork.org/scripts/536725/MilkyWayIdle%20MB%20Meme%20Maker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Global array of search-replacement pairs
    const itemreplacements = [
        { search: /Egg/g, replacement: "Krill" },
        { search: /Wheat/g, replacement: "Oil Fish" },
        { search: /Sugar/g, replacement: "Baggie Full of Meth And Likely Cocaine" },
        { search: /Cotton/g, replacement: "Flying Fish" },
        { search: /Farmland/g, replacement: "The Bay of Langway" },
        { search: /Foraging/g, replacement: "Fishing Pond "},
        { search: /Task Token/g, replacement: "Purple Poin"},
        { search: /totaldomination7/g, replacement: "smart (totaldomination7)"},


     ];

    const uireplacements = [
        { search: /Egg/g, replacement: "Krill" },
        { search: /Wheat/g, replacement: "Oil Fish" },
        { search: /Sugar/g, replacement: "Baggie full of Meth And Likely Cocaine" },
        { search: /Cotton/g, replacement: "Flying Fish" },
        { search: /Farmland/g, replacement: "The Bay of Langway" },
        { search: /Foraging/g, replacement: "Fishing Pond "},
        { search: /Tasks/g, replacement: " "},


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