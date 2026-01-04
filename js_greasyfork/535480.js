// ==UserScript==
// @name         OC Role Display - Ravage Edition - V3
// @namespace    http://tampermonkey.net/
// @version      1.3.2
// @description  Dynamically numbers duplicate OC roles based on slot order
// @author       NotIbbyz
// @match        https://www.torn.com/factions.php?step=your*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        GM_info
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/535480/OC%20Role%20Display%20-%20Ravage%20Edition%20-%20V3.user.js
// @updateURL https://update.greasyfork.org/scripts/535480/OC%20Role%20Display%20-%20Ravage%20Edition%20-%20V3.meta.js
// ==/UserScript==

(async function() {
    'use strict';

    // Inject pulse animation
    const style = document.createElement('style');
    style.innerHTML = `
    @keyframes pulseRed {
        0% { box-shadow: 0 0 8px red; }
        50% { box-shadow: 0 0 18px red; }
        100% { box-shadow: 0 0 8px red; }
    }
    .pulse-border-red {
        animation: pulseRed 1s infinite;
    }
    `;
    document.head.appendChild(style);

    const defaultLevel6 = 70;
    const defaultLevel5 = 65;
    const defaultLevel4 = 65;
    const defaultLevel3 = 65;
    const defaultLevel2 = 65;
    const defaultDecline = 700;

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
        },
        {
            OCName: "Market Forces",
            Positions: `default_${defaultLevel3}`
        }
    ];

    const roleMappings = {};

    function processScenario(panel) {
        if (panel.classList.contains('role-processed')) return;
        panel.classList.add('role-processed');

        const ocName = panel.querySelector('.panelTitle___aoGuV')?.innerText.trim() || "Unknown";
        const slots = panel.querySelectorAll('.wrapper___Lpz_D');

        if (!roleMappings[ocName]) {
            const slotsWithPos = Array.from(slots).map(slot => {
                const fiberKey = Object.keys(slot).find(k => k.startsWith('__reactFiber$'));
                if (!fiberKey) return null;
                const fiberNode = slot[fiberKey];
                const slotKey = fiberNode.return.key.replace('slot-', '');
                const posNum = parseInt(slotKey.match(/P(\d+)/)?.[1] || '0', 10);
                return { slot, positionNumber: posNum };
            }).filter(Boolean);

            slotsWithPos.sort((a, b) => a.positionNumber - b.positionNumber);

            const originalNames = slotsWithPos.map(({ slot }) =>
                slot.querySelector('.title___UqFNy')?.innerText.trim() || 'Unknown'
            );

            const freq = {};
            originalNames.forEach(name => {
                freq[name] = (freq[name] || 0) + 1;
            });

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

            roleMappings[ocName] = finalNames;
        }

        Array.from(slots).forEach(slot => {
            const fiberKey = Object.keys(slot).find(k => k.startsWith('__reactFiber$'));
            if (!fiberKey) return;
            const fiberNode = slot[fiberKey];
            const positionKey = fiberNode.return.key.replace('slot-', '');
            const posNum = parseInt(positionKey.match(/P(\d+)/)?.[1] || '0', 10);
            const roleIndex = posNum - 1;

            const finalName = roleMappings[ocName][roleIndex];
            const successStr = slot.querySelector('.successChance___ddHsR')?.textContent.trim() || '';
            const successChance = parseInt(successStr, 10) || 0;
            const joinBtn = slot.querySelector("button[class^='torn-btn joinButton']");

            const ocData = ocRoles.find(o => o.OCName === ocName);
            let required = null;
            if (ocData) {
                if (typeof ocData.Positions === 'string' && ocData.Positions.startsWith('default_')) {
                    required = parseInt(ocData.Positions.split('_')[1], 10) || 70;
                } else if (typeof ocData.Positions === 'object') {
                    if (ocData.Positions[finalName] !== undefined) {
                        required = ocData.Positions[finalName];
                    }
                }
            }

            if (required !== null) {
                const honorTextSpans = slot.querySelectorAll('.honor-text');
                const userName = (honorTextSpans.length > 1) ? honorTextSpans[1].textContent.trim() : null;

                // Only highlight join slots (empty) in green/red
                if (!userName) {
                    slot.style.backgroundColor =
                        (successChance < required) ? '#ff000061' : '#21a61c61';
                }

                if (joinBtn) {
                    if (successChance < required) {
                        joinBtn.setAttribute('disabled', '');
                    } 
                }

                // Highlight assigned players only if successChance < required
                if (userName && successChance < required) {
                    slot.classList.add('pulse-border-red');
                    slot.style.outline = '4px solid red';
                    slot.style.outlineOffset = '0px';

                }
            }
                        // Update displayed role name if different
            const roleElem = slot.querySelector('.title___UqFNy');
            if (finalName && roleElem && roleElem.innerText.trim() !== finalName) {
                roleElem.innerText = finalName;
            }

        });
    }

    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            if (mutation.addedNodes.length) {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === 1 && node.matches('.wrapper___U2Ap7')) {
                        processScenario(node);
                    }
                    if (node.nodeType === 1) {
                        const innerPanels = node.querySelectorAll?.('.wrapper___U2Ap7') || [];
                        innerPanels.forEach(inner => processScenario(inner));
                    }
                });
            }
        });
    });

    const targetNode = document.querySelector('#factionCrimes-root') || document.body;
    observer.observe(targetNode, {
        childList: true,
        subtree: true
    });

    window.addEventListener('load', () => {
        document.querySelectorAll('.wrapper___U2Ap7').forEach(panel => {
            processScenario(panel);
        });
    });

})();
