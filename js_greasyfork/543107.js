// ==UserScript==
// @name         Work.ink Auto Access Script
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Automatically clicks through access/skip buttons on work.ink
// @author       You
// @match        *://*.work.ink/*
// @grant        none
// @license      MIT
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/543107/Workink%20Auto%20Access%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/543107/Workink%20Auto%20Access%20Script.meta.js
// ==/UserScript==

(async function () {
    const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

    const waitForElement = (selector, timeout = 5000, interval = 100) => {
        return new Promise((resolve, reject) => {
            const start = Date.now();
            const check = () => {
                const el = document.querySelector(selector);
                if (el) return resolve(el);
                if (Date.now() - start > timeout) return reject();
                setTimeout(check, interval);
            };
            check();
        });
    };

    const clickMultipleTimes = async (element, times = 5, delay = 250) => {
        for (let i = 0; i < times; i++) {
            element.click();
            await sleep(delay);
        }
    };

    try {
        let el = await waitForElement('.accessBtn');
        el.click();

        el = await waitForElement('#access-offers');
        await clickMultipleTimes(el);

        el = await waitForElement('div.button.large.accessBtn.pos-relative.svelte-iyommg');
        el.click();

        try {
            el = await waitForElement('.skipBtn');
            el.click();
        } catch {
            el = await waitForElement('#access-offers');
            await clickMultipleTimes(el);
            return;
        }

        try {
            el = await waitForElement('.closelabel');
            el.click();
        } catch {
            el = await waitForElement('#access-offers');
            await clickMultipleTimes(el);
            return;
        }

        el = await waitForElement('button.w-full.bg-gray-100');
        el.click();

        el = await waitForElement('button.w-full.bg-emerald-600.text-white.rounded-full');
        await clickMultipleTimes(el);
    } catch (e) {
        console.warn("Script error:", e);
    }
})();
