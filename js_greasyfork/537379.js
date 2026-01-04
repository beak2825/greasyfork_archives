// ==UserScript==
// @name         Fishing Update
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  Tired of waiting for the new update to come? Y'know, the Combat-Revamp? Or just an update at all? Well look no further then the Fishing Update script!! In this script, all your foraging things will be gone! And be replaced with.. FISH! Yup thats right! Fish! Try out the new Celestial Fishing Rod today! Or maybe try catching some Wahoos with 100% chance to find them! Or even try on the new Flying Boots! There literally just Cotten Boots but renamed because this script does that! So try it today!!
// @author       sentientmilk and JuniorLeafYT
// @match        https://www.milkywayidle.com/*
// @icon         https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/93cb2394-db3d-4c6f-8393-d493a2aa1323/dgoun7r-5af608ef-17a2-46e1-9493-dd12ad544eac.png/v1/fit/w_637,h_572/pufferfish_eating_a_carrot__png__by_wessieboi99_dgoun7r-375w-2x.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9NTcyIiwicGF0aCI6IlwvZlwvOTNjYjIzOTQtZGIzZC00YzZmLTgzOTMtZDQ5M2EyYWExMzIzXC9kZ291bjdyLTVhZjYwOGVmLTE3YTItNDZlMS05NDkzLWRkMTJhZDU0NGVhYy5wbmciLCJ3aWR0aCI6Ijw9NjM3In1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmltYWdlLm9wZXJhdGlvbnMiXX0.30WQXsNizRtJuEcPNOyjaClcvIRx1WC6YU3mNzjktzM
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/537379/Fishing%20Update.user.js
// @updateURL https://update.greasyfork.org/scripts/537379/Fishing%20Update.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Fishify
    const itemreplacements = [
        { search: /Egg/g, replacement: "Christmas Wrasse"},
        { search: /Wheat/g, replacement: "Bathophilus Filifer"},
        { search: /Sugar/g, replacement: "Jew Fish"},
        { search: /Cotton/g, replacement: "Flying Fish"},
        { search: /Blueberry/g, replacement: "Blåhaj"},
        { search: /Apple/g, replacement: "Coryphopterus Hyalinus"},
        { search: /Arabica Coffee Bean/g, replacement: "Polygon Moray"},
        { search: /Flax/g, replacement: "Atlantic Tarpon"},
        { search: /Blackberry/g, replacement: "Icefish"},
        { search: /Orange/g, replacement: "Squid"},
        { search: /Robusta Coffee Bean/g, replacement: "Seagull"},
        { search: /Strawberry/g, replacement: "Humpback Dolphin"},
        { search: /Plum/g, replacement: "Sperm Whale"},
        { search: /Liberica Coffee Bean/g, replacement: "Green Sea Turtle"},
        { search: /Bamboo Branch/g, replacement: "Snowflake Moray"},
        { search: /Mooberry/g, replacement: "Tuna"},
        { search: /Peach/g, replacement: "Sardine"},
        { search: /Excelsa Coffee Bean/g, replacement: "Billfish"},
        { search: /Cocoon/g, replacement: "Wahoo"},
        { search: /Marsberry/g, replacement: "Bluestripe Snapper"},
        { search: /Dragon Fruit/g, replacement: "Coral Grouper"},
        { search: /Fieriosa Coffee Bean/g, replacement: "Clown Triggerfish"},
        { search: /Spaceberry/g, replacement: "Pacific Herring"},
        { search: /Star Fruit/g, replacement: "Japenese Bigeye Bream"},
        { search: /Spacia Coffee Bean/g, replacement: "Black Spotted Trevally"},
        { search: /Radiant Fiber/g, replacement: "Shrimp"},


     ];

    const uireplacements = [
        { search: /Foraging/g, replacement: "Fishing Pond"},
        { search: /Farmland/g, replacement: "Pacific Ocean" },
        { search: /Egg/g, replacement: "Christmas Wrasse"},
        { search: /Wheat/g, replacement: "Bathophilus Filifer"},
        { search: /Sugar/g, replacement: "Jew Fish"},
        { search: /Cotton/g, replacement: "Flying Fish"},
        { search: /Shimmering Lake/g, replacement: "Atlantic Ocean"},
        { search: /Blueberry/g, replacement: "Blåhaj"},
        { search: /Apple/g, replacement: "Coryphopterus Hyalinus"},
        { search: /Arabica Coffee Bean/g, replacement: "Polygon Moray"},
        { search: /Flax/g, replacement: "Atlantic Tarpon"},
        { search: /Misty Forest/g, replacement: "Arctic Ocean"},
        { search: /Blackberry/g, replacement: "Icefish"},
        { search: /Orange/g, replacement: "Squid"},
        { search: /Robusta Coffee Bean/g, replacement: "Seagull"},
        { search: /Burble Beach/g, replacement: "Indian Ocean"},
        { search: /Strawberry/g, replacement: "Humpback Dolphin"},
        { search: /Plum/g, replacement: "Sperm Whale"},
        { search: /Liberica Coffee Bean/g, replacement: "Green Sea Turtle"},
        { search: /Bamboo Branch/g, replacement: "Snowflake Moray"},
        { search: /Silly Cow Valley/g, replacement: "Arabian Sea"},
        { search: /Mooberry/g, replacement: "Tuna"},
        { search: /Peach/g, replacement: "Sardine"},
        { search: /Excelsa Coffee Bean/g, replacement: "Billfish"},
        { search: /Cocoon/g, replacement: "Wahoo"},
        { search: /Olympus Mons/g, replacement: "Coral Sea"},
        { search: /Marsberry/g, replacement: "Bluestripe Snapper"},
        { search: /Dragon Fruit/g, replacement: "Coral Grouper"},
        { search: /Fieriosa Coffee Bean/g, replacement: "Clown Triggerfish"},
        { search: /Asteroid Belt/g, replacement: "South China Sea"},
        { search: /Spaceberry/g, replacement: "Pacific Herring"},
        { search: /Star Fruit/g, replacement: "Japenese Bigeye Bream"},
        { search: /Spacia Coffee Bean/g, replacement: "Black Spotted Trevally"},
        { search: /Radiant Fiber/g, replacement: "Shrimp"},
    // Fishified

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
            "div[class^='SkillAction_name__2VPXa']",
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