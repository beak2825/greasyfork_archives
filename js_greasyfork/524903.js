// ==UserScript==
// @name         PoE2 Trade Copy Item Button
// @version      1.0
// @description  Adds a button to the PoE2 Trade page that allows you to copy the item description and affixes to your clipboard.
// @author       Kevin M
// @namespace    meinon.de
// @license      MIT
// @match        https://www.pathofexile.com/trade2/*
// @icon         https://www.google.com/s2/favicons?domain=pathofexile.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/524903/PoE2%20Trade%20Copy%20Item%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/524903/PoE2%20Trade%20Copy%20Item%20Button.meta.js
// ==/UserScript==

(function () {
    'use strict';
    const processedRows = new Set();

    function processRow(row) {
        if (processedRows.has(row)) return;

        try {
            const leftDiv = row.querySelector('div.left');
            if (!leftDiv || !leftDiv.children || leftDiv.children.length < 2) {
                return;
            }

            var copy_button = leftDiv.children[1];
            copy_button.className = "copy";
            copy_button.removeAttribute("style");

            copy_button.addEventListener('click', function () {
                const itemHeader = row.querySelector('div.itemHeader.doubleLine') ?? row.querySelector('div.itemHeader');
                const content = row.querySelector('div.content');

                if (!itemHeader || !content) {
                    console.log('Item header or content not found');
                    return;
                }

                let outputText = '';

                const typeLineElem = itemHeader.querySelector('.itemName.typeLine .lc');
                const itemNameElem = itemHeader.querySelector('.itemName:not(.typeLine) .lc');

                const normal = row.querySelector('.normalPopup');
                const magic = row.querySelector('.magicPopup');
                const rare = row.querySelector('.rarePopup');
                const unique = row.querySelector('.uniquePopup');

                if (normal) {
                    console.log('normal');
                    outputText += `Rarity: Normal\n`;
                }
                else if (magic) {
                    console.log('magic');
                    outputText += `Rarity: Magic\n`;
                }
                else if (rare) {
                    console.log('rare');
                    outputText += `Rarity: Rare\n`;
                }
                else if (unique) {
                    console.log('unique');
                    outputText += `Rarity: unique\n`;
                }

                if (itemNameElem) {
                    outputText += `${itemNameElem.innerText}\n`;
                }

                // Add type line
                if (typeLineElem) {
                    outputText += `${typeLineElem.innerText}\n`;
                }

                //Quality
                const quality = content.querySelector('span[data-field="quality"] .colourAugmented');
                if (quality) {
                    outputText += '--------\n';
                    outputText += `Quality: ` + quality.innerText + ' (augmented)\n';
                }

                // Requirements
                const requirements = content.querySelector('.requirements');
                if (requirements) {
                    outputText += '--------\n';
                    outputText += 'Requirements:\n';
                    let level = requirements.querySelector('span[data-field="lvl"] .colourDefault').innerText;
                    let str = requirements.querySelector('span[data-field="str"] .colourDefault');
                    let int = requirements.querySelector('span[data-field="int"] .colourDefault');
                    let dex = requirements.querySelector('span[data-field="dex"] .colourDefault');

                    outputText += `Level: ${level}\n`;

                    if (str) {
                        str = 'Str: ' + str.innerText;
                        outputText += str + '\n';
                    }
                    if (int) {
                        int = 'Int: ' + int.innerText;
                        outputText += int + '\n';
                    }
                    if (dex) {
                        dex = 'Dex: ' + dex.innerText;
                        outputText += dex + '\n';
                    }
                    outputText += '--------\n';
                }

                // Sockets
                const socketsDiv = leftDiv.querySelector('.sockets');

                if (socketsDiv && socketsDiv.children.length > 0) {

                    outputText += `Sockets: ${"S ".repeat(socketsDiv.childElementCount)}\n`;
                    outputText += '--------\n';
                }

                // Item Level
                const itemLevel = content.querySelector('.itemLevel');
                if (itemLevel) {
                    outputText += itemLevel.innerText.trim() + '\n';
                    outputText += '--------\n';
                }

                // Enchantments
                const enchantments = content.querySelectorAll('.enchantMod');
                if (enchantments.length > 0) {
                    let enchantSection = [];
                    enchantments.forEach(enchant => {
                        let text = enchant.innerText.trim();
                        enchantSection.push(text + ' (enchant)');
                    });
                    outputText += enchantSection.join('\n') + '\n';
                    outputText += '--------\n';
                }

                // Implicit mods
                const runeMods = content.querySelectorAll('.runeMod');

                if (runeMods.length > 0) {
                    let implicitSection = [];
                    runeMods.forEach(rune => {
                        let text = rune.innerText.trim();
                        implicitSection.push(text + ' (rune)');
                    });
                    outputText += implicitSection.join('\n') + '\n';
                    outputText += '--------\n';
                }

                // Implicit mods
                const implicitMods = content.querySelectorAll('.implicitMod');

                if (implicitMods.length > 0) {
                    let implicitSection = [];
                    // outputText += `Implicits: ${implicitMods.length}\n`;
                    implicitMods.forEach(implicit => {
                        let text = implicit.innerText.trim();
                        implicitSection.push(text + ' (implicit)');
                    });
                    outputText += implicitSection.join('\n') + '\n';
                    outputText += '--------\n';
                }

                // Explicit mods
                const explicitMods = content.querySelectorAll('.explicitMod');
                if (explicitMods.length > 0) {
                    let modSection = [];
                    explicitMods.forEach(mod => {
                        let text = mod.querySelector('.lc.s').innerText.trim();
                        modSection.push(text);
                    });
                    outputText += modSection.join('\n') + '\n';
                }

                // Corrupted state
                const corrupted = content.querySelector('.unmet');
                if (corrupted) {
                    outputText += '--------\n';
                    outputText += corrupted.innerText + '\n';
                }

                const priceNote = content.querySelector('.textCurrency');
                if (priceNote && priceNote.innerText.includes('~price')) {
                    outputText += '--------\n';
                    outputText += `Note: ${priceNote.innerText.replace('~price', '').trim()}`;
                    outputText += '\n';
                }

                navigator.clipboard.writeText(outputText);
            });

            processedRows.add(row);
        } catch (e) {
            console.error('Error processing row:', e);
        }
    }

    const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            for (const node of mutation.addedNodes) {
                if (node.nodeType === 1 && node.classList.contains('row')) {
                    if (!node.querySelector('div.itemHeader')) continue;
                    processRow(node);
                }
            }
        }
    });

    document.querySelectorAll('div.row').forEach(row => {
        if (row.querySelector('div.itemHeader')) {
            processRow(row);
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();