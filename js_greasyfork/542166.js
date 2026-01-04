// ==UserScript==
// @name         Deepco Recursion Efficiency
// @namespace    http://tampermonkey.net/
// @version      2.2
// @description  Calculates efficiency of recursion upgrades according to algorithims by Emsou & Soda
// @author       Bir & ChatGPT
// @match        https://deepco.app/upgrades
// @icon         https://www.google.com/s2/favicons?sz=64&domain=deepco.app
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/542166/Deepco%20Recursion%20Efficiency.user.js
// @updateURL https://update.greasyfork.org/scripts/542166/Deepco%20Recursion%20Efficiency.meta.js
// ==/UserScript==

(function () {
    'use strict';

    console.log('[Deepco Efficiency] Script loaded');

    const style = `
        .deepco-efficiency-panel {
            position: fixed;
            top: 20px;
            right: 20px;
            width: 300px;
            background: #1e1e1e;
            color: #ddd;
            font-family: sans-serif;
            font-size: 14px;
            border: 1px solid #555;
            border-radius: 10px;
            padding: 10px;
            box-shadow: 0 0 10px #000;
            z-index: 9999;
        }
        .deepco-efficiency-panel h3 {
            margin: 0 0 10px;
            border-bottom: 1px solid #444;
            padding-bottom: 5px;
            font-size: 16px;
        }
        .deepco-efficiency-entry {
            margin: 5px 0;
            display: flex;
            justify-content: space-between;
        }
        .highlight-efficient {
            outline: 3px solid limegreen !important;
            outline-offset: 2px;
        }
    `;
    const styleTag = document.createElement('style');
    styleTag.textContent = style;
    document.head.appendChild(styleTag);

    function extractValueFromText(text) {
        const match = text.match(/([\d.]+)%/);
        return match ? parseFloat(match[1]) : null;
    }

   function extractCostFromText(text) {
    const match = text.match(/\(([\d.]+)\s*RC\)/); // now supports decimals like 123.0
    const cost = match ? parseFloat(match[1]) : null;
    return cost;
}


    function parseUpgrades() {
        const frame = document.querySelector('#recursive-upgrades');
        if (!frame) {
            return [];
        }

        const paragraphs = [...frame.querySelectorAll('p')];
        const upgrades = [];

        for (let i = 0; i < paragraphs.length - 1; i++) {
            const p = paragraphs[i];
            const text = p.textContent.trim();

            // Skip Queue Slots line
            if (/Queue Slots/i.test(text)) continue;

            const value = extractValueFromText(text);
            // Extract name more robustly
            const nameMatch = text.match(/^(.*?)(?: Bonus)?:/i);
            const name = nameMatch ? nameMatch[1].trim() : 'Unknown';

            // Find next FORM sibling, skipping any spacer <p>
            let next = p.nextElementSibling;
            while (next && next.tagName !== 'FORM') {
                next = next.nextElementSibling;
            }
            const form = next;
            if (!form) continue;

            const button = form.querySelector('button');
            if (!button) continue;

            const cost = extractCostFromText(button.textContent);


            if (value !== null && cost !== null) {
                upgrades.push({ name, value, cost, button });
            }
        }

        return upgrades;
    }

    function calculateEfficiencies(upgrades) {
    const minUpgrade = upgrades.find(u => u.name.toLowerCase().includes('min processing'));
    const maxUpgrade = upgrades.find(u => u.name.toLowerCase().includes('max processing'));
    const totalUpgrade = upgrades.find(u => u.name.toLowerCase().includes('total processing'));
    const dcYieldUpgrade = upgrades.find(u => u.name.toLowerCase().includes('dc yield'));

    if (!minUpgrade || !maxUpgrade || !totalUpgrade || !dcYieldUpgrade) {
        console.warn('[Deepco Efficiency] Missing one or more upgrades for calculation');
        return upgrades.map(u => ({ ...u, efficiency: 0 }));
    }

    const minVal = minUpgrade.value;
    const maxVal = maxUpgrade.value;
    const totalVal = totalUpgrade.value;
    const dcYieldVal = dcYieldUpgrade.value;

    const costMin = minUpgrade.cost;
    const costMax = maxUpgrade.cost;
    const costTotal = totalUpgrade.cost;
    const costDCYield = dcYieldUpgrade.cost;

    const minMult = ((minVal) / 100 + 1) * (totalVal / 100 + 1);
    const maxMult = ((maxVal) / 100 + 1) * (totalVal / 100 + 1);

    const minThresh = ((minVal + 1) / 100 + 1) * (totalVal / 100 + 1);
    const maxThresh = ((maxVal + 1) / 100 + 1) * (totalVal / 100 + 1);

    const totalDmgPlus = (totalVal + 1) / 100;
    const totalDmgBase = totalVal / 100;

    const dcYieldIncr = (dcYieldVal + 1) / dcYieldVal;

    return upgrades.map(u => {
        let efficiency = 0;
        const C = u.cost;

        const name = u.name.toLowerCase();

        if (name.includes('min processing')) {
            efficiency = (((minThresh / minMult) - 1) * 100 * 0.6) / C;
        } else if (name.includes('max processing')) {
            efficiency = (((maxThresh / maxMult) - 1) * 100) / C;
        } else if (name.includes('total processing')) {
            efficiency = ((((totalDmgPlus / totalDmgBase) - 1) * 100)) / C;
        } else if (name.includes('dc yield')) {
            efficiency = (((dcYieldIncr - 1) * 100) * 2) / C;
        }

        return { ...u, efficiency };
    });
}

    function displayEfficiencies(results) {
    let container = document.querySelector('.deepco-efficiency-panel');
    if (!container) {
        container = document.createElement('div');
        container.className = 'deepco-efficiency-panel';
        document.body.appendChild(container);
    }

    container.innerHTML = `<h3>Efficiency Panel</h3>`;

    results.forEach(upg => {
        const row = document.createElement('div');
        row.className = 'deepco-efficiency-entry';
        row.style.borderBottom = '1px solid #444';
        row.style.padding = '5px 0';

        // Format value display for clarity (could tweak if some upgrades are not %)
        const valueDisplay = upg.value !== null ? `${upg.value}${upg.name.includes('Yield') || upg.name.includes('Processing') ? '%' : '%'}` : 'N/A';

        row.innerHTML = `
            <div><strong>${upg.name}</strong></div>
            <div>Current Value: <span>${valueDisplay}</span></div>
            <div>Cost: <span>${upg.cost} RC</span></div>
            <div>Efficiency: <span>${upg.efficiency.toFixed(4)}</span></div>
        `;
        container.appendChild(row);
    });

    console.log('[Deepco Efficiency] Panel updated');
}
    function highlightBest(upgrades) {
        upgrades.forEach(u => u.button.classList.remove('highlight-efficient'));
        const best = upgrades.reduce((a, b) => (a.efficiency > b.efficiency ? a : b));
        best.button.classList.add('highlight-efficient');

        console.log(`[Deepco Efficiency] Highlighted: ${best.name}`);
    }

    function isRecursionTabVisible() {
        const tab = document.querySelector('[data-tab-id="recursive"]');
        return tab && getComputedStyle(tab).display !== 'none';
    }

    function tryRun() {
        if (isRecursionTabVisible()) {
            console.log('[Deepco Efficiency] Recursion tab visible');
            run();
        } else {
            console.log('[Deepco Efficiency] Recursion tab not visible');
        }
    }

    function run() {
        const raw = parseUpgrades();
        const calculated = calculateEfficiencies(raw);
        displayEfficiencies(calculated);
        highlightBest(calculated);
    }

    const interval = setInterval(() => {
        tryRun();
    }, 1000);

    window.addEventListener('beforeunload', () => clearInterval(interval));
})();