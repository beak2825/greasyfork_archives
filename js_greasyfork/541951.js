// ==UserScript==
// @name         Torn OC Role Evaluator
// @namespace    underko.torn.scripts.oc
// @version      1.13
// @description  Evaluate OC roles based on influence and success chance
// @author       underko[3362751]
// @match        *.torn.com/factions.php*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/541951/Torn%20OC%20Role%20Evaluator.user.js
// @updateURL https://update.greasyfork.org/scripts/541951/Torn%20OC%20Role%20Evaluator.meta.js
// ==/UserScript==

(function () {
    'use strict';
    
    const hardJobDifficultyTrashold   = 30;
    const mediumJobDifficultyTrashold = 10;

    const influenceThresholds = {
        high:   { good: 75, ok: 65 }, // >=30% role influence
        medium: { good: 65, ok: 50 }, // >=10% role influence
        low:    { good: 50, ok: 40 }  // <10% role influence
    };

    const ocRoleInfluence = {
        "Pet Project": [
            { role: "Kidnapper",   influence: 41.14 },
            { role: "Muscle",      influence: 26.83 },
            { role: "Picklock",    influence: 32.03 }
        ],
        "Mob Mentality": [
            { role: "Looter #1",   influence: 34.83 },
            { role: "Looter #2",   influence: 25.97 },
            { role: "Looter #3",   influence: 19.87 },
            { role: "Looter #4",   influence: 19.33 }
        ],
        "Cash Me if You Can": [
            { role: "Thief #1",    influence: 46.67 },
            { role: "Thief #2",    influence: 21.87 },
            { role: "Lookout",     influence: 31.46 }
        ],
        "Best of the Lot": [
            { role: "Picklock",    influence: 23.65 },
            { role: "Car Thief",   influence: 21.06 },
            { role: "Muscle",      influence: 36.43 },
            { role: "Imitator",    influence: 18.85 }
        ],
        "Market Forces": [
            { role: "Enforcer",    influence: 27.56 },
            { role: "Negotiator",  influence: 25.59 },
            { role: "Lookout",     influence: 19.05 },
            { role: "Arsonist",    influence:  4.12 },
            { role: "Muscle",      influence: 23.68 }
        ],
        "Smoke and Wing Mirrors": [
            { role: "Car Thief",   influence: 48.20 },
            { role: "Imitator",    influence: 26.30 },
            { role: "Hustler #1",  influence:  7.70 },
            { role: "Hustler #2",  influence: 17.81 }
        ],
        "Gaslight the Way": [
            { role: "Imitator #1", influence:  7.54 },
            { role: "Imitator #2", influence: 34.85 },
            { role: "Imitator #3", influence: 40.25 },
            { role: "Looter #1",   influence:  7.54 },
            { role: "Looter #2",   influence:  0.00 },
            { role: "Looter #3",   influence:  9.83 }
        ],
        "Stage Fright": [
            { role: "Enforcer",    influence: 16.89 },
            { role: "Muscle #1",   influence: 21.92 },
            { role: "Muscle #2",   influence:  2.09 },
            { role: "Muscle #3",   influence:  9.49 },
            { role: "Lookout",     influence:  7.68 },
            { role: "Sniper",      influence: 41.92 }
        ],
        "Snow Blind": [
            { role: "Hustler",     influence: 51.40 },
            { role: "Imitator",    influence: 30.44 },
            { role: "Muscle #1",   influence:  9.08 },
            { role: "Muscle #2",   influence:  9.08 }
        ],
        "Leave No Trace": [
            { role: "Techie",      influence: 24.40 },
            { role: "Negotiator",  influence: 29.07 },
            { role: "Imitator",    influence: 46.54 }
        ],
        "No Reserve": [
            { role: "Car Thief",   influence: 30.86 },
            { role: "Techie",      influence: 37.88 },
            { role: "Engineer",    influence: 31.27 }
        ],
        "Counter Offer": [
            { role: "Robber",      influence: 33.29 },
            { role: "Looter",      influence:  4.69 },
            { role: "Hacker",      influence: 16.72 },
            { role: "Picklock",    influence: 17.10 },
            { role: "Engineer",    influence: 28.21 }
        ],
        "Guardian Ángels": [
            { role: "Enforcer",    influence: 28.34 },
            { role: "Hustler",     influence: 37.72 },
            { role: "Engineer",    influence: 33.93 }
        ],
        "Honey Trap": [
            { role: "Enforcer",    influence: 20.21 },
            { role: "Muscle #1",   influence: 34.32 },
            { role: "Muscle #2",   influence: 45.47 }
        ],
        "Bidding War": [
            { role: "Robber #1",   influence:  6.82 },
            { role: "Driver",      influence: 21.93 },
            { role: "Robber #2",   influence: 19.63 },
            { role: "Robber #3",   influence: 25.65 },
            { role: "Bomber #1",   influence: 10.96 },
            { role: "Bomber #2",   influence: 15.00 }
        ],
        "Sneaky Git Grab": [
            { role: "Imitator",    influence: 12.48 },
            { role: "Pickpocket",  influence: 43.77 },
            { role: "Hacker",      influence: 23.11 },
            { role: "Techie",      influence: 20.64 }
        ],
        "Blast from the Past": [
            { role: "Picklock #1", influence:  9.81 },
            { role: "Hacker",      influence:  6.18 },
            { role: "Engineer",    influence: 25.29 },
            { role: "Bomber",      influence: 20.40 },
            { role: "Muscle",      influence: 36.75 },
            { role: "Picklock #2", influence:  1.56 }
        ],
        "Break the Bank": [
            { role: "Robber",      influence: 10.84 },
            { role: "Muscle #1",   influence: 10.27 },
            { role: "Muscle #2",   influence:  7.78 },
            { role: "Thief #1",    influence:  3.55 },
            { role: "Muscle #3",   influence: 33.54 },
            { role: "Thief #2",    influence: 34.03 }
        ],
        "Stacking the Deck": [
            { role: "Cat Burglar", influence: 31.99 },
            { role: "Driver",      influence:  3.86 },
            { role: "Hacker",      influence: 25.64 },
            { role: "Imitator",    influence: 38.52 }
        ],
        "Clinical Precision": [
            { role: "Imitator",    influence: 41.51 },
            { role: "Cat Burglar", influence: 22.21 },
            { role: "Assassin",    influence: 14.56 },
            { role: "Cleaner",     influence: 21.71 }
        ],
        "Manifest Cruelty": [
            { role: "Hacker",       influence: 13.69 },
            { role: "Interrogator", influence: 26.84 },
            { role: "Reviver",      influence: 47.47 },
            { role: "Cat Burglar",  influence: 12.00 }
        ],
        "Ace in the Hole": [
            { role: "Imitator",    influence: 13.73 },
            { role: "Muscle #1",   influence: 18.55 },
            { role: "Muscle #2",   influence: 18.88 },
            { role: "Hacker",      influence: 37.49 },
            { role: "Driver",      influence: 11.35 }
        ],
        "Gone Fission": [
            { role: "Hijacker",    influence: 28.61 },
            { role: "Engineer",    influence: 18.38 },
            { role: "Pickpocket",  influence: 15.98 },
            { role: "Imitator",    influence: 19.51 },
            { role: "Bomber",      influence: 17.52 }
        ],
        "Crane Reaction": [
            { role: "Sniper",      influence: 31.94 },
            { role: "Lookout",     influence: 27.15 },
            { role: "Engineer",    influence:  4.39 },
            { role: "Bomber",      influence: 17.80 },
            { role: "Muscle #1",   influence: 10.07 },
            { role: "Muscle #2",   influence:  8.65 }
        ]
    };

    let crimeData = {};
    let previousTab = "none";
    
    // https://github.com/CoeJoder/waitForKeyElements.js
    function waitForKeyElements(selectorOrFunction, callback, waitOnce, interval, maxIntervals) {
        if (typeof waitOnce === "undefined") {
            waitOnce = true;
        }
        if (typeof interval === "undefined") {
            interval = 300;
        }
        if (typeof maxIntervals === "undefined") {
            maxIntervals = -1;
        }
        if (typeof waitForKeyElements.namespace === "undefined") {
            waitForKeyElements.namespace = Date.now().toString();
        }
        var targetNodes = (typeof selectorOrFunction === "function")
                ? selectorOrFunction()
                : document.querySelectorAll(selectorOrFunction);
     
        var targetsFound = targetNodes && targetNodes.length > 0;
        if (targetsFound) {
            targetNodes.forEach(function(targetNode) {
                var attrAlreadyFound = `data-userscript-${waitForKeyElements.namespace}-alreadyFound`;
                var alreadyFound = targetNode.getAttribute(attrAlreadyFound) || false;
                if (!alreadyFound) {
                    var cancelFound = callback(targetNode);
                    if (cancelFound) {
                        targetsFound = false;
                    }
                    else {
                        targetNode.setAttribute(attrAlreadyFound, true);
                    }
                }
            });
        }
     
        if (maxIntervals !== 0 && !(targetsFound && waitOnce)) {
            maxIntervals -= 1;
            setTimeout(function() {
                waitForKeyElements(selectorOrFunction, callback, waitOnce, interval, maxIntervals);
            }, interval);
        }
    }

    function classifyOcRoleInfluence(ocName, roleName, successChance) {
        const roleData = ocRoleInfluence[ocName]?.find(r => r.role === roleName);
        const influence = roleData ? roleData.influence : 0;

        let thresholds;

        if (influence >= hardJobDifficultyTrashold) thresholds = influenceThresholds.high;
        else if (influence >= mediumJobDifficultyTrashold) thresholds = influenceThresholds.medium;
        else thresholds = influenceThresholds.low;

        if (successChance >= thresholds.good) return { evaluation: 'good', influence };
        if (successChance >= thresholds.ok) return { evaluation: 'ok', influence };
        return { evaluation: 'bad', influence };
    }

    function processCrime(wrapper) {
        const ocId = wrapper.getAttribute('data-oc-id');
        if (!ocId || crimeData[ocId]) return;

        const titleEl = wrapper.querySelector('p.panelTitle___aoGuV');
        if (!titleEl) return;

        const crimeTitle = titleEl.textContent.trim();
        const roles = [];

        const roleEls = wrapper.querySelectorAll('.title___UqFNy');
        roleEls.forEach(roleEl => {
            const roleName = roleEl.textContent.trim();
            const successEl = roleEl.nextElementSibling;
            const chance = successEl ? parseInt(successEl.textContent.trim(), 10) : null;
            const evaluation = chance !== null ? classifyOcRoleInfluence(crimeTitle, roleName, chance) : { evaluation: 'unknown', influence: null };
            roles.push({ role: roleName, chance, evaluation });

            if (successEl && evaluation.influence !== null) {
                successEl.textContent = `${chance}/${Math.round(evaluation.influence)}`;
            }

            const slotHeader = roleEl.closest('button.slotHeader___K2BS_');
            if (slotHeader) {
                switch (evaluation.evaluation) {
                    case 'good':
                        slotHeader.style.backgroundColor = '#239b56'; break;
                    case 'ok':
                        slotHeader.style.backgroundColor = '#ca6f1e'; break;
                    case 'bad':
                        slotHeader.style.backgroundColor = '#a93226'; break;
                }
            }
        });

        crimeData[ocId] = { id: ocId, title: crimeTitle, roles };
    }

    function setupMutationObserver(root) {
        const observer = new MutationObserver(() => {
            const tabTitle = document.querySelector('button.active___ImR61 span.tabName___DdwH3')?.textContent.trim();

            if (tabTitle !== 'Recruiting' && tabTitle !== 'Planning') return;

            if (previousTab !== tabTitle) {
                crimeData = {};
                previousTab = tabTitle;
            }

            const allCrimes = document.querySelectorAll('.wrapper___U2Ap7');
            allCrimes.forEach(crimeNode => {
                processCrime(crimeNode);
            });
        });

        observer.observe(root, { childList: true, subtree: true });
    }

    waitForKeyElements("#faction-crimes-root", (root) => {
        setupMutationObserver(root);
    });
})();
