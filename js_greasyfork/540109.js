// ==UserScript==
// @name         Torn.com Auto-Set Employee Pay
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Logs matches and input updates when setting employee wages on Torn.com using API data.
// @match        https://www.torn.com/companies.php*
// @grant        GM_xmlhttpRequest
// @connect      api.torn.com
// @author       Riot [974353]
// @license      MIT License
// @downloadURL https://update.greasyfork.org/scripts/540109/Torncom%20Auto-Set%20Employee%20Pay.user.js
// @updateURL https://update.greasyfork.org/scripts/540109/Torncom%20Auto-Set%20Employee%20Pay.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const API_KEY = 'ABCDEFG'; // ✅ Replace with your real API key
    const API_URL = `https://api.torn.com/company/?selections=employees&key=${API_KEY}`;

    function calculateWage(employee) {
        const manual = Number(employee.manual_labor) || 0;
        const intel = Number(employee.intelligence) || 0;
        const endur = Number(employee.endurance) || 0;
        const merits = Number(employee.effectiveness?.merits) || 0;
        const addiction = Number(employee.effectiveness?.addiction ?? 0);
        const inactivity = Number(employee.effectiveness?.inactivity);

        const baseStat = Math.max(manual, intel, endur);
        let wage = Math.min(baseStat * 10, 3_000_000);

        const log = [`🧮 ${employee.name}:`];
        log.push(`  • Base stat: ${baseStat} → Wage: ${wage.toLocaleString()}`);

        if (merits > 0) {
            const meritBonus = Math.min(merits * 100_000, 1_000_000);
            wage += meritBonus;
            log.push(`  • Merits (${merits}) → +${meritBonus.toLocaleString()}`);
        }


        if (addiction === 0) {
            wage += 500_000;
            log.push(`  • Addiction (${addiction}) → +500,000`);
        } else if (addiction >= -10 && addiction < 0) {
            wage += 250_000;
            log.push(`  • Addiction (${addiction}) → +250,000`);
        } else if (addiction < -10) {
            const penalty = 100_000 * (Math.abs(addiction) - 10);
            wage -= penalty;
            log.push(`  • Addiction (${addiction}) → -${penalty.toLocaleString()}`);
        }


        if (!isNaN(inactivity) && inactivity < 0) {
            const penalty = Math.abs(inactivity) * 250_000;
            wage -= penalty;
            log.push(`  • Inactivity (${inactivity}) → -${penalty.toLocaleString()}`);
        }

        wage = Math.max(0, Math.round(wage));
        log.push(`  → Final Wage: $${wage.toLocaleString()}`);
        console.log(log.join('\n'));
        return wage;
    }

    function updateWages(employeesData) {
        const employeeElements = document.querySelectorAll('ul.employee-list li[data-user]');
        console.log(`🧠 Found ${employeeElements.length} employee elements in DOM`);

        employeeElements.forEach((li) => {
            const userId = li.getAttribute('data-user');
            const employee = employeesData[Number(userId)];

            if (!employee) {
                console.warn(`⚠️ No API data for user ID ${userId}`);
                return;
            }

            const wage = calculateWage(employee);
            const previousWage = Number(employee.wage) || 0;

            const hiddenInput = li.querySelector('.employee-input-pay[type="hidden"]');
            const visibleInput = li.querySelector('.employee-input-pay[type="text"]');

            if (!hiddenInput && !visibleInput) {
                console.warn(`⚠️ No inputs found for ${employee.name} [${userId}]`);
                return;
            }

            console.log(`✅ Updating ${employee.name} (ID: ${userId}) ($${previousWage.toLocaleString()}) → $${wage.toLocaleString()}`);

            if (hiddenInput) {
                hiddenInput.value = wage;
                //console.log(`   🔒 Hidden input set to: ${hiddenInput.value}`);
            }

            if (visibleInput) {
                visibleInput.value = wage.toLocaleString();
                visibleInput.dispatchEvent(new Event('input', { bubbles: true }));
                //console.log(`   👁️ Visible input set to: ${visibleInput.value}`);
            }
        });
    }

    function fetchAndApplyWages() {
        console.log("📡 Fetching employee effectiveness from Torn API...");

        GM_xmlhttpRequest({
            method: 'GET',
            url: API_URL,
            onload: function (response) {
                const data = JSON.parse(response.responseText);

                if (!data.company_employees) {
                    console.error("❌ No 'company_employees' field in API response!");
                    console.log("🔎 Response received:", data);
                    return;
                }

                updateWages(data.company_employees);
            },
            onerror: (e) => {
                console.error('❌ API request failed', e);
            }
        });
    }

    function observePageLoad() {
        const observer = new MutationObserver((mutations, obs) => {
            const employeeList = document.querySelector('ul.employee-list li[data-user]');
            if (employeeList) {
                obs.disconnect(); // Stop observing
                console.log("✅ Detected employee list loaded — beginning wage update");
                setTimeout(fetchAndApplyWages, 1000); // Allow DOM to settle
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }

    window.addEventListener('load', () => {
        console.log("🚀 Script loaded and watching for employee list...");
        observePageLoad();
    });
})();
