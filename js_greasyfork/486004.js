// ==UserScript==
// @name         Loadout helper
// @namespace    Ziticca Script Library
// @version      1.5
// @description  Scrapes the loadout page to display loadout information with one glance
// @author       Ziticca
// @license      MIT
// @match        https://www.torn.com/loader.php?sid=attack*
// @icon         https://www.torn.com/images/v2/loadouts/all_loadouts_default.svg
// @run-at       document-start
// @grant        unsafeWindow
// @grant        GM_addStyle
// @grant        GM.xmlHttpRequest
// @downloadURL https://update.greasyfork.org/scripts/486004/Loadout%20helper.user.js
// @updateURL https://update.greasyfork.org/scripts/486004/Loadout%20helper.meta.js
// ==/UserScript==

/* jshint esversion:9 */

(function () {
    'use strict';

    const styles = `
        .loadout-helper-container {
            position: relative;
            padding-left: 1em;
            height: 0;
            max-width: 450px;
        }
        .loadout-helper-layout-container {
            padding-top: 1em;
        }
        .loadout-helper-weapon-info, .loadout-helper-armor-info {
            margin-bottom: .6em;
            padding-bottom: .2em;
            padding-top: .2em;
        }
        .loadout-helper-weapon-slot, .loadout-helper-armor-slot {
            font-size: .9em;
            margin-bottom: .4em;
        }
        .loadout-helper-weapon-name, .loadout-helper-armor-name {
            font-size: 1.2em;
            font-weight: bold;
            margin-bottom: .4em;
        }
        .loadout-helper-weapon-damage, .loadout-helper-armor-armor {
            font-weight: bold;
            padding-bottom: .4em;
            margin-bottom: .4em;
            border-bottom: 1px solid color-mix(in srgb, currentColor 50%, transparent);
        }
        .loadout-helper-armor-slot {
            border-bottom: 1px solid color-mix(in srgb, currentColor 50%, transparent);
        }
        .loadout-helper-weapon-bonus, .loadout-helper-weapon-upgrade, .loadout-helper-armor-bonus {
            margin-bottom: .4em;
        }
        .loadout-helper-weapon-bonus-name, .loadout-helper-weapon-upgrade-name, .loadout-helper-armor-bonus-name {
            font-weight: bold;
            margin-bottom: .4em;
        }
        .loadout-helper-weapon-bonus-type, .loadout-helper-weapon-upgrade-type {
            font-weight: normal;
            font-size: .9em;
            margin-left: .4em;
        }
        .loadout-helper-weapon-bonus-value, .loadout-helper-weapon-upgrade-value, .loadout-helper-armor-bonus-value {
            padding-left: .6em;
        }
        .loadout-helper-armor-title {
            font-size: .9em;
            margin-bottom: .4em;
        }
        .loadout-helper-armor-name {
            font-size: 1.2em;
            font-weight: bold;
            margin-bottom: .4em;
        }
`;
    const { fetch: origFetch } = unsafeWindow;
    let setupDone = false;
    unsafeWindow.fetch = async (...args) => {
        if (typeof args[0] === 'string' && args[0].indexOf("/loader.php?sid=attackData") !== -1 && !setupDone) {
            console.log("fetch called with args:", args);
            const response = await origFetch(...args);
            response
                .clone()
                .json()
                .then((data) => {
                console.log("intercepted response data:", data);
                setupLoadout(data);
            })
                .catch(err => console.error(err));
            return response;
        } else {
            const response = await origFetch(...args);
            return response;
        }
    };

    const isTampermonkeyEnabled = typeof unsafeWindow !== 'undefined';
    if (isTampermonkeyEnabled) {
        GM_addStyle(styles);
    }

    const setupLoadout = function (data) {
        if (setupDone) return;
        const defenderItems = data["DB"]["defenderItems"];
        const defenderUser = data["DB"]["defenderUser"];
        let weapons = [];
        let armors = [];
        const weaponKeys = ["1", "2", "3", "5"];
        const armorKeys = ["4", "6", "7", "8", "9"];
        for (const itemKey in defenderItems) {
            const item = defenderItems[itemKey];
            if (!item) continue;
            if (weaponKeys.includes(itemKey)) {
                weapons.push(item.item[0]);
            }
            if (armorKeys.includes(itemKey)) {
                armors.push(item.item[0]);
            }
        }
        const defenderContainer = document.querySelector('div[class^="playersModelWrap"]');
        if (defenderContainer) {
            const loadoutContainer = document.createElement("div");
            loadoutContainer.className = "loadout-helper-loadout-container";

            const getLoadoutContainer = document.createElement("div");
            getLoadoutContainer.className = "loadout-helper-container";
            getLoadoutContainer.style.left = `${defenderContainer.getBoundingClientRect().width}px`;
            getLoadoutContainer.style.top = `-${defenderContainer.getBoundingClientRect().height}px`;
            getLoadoutContainer.appendChild(loadoutContainer);
            defenderContainer.appendChild(getLoadoutContainer);
            updateLoadout(loadoutContainer, weapons, armors);

            setupDone = true;
        } else {
            console.log("[Loadout helper] Document body not yet loaded. Waiting for it to load...")
            setTimeout(() => { setupLoadout(data) }, 1000);
        }
    };

    const updateLoadout = (layout, weapons, armors) => {
        for (const weapon of weapons) {
            const weaponInfo = document.createElement("div");
            weaponInfo.className = `loadout-helper-weapon-info ${weapon.glowClass}`;
            const weaponSlot = document.createElement("p");
            weaponSlot.className = "loadout-helper-weapon-slot";
            weaponSlot.textContent = `${weapon.name}`;
            weaponInfo.appendChild(weaponSlot);
            const weaponDamage = document.createElement("p");
            weaponDamage.className = "loadout-helper-weapon-damage";
            weaponDamage.textContent = `Dmg: ${weapon.dmg} | Acc: ${weapon.acc} | Q: ${weapon.quality ? weapon.quality : 'N/A'}`;
            weaponInfo.appendChild(weaponDamage);
            if (weapon.currentBonuses) {
                for (const bonusKey in weapon.currentBonuses) {
                    const bonus = weapon.currentBonuses[bonusKey];
                    const weaponBonus = document.createElement("div");
                    weaponBonus.className = "loadout-helper-weapon-bonus";
                    const weaponBonusName = document.createElement("p");
                    weaponBonusName.className = `loadout-helper-weapon-bonus-name`;
                    weaponBonusName.textContent = `${bonus.title} (${bonus.value})`;
                    const weaponBonusType = document.createElement("span");
                    weaponBonusType.className = "loadout-helper-weapon-bonus-type";
                    weaponBonusType.textContent = "(Bonus)";
                    weaponBonusName.append(weaponBonusType);
                    weaponBonus.appendChild(weaponBonusName);
                    const weaponBonusValue = document.createElement("p");
                    weaponBonusValue.className = "loadout-helper-weapon-bonus-value";
                    weaponBonusValue.textContent = bonus.desc;
                    weaponBonus.appendChild(weaponBonusValue);
                    weaponInfo.appendChild(weaponBonus);
                }
            }
            if (weapon.currentUpgrades) {
                for (const upgrade of weapon.currentUpgrades) {
                    const weaponUpgrade = document.createElement("div");
                    weaponUpgrade.className = "loadout-helper-weapon-upgrade";
                    const weaponUpgradeName = document.createElement("p");
                    weaponUpgradeName.className = `loadout-helper-weapon-upgrade-name`;
                    weaponUpgradeName.textContent = upgrade.title;
                    const weaponUpgradeType = document.createElement("span");
                    weaponUpgradeType.className = "loadout-helper-weapon-upgrade-type";
                    weaponUpgradeType.textContent = "(Attachment)";
                    weaponUpgradeName.append(weaponUpgradeType);
                    weaponUpgrade.appendChild(weaponUpgradeName);
                    const weaponUpgradeValue = document.createElement("p");
                    weaponUpgradeValue.className = "loadout-helper-weapon-upgrade-value";
                    weaponUpgradeValue.textContent = upgrade.desc;
                    weaponUpgrade.appendChild(weaponUpgradeValue);
                    weaponInfo.appendChild(weaponUpgrade);
                }
            }
            layout.appendChild(weaponInfo);
        }


        for (const armor of armors) {
            const armorInfo = document.createElement("div");
            armorInfo.className = `loadout-helper-armor-info ${armor.glowClass}`;
            const armorSlot = document.createElement("p");
            armorSlot.className = "loadout-helper-armor-slot";
            armorSlot.textContent = `${armor.name}`;
            armorInfo.appendChild(armorSlot);
            if (armor.currentBonuses) {
                for (const bonusKey in armor.currentBonuses) {
                    const bonus = armor.currentBonuses[bonusKey];
                    const armorBonus = document.createElement("div");
                    armorBonus.className = "loadout-helper-armor-bonus";
                    const armorBonusName = document.createElement("p");
                    armorBonusName.className = "loadout-helper-armor-bonus-name";
                    armorBonusName.textContent = `${bonus.title} (${bonus.value})`;
                    armorBonus.appendChild(armorBonusName);
                    if (bonus.desc) {
                        const bonusDetails = bonus.desc.split('<br/>');
                        let bonusDesc = bonusDetails[0];
                        if (bonusDetails.length > 1) {
                            const startIdx = bonusDetails[1].indexOf('<i>') + 3;
                            const endIdx = bonusDetails[1].indexOf('</i>');
                            bonusDesc += ` (${bonusDetails[1].substring(startIdx, endIdx)})`;
                        }
                        const armorBonusValue = document.createElement("p");
                        armorBonusValue.className = "loadout-helper-armor-bonus-value";
                        armorBonusValue.textContent = bonusDesc;
                        armorBonus.appendChild(armorBonusValue);
                    }
                    armorInfo.appendChild(armorBonus);
                }
            }
            layout.appendChild(armorInfo);
        }

    };
})();