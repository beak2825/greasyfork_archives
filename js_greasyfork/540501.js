// ==UserScript==
// @name         Auto-fill DOB BIN
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Automatically insert BIN from URL parameter and trigger search on NYC DOB NOW site
// @author       oleglyba
// @match        https://a810-dobnow.nyc.gov/publish/Index.html*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/540501/Auto-fill%20DOB%20BIN.user.js
// @updateURL https://update.greasyfork.org/scripts/540501/Auto-fill%20DOB%20BIN.meta.js
// ==/UserScript==

(function () {
    console.log("[TM] 🚀 Starting BIN autofill automation");

    const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

    const clickBinSearch = async () => {
        console.log('[TM] ⏳ Waiting for BIN button');

        const waitForBinButton = () => new Promise(resolve => {
            const check = setInterval(() => {
                const btn = Array.from(document.querySelectorAll('div')).find(
                    el => el.textContent.trim() === 'BIN'
                );
                if (btn) {
                    clearInterval(check);
                    resolve(btn);
                }
            }, 300);
        });

        const binBtn = await waitForBinButton();
        console.log('[TM] ✅ BIN button found');
        binBtn.click();
    };

    const fillBin = async () => {
        await sleep(1500);

        const urlParams = new URLSearchParams(window.location.hash.split('?')[1]);
        const bin = urlParams.get("bin");

        if (!bin) {
            console.warn("[TM] ❌ BIN not found in URL");
            return;
        }

        console.log("[TM] 🧠 BIN found in URL:", bin);

        const input = document.querySelector("input[placeholder='Enter BIN']");
        if (input) {
            input.value = bin;
            input.dispatchEvent(new Event("input", { bubbles: true }));
            await sleep(500);

            const searchBtn = [...document.querySelectorAll("button")].find((btn) =>
                btn.textContent.trim().toLowerCase() === "search"
            );

            if (searchBtn) {
                console.log("[TM] 🔍 Clicking Search");
                searchBtn.click();
            }
        }
    };

    const start = async () => {
        await clickBinSearch();
        await fillBin();
    };

    start();
})();
