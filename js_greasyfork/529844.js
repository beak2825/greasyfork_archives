// ==UserScript==
// @name         OC Role Display - Ravage Edition
// @namespace    http://tampermonkey.net/
// @version      2.4.5
// @description  Color Coding the positions
// @author       NotIbbyz
// @match        https://www.torn.com/factions.php?step=your*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        GM_info
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/529844/OC%20Role%20Display%20-%20Ravage%20Edition.user.js
// @updateURL https://update.greasyfork.org/scripts/529844/OC%20Role%20Display%20-%20Ravage%20Edition.meta.js
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


    const defaultLevel6 = 67;
    const defaultLevel5 = 65;
    const defaultLevel4 = 65;
    const defaultLevel3 = 65;
    const defaultLevel2 = 65;
    const defaultDecline = 700;

    const ocRoles = [
        {
            OCName: "Blast From The Past",
            Positions: {
                "PICKLOCK #1": 68,
                "HACKER": 65,
                "ENGINEER": 70,
                "BOMBER": 70,
                "MUSCLE": 70,
                "PICKLOCK #2": 65
            }
        },{
            OCName: "Stacking the Deck",
            Positions: {
                "HACKER": 60,
                "IMITATOR": 64,
                "CAT BURGLAR": 60,
                "DRIVER": 50
            }
        },
        {
            OCName: "Ace in the Hole",
            Positions: {
                "HACKER": 60,
                "DRIVER": 50,
                "MUSCLE #1": 60,
                "IMITATOR": 62,
                "MUSCLE #2": 61
            }
        },
        {
            OCName: "Break the Bank",
            Positions: {
                "ROBBER": 62,
                "MUSCLE #1": 60,
                "THIEF #1": 55,
                "MUSCLE #2": 55,
                "MUSCLE #3": 62,
                "THIEF #2": 62
            }
        },
          {
            OCName: "Bidding War",
            Positions: {
                "ROBBER #3": 70,
                "ROBBER #2": 65,
                "ROBBER #1": 60,
                "BOMBER #1": 60,
                "BOMBER #2": 64,
                "DRIVER": 64
            }
        },
         {
            OCName: "Clinical Precision",
            Positions: {
                "ASSASSIN": 60,
                "CAT BURGLAR": 65,
                "CLEANER": 65,
                "IMITATOR": 70,
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
        }, {
            OCName: "Snow Blind",
            Positions: `default_${defaultLevel4}`
        },
        {
            OCName: "Pet Project",
            Positions: `default_${defaultLevel2}`
        },
        {
            OCName: "Cash Me If You Can",
            Positions: `default_${defaultLevel2}`
        },
        {
            OCName: "Smoke and Wing Mirrors",
            Positions: `default_${defaultLevel2}`
        },
        {
            OCName: "Market Forces",
            Positions: `default_${defaultLevel2}`
        },
        {
            OCName: "Guardian Ángels",
            Positions: `default_${defaultLevel5}`
        },
        {
            OCName: "No Reserve",
            Positions: `default_${defaultLevel5}`
        },{
            OCName: "Stacking the Deck",
            Positions: `default_${defaultDecline}`
        }
    ];

     const roleMappings = {};

    function processScenario(panel) {
        if (panel.classList.contains('role-processed')) return;
        panel.classList.add('role-processed');

        const ocName = panel.querySelector('.panelTitle___aoGuV')?.innerText.trim() || "Unknown";
        const slots = panel.querySelectorAll('.wrapper___Lpz_D');

        Array.from(slots).forEach(slot => {
            // get raw role text and chance
            const roleElem      = slot.querySelector('.title___UqFNy');
            const chanceElem    = slot.querySelector('.successChance___ddHsR');
            if (!roleElem || !chanceElem) return;

            const rawRole       = roleElem.innerText.trim();
            const successChance = parseInt(chanceElem.textContent.trim(), 10) || 0;
            const joinBtn       = slot.querySelector("button[class^='torn-btn joinButton']");

            // find thresholds
            const ocData = ocRoles.find(o => o.OCName.toLowerCase() === ocName.toLowerCase());
            let required = null;
            if (ocData) {
                if (typeof ocData.Positions === 'string' && ocData.Positions.startsWith('default_')) {
                    required = parseInt(ocData.Positions.split('_')[1], 10);
                } else if (typeof ocData.Positions === 'object' && ocData.Positions[rawRole] !== undefined) {
                    required = ocData.Positions[rawRole];
                }
            }
            if (required === null) return;  // skip unmapped slots

            // detect assigned player
            const honorTexts = slot.querySelectorAll('.honor-text');
            const userName   = honorTexts.length > 1 ? honorTexts[1].textContent.trim() : null;

            // color & disable logic
            if (!userName) {
                slot.style.backgroundColor = successChance < required
                    ? '#ff000061'  // redish
                    : '#21a61c61'; // greenish
                if (joinBtn && successChance < required) {
                    joinBtn.setAttribute('disabled', '');
                }
            } else if (successChance < required) {
                slot.classList.add('pulse-border-red');
                slot.style.outline = '4px solid red';
                slot.style.outlineOffset = '0px';
            }
        });
    }

    const observer = new MutationObserver(mutations => {
        mutations.forEach(m => {
            m.addedNodes.forEach(node => {
                if (node.nodeType !== 1) return;
                if (node.matches('.wrapper___U2Ap7')) {
                    processScenario(node);
                } else {
                    node.querySelectorAll?.('.wrapper___U2Ap7').forEach(processScenario);
                }
            });
        });
    });

    const targetNode = document.querySelector('#factionCrimes-root') || document.body;
    observer.observe(targetNode, { childList: true, subtree: true });

    window.addEventListener('load', () => {
        document.querySelectorAll('.wrapper___U2Ap7').forEach(processScenario);
    });

})();
