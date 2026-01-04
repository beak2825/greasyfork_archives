// ==UserScript==
// @name         Add Multi-Dice Roller Tab to Panel Tabs
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Adds a very basic dice tab to the sidebar with various die sizes
// @match        https://ogres.app/play/*
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/542182/Add%20Multi-Dice%20Roller%20Tab%20to%20Panel%20Tabs.user.js
// @updateURL https://update.greasyfork.org/scripts/542182/Add%20Multi-Dice%20Roller%20Tab%20to%20Panel%20Tabs.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const MAX_RETRIES = 100;
    const RETRY_INTERVAL_MS = 100;
    let attempts = 0;

    function tryAddDiceTab() {
        const ul = document.querySelector('ul.panel-tabs');
        if (!ul) {
            if (attempts < MAX_RETRIES) {
                attempts++;
                if (attempts % 10 === 0) {
                    console.log(`[DiceTab] Waiting... (attempt ${attempts})`);
                }
                setTimeout(tryAddDiceTab, RETRY_INTERVAL_MS);
                return;
            } else {
                console.warn('[DiceTab] ul.panel-tabs not found after max retries.');
                return;
            }
        }

        console.log('[DiceTab] Found ul.panel-tabs, adding dice tab...');

        const li = document.createElement('li');
        li.className = 'panel-tabs-tab';
        // option 2:
        li.style.cursor = 'pointer';


        const label = document.createElement('label');

        const input = document.createElement('input');
        input.type = 'radio';
        input.name = 'panel';
        input.value = 'dice';

        // SVG DICE
        const svgNS = 'http://www.w3.org/2000/svg';
        const svg = document.createElementNS(svgNS, 'svg');
        svg.setAttribute('width', '16');
        svg.setAttribute('height', '16');
        svg.setAttribute('viewBox', '0 0 16 16');
        svg.setAttribute('fill', 'currentColor');

        const die = document.createElementNS(svgNS, 'rect');
        die.setAttribute('x', '1');
        die.setAttribute('y', '1');
        die.setAttribute('width', '14');
        die.setAttribute('height', '14');
        die.setAttribute('rx', '2');
        die.setAttribute('ry', '2');
        die.setAttribute('stroke', 'currentColor');
        die.setAttribute('fill', 'none');
        svg.appendChild(die);

        const createDot = (cx, cy) => {
            const dot = document.createElementNS(svgNS, 'circle');
            dot.setAttribute('cx', cx);
            dot.setAttribute('cy', cy);
            dot.setAttribute('r', '1.2');
            dot.setAttribute('fill', 'currentColor');
            return dot;
        };

        // D6 face with 6 dots
        const positions = [
            [4, 4], [8, 4], [12, 4],
            [4, 12], [8, 12], [12, 12],
        ];
        positions.forEach(([cx, cy]) => svg.appendChild(createDot(cx, cy)));

        // END SVG DICE


        label.appendChild(input);
        label.appendChild(svg);
        li.appendChild(label);
        //ul.appendChild(li);
        const lastItem = ul.lastElementChild;
        ul.insertBefore(li, lastItem);

        console.log('[DiceTab] Dice tab added. Setting up interaction...');

        input.addEventListener('change', () => {
            if (!input.checked) return;

            console.log('[DiceTab] Dice tab selected — updating .form-body...');
            const panel = document.querySelector('.form-body');
            if (!panel) {
                console.warn('[DiceTab] .form-body not found.');
                return;
            }

            // Setup other tabs to hide dice panel
            const otherTabs = [...ul.querySelectorAll('li.panel-tabs-tab')].filter(el => el !== li);
            otherTabs.forEach(tab => {
                tab.addEventListener('click', () => {
                    const panel = document.querySelector('#form-panel');
                    if (!panel) return;

                    const dicePanel = panel.querySelector('#dice-panel');
                    if (dicePanel) {
                        dicePanel.style.display = 'none';
                    }
                });
            });


            // Hide all direct children of #form-panel
[...panel.children].forEach(child => child.style.display = 'none');

            // Create or show dice panel
let dicePanel = document.querySelector('#dice-panel');
if (!dicePanel) {
    dicePanel = document.createElement('div');
    dicePanel.id = 'dice-panel';
    dicePanel.style.padding = '1em';

    const result = document.createElement('div');
    result.textContent = '🎲 Click a die to roll.';
    result.style.marginTop = '1em';

    // History display
    const historyTitle = document.createElement('div');
    historyTitle.textContent = 'Last 100 rolls:';
    historyTitle.style.marginTop = '1em';
    historyTitle.style.fontWeight = 'bold';

    const historyList = document.createElement('ul');
    historyList.style.paddingLeft = '20px';
    //historyList.style.maxHeight = '120px';
    historyList.style.overflowY = 'auto';
    historyList.style.fontSize = '0.9em';

    // Rolling buffer array
    const rollHistory = [];

    const dice = [4, 6, 8, 10, 12, 20, 100];
    dice.forEach(sides => {
        const btn = document.createElement('button');
        btn.textContent = `d${sides}`;
        btn.style.marginRight = '0.5em';
        btn.addEventListener('click', () => {
            const roll = Math.floor(Math.random() * sides) + 1;
            result.textContent = `🎲 You rolled a ${roll} on a d${sides}`;

            // Add to history
            rollHistory.unshift(`d${sides}: ${roll}`);
            if (rollHistory.length > 100) rollHistory.pop();

            // Update history display
            historyList.innerHTML = '';
            rollHistory.forEach(entry => {
                const li = document.createElement('li');
                li.textContent = entry;
                historyList.appendChild(li);
            });
        });
        dicePanel.appendChild(btn);
    });

    dicePanel.appendChild(result);
    dicePanel.appendChild(historyTitle);
    dicePanel.appendChild(historyList);

    const footer = document.querySelector('.form-footer');
    if (footer) {
        footer.style.visibility = "hidden";
    }

    panel.appendChild(dicePanel);

}

dicePanel.style.display = 'block';


// Show our dice panel
dicePanel.style.display = 'block';

        });
    }

    console.log('[DiceTab] Starting tab insert with retry logic...');
    tryAddDiceTab();
})();
