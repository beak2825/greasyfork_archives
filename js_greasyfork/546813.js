// ==UserScript==
// @name         ⚔️ Daily Orders Button on the Battlefield
// @namespace    http://tampermonkey.net/
// @version      2.4
// @description  Save battlefield region → auto-fill Daily Orders
// @match        https://www.erepublik.com/en/military/battlefield/*
// @match        https://www.erepublik.com/en/military/military-unit/4810/daily-orders*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/546813/%E2%9A%94%EF%B8%8F%20Daily%20Orders%20Button%20on%20the%20Battlefield.user.js
// @updateURL https://update.greasyfork.org/scripts/546813/%E2%9A%94%EF%B8%8F%20Daily%20Orders%20Button%20on%20the%20Battlefield.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const MU_ID = 4810;
    const dailyOrdersUrl = `https://www.erepublik.com/en/military/military-unit/${MU_ID}/daily-orders`;
    const DEBUG = true; // set to false to disable logs

    function debugLog(...args) {
        if (DEBUG) console.log(...args);
    }

    // ========== MODULE 1: Battlefield button ==========
    function createDailyOrdersButton() {
        const regionLink = document.querySelector('#region_name_link');
        if (!regionLink || document.querySelector('#daily_button_wrapper')) return;

        const wrapper = document.createElement('span');
        wrapper.id = 'daily_button_wrapper';
        wrapper.style.marginLeft = '-56px';
        wrapper.style.display = 'inline-flex';
        wrapper.style.gap = '64px';

        const btnDaily = makeButton({
            id: 'daily_button_primary',
            text: '⚔️ D a i l y',
            bg: '#000',
            onClick: () => goToDailyOrders('primary')
        });

        const btnOrders = makeButton({
            id: 'daily_button_secondary',
            text: 'O r d e r s ⚔️',
            bg: '#83599E',
            onClick: () => goToDailyOrders('secondary')
        });

        wrapper.appendChild(btnDaily);
        wrapper.appendChild(btnOrders);
        regionLink.insertAdjacentElement('afterend', wrapper);
    }


    // NEW: reusable button factory
    function makeButton({ id, text, bg = '#000', onClick }) {
        const btn = document.createElement('a');
        btn.id = id;
        btn.href = "javascript:;";
        btn.textContent = text;
        btn.style.padding = '2px 6px';
        btn.style.backgroundColor = bg;
        btn.style.color = '#fff';
        btn.style.borderRadius = '8px';
        btn.style.fontWeight = 'bold';
        btn.style.fontSize = '12px';
        btn.style.textDecoration = 'none';
        btn.style.display = 'inline-block';
        btn.style.cursor = 'pointer';
        btn.style.letterSpacing = '2px';
        btn.style.lineHeight = '1.5';
        btn.style.filter = 'brightness(1.3)';

        if (typeof onClick === 'function') btn.addEventListener('click', onClick);
        return btn;
    }

    // NEW unified saver / redirector
    function goToDailyOrders(type = 'primary') {
        const regionEl = document.querySelector('#region_name_link');
        if (!regionEl) return debugLog("No region element found when trying to save region.");

        const region = cleanRegionName(regionEl.textContent.trim());
        debugLog("🌍 goToDailyOrders: Extracted region =", region);

        localStorage.setItem('savedRegion', region);
        localStorage.setItem('savedBattlefieldURL', window.location.href || '');
        // single trigger key describing the requested action
        localStorage.setItem('doType', type); // 'primary' or 'secondary'

        debugLog("💾 Saved region, battlefield URL and doType:", type, " - redirecting...");
        window.location.href = dailyOrdersUrl;
    }


    function cleanRegionName(rawName) {
        return rawName
            .replace(/\sRW/g, '')// remove " RW"
            .replace(/\sR\d+$/g, '') // remove " R<number>" at the end
            .trim();
    }

    // ========== MODULE 2: Daily Orders auto-fill ==========
    function fillRegionFromStorage() {
        return new Promise((resolve, reject) => {

            const savedRegion = localStorage.getItem('savedRegion');
            if (!savedRegion) return resolve(); // nothing to do

            const dropdown = document.querySelector('.battle4Do');
            if (!dropdown) return reject("Region dropdown missing.");

            if (!dropdown.classList.contains('open')) dropdown.click();

            waitForSelector('.battle4Do.open input.inputText')
                .then(input => {
                input.value = savedRegion;
                input.dispatchEvent(new Event('input', { bubbles: true }));
                return waitForSelector('.battle4Do.open ul.list li a b');
            })
                .then(() => {
                const matches = [...document.querySelectorAll('.battle4Do.open ul.list li a b')];
                const match = matches.find(el => el.textContent.trim() === savedRegion);

                if (match) match.closest('a').click();

                localStorage.removeItem('savedRegion');
                resolve(); // <- IMPORTANT
            })
                .catch(err => {
                localStorage.removeItem('savedRegion');
                reject(err);
            });

        });
    }

    // NEW unified orchestrator: run region fill, then optionally extra steps
    function performDailyOrder(type = 'primary') {
        debugLog("▶ performDailyOrder:", type);

        fillRegionFromStorage()
            .then(() => {
            debugLog("✅ Region fill completed.");
            if (type === 'secondary') {
                debugLog("▶ Performing secondary-only steps (sides) ...");
                return fillSidesSecondary();
            }
            return Promise.resolve();
        })
            .then(() => {
            debugLog("🔚 performDailyOrder finished for type:", type);
            if (type === 'secondary') {
                returnToBattlefield();
            }
        })
            .catch(err => {
            debugLog("⚠️ performDailyOrder error:", err);
            // decide: still attempt to return? usually safe to not redirect on error
        });
    }

    // REPLACEMENT: robust CSS-based side-selection (no returnToBattlefield call here)
    function fillSidesSecondary() {
        debugLog("▶️ Starting side-selection (Angular-safe).");

        return new Promise(async (resolve, reject) => {
            try {
                const sideDropdown = document.querySelector('.selectFromList.doSide');
                if (!sideDropdown) return reject(new Error("Side dropdown (.selectFromList.doSide) not found"));

                // Helper: wait until Angular injects the <ul> inside the dropdown
                const waitForOptions = () =>
                waitForSelector('.selectFromList.doSide.open ul.list li a', 5000)
                .then(() => Array.from(
                    document.querySelectorAll('.selectFromList.doSide.open ul.list li a')
                ));

                // ---- STEP A: SELECT FIRST COUNTRY ----
                sideDropdown.click();
                debugLog("🔽 Dropdown opened for FIRST country.");

                let options = await waitForOptions();
                if (options.length < 1) return reject("No options found in dropdown for first country.");

                const firstSide = options[0];
                debugLog("1️⃣ Clicking FIRST country:", firstSide.textContent.trim());

                firstSide.click(); // Angular ng-click is correctly bound now
                debugLog("✔ First side clicked. Waiting for Set Order...");

                await clickSetOrderButton();
                debugLog("✔ First side order set.");

                // Small delay to let Angular finish re-rendering
                await new Promise(r => setTimeout(r, 400));

                // ---- STEP B: SELECT SECOND COUNTRY ----
                sideDropdown.click();
                debugLog("🔽 Dropdown reopened for SECOND country.");

                options = await waitForOptions();
                if (options.length < 2) return reject("Second country not found in dropdown.");

                const secondSide = options[1];
                debugLog("2️⃣ Clicking SECOND country:", secondSide.textContent.trim());

                secondSide.click();
                debugLog("✔ Second side clicked. Waiting for Set Order...");

                await clickSetOrderButton();
                debugLog("✔ Second side order set.");

                resolve();

            } catch (err) {
                debugLog("❌ Error inside fillSidesSecondary():", err);
                reject(err);
            }
        });
    }

    // OPTIONAL REPLACEMENT: slightly stricter selector and clearer timeouts
    function clickSetOrderButton() {
        return new Promise((resolve, reject) => {
            const start = Date.now();
            const maxWait = 7000; // extend a bit to handle slow responses

            const check = () => {
                const btn = document.querySelector('a.std_global_btn.smallSize.blueColor');

                if (!btn) {
                    if (Date.now() - start > maxWait) return reject(new Error("Set Order button not found within timeout"));
                    return requestAnimationFrame(check);
                }

                // If the button element exists but still flagged disabled
                const isDisabled = btn.classList.contains('disabled');

                if (!isDisabled) {
                    // short deliberate delay to ensure server-side readiness (keeps your 1.5s safety)
                    setTimeout(() => {
                        try {
                            btn.click();
                            debugLog("🖱 Clicked Set Order");
                            resolve();
                        } catch (e) {
                            reject(e);
                        }
                    }, 1200);
                    return;
                }

                if (Date.now() - start > maxWait) {
                    return reject(new Error("Set Order button never became active"));
                }

                requestAnimationFrame(check);
            };

            check();
        });
    }

    function waitForSelector(selector, timeout = 3000) {
        return new Promise((resolve, reject) => {
            const el = document.querySelector(selector);
            if (el) return resolve(el);

            const obs = new MutationObserver(() => {
                const el2 = document.querySelector(selector);
                if (el2) {
                    obs.disconnect();
                    resolve(el2);
                }
            });

            obs.observe(document, { childList: true, subtree: true });

            setTimeout(() => {
                obs.disconnect();
                reject(new Error("Timeout waiting for selector: " + selector));
            }, timeout);
        });
    }

    function returnToBattlefield() {
        const url = localStorage.getItem('savedBattlefieldURL');

        if (url) {
            debugLog("🏃 Returning to saved battlefield:", url);
            localStorage.removeItem('savedBattlefieldURL');
            window.location.href = url;
        } else {
            debugLog("⚠️ No battlefield URL saved.");
        }
    }

    // ========== INIT ==========
    if (location.href.includes('/battlefield/')) {
        createDailyOrdersButton();
    }
    if (location.href.includes('/daily-orders')) {
        const doType = localStorage.getItem('doType');
        if (doType) {
            // remove the key right away so we don't re-run accidentally
            localStorage.removeItem('doType');
            performDailyOrder(doType);
        }
    }


})();
