// ==UserScript==
// @name         OC Role Display - Ravage Edition
// @namespace    http://tampermonkey.net/
// @version      3.1.1
// @description  Color Coding the positions
// @author       NotIbbyz
// @match        https://www.torn.com/factions.php?step=your*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @connect      tornprobability.com
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

    /* Make room at the bottom */
    /* Reserve space at the bottom */
    .oc-has-contrib {
        position: relative !important;
        padding-bottom: 22px !important;
        overflow: visible !important;
    }

    /* The line container */
    .oc-contrib-linewrap {
        position: absolute !important;
        left: 8px !important;
        right: 8px !important;
        bottom: 6px !important;
        display: flex !important;
        align-items: center !important;
        gap: 8px !important;
        pointer-events: none !important;
    }

    /* The left/right line parts */
    .oc-contrib-linewrap::before,
    .oc-contrib-linewrap::after {
        content: "";
        flex: 1;
        height: 1px;
        background: rgba(0,156,255,0.95);
    }

    /* The text in the middle*/
    .oc-contrib-linetext {
        font-weight: 900;
        font-size: 12px;
        color: rgba(0,136,235,0.95);
        line-height: 1;
        padding: 0 2px; /* tiny spacing so it doesn't touch the line */
    }

    `;
    document.head.appendChild(style);

    const API_URL = "https://tornprobability.com:3000/api/GetRoleWeights";
    let roleWeightsAPI = null;

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
                "HACKER": 65,
                "DRIVER": 55,
                "MUSCLE #1": 62,
                "IMITATOR": 65,
                "MUSCLE #2": 63
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
            OCName: "Sneaky Git Grab",
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
            OCName: "Best of the Lot",
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
            OCName: "Manifest Cruelty",
            Positions: `default_${defaultDecline}`
        }
    ];

    // priority based on https://crimeshub-2b4b0.firebaseapp.com/oc
    const roleContributions = {
        "Mob Mentality": {
            "Looter #1": 34,
            "Looter #2": 26,
            "Looter #4": 23,
            "Looter #3": 18
        },
        "Cash Me If You Can": {
            "Thief #1": 50,
            "Lookout #2": 28,
            "Thief #2": 22
        },
        "Smoke and Wing Mirrors": {
            "CAR THIEF": 51,
            "HUSTLER #1": 13,
            "HUSTLER #2": 9,
            "IMITATOR": 27
        },
        "Market Forces": {
            "Enforcer": 29,
            "Negotiator": 27,
            "Muscle": 23,
            "Lookout": 26,
            "Arsonist": 5,
        },
        "Gaslight The Way": {
            "Imitator #3": 41,
            "Imitator #2": 27,
            "Looter #3": 13,
            "Imitator #1": 9,
            "Looter #1": 10,
            "Looter #2": 0,
        },
        "Snow Blind": {
            "Hustler": 48,
            "Imitator": 36,
            "Muscle #1": 8,
            "Muscle #2": 8
        },
        "Stage Fright": {
            "Sniper": 46,
            "Muscle #1": 20,
            "Enforcer": 16,
            "Muscle #3": 9,
            "Lookout": 6,
            "Muscle #2": 3,
        },
        "Guardian Ángels": {
            "Hustler": 42,
            "Engineer": 31,
            "Enforcer": 27,
        },
        "No Reserve": {
            "Techie": 38,
            "Engineer": 31,
            "Car Thief": 31,
        },
        "Counter Offer": {
            "Robber": 36,
            "Engineer": 28,
            "Picklock": 17,
            "Hacker": 12,
            "Looter": 7,
        },
        "Leave No Trace": {
            "Imitator": 37,
            "Negotiator": 34,
            "Techie": 29,
        },
        "Sneaky Git Grab": {
            "Pickpocket": 51,
            "Imitator": 18,
            "Techie": 17,
            "Hacker": 14,
        },
        "Bidding War": {
            "Robber #3": 32,
            "Robber #2": 22,
            "Bomber #2": 18,
            "Driver": 13,
            "Bomber #1": 8,
            "Robber #2": 7,
        },
        "Honey Trap": {
            "ENFORCER": 27,
            "muscle #1": 31,
            "MUSCLE #2": 42
        },
        "Blast From The Past": {
            "Muscle": 34,
            "Engineer": 24,
            "Bomber": 16,
            "Picklock #1": 11,
            "Hacker": 12,
            "Picklock #2": 3,
        },
        "Clinical Precision": {
            "Imitator": 43,
            "Cleaner": 22,
            "Cat Burglar": 19,
            "Assassin": 16,
        },
        "Break the Bank": {
            "Muscle #3": 32,
            "Thief #2": 29,
            "Muscle #1": 14,
            "Robber": 13,
            "Muscle #2": 10,
            "Thief #1": 3,
        },
        "Manifest Cruelty": {
            "Reviver": 46,
            "Interrogator": 24,
            "Hacker": 16,
            "Cat Burglar": 14,
        },
        "Stacking The Deck": {
            "Imitator": 48,
            "Hacker": 26,
            "Cat Burglar": 23,
            "Driver": 3,
        },
        "Gone Fission": {
            "Hijacker": 25,
            "Imitator": 25,
            "Bomber": 18,
            "Pickpocket": 17,
            "Engineer": 15
        },
        "Ace In The Hole": {
            "Hacker": 28,
            "Imitator": 21,
            "Muscle #2": 25,
            "Muscle #1": 18,
            "Driver": 8
        },
        "Crane Reaction": {
            "Sniper": 41,
            "Lookout": 17,
            "Bomber": 16,
            "Muscle #1": 10,
            "Muscle #2": 8,
            "Engineer": 8,
        },
    };


    const roleMappings = {};

    function processScenario(panel) {
        if (!panel.classList.contains('role-processed')) {
            panel.classList.add('role-processed');
        }


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

            //add the priority after we get he rawRole

            // const ocKey = ocName.split("\n")[0].trim().toLowerCase();
            //const roleKey = rawRole.trim().toLowerCase();

            // const contributionsForOC =
            //        Object.entries(roleContributions || {}).find(([k]) => k.trim().toLowerCase() === ocKey)?.[1];

            //   const pct =
            //         Object.entries(contributionsForOC || {}).find(([k]) => k.trim().toLowerCase() === roleKey)?.[1];

            //From allenone api
            // ✅ Only run contribution rendering once API is ready
            if (roleWeightsAPI) {
                const cleanOCName = ocName.split("\n")[0].trim();

                const ocKeyCompact   = cleanOCName.toLowerCase().replace(/[^a-z0-9\u00C0-\u017F]/gi, "");
                const roleKeyCompact = rawRole.toLowerCase().replace(/[^a-z0-9\u00C0-\u017F]/gi, "");

                const ocEntry = Object.entries(roleWeightsAPI || {}).find(([k]) =>
                                                                          k.toLowerCase() === ocKeyCompact
                                                                         );

                const pctRaw = ocEntry
                ? Object.entries(ocEntry[1] || {}).find(([k]) => k.toLowerCase() === roleKeyCompact)?.[1]
                : undefined;

                const pct = (typeof pctRaw === "number") ? Math.round(pctRaw) : undefined;

                if (typeof pct === "number") {
                    slot.classList.add("oc-has-contrib");

                    if (!slot.querySelector(".oc-contrib-linewrap")) {
                        const wrap = document.createElement("div");
                        wrap.className = "oc-contrib-linewrap";

                        const text = document.createElement("span");
                        text.className = "oc-contrib-linetext";
                        text.textContent = `${pct}%`;

                        wrap.appendChild(text);
                        slot.appendChild(wrap);
                    }
                }
            }




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

    GM_xmlhttpRequest({
        method: "GET",
        url: API_URL,
        onload: (res) => {
            try {
                roleWeightsAPI = JSON.parse(res.responseText);
                console.log("[OC Role Display] Role Weights API loaded ✅");

                // ✅ Re-run on existing scenarios so first load also gets % lines
                document.querySelectorAll('.wrapper___U2Ap7').forEach(processScenario);

            } catch (e) {
                console.warn("[OC Role Display] Failed parsing API JSON ❌", e);
            }
        },
        onerror: (err) => {
            console.warn("[OC Role Display] API request failed ❌", err);
        }
    });


})();