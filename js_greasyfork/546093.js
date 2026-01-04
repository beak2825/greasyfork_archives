// ==UserScript==
// @name         OC Role Display - 39th OG Edition
// @namespace    http://tampermonkey.net/
// @version      6.6
// @description  Adding minimum and maximum CPR requirements in accordance with 39th Street Killers OC 6.6 requirements
// @author       Verboten, ChatGPT, based on work originally done by Allenone, Darrelia, and CPRs for 39th OG put in by Kohnago
// @match        https://www.torn.com/factions.php?step=your*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        GM_info
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/546093/OC%20Role%20Display%20-%2039th%20OG%20Edition.user.js
// @updateURL https://update.greasyfork.org/scripts/546093/OC%20Role%20Display%20-%2039th%20OG%20Edition.meta.js
// ==/UserScript==
(async function() {
    'use strict';

    // Inject styles
    const style = document.createElement('style');
    style.innerHTML = `
    @keyframes pulseBorder {
        0%   { box-shadow: 0 0 8px var(--pulse-color, red); }
        50%  { box-shadow: 0 0 18px var(--pulse-color, red); }
        100% { box-shadow: 0 0 8px var(--pulse-color, red); }
    }
    .pulse-border { animation: pulseBorder 1s infinite; }

    .status-red {
        --pulse-color: rgba(255,0,0,0.7);
        background-color: rgba(153, 0, 0, 0.6);
        outline: 4px solid red;
    }
    .status-green {
        --pulse-color: rgba(23,116,19,0.7);
        background-color: rgba(23, 116, 19, 0.6);
        outline: none;
    }
    .status-brightgreen {
        --pulse-color: rgba(33,166,28,0.7);
        background-color: rgba(33, 166, 28, 0.6);
        outline: 4px solid #21a61c;
    }
    `;
    document.head.appendChild(style);

    // Defaults
    const defaultLevel6 = 70;
    const defaultLevel5 = 65;
    const defaultLevel4 = 65;
    const defaultLevel2 = 65;
    const defaultDecline = 700;

    // === Requirements ===
    const ocRoles = [
        {
            OCName: "Blast From The Past",
            Positions: {
                "PICKLOCK #1": 60,
                "HACKER": 60,
                "ENGINEER": 70,
                "BOMBER": 70,
                "MUSCLE": 70,
                "PICKLOCK #2": { max: 60 }
            }
        },{
            OCName: "Stacking the Deck",
            Positions: {
                "HACKER": 65,
                "IMITATOR": 65,
                "CAT BURGLAR": 65,
                "DRIVER": 55
            }
        },
        {
            OCName: "Ace in the Hole",
            Positions: {
                "HACKER": 65,
                "DRIVER": 55,
                "MUSCLE #1": 65,
                "IMITATOR": 65,
                "MUSCLE #2": 65
            }
        },
        {
            OCName: "Break the Bank",
            Positions: {
                "ROBBER": 68,
                "MUSCLE #1": 68,
                "THIEF #1": 60,
                "MUSCLE #2": 65,
                "MUSCLE #3": 70,
                "THIEF #2": 70
            }
        },
        {
            OCName: "Clinical Precision",
            Positions: {
                "ASSASSIN": 65,
                "CAT BURGLAR": 65,
                "CLEANER": 65,
                "IMITATOR": 65,
            }
        },
        {
            OCName: "Manifest Cruelty",
            Positions: {
                "HACKER": 65,
                "INTERROGATOR": 65,
                "REVIVER": 65,
                "CAT BURGLAR": 65,
            }
        },
        {
            OCName: "Gone Fission",
            Positions: {
                "IMITATOR": 60,
                "PICKPOCKET": 60,
                "BOMBER": 63,
                "HIJACKER": 60,
                "ENGINEER": 60,
            }
        },
        {
            OCName: "Crane Reaction",
            Positions: {
                "LOOKOUT": 58,
                "SNIPER": 58,
                "BOMBER": 58,
                "ENGINEER": 58,
                "MUSCLE #1": 58,
                "MUSCLE #2": 58,
            }
        },
        { OCName: "Honey Trap", Positions: `default_${defaultLevel6}` },
        { OCName: "Leave No Trace", Positions: `default_${defaultLevel5}` },
        { OCName: "Stage Fright", Positions: `default_${defaultLevel4}` },
        { OCName: "Snow Blind", Positions: `default_${defaultLevel4}` },
        { OCName: "Pet Project", Positions: `default_${defaultLevel2}` },
        { OCName: "Cash Me If You Can", Positions: `default_${defaultLevel2}` },
        { OCName: "Smoke and Wing Mirrors", Positions: `default_${defaultLevel2}` },
        { OCName: "Market Forces", Positions: `default_${defaultLevel2}` },
        { OCName: "No Reserve", Positions: `default_${defaultLevel5}` },
        { OCName: "Stacking the Deck", Positions: `default_${defaultDecline}` }
    ];

    function processScenario(panel) {
        if (panel.classList.contains('role-processed')) return;
        panel.classList.add('role-processed');

        const ocName = panel.querySelector('.panelTitle___aoGuV')?.innerText.trim() || "Unknown";
        const slots = panel.querySelectorAll('.wrapper___Lpz_D');

        Array.from(slots).forEach(slot => {
            const roleElem   = slot.querySelector('.title___UqFNy');
            const chanceElem = slot.querySelector('.successChance___ddHsR');
            if (!roleElem || !chanceElem) return;

            const rawRole       = roleElem.innerText.trim();
            const successChance = parseInt(chanceElem.textContent.trim(), 10) || 0;
            const joinBtn       = slot.querySelector("button[class^='torn-btn joinButton']");
            const honorTexts    = slot.querySelectorAll('.honor-text');
            const userName      = honorTexts.length > 1 ? honorTexts[1].textContent.trim() : null;

            const ocData = ocRoles.find(o => o.OCName.toLowerCase() === ocName.toLowerCase());
            let required = null;
            let isMax = false;

            if (ocData) {
                if (typeof ocData.Positions === 'string' && ocData.Positions.startsWith('default_')) {
                    required = parseInt(ocData.Positions.split('_')[1], 10);
                } else if (typeof ocData.Positions === 'object' && ocData.Positions[rawRole] !== undefined) {
                    if (typeof ocData.Positions[rawRole] === "object" && ocData.Positions[rawRole].max) {
                        required = ocData.Positions[rawRole].max;
                        isMax = true;
                    } else {
                        required = ocData.Positions[rawRole];
                    }
                }
            }
            if (required === null) return;

            slot.classList.remove('status-red', 'status-green', 'status-brightgreen', 'pulse-border');
            slot.style.boxShadow = '';
            slot.style.outline = '';
            slot.style.outlineOffset = '';

            let valid = true;
            if (isMax) {
                if (successChance > required) valid = false;
            } else {
                if (successChance < required) valid = false;
            }

            if (userName) { // occupied slot
                slot.classList.add(valid ? 'status-green' : 'status-red');
                if (!valid) slot.classList.add('pulse-border'); // pulse only for invalid occupants
            } else { // empty slot
                slot.style.backgroundColor = valid ? 'rgba(23, 116, 19, 0.6)' : 'rgba(153, 0, 0, 0.6)'; // green or red background
                slot.classList.remove('status-red', 'status-green', 'pulse-border'); // remove any class that might add outlines
                slot.style.outline = ''; // ensure no outline
            }

            if (joinBtn) {
                if (valid) joinBtn.removeAttribute('disabled');
                else joinBtn.setAttribute('disabled', '');
            }
        });
    }

    const observer = new MutationObserver(mutations => {
        mutations.forEach(m => {
            m.addedNodes.forEach(node => {
                if (node.nodeType !== 1) return;
                if (node.matches('.wrapper___U2Ap7')) processScenario(node);
                else node.querySelectorAll?.('.wrapper___U2Ap7').forEach(processScenario);
            });
        });
    });

    const targetNode = document.querySelector('#factionCrimes-root') || document.body;
    observer.observe(targetNode, { childList: true, subtree: true });

    window.addEventListener('load', () => {
        document.querySelectorAll('.wrapper___U2Ap7').forEach(processScenario);
    });
})();