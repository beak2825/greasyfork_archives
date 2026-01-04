// ==UserScript==
// @name         Tyrofight (Optimized)
// @namespace    seintz.torn.easy-fight.optimized
// @version      1.7
// @description  Move fight/outcome buttons for easier clicks + customizable UI
// @author       seintz [2460991], Finaly [2060206], Anxiety [2149726], IAMAPEX [2523988]
// @license      GNU GPLv3
// @match        https://www.torn.com/loader.php?sid=attack*
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/543284/Tyrofight%20%28Optimized%29.user.js
// @updateURL https://update.greasyfork.org/scripts/543284/Tyrofight%20%28Optimized%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Load saved preferences or set defaults
    let outcome = GM_getValue("outcome", "leave");
    let defaultWeapon = GM_getValue("defaultWeapon", "primary");
    let useTemp = GM_getValue("useTemp", true);

    const buttonSelector = 'div[class^="dialogButtons___"]';
    const playerArea = 'div[class^="playerArea___"]';
    const outcomeMap = { leave: 0, mug: 1, hosp: 2 };

    function injectUI() {
        const html = `
            <div id="parameterUI" style="position: fixed; top: 210px; left: 10px; z-index: 999;
                 background-color: #2a2a2a; color: white; padding: 12px 16px;
                 border: 1px solid #007bff; border-radius: 8px; font-size: 14px;">
                <div style="margin-bottom: 10px;">
                    <label for="outcomeSelect">Select Outcome:</label><br>
                    <select id="outcomeSelect" title="Choose what to do after winning">
                        <option value="leave">Leave</option>
                        <option value="mug">Mug</option>
                        <option value="hosp">Hospitalize</option>
                    </select>
                </div>
                <div style="margin-bottom: 10px;">
                    <label for="weaponSelect">Select Weapon:</label><br>
                    <select id="weaponSelect" title="Choose default weapon">
                        <option value="primary">Primary</option>
                        <option value="secondary">Secondary</option>
                        <option value="melee">Melee</option>
                    </select>
                </div>
                <div>
                    <label for="useTempCheckbox">Use Temporary:</label>
                    <input type="checkbox" id="useTempCheckbox" title="Use temp weapon">
                </div>
            </div>
        `;

        const container = document.createElement('div');
        container.innerHTML = html;
        document.body.appendChild(container);

        document.getElementById('outcomeSelect').value = outcome;
        document.getElementById('weaponSelect').value = defaultWeapon;
        document.getElementById('useTempCheckbox').checked = useTemp;

        document.getElementById('outcomeSelect').addEventListener('change', e => {
            outcome = e.target.value;
            GM_setValue("outcome", outcome);
            moveButton();
        });

        document.getElementById('weaponSelect').addEventListener('change', e => {
            defaultWeapon = e.target.value;
            GM_setValue("defaultWeapon", defaultWeapon);
            moveButton();
        });

        document.getElementById('useTempCheckbox').addEventListener('change', e => {
            useTemp = e.target.checked;
            GM_setValue("useTemp", useTemp);
            moveButton();
        });
    }

    function moveButton() {
        const optionsDialogBox = document.querySelector(buttonSelector);
        if (!optionsDialogBox) return;

        const buttons = optionsDialogBox.children;
        const selectedIndex = outcomeMap[outcome];

        for (const btn of buttons) {
            btn.classList.remove("btn-move");
            const text = btn.innerText.toLowerCase();
            const index = [...buttons].indexOf(btn);

            if (text.includes("fight") || index === selectedIndex) {
                btn.classList.add("btn-move");
                calculateStyle(defaultWeapon, useTemp);
            }
        }
    }

    function calculateStyle(weapon, temp = false) {
        let topMobile, topTablet, topDesktop;

        if (temp) {
            topMobile = topTablet = topDesktop = `297.5px`;
        } else {
            switch (weapon) {
                case "primary":
                    topMobile = topTablet = topDesktop = `10px`;
                    break;
                case "secondary":
                    topMobile = `75px`;
                    topTablet = topDesktop = `110px`;
                    break;
                case "melee":
                    topMobile = `140px`;
                    topTablet = topDesktop = `210px`;
                    break;
            }
        }

        applyCSS(topMobile, topTablet, topDesktop);
    }

    function applyCSS(topMobile, topTablet, topDesktop) {
        const size = window.innerWidth;
        const top = size <= 600 ? topMobile : (size <= 1000 ? topTablet : topDesktop);
        const left = size <= 600 ? "-100px" : (size <= 1000 ? "-140px" : "-150px");

        GM_addStyle(`
            div[class^="dialogButtons___"] > button.btn-move {
                position: absolute;
                left: ${left};
                top: ${top};
                height: 60px;
                width: 120px;
                z-index: 1000;
            }
            .playerWindow___aDeDI {
                overflow: visible !important;
            }
            .modelWrap___j3kfA {
                visibility: visible !important;
                width: 322px !important;
            }
        `);
    }

    function waitForElement(selector, callback) {
        const check = setInterval(() => {
            const el = document.querySelector(selector);
            if (el) {
                clearInterval(check);
                callback(el);
            }
        }, 200);
    }

    function initObserver() {
        const config = { attributes: true, childList: true, subtree: true };
        const observer = new MutationObserver(() => {
            if (document.querySelector(buttonSelector)) {
                moveButton();
            }
        });

        waitForElement(playerArea, wrapper => {
            observer.observe(wrapper, config);
        });
    }

    // Main Execution
    waitForElement(buttonSelector, moveButton);
    window.addEventListener("resize", moveButton);
    window.addEventListener("load", () => {
        injectUI();
        initObserver();
    });
})();