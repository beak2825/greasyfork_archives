// ==UserScript==
// @name         Force Aptos Font on Specific Sites
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Forces specified websites (from a customizable list) to use the Aptos font family.
// @author       Your Name/AI (Update with your actual name/handle)
// @match        *://*/*
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/539696/Force%20Aptos%20Font%20on%20Specific%20Sites.user.js
// @updateURL https://update.greasyfork.org/scripts/539696/Force%20Aptos%20Font%20on%20Specific%20Sites.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const SCRIPT_NAME = "Force Aptos on Sites";
    const TARGET_LIST_KEY = 'aptosFontTargetList_v1'; // Renamed from WHITELIST_KEY

    // Comprehensive Aptos font stack
    const APTOS_FONT_FAMILY = `"Aptos", "Aptos Display", "Aptos Narrow", "Aptos Serif", "Aptos Mono", "Segoe UI Variable Text", "Segoe UI Variable Display", "Segoe UI Variable Small", "Segoe UI", Tahoma, Geneva, Verdana, sans-serif`;

    function loadTargetList() {
        const storedValue = GM_getValue(TARGET_LIST_KEY, '[]');
        try {
            const parsed = JSON.parse(storedValue);
            return Array.isArray(parsed) ? parsed : [];
        } catch (e) {
            console.error(`${SCRIPT_NAME}: Error parsing target list, resetting. Stored value:`, storedValue, e);
            return [];
        }
    }

    function saveTargetList(targetList) {
        if (!Array.isArray(targetList)) {
            console.error(`${SCRIPT_NAME}: Attempted to save invalid target list type.`);
            return;
        }
        GM_setValue(TARGET_LIST_KEY, JSON.stringify(targetList.map(site => site.trim().toLowerCase()).filter(site => site.length > 0)));
    }

    function isSiteOnTargetList(hostname) {
        const targetList = loadTargetList();
        const lowerHostname = hostname.toLowerCase();
        // Check if the current hostname or any of its subdomains are targeted.
        // e.g., if "example.com" is targeted, "mail.example.com" will also have the font forced.
        return targetList.some(targetHost => lowerHostname === targetHost || lowerHostname.endsWith('.' + targetHost));
    }

    function applyCustomFont() {
        GM_addStyle(`
            /* Apply to all elements */
            * {
                font-family: ${APTOS_FONT_FAMILY} !important;
            }

            /*
            Alternative, more specific selectors if '*' causes issues:
            body, p, div, span, a, li, h1, h2, h3, h4, h5, h6,
            input, button, textarea, select, option, label, legend,
            article, aside, footer, header, main, nav, section,
            td, th, caption, pre, code {
                font-family: ${APTOS_FONT_FAMILY} !important;
            }
            */
        `);
        console.log(`${SCRIPT_NAME}: Applied Aptos font family to ${window.location.hostname}.`);
    }

    // --- Main Logic ---
    const currentHostname = window.location.hostname;

    if (currentHostname && typeof currentHostname === 'string' && currentHostname.trim() !== "") {
        // *** CORE LOGIC CHANGE HERE ***
        // Only apply the font if the current site IS ON the target list
        if (isSiteOnTargetList(currentHostname)) {
            applyCustomFont();
        } else {
            console.log(`${SCRIPT_NAME}: ${currentHostname} is not on the target list. Aptos font not applied.`);
        }
    } else {
        console.warn(`${SCRIPT_NAME}: Could not determine current hostname. Font modification skipped.`);
    }


    // --- Menu Commands for Target List Management ---

    function addSiteToTargetList() {
        const hostnameToAdd = currentHostname;
        if (!hostnameToAdd || typeof hostnameToAdd !== 'string' || hostnameToAdd.trim() === "") {
            alert(`${SCRIPT_NAME}: Cannot determine current hostname to add to target list.`);
            return;
        }

        const targetList = loadTargetList();
        const hostToAddInput = prompt(
            `${SCRIPT_NAME}: Enter hostname to add to Aptos font target list (e.g., ${hostnameToAdd} or a base domain like ${hostnameToAdd.split('.').slice(-2).join('.')}):`,
            hostnameToAdd
        );

        if (hostToAddInput && hostToAddInput.trim() !== "") {
            const trimmedHost = hostToAddInput.trim().toLowerCase();
            if (!targetList.includes(trimmedHost)) {
                targetList.push(trimmedHost);
                saveTargetList(targetList);
                alert(`${SCRIPT_NAME}: ${trimmedHost} added to Aptos target list.\nReload the page for changes to take effect.`);
            } else {
                alert(`${SCRIPT_NAME}: ${trimmedHost} is already on the Aptos target list.`);
            }
        }
    }

    function removeSiteFromTargetList() {
        const hostnameToRemove = currentHostname;
        if (!hostnameToRemove || typeof hostnameToRemove !== 'string' || hostnameToRemove.trim() === "") {
            alert(`${SCRIPT_NAME}: Cannot determine current hostname to remove from target list.`);
            return;
        }
        let targetList = loadTargetList();

        const hostToRemoveInput = prompt(
            `${SCRIPT_NAME}: Enter hostname to remove from Aptos target list (e.g., ${hostnameToRemove} or a specific entry):`,
            hostnameToRemove
        );

        if (hostToRemoveInput && hostToRemoveInput.trim() !== "") {
            const trimmedHost = hostToRemoveInput.trim().toLowerCase();
            if (targetList.includes(trimmedHost)) {
                targetList = targetList.filter(site => site !== trimmedHost);
                saveTargetList(targetList);
                alert(`${SCRIPT_NAME}: ${trimmedHost} removed from Aptos target list.\nReload the page for changes to take effect.`);
            } else {
                alert(`${SCRIPT_NAME}: ${trimmedHost} was not found in the Aptos target list.`);
            }
        }
    }

    function viewEditTargetList() {
        const targetList = loadTargetList();
        const targetListString = targetList.join(', ');
        const newTargetListString = prompt(
            `${SCRIPT_NAME}: Edit Aptos font target list (comma-separated hostnames):\nExample: google.com, example.org`,
            targetListString
        );

        if (newTargetListString !== null) { // User didn't cancel prompt
            const newTargetListArray = newTargetListString
                .split(',')
                .map(site => site.trim().toLowerCase())
                .filter(site => site.length > 0 && site.includes('.')); // Basic validation

            saveTargetList(newTargetListArray);
            alert(`${SCRIPT_NAME}: Aptos target list updated.\nReload relevant pages for changes to take effect.`);
        }
    }

    // Register menu commands
    if (currentHostname && typeof currentHostname === 'string' && currentHostname.trim() !== "") {
        // Menu command labels reflect the new logic
        GM_registerMenuCommand(`[${SCRIPT_NAME}] Force Aptos on: ${currentHostname}`, addSiteToTargetList);
        GM_registerMenuCommand(`[${SCRIPT_NAME}] Stop forcing Aptos for a site...`, removeSiteFromTargetList);
    }
    GM_registerMenuCommand(`[${SCRIPT_NAME}] View/Edit Aptos Target List`, viewEditTargetList);

})();