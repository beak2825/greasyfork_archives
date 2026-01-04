// ==UserScript==
// @name         Loadout viewer
// @namespace    Ziticca Script Library
// @version      1.0
// @description  Shows targets loadout information if available
// @author       Ziticca
// @license      Copyright Ziticca
// @match        https://www.torn.com/loader.php*
// @icon         https://www.torn.com/images/v2/loadouts/all_loadouts_default.svg
// @run-at       document-start
// @grant        unsafeWindow
// @grant        GM_addStyle
// @grant        GM.xmlHttpRequest
// @connect      backend-5lx2q4ta6a-lz.a.run.app
// @connect      api.torn.com
// @downloadURL https://update.greasyfork.org/scripts/497895/Loadout%20viewer.user.js
// @updateURL https://update.greasyfork.org/scripts/497895/Loadout%20viewer.meta.js
// ==/UserScript==

/* jshint esversion:9 */

(function () {
    'use strict';

    const styles = `
        .loadout-helper-container {
            position: relative;
            padding-left: 1em;
            height: 0;
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
        .loadout-viewer-apikey-label {
            display: block;
        }
        .loadout-viewer-apikey-input {
            height: 14px;
            padding: .8em;
            display: block;
            margin-top: 1em;
            margin-bottom: 1em;
        }
        .loadout-viewer-apikey-error {
            color: red;
        }
        .loadout-viewer-title {
            color: gray;
        }
        .loadout-viewer-no-data {
            margin-top: 1em;
        }
`;
    const loadoutURL = "https://backend-5lx2q4ta6a-lz.a.run.app/loadouts";
    const isTampermonkeyEnabled = typeof unsafeWindow !== 'undefined';
    if (isTampermonkeyEnabled) {
        GM_addStyle(styles);
    }

    const getApikey = () => {
        return localStorage.getItem("ZSL.loadout_viewer.apikey");
    };

    const getQueryParams = () => {
        const urlParts = unsafeWindow.location.href.split('?');
        if (urlParts.length < 2) {
            console.log("[Loadout Viewer] URL does not look like one I can handle");
            return [];
        } else {
            const queryParams = urlParts[1];
            const params = queryParams.split('&');
            return params;
        }
    };

    const getTargetPlayerQueryParam = (params) => {
        for (const param of params) {
            const [key, value] = param.split('=');
            if (key === "user2ID") {
                return value;
            }
        }
        console.log("Could not get target player id");
        return null;
    };
    const queryParams = getQueryParams();
    const targetId = getTargetPlayerQueryParam(queryParams);
    const loadPlayerLoadout = async () => {
        if (targetId) {
            const response = await GM.xmlHttpRequest({
                method: "GET",
                url: `${loadoutURL}/${targetId}/?apikey=${localStorage.getItem("ZSL.loadout_viewer.apikey")}`,
                headers: {
                    "Content-type": "application/json"
                }
            }).catch((e) => console.log(e));
            const data = JSON.parse(response.responseText);
            setupLoadout(data);
        }
    };

    let setupDone = false;
    let baseCreationDone = false;
    let baseContainer = null;
    let loadoutContainer = null;

    const createBaseContainer = async () => {
        const defenderContainer = document.querySelector("#defender");
        if (defenderContainer) {
            baseContainer = document.createElement("div");
            baseContainer.className = "loadout-helper-container";
            baseContainer.style.left = `${defenderContainer.getBoundingClientRect().width}px`;
            baseContainer.style.top = `-${defenderContainer.getBoundingClientRect().height}px`;
            const loadoutHelperTitle = document.createElement("h6");
            loadoutHelperTitle.className = "loadout-viewer-title";
            loadoutHelperTitle.textContent = "Loadout viewer";
            baseContainer.appendChild(loadoutHelperTitle);

            defenderContainer.appendChild(baseContainer);
            baseCreationDone = true;
        } else {
            console.log("[Loadout helper] Document body not yet loaded. Waiting for it to load...");
            await new Promise(r => setTimeout(r, 1000));
            await createBaseContainer();
        }
    };

    const setupLoadout = function (data) {
        if (setupDone) return;
        if (data) {
            let weapons = [];
            let armors = [];
            const weaponKeys = ["1", "2", "3", "5"];
            const armorKeys = ["4", "6", "7", "8", "9"];
            for (const item of data.items) {
                if (weaponKeys.includes(item["equipSlot"])) {
                    weapons.push(item);
                }
                if (armorKeys.includes(item["equipSlot"])) {
                    armors.push(item);
                }
            }
            loadoutContainer = document.createElement("div");
            loadoutContainer.className = "loadout-helper-loadout-container";
            baseContainer.appendChild(loadoutContainer);
            updateLoadout(loadoutContainer, weapons, armors);
        } else {
            const noDataContainer = document.createElement("p");
            noDataContainer.className = "loadout-viewer-no-data";
            noDataContainer.textContent = "There is no saved loadout for this player";
            baseContainer.appendChild(noDataContainer);
        }
        setupDone = true;
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

    const checkApikey = async (apikey) => {
        const response = await GM.xmlHttpRequest({
            method: "GET",
            url: `https://api.torn.com/user/?selections=basic&key=${apikey}`,
            headers: {
                "Content-type": "application/json"
            }
        }).catch((e) => {
            console.log(e);
            return false;
        });
        try {
            const responseJson = JSON.parse(response.responseText);
            console.log(responseJson);
            if ("error" in responseJson) {
                console.log("Invalid key");
                return false;
            } else {
                return true;
            }
        } catch (e) {
            console.log("[Loadout viewer] Something went wrong. Please contact the author");
            return false;
        }
    };

    const createApiKeyForm = () => {
        const apikeyForm = document.createElement("div");
        const apikeyLabel = document.createElement("label");
        apikeyLabel.className = "loadout-viewer-apikey-label";
        apikeyLabel.textContent = "Basic apikey";
        const apiKeyInput = document.createElement("input");
        apiKeyInput.className = "loadout-viewer-apikey-input";
        const apikeyError = document.createElement("p");
        apikeyError.className = "loadout-viewer-apikey-error";
        const apiKeyFormButton = document.createElement("button");
        apiKeyFormButton.className = "torn-btn";
        apiKeyFormButton.textContent = "Save apikey for loadout viewer";
        apiKeyFormButton.addEventListener("click", async () => {
            const apikeyValidity = await checkApikey(apiKeyInput.value);
            if (apikeyValidity) {
                localStorage.setItem("ZSL.loadout_viewer.apikey", apiKeyInput.value);
                apikeyForm.remove();
                loadPlayerLoadout();
            } else {
                apikeyError.textContent = "Invalid apikey";
            }
        });
        apikeyForm.appendChild(apikeyLabel);
        apikeyForm.appendChild(apiKeyInput);
        apikeyForm.appendChild(apiKeyFormButton);
        apikeyForm.appendChild(apikeyError);
        baseContainer.appendChild(apikeyForm);
    };

    const initLoadoutViewer = async () => {
        console.log("[Loadout viewer] Initializing loadout viewer");
        await createBaseContainer();
        if (getApikey() !== null) {
            loadPlayerLoadout();
        } else {
            createApiKeyForm();
        }
    };

    initLoadoutViewer();
})();