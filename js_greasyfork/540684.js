// ==UserScript==
// @name         Mail.com Alias Creator (Automated)
// @namespace    https://mail.com/
// @version      1.1
// @description  Auto-create a custom alias using symbol prefixes for testing/filtering purposes (ethical use only)
// @author       Clumsy
// @match        https://www.mail.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/540684/Mailcom%20Alias%20Creator%20%28Automated%29.user.js
// @updateURL https://update.greasyfork.org/scripts/540684/Mailcom%20Alias%20Creator%20%28Automated%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // === CONFIGURABLE SECTION ===
    const ALIAS_PREFIX = ",,"; // Safe symbol prefix for edge case testing
    const ALIAS_BODY = "testcase" + Math.floor(Math.random() * 100000); // Randomize alias body
    const FULL_ALIAS = ALIAS_PREFIX + ALIAS_BODY;
    const DOMAIN_SUFFIX = "@mail.com"; // Alias domain

    // === HELPER ===
    function waitForSelector(selector, timeout = 10000) {
        return new Promise((resolve, reject) => {
            const interval = 200;
            let elapsed = 0;
            const timer = setInterval(() => {
                const el = document.querySelector(selector);
                if (el) {
                    clearInterval(timer);
                    resolve(el);
                } else if ((elapsed += interval) >= timeout) {
                    clearInterval(timer);
                    reject(`Timeout waiting for selector: ${selector}`);
                }
            }, interval);
        });
    }

    async function goToAliasSettings() {
        if (!location.href.includes("settings")) {
            const settingsBtn = await waitForSelector('a[href*="/settings/"]');
            settingsBtn.click();
            await new Promise(r => setTimeout(r, 2000));
        }

        const aliasBtn = await waitForSelector('a[href*="alias"]');
        aliasBtn.click();
        await new Promise(r => setTimeout(r, 3000));
    }

    async function createAlias() {
        const inputField = await waitForSelector('input[name="aliasName"]');
        inputField.focus();
        inputField.value = FULL_ALIAS;
        inputField.dispatchEvent(new Event("input", { bubbles: true }));

        const submitBtn = await waitForSelector('button[type="submit"], button[data-action="add-alias"]');
        submitBtn.click();

        console.log(`[✓] Alias creation attempted: ${FULL_ALIAS + DOMAIN_SUFFIX}`);
    }

    async function start() {
        try {
            await goToAliasSettings();
            await createAlias();
        } catch (err) {
            console.error("[✗] Alias automation failed:", err);
        }
    }

    window.addEventListener("load", () => {
        setTimeout(() => start(), 2000); // Delay to allow page scripts to initialize
    });
})();
