// ==UserScript==
// @name         Boss Identifier Replacer
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Replace two-letter identifiers with unique single characters in the boss map and panel without altering data-title attributes. Mark blocks with specified styles based on boss names.
// @author       Lucky11
// @match        https://www.dfprofiler.com/bossmap
// @match        https://*.dfprofiler.com/profile/view/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/544838/Boss%20Identifier%20Replacer.user.js
// @updateURL https://update.greasyfork.org/scripts/544838/Boss%20Identifier%20Replacer.meta.js
// ==/UserScript==

//Future update Idea:
// Add new logic to this script that you could set custom style depending on boss count found in block. For example
// 1 x Evolved Longarms<br />2 x Irradiated Titan<br />1 x Irradiated Wraith<br />1 x Mega Titan<br />2 x Mega Giant Spider<br />1 x Charred Mother
// "8 x Any Boss": "3px dashed yellow", //marks any boss as long as 8 in the same block.

(function() {
    'use strict';

    // Enable or disable features
    const enableIdentifierReplacement = true; // Set to false to disable identifier replacement
    const enableBossStyling = true; // Set to false to disable custom boss block styling
    const useFullTitleForStyling = true; // Set to true to use EXACT Boss block name as it is shown on BossMap for example : "4 x Bandits" check example below!
    //if it is set to false then it will extract only boss name not the count "2 x Bandits" and "4 x Bandits" would be seen as "Bandits" and the same style would apply!

    // Editable list of bosses and their corresponding styles using hex codes
    const bossStyles = {
        "4 x Bandits": "2px dashed yellow", // Yellow
        "6 x Bandits": "3px dashed #b61dc4", // Magenta
        '8 x Bandits': '3px solid red', // Red

        '4 x Six-Armed Bandit': '2px solid #bfbfbf', // Light Gray
        '4 x Nefertiti': '1px dashed white', // White

        '2 x Mother': '1.5px dashed #d97ed9', // Light Pink
        '2 x Titan': '1.5px dashed #d97ed9', // Light Pink
        '2 x Wraith': '1.5px dashed #d97ed9', // Light Pink
        '2 x Giant Spider': '1.5px dashed #d97ed9', // Light Pink

        '2 x Flaming Mother': '1px dashed #fc6603', // Orange
        '2 x Flaming Titan': '1px dashed #fc6603', // Orange
        '2 x Flaming Wraith': '1px dashed #fc6603', // Orange
        '2 x Flaming Giant Spider': '1px dashed #fc6603', // Orange
        '4 x Flaming Long Arms': '2px dashed #fc6603', // Orange
        '4 x Flaming Rumblers': '2px dashed #fc6603', // Orange
        '4 x Flaming Flesh Hound': '2px dashed #fc6603', // Orange

        '1 x Charred Titan': '3px solid #014254', // Dark Teal
        '1 x Flaming Charred Titan': '3px solid #014254', // Dark Teal

        '2 x Charred Mother': '3px solid #014254', // Dark Teal
        '2 x Charred Giant Spider': '3px solid #014254', // Dark Teal
        '2 x Charred Wraith': '3px solid #014254', // Dark Teal
        '4 x Evolved Longarms': '2px dashed #00CC64', // Green
        '3 x Irradiated Titan': '2px dashed #00CC64', // Green
        '3 x Irradiated Mother': '2px dashed #00CC64', // Green
        '3 x Irradiated Giant Spider': '2px dashed #00CC64', // Green
        '3 x Irradiated Wraith': '2px dashed #00CC64', // Green
        '3 x Mega Titan': '2px dashed #fc6603', // Orange
        '3 x Mega Mother': '2px dashed #fc6603', // Orange
        '3 x Mega Giant Spider': '2px dashed #fc6603', // Orange
        '3 x Mega Wraith': '2px dashed #fc6603', // Orange

        '1 x Volatile Leaper': '3px solid blue', // Blue
        '1 x Behemoth': '4px solid #730915', // Dark Red
        '1 x Devil Hound': '3px solid #FF0062', // Bright Pink

        // HALLOWEEN EVENT
        '1 x Pumpkin Queen': '6px solid #01F9C6', // Aqua color
        '5 x Slenderman': '1px solid #01F9C6', // Aqua color
        '5 x Pumpkin Head': '1px solid #01F9C6', // Aqua color
        '5 x Scarecrow': '1px solid #01F9C6', // Aqua color
        '5 x Werewoo': '1px solid #01F9C6', // Aqua color
    };

//     //use this type of style ("4 x Bandits") if useFullTitleForStyling is set to true
//     const bossStyles = {
//         "4 x Bandits": "1.5px dashed red",//if const useFullTitleForStyling = true; then would be "4 x Bandits" instead of "Bandits"
//         "8 x Bandits": "2px dotted #11FfEE",//if const useFullTitleForStyling = true; then would be "4 x Bandits" instead of "Bandits"
//         '4 x Six-Armed Bandit':'1.5px dashed #B29991',
//         'Quick Reaction Force':'1.5px solid #646464',
//         //"Flaming": "2px solid #27BEF5",// If only a part of Boss name is used like "Flaming" then it will change Style for all "Flaming" Bosses like "Flaming Spider", "Flaming Titan" etc...
//      };

//     //use this type of style "Bandits" marks all bandits regardless of their count if useFullTitleForStyling is set to false!!!
//     const bossStyles = {
//         "Bandits": "1px dashed red",//if const useFullTitleForStyling = true; then would be "4 x Bandits" instead of "Bandits"
//         'Six-Armed Bandit':'1px dashed yellow',
//         //"Flaming": "2px solid #27BEF5",// If only a part of Boss name is used like "Flaming" then it will change Style for all "Flaming" Bosses like "Flaming Spider", "Flaming Titan" etc...
//      };
    // Function to generate unique single-character replacements
    const generateUniqueChars = (startChar) => {
        const usedChars = new Set();
        const replacements = {};
        let charCode = startChar.charCodeAt(0);

        return (key) => {
            if (!replacements[key]) {
                while (usedChars.has(String.fromCharCode(charCode))) {
                    charCode++;
                }
                const newChar = String.fromCharCode(charCode);
                usedChars.add(newChar);
                replacements[key] = newChar;
                charCode++;
            }
            return replacements[key];
        };
    };

    const getLowercaseChar = generateUniqueChars('a'); // For class="preboss"
    const getUniqueChar = generateUniqueChars('A'); // For class="oldboss"

    // Function to replace identifiers in the boss panel and map
    const replaceIdentifiers = () => {
        if (enableIdentifierReplacement) {
            const bossTableRows = document.querySelectorAll('#cur_bosses tbody tr');
            const identifiers = new Set();

            // Collect identifiers from the boss panel
            bossTableRows.forEach(row => {
                const slot = row.cells[0].textContent.trim();
                if (slot.length === 2) {
                    identifiers.add(slot);
                }
            });

            // Replace identifiers in the boss panel
            bossTableRows.forEach(row => {
                const slot = row.cells[0];
                if (identifiers.has(slot.textContent.trim())) {
                    const newChar = getUniqueChar(slot.textContent.trim());
                    slot.textContent = newChar;
                }
            });

            // Replace identifiers on the map
            const mapCells = document.querySelectorAll('#boss-table .coord');
            mapCells.forEach(cell => {
                const spans = cell.querySelectorAll('span');
                spans.forEach(span => {
                    const currentText = span.textContent.trim();

                    // Check if the current text matches any identifier
                    if (identifiers.has(currentText)) {
                        if (cell.querySelector('.preboss')) {
                            // Keep class="preboss" and use lowercase letters
                            const newChar = getLowercaseChar(currentText);
                            span.textContent = newChar;
                        } else if (cell.querySelector('.oldboss')) {
                            // Keep class="oldboss" and use unique characters
                            const newChar = getUniqueChar(currentText);
                            span.textContent = newChar;
                        } else {
                            // Default replacement for other cases
                            const newChar = getUniqueChar(currentText);
                            span.textContent = newChar; // Only change the visible text
                        }
                    }
                });
            });
        }
    };

    // Function to apply boss styling
    const applyBossStyling = () => {
        if (!enableBossStyling) return; // Exit if styling is disabled

        const mapCells = document.querySelectorAll('#boss-table .coord');
        mapCells.forEach(cell => {
            // Use full data-title or just the boss name based on user preference
            const bossName = useFullTitleForStyling ? cell.dataset.title : cell.dataset.title.split(" x ")[1] || cell.dataset.title; // Extract boss name from data-title
            const trimmedBossName = bossName.trim(); // Trim any extra spaces

            // Check for exact matches in the bossStyles object
            let appliedStyle = "";
            for (const [key, style] of Object.entries(bossStyles)) {
                if (useFullTitleForStyling) {
                    // Check for exact match when using full title
                    if (trimmedBossName === key) {
                        appliedStyle = style; // Set the style to apply
                        break; // Exit the loop once a match is found
                    }
                } else {
                    // Check for partial matches when not using full title
                    if (trimmedBossName.includes(key)) {
                        appliedStyle = style; // Set the style to apply
                        break; // Exit the loop once a match is found
                    }
                }
            }

            cell.style.border = appliedStyle; // Apply the corresponding style

            // Remove red border if the cell has the oldboss class
            if (cell.querySelector('.oldboss')) {
                cell.style.border = ""; // Clear the border
            }
        });
    };

    // Function to handle both identifier replacement and styling
    const handleBossUpdates = () => {
        replaceIdentifiers(); // Call to replace identifiers
        applyBossStyling(); // Call to apply boss styling
    };

    // Initial replacement and styling on page load
    handleBossUpdates();

    // Mutation observer to handle dynamic updates
    const observer = new MutationObserver(handleBossUpdates);
    observer.observe(document.body, { childList: true, subtree: true });
})();
