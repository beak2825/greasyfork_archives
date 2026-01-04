// ==UserScript==
// @name         OC Role Display - CHR
// @namespace    http://tampermonkey.net/
// @version      1.6.3
// @description  Color Coding the positions
// @author       colaman32
// @match        https://www.torn.com/factions.php?step=your*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        GM_info
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/541416/OC%20Role%20Display%20-%20CHR.user.js
// @updateURL https://update.greasyfork.org/scripts/541416/OC%20Role%20Display%20-%20CHR.meta.js
// ==/UserScript==


//OC Role Display - CHR
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
                "PICKLOCK #1": 65,
                "HACKER": 65,
                "ENGINEER": 72,
                "BOMBER": 72,
                "MUSCLE": 75,
                "PICKLOCK #2": 0
            }
        },{
            OCName: "Stacking the Deck",
            Positions: {
                "HACKER": 68,
                "IMITATOR": 70,
                "CAT BURGLAR": 70,
                "DRIVER": 60
            }
        },{
            OCName: "Clinical Precision",
            Positions: {
                "CLEANER": 70,
                "IMITATOR": 73,
                "CAT BURGLAR": 69,
                "ASSASSIN": 68
            }
        },
        {
            OCName: "Ace in the Hole",
            Positions: {
                "HACKER": 65,
                "DRIVER": 50,
                "MUSCLE #1": 63,
                "IMITATOR": 65,
                "MUSCLE #2": 63
            }
        },
        {
            OCName: "Break the Bank",
            Positions: {
                "ROBBER": 65,
                "MUSCLE #1": 65,
                "THIEF #1": 60,
                "MUSCLE #2": 65,
                "MUSCLE #3": 67,
                "THIEF #2": 67
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