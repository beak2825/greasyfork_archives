// ==UserScript==
// @name         OC Role Display - Ravage Edition - V2
// @namespace    http://tampermonkey.net/
// @version      1.2.6
// @description  Dynamically numbers duplicate OC roles based on slot order
// @author       darrellia
// @match        https://www.torn.com/factions.php?step=your*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        GM_info
// @download     https://update.greasyfork.org/scripts/529844/OC%20Role%20Display.user.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/535392/OC%20Role%20Display%20-%20Ravage%20Edition%20-%20V2.user.js
// @updateURL https://update.greasyfork.org/scripts/535392/OC%20Role%20Display%20-%20Ravage%20Edition%20-%20V2.meta.js
// ==/UserScript==

(async function() {
    'use strict';
    // Different threshold for each OC:
    const defaultLevel6 = 70;
    const defaultLevel5 = 65;
    const defaultLevel4 = 65;
    const defaultLevel3 = 65;
    const defaultLevel2 = 65;
    const defaultDecline = 700;


    // Data that doesn't change can be stored in a quick-lookup Map:
    const ocRoles = [
        {
            OCName: "Blast From The Past",
            Positions: {
                "PICKLOCK 1": 70,
                "HACKER": 70,
                "ENGINEER": 70,
                "BOMBER": 70,
                "MUSCLE": 73,
                "PICKLOCK 2": 67
            }
        },
        {
            OCName: "Break The Bank",
            Positions: {
                "ROBBER": 60,
                "MUSCLE 1": 58,
                "THIEF 1": 55,
                "MUSCLE 2": 55,
                "MUSCLE 3": 60,
                "THIEF 2": 60
            }
        },
        {
            OCName: "Honey Trap",
            Positions: `default_${defaultLevel6}`
        },
        {
            OCName: "Leave No Trace",
            Positions: `default_${defaultLevel5}`
        },
        {
            OCName: "Stage Fright",
            Positions: `default_${defaultLevel4}`
        },
                {
            OCName: "Pet Project",
            Positions: `default_${defaultDecline}`
        },
                {
            OCName: "Cash Me If You Can",
            Positions: `default_${defaultLevel2}`
        },
                {
            OCName: "Smoke and Wing Mirrors",
            Positions: `default_${defaultDecline}`
        },{
            OCName: "Market Forces",
            Positions: `default_${defaultLevel3}`
        }




    ];

    // Cache for storing "role name array" for each OC, so we don't re-build every time
    const roleMappings = {};

    /**
     * Processes a single scenario (OC panel) – numbering duplicate roles and color-coding.
     */
    function processScenario(panel) {
        // Skip if we've processed this specific panel already
        if (panel.classList.contains('role-processed')) return;
        panel.classList.add('role-processed');

        const ocName = panel.querySelector('.panelTitle___aoGuV')?.innerText.trim() || "Unknown";
        const slots = panel.querySelectorAll('.wrapper___Lpz_D');

        // Build roleMappings[ocName] if we haven’t yet.
        if (!roleMappings[ocName]) {
            // Gather each slot’s numeric position
            const slotsWithPos = Array.from(slots).map(slot => {
                const fiberKey = Object.keys(slot).find(k => k.startsWith('__reactFiber$'));
                if (!fiberKey) return null;
                const fiberNode = slot[fiberKey];
                const slotKey = fiberNode.return.key.replace('slot-', '');
                const posNum = parseInt(slotKey.match(/P(\d+)/)?.[1] || '0', 10);
                return { slot, positionNumber: posNum };
            }).filter(Boolean);

            // Sort by position so we assign duplicates in the correct user-visible order
            slotsWithPos.sort((a, b) => a.positionNumber - b.positionNumber);

            // Collect raw names from the DOM
            const originalNames = slotsWithPos.map(({ slot }) =>
                slot.querySelector('.title___UqFNy')?.innerText.trim() || 'Unknown'
            );

            // Count how many times each name appears
            const freq = {};
            originalNames.forEach(name => {
                freq[name] = (freq[name] || 0) + 1;
            });

            // For duplicates, append numeric suffix
            const finalNames = [];
            const counter = {};
            originalNames.forEach(name => {
                if (freq[name] > 1) {
                    counter[name] = (counter[name] || 0) + 1;
                    finalNames.push(`${name} ${counter[name]}`);
                } else {
                    finalNames.push(name);
                }
            });

            // Store final labeling array
            roleMappings[ocName] = finalNames;
        }

        // Now color code each slot and rename if needed
        Array.from(slots).forEach(slot => {
            const fiberKey = Object.keys(slot).find(k => k.startsWith('__reactFiber$'));
            if (!fiberKey) return;
            const fiberNode = slot[fiberKey];
            const positionKey = fiberNode.return.key.replace('slot-', '');
            const posNum = parseInt(positionKey.match(/P(\d+)/)?.[1] || '0', 10);
            const roleIndex = posNum - 1;
            const joinBtn = slot.querySelector("button[class^='torn-btn joinButton']");

            // The final labeled name from our roleMappings array
            const finalName = roleMappings[ocName][roleIndex];

            // Color-coding: find success chance vs required threshold
            const successStr = slot.querySelector('.successChance___ddHsR')?.textContent.trim() || '';
            const successChance = parseInt(successStr, 10) || 0;

            // Identify threshold from ocRoles data
            const ocData = ocRoles.find(o => o.OCName === ocName);
            let required = null;
            if (ocData) {
                if (typeof ocData.Positions === 'string' && ocData.Positions.startsWith('default_')) {
                    // e.g. default_70
                    required = parseInt(ocData.Positions.split('_')[1], 10) || 70;
                } else if (typeof ocData.Positions === 'object') {
                    // For "Blast From The Past" / "Break The Bank" with explicit keys
                    if (ocData.Positions[finalName] !== undefined) {
                        required = ocData.Positions[finalName];
                    }
                }
            }

            // Apply color highlight if we have a valid threshold
            if (required !== null) {
                slot.style.backgroundColor =
                    (successChance < required) ? '#ff000061' : '#21a61c61';
                if (successChance < required) {
                    joinBtn?.setAttribute('disabled', '');
                } else {
                    joinBtn?.removeAttribute('disabled');
                }
            }

            // Update displayed role name if different
            const roleElem = slot.querySelector('.title___UqFNy');
            if (finalName && roleElem && roleElem.innerText.trim() !== finalName) {
                roleElem.innerText = finalName;
            }
        });
    }

    /**
     * Sets up a single MutationObserver that processes new or changed OC panels as they appear.
     * This is more efficient than scanning on every hash change or button click.
     */
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            if (mutation.addedNodes.length) {
                mutation.addedNodes.forEach(node => {
                    // If the node *is* a scenario panel
                    if (node.nodeType === 1 && node.matches('.wrapper___U2Ap7')) {
                        processScenario(node);
                    }
                    // If the node *contains* any scenario panels
                    if (node.nodeType === 1) {
                        const innerPanels = node.querySelectorAll?.('.wrapper___U2Ap7') || [];
                        innerPanels.forEach(inner => processScenario(inner));
                    }
                });
            }
        });
    });

    // Observe #factionCrimes-root or body (fallback) so we catch all new OCs
    const targetNode = document.querySelector('#factionCrimes-root') || document.body;
    observer.observe(targetNode, {
        childList: true,
        subtree: true
    });

    // On page load, also handle any existing panels
    window.addEventListener('load', () => {
        document.querySelectorAll('.wrapper___U2Ap7').forEach(panel => {
            processScenario(panel);
        });
    });

})();