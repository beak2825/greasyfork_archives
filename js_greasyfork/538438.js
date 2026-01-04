// ==UserScript==
// @name         GGn Autofill GameDOX Fields
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  Autofills GameDOX fields on grouped upload page with minimal delay and dynamic DOM handling
// @author       stormlight
// @match        https://gazellegames.net/upload.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/538438/GGn%20Autofill%20GameDOX%20Fields.user.js
// @updateURL https://update.greasyfork.org/scripts/538438/GGn%20Autofill%20GameDOX%20Fields.meta.js
// ==/UserScript==


(function () {
    'use strict';

    const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

    const waitForSelector = async (selector, timeout = 5000) => {
        const start = Date.now();
        while (Date.now() - start < timeout) {
            const el = document.querySelector(selector);
            if (el) return el;
            await delay(50);
        }
        return null;
    };

    async function fillFields() {
        console.log('Autofill: Starting');

        const misc = await waitForSelector('#miscellaneous');
        misc.value = 'GameDOX';
        misc.dispatchEvent(new Event('change', { bubbles: true }));

        await delay(200);

        const gamedox = await waitForSelector('#gamedox');
        gamedox.value = 'Guide';
        gamedox.dispatchEvent(new Event('change', { bubbles: true }));

        const language = await waitForSelector('#language');
        language.value = 'English';
        language.dispatchEvent(new Event('change', { bubbles: true }));

        await delay(100);

        const scanRadio = await waitForSelector('#scan');
        scanRadio.checked = true;
        scanRadio.click();

        await waitForSelector('#scan_dpi');
        const dpi = document.querySelector('#scan_dpi');
        dpi.value = 'Other';
        dpi.dispatchEvent(new Event('change', { bubbles: true }));

        await waitForSelector('#other_dpi');
        const dpiInput = document.querySelector('#other_dpi');
        dpiInput.value = '160';
        dpiInput.dispatchEvent(new Event('input', { bubbles: true }));

        await delay(100);

        const region = await waitForSelector('#region');
        region.value = 'USA';
        region.dispatchEvent(new Event('change', { bubbles: true }));

        await waitForSelector('#format');
        const format = document.querySelector('#format');
        format.value = 'PDF';
        format.dispatchEvent(new Event('change', { bubbles: true }));

        const ripSrc = document.querySelector('#ripsrc_home');
        if (ripSrc) {
            ripSrc.checked = true;
            ripSrc.click();
        }

        const releaseDesc = await waitForSelector('#release_desc');
        if (releaseDesc) {
            releaseDesc.value = `Game Manual\nSNS-U5-USA\nLanguage: English\nPages: 32`;
            releaseDesc.dispatchEvent(new Event('input', { bubbles: true }));
        }

        console.log('Autofill: Completed');
    }


    const container = document.querySelector('#upload_form') || document.body;
    const observer = new MutationObserver(async () => {
        const success = await fillFields();
        if (success !== false) observer.disconnect();
    });

    observer.observe(container, { childList: true, subtree: true });

    window.addEventListener('load', () => {
        setTimeout(() => fillFields().then(success => {
            if (success !== false) observer.disconnect();
        }), 1000);
    });
})();
