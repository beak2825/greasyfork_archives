// ==UserScript==
// @name         Loadout Reveal
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  NST: Loadout reveal for those in gunshops
// @author       Hwa [2466470]
// @match        https://www.torn.com/loader.php?sid=attack*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        none
// @license      Attribution-NonCommercial-NoDerivatives 4.0 International
// @downloadURL https://update.greasyfork.org/scripts/537558/Loadout%20Reveal.user.js
// @updateURL https://update.greasyfork.org/scripts/537558/Loadout%20Reveal.meta.js
// ==/UserScript==


(function() {
    'use strict';

    // Wait until a selector exists anywhere
    function waitForSelector(selector, callback, root = document.body) {
        const el = root.querySelector(selector);
        if (el) return callback(el);

        const observer = new MutationObserver((mutations, obs) => {
            const el = root.querySelector(selector);
            if (el) {
                obs.disconnect();
                callback(el);
            }
        });

        observer.observe(root, { childList: true, subtree: true });
    }

    // extract armor
    function extractArmor(playerEl) {
        if (!playerEl) {
            return {
                Helmet: "N/A",
                Chest: "N/A",
                Gloves: "N/A",
                Pants: "N/A",
                Boots: "N/A"
            };
        }

        const armorAreas = playerEl.querySelectorAll('area') || [];
        const armor = {};

        ['Helmet','Chest','Gloves','Pants','Boots'].forEach(part => {
            const area = Array.from(armorAreas).find(a => a.alt === part);
            armor[part] = area ? (area.title || "N/A") : "N/A";
        });

        return armor;
    }

    // Extract armor prefix
    function getArmorPrefix(armor) {
        if (!armor || typeof armor !== 'object') return null;

        const parts = ['Helmet','Chest','Gloves','Pants','Boots'];
        const names = parts.map(part => {
            return armor[part] ?? null;
        });

        if (names.some(n => n === null)) return null;
        if (names.every(n => n === "N/A")) return "No Armor";

        if (names.some(n => n === "N/A")) return null;

        const prefixes = names.map(name => String(name).split(' ')[0]);
        return prefixes.every(p => p === prefixes[0]) ? prefixes[0] : null;
    }

    // extract weapons
    function extractWeapons(playerEl) {
        const weaponListDiv = playerEl.querySelector('[class^="weaponList"]');
        if (!weaponListDiv) return {};

        const weapons = {};
        const mapNames = {
            weapon_main: "Primary",
            weapon_second: "Secondary",
            weapon_melee: "Melee"
        };

        ['weapon_main', 'weapon_second', 'weapon_melee'].forEach(id => {
            const div = weaponListDiv.querySelector(`#${id}`);

            if (!div) {
                // No weapon present
                weapons[mapNames[id]] = "N/A";
                return;
            }

            // Weapon name
            const img = div.querySelector('figure img');
            const weaponName = img?.alt || "N/A";

            // Damage
            const damage = div.querySelector('span[id^="damage-value_"]')?.textContent?.trim() || "N/A";

            // -------- SAFE ACCURACY RESOLUTION --------
            let accuracyEl =
                div.querySelector('span[id^="accuracy_"]') ||
                div.querySelector('span[id^="accuracy_defender_"]') ||
                document.querySelector('[id="accuracy_defender_melee"]') ||
                document.querySelector('[id="accuracy_defender_secondary"]') ||
                document.querySelector('[id="accuracy_defender_primary"]');

            const accuracy = accuracyEl?.textContent?.trim() || "N/A";
            // ------------------------------------------

            // Attachments
            const bonus_attachments = Array.from(div.querySelectorAll('[data-bonus-attachment-title]'))
            .map(i => ({
                title: i.getAttribute('data-bonus-attachment-title') || "",
                description: i.getAttribute('data-bonus-attachment-description') || ""
            }))
            .filter(b => b.title);

            // Save weapon block
            weapons[mapNames[id]] = {
                weapon: weaponName,
                damage,
                accuracy,
                bonus_attachments
            };
        });

        // TEMP WEAPON — completely safe
        const tempImg =
              weaponListDiv.querySelector('#weapon_temp figure img') ||
              weaponListDiv.querySelector('#weapon_temp img');

        weapons.Temp = tempImg?.alt || "N/A";

        return weapons;
    }

    // Format weapon info
    function formatWeaponData(weaponData) {
        if (!weaponData || typeof weaponData !== 'object' || !weaponData.weapon) return "N/A";

        let text = `${weaponData.weapon}, damage: ${weaponData.damage}, accuracy: ${weaponData.accuracy}`;
        if (Array.isArray(weaponData.bonus_attachments) && weaponData.bonus_attachments.length) {
            text += '<br>Bonuses:';
            for (const bonus of weaponData.bonus_attachments) {
                text += `<br>- ${bonus.title} (${bonus.description.replace('+','').trim()})`;
            }
        }
        return text;
    }

    // Create table with copy button
    function createDataTable(dataObj) {
        const container = document.createElement('div');
        container.style.display = 'flex';
        container.style.alignItems = 'flex-start';
        container.style.marginBottom = '10px';
        container.style.gap = '10px';

        const table = document.createElement('table');
        table.style.borderCollapse = 'collapse';
        table.style.background = '#111';
        table.style.color = '#fff';
        table.style.fontFamily = 'monospace';
        table.style.zIndex = '9999';
        table.style.position = 'relative';

        for (const [key, value] of Object.entries(dataObj)) {
            const row = document.createElement('tr');

            const keyCell = document.createElement('td');
            keyCell.textContent = key;
            keyCell.style.border = '1px solid #888';
            keyCell.style.padding = '4px';
            keyCell.style.background = '#222';
            keyCell.style.color = '#fff';

            const valueCell = document.createElement('td');
            if (value && typeof value === 'object' && value.weapon) {
                valueCell.innerHTML = formatWeaponData(value);
            } else {
                valueCell.textContent = value;
            }
            valueCell.style.border = '1px solid #888';
            valueCell.style.padding = '4px';
            valueCell.style.background = '#333';
            valueCell.style.color = '#fff';

            row.appendChild(keyCell);
            row.appendChild(valueCell);
            table.appendChild(row);
        }

        const button = document.createElement('button');
        button.textContent = 'Copy';
        button.style.marginLeft = '5px';
        button.style.padding = '2px 5px';
        button.style.backgroundColor = '#444';
        button.style.color = '#fff';
        button.style.border = '1px solid #888';
        button.style.borderRadius = '4px';
        button.style.cursor = 'pointer';
        button.style.fontFamily = 'monospace';
        button.style.fontSize = '14px';

        button.addEventListener('click', () => {
            const rows = Array.from(table.querySelectorAll('tr')).map(row => {
                const cells = row.querySelectorAll('td');
                return `${cells[0].textContent}: ${cells[1].innerText}`;
            });

            // Extract name from first row
            const playerName = rows[0].split(':')[1].trim();

            // Remove the Name row from the output
            const filteredRows = rows.slice(1);

            const header = `=== NST Loadout Reveal (${playerName}) ===`;
            const footer = "======";

            const finalText = `${header}\n\n${filteredRows.join('\n')}\n\n${footer}`;

            navigator.clipboard.writeText(finalText).then(() => {
                button.textContent = 'Copied!';
                setTimeout(() => button.textContent = 'Copy', 2000);
            });
        });

        container.appendChild(table);
        container.appendChild(button);
        return container;
    }

    // Insert table
    function insertTable(data) {
        const container = document.querySelector('[class^="coreWrap"]');
        if (!container) return;
        const afterEl = container.querySelector('[class^="logStatsWrap__"]');
        const tableEl = createDataTable(data);
        afterEl ? afterEl.after(tableEl) : container.appendChild(tableEl);

        return container;
    }

    // Extract data from a player element
    function extractData(playerEl, nameEl) {
        // Armor
        const armor = extractArmor(playerEl);
        const armorPrefix = getArmorPrefix(armor);

        // Weapons
        const weapons = extractWeapons(playerEl);

        const data = {
            ...(armorPrefix ? { 'Full Set': armorPrefix } : armor),
            ...weapons,
        };

        return data;
    }

    // ------------- MOBILE ONLY ---------------
    function getPageType() {
        // Look for any weapon slot element
        const weaponEl = document.querySelector('[id^="weapon_main"]');

        if (!weaponEl) return 'unknown';

        // If the weapon element is for the defender, we’re on the second tab
        const isDefender = Array.from(weaponEl.classList).some(c => c.includes('defender_'));

        if (isDefender) {
            return 'second'; // Defender's weapon view (switched tab)
        }

        return 'first'; // Default (defender armor + your weapons)
    }

    function observeMobileWeapons(callback) {
        const containerSelector = 'div[class^="weaponList_"]';

        const tryAttach = () => {
            const container = document.querySelector(containerSelector);
            if (!container) {
                console.warn("Weapon container not found yet, retrying...");
                setTimeout(tryAttach, 500);
                return;
            }

            const observer = new MutationObserver(mutations => {
                for (const mutation of mutations) {
                    // Only look for added nodes
                    if (mutation.type === 'childList' && mutation.addedNodes.length) {
                        mutation.addedNodes.forEach(node => {
                            if (!(node instanceof HTMLElement)) return;
                            const weaponMain = node.id?.startsWith('weapon_main') ? node : node.querySelector('[id^="weapon_main"]');
                            if (!weaponMain) return;

                            const isDefender = Array.from(weaponMain.classList).some(c => c.includes('defender_'));
                            callback(isDefender ? 'second' : 'first', weaponMain);
                        });
                    }
                }
            });

            observer.observe(container, {
                childList: true,
                subtree: true
            });

            // Initial detection in case it’s already loaded
            const weaponMain = container.querySelector('[id^="weapon_main"]');
            if (weaponMain) {
                const isDefender = Array.from(weaponMain.classList).some(c => c.includes('defender_'));
                callback(isDefender ? 'second' : 'first', weaponMain);
            }
        };

        tryAttach();
    }

    function updateDataTable(container, dataObj) {
        if (!container) return;

        const table = container.querySelector('table');
        if (!table) return;

        for (const [key, value] of Object.entries(dataObj)) {
            let row = table.querySelector(`tr[data-key="${key}"]`);

            if (!row) {
                // Create new row if it doesn't exist
                row = document.createElement('tr');
                row.dataset.key = key;

                const keyCell = document.createElement('td');
                keyCell.textContent = key;
                keyCell.style.border = '1px solid #888';
                keyCell.style.padding = '4px';
                keyCell.style.background = '#222';
                keyCell.style.color = '#fff';

                const valueCell = document.createElement('td');
                valueCell.style.border = '1px solid #888';
                valueCell.style.padding = '4px';
                valueCell.style.background = '#333';
                valueCell.style.color = '#fff';

                row.appendChild(keyCell);
                row.appendChild(valueCell);
                table.appendChild(row);
            }

            // Update row content
            const valueCell = row.querySelector('td:nth-child(2)');
            if (value && typeof value === 'object' && value.weapon) {
                valueCell.innerHTML = formatWeaponData(value);
            } else {
                valueCell.textContent = value;
            }
        }
    }

    // Wait for full fight page
    waitForSelector('[class^="playerArea_"]', playerAreas => {
        const players = document.querySelectorAll('[class^="playerArea_"]');
        const isMobile = players.length === 1; // only one player area = mobile view
        console.log("Is mobile?", isMobile);

        const nameEls = document.querySelectorAll('span[class*="userName___"][class*="user-name"]');
        const dataTableContainer = insertTable({ Name: nameEls[1]?.textContent.trim() || 'N/A' });

        if (isMobile) {
            observeMobileWeapons((pageType, el) => {

                const playerEl = document.querySelector('[class^="playerArea_"]');
                if (pageType === 'first') {
                    const armor = extractArmor(playerEl);
                    const armorPrefix = getArmorPrefix(armor);
                    updateDataTable(dataTableContainer, armorPrefix ? { 'Full Set': armorPrefix } : armor);
                } else {
                    const weapons = extractWeapons(playerEl);
                    updateDataTable(dataTableContainer, weapons);
                }
            });
        } else {
            const secondPlayer = players[1];

            const armorData = extractArmor(secondPlayer);
            const armorPrefix = getArmorPrefix(armorData);
            const armor = armorPrefix ? { 'Full Set': armorPrefix } : armorData;
            const weapons = extractWeapons(secondPlayer);

            const merged = { ...armor, ...weapons };
            updateDataTable(dataTableContainer, merged);
        }

    });
})();