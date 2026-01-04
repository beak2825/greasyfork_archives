// ==UserScript==
// @name         OC Role Display - PERK_Ryan Edition
// @namespace    http://tampermonkey.net/
// @version      1.5.0
// @description  Dynamically numbers duplicate OC roles based on slot order, shows priority of roles, and stores your CPR for each crime/role
// @author       PERK_Ryan (made from Allenone and NotIbbyz work)
// @match        https://www.torn.com/factions.php?step=your*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        GM_info
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @license      MIT
// @connect      tornprobability.com
// @downloadURL https://update.greasyfork.org/scripts/537039/OC%20Role%20Display%20-%20PERK_Ryan%20Edition.user.js
// @updateURL https://update.greasyfork.org/scripts/537039/OC%20Role%20Display%20-%20PERK_Ryan%20Edition.meta.js
// ==/UserScript==

//OC Role Display - PERK_Ryan Edition
(async function() {
    'use strict';
 
    // Inject pulse animations
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
 
    const defaultCPR1 = 70;
    const defaultCPR2 = 70;
    const defaultCPR3 = 70;

    const ocRoles = [
        {
            OCName: "Ace in the Hole",
            Positions: {
                "IMPERSONATOR": 70,
                "MUSCLE 1": 70,
                "MUSCLE 2": 70,
                "HACKER": 70,
                "DRIVER": 70
            },
            PositionPriority: {
                   "IMPERSONATOR": "P5",
                   "MUSCLE 1": "P3",
                   "MUSCLE 2": "P4",
                   "HACKER": "P1",
                   "DRIVER": "P2"
               }
        },
        {
            OCName: "Stacking the Deck",
            Positions: {
                "CAT BURGLAR": 70,
                "DRIVER": 70,
                "HACKER": 70,
                "IMPERSONATOR": 70
            },
            PositionPriority: {
                   "CAT BURGLAR": "P2",
                   "DRIVER": "P4",
                   "HACKER": "P3",
                   "IMPERSONATOR": "P1"
               }
        },
        {
            OCName: "Break the Bank",
            Positions: {
                "ROBBER": 60,
                "MUSCLE 1": 60,
                "MUSCLE 2": 60,
                "THIEF 1": 60,
                "MUSCLE 3": 60,
                "THIEF 2": 60
            },
            PositionPriority: {
                  "ROBBER": "P3",
                  "MUSCLE 1": "P4",
                  "MUSCLE 2": "P5",
                  "THIEF 1": "P6",
                  "MUSCLE 3": "P1",
                  "THIEF 2": "P2"
              }
        },
        {
            OCName: "Blast from the Past",
            Positions: {
                "PICKLOCK 1": 50,
                "HACKER": 50,
                "ENGINEER": 70,
                "BOMBER": 70,
                "MUSCLE": 70,
                "PICKLOCK 2": 40
            },
            PositionPriority: {
                "PICKLOCK 1": "P4",
                "HACKER": "P5",
                "ENGINEER": "P2",
                "BOMBER": "P3",
                "MUSCLE": "P1",
                "PICKLOCK 2": "P6"
            }
        },
        {
            OCName: "Bidding War",
            Positions: {
                "ROBBER 1": 60,
                "DRIVER": 60,
                "ROBBER 2": 60,
                "ROBBER 3": 70,
                "BOMBER 1": 60,
                "BOMBER 2": 60
            },
            PositionPriority: {
                "ROBBER 1": "P6",
                "DRIVER": "P3",
                "ROBBER 2": "P2",
                "ROBBER 3": "P1",
                "BOMBER 1": "P5",
                "BOMBER 2": "P4"
            }
        },
        { 
            OCName: "Honey Trap", 
            Positions: {
                "ENFORCER": 40,
                "MUSCLE 1": 60,
                "MUSCLE 2": 70
            },
            PositionPriority: {
                "ENFORCER": "P3",
                "MUSCLE 1": "P2",
                "MUSCLE 2": "P1"
            }
        },
        {
            OCName: "No Reserve",
            Positions: {
                "CAR THIEF": 60,
                "TECHIE": 70,
                "ENGINEER": 60
            },
            PositionPriority: {
                "CAR THIEF": "P3",
                "TECHIE": "P1",
                "ENGINEER": "P2"
            }
        },
        { 
            OCName: "Leave No Trace", 
            Positions: {
                "TECHIE": 60,
                "NEGOTIATOR": 60,
                "IMPERSONATOR": 60
            },
            PositionPriority: {
                "TECHIE": "P3",
                "NEGOTIATOR": "P2",
                "IMPERSONATOR": "P1"
            }
        },
        { 
            OCName: "Stage Fright", 
            Positions: {
                "ENFORCER": 60,
                "MUSCLE 1": 60,
                "MUSCLE 2": 60,
                "MUSCLE 3": 60,
                "LOOKOUT": 60,
                "SNIPER": 70
            },
            PositionPriority: {
                "ENFORCER": "P3",
                "MUSCLE 1": "P2",
                "MUSCLE 2": "P6",
                "MUSCLE 3": "P4",
                "LOOKOUT": "P5",
                "SNIPER": "P1"
            }
        },
        { 
            OCName: "Snow Blind", 
            Positions: {
                "HUSTLER": 60,
                "IMPERSONATOR": 60,
                "MUSCLE 1": 60,
                "MUSCLE 2": 60
            },
            PositionPriority: {
                   "HUSTLER": "P1",
                   "IMPERSONATOR": "P2",
                   "MUSCLE 1": "P3",
                   "MUSCLE 2": "P4"
               }
        },
        { 
            OCName: "Smoke and Wing Mirrors", 
            Positions: {
                "CAR THIEF": 70,
                "IMPERSONATOR": 70,
                "HUSTLER 1": 50,
                "HUSTLER 2": 50
            },
            PositionPriority: {
                "CAR THIEF": "P1",
                "IMPERSONATOR": "P2",
                "HUSTLER 1": "P4",
                "HUSTLER 2": "P3"
            }
        },
        { 
            OCName: "Market Forces",
            Positions: {
                "ENFORCER": 60,
                "NEGOTIATOR": 60,
                "LOOKOUT": 60,
                "ARSONIST": 60,
                "MUSCLE": 60
            },
            PositionPriority: {
                "ENFORCER": "P1",
                "NEGOTIATOR": "P2",
                "LOOKOUT": "P4",
                "ARSONIST": "P5",
                "MUSCLE": "P3"
            }
        },
        { 
            OCName: "Best of the Lot", 
            Positions: {
                "PICKLOCK": 60,
                "CAR THIEF": 60,
                "MUSCLE": 60,
                "IMPERSONATOR": 60
            },
            PositionPriority: {
                "PICKLOCK": "P2",
                "CAR THIEF": "P3",
                "MUSCLE": "P1",
                "IMPERSONATOR": "P4"
            }
        },
        { 
            OCName: "Cash Me if You Can",
            Positions: {
                "THIEF 1": 60,
                "THIEF 2": 60,
                "LOOKOUT": 60
            },
            PositionPriority: {
                "THIEF 1": "P1",
                "THIEF 2": "P3",
                "LOOKOUT": "P2"
            }
        },
        { 
            OCName: "Mob Mentality", 
            Positions: {
                "LOOTER 1": 10,
                "LOOTER 2": 10,
                "LOOTER 3": 10,
                "LOOTER 4": 10
            },
            PositionPriority: {
                "LOOTER 1": "P1",
                "LOOTER 2": "P2",
                "LOOTER 3": "P4",
                "LOOTER 4": "P3"
            }
        },
        { 
            OCName: "Pet Project",
            Positions: {
                "KIDNAPPER": 10,
                "MUSCLE": 10,
                "PICKLOCK": 10
            },
            PositionPriority: {
                "KIDNAPPER": "P1",
                "MUSCLE": "P3",
                "PICKLOCK": "P2"
            }
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
       let priorityPrefix = '';
 
       if (ocData) {
         if (typeof ocData.Positions === 'object') {
           const baseName = finalName.replace(/\s\d+$/, '');
           if (ocData.Positions[finalName] !== undefined) {
             required = ocData.Positions[finalName];
           } else if (ocData.Positions[baseName] !== undefined) {
             required = ocData.Positions[baseName];
           }
 
           if (ocData.PositionPriority && ocData.PositionPriority[finalName]) {
             priorityPrefix = `${ocData.PositionPriority[finalName]} `;
           }
         }
       }
 
       if (required !== null) {
         const honorTextSpans = slot.querySelectorAll('.honor-text');
         const userName = (honorTextSpans.length > 1) ? honorTextSpans[1].textContent.trim() : null;
 
         if (!userName) {
           slot.style.backgroundColor =
             (successChance < required) ? '#ff000061' : '#21a61c61';
         }
 
         if (joinBtn) {
           if (successChance < required) {
             joinBtn.setAttribute('disabled', '');
           }
         }
 
         if (userName && successChance < required) {
           slot.classList.add('pulse-border-red');
           slot.style.outline = '4px solid red';
           slot.style.outlineOffset = '0px';
         }
       }
 
       const roleElem = slot.querySelector('.title___UqFNy');
       if (finalName && roleElem) {
         const priority = ocData?.PositionPriority?.[finalName] || 'idk';
         const updatedName = `${priority ? priority + ' ' : ''}${finalName}`;
         roleElem.innerText = updatedName;
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


/*  Faction CPR Tracker  */
(function() {
    'use strict';
 
    const API_ENDPOINT = 'https://tornprobability.com:3000/api/SubmitCPR';
    const TARGET_URL_BASE = 'page.php?sid=organizedCrimesData&step=crimeList';
    const STORAGE_PREFIX = 'FactionCPRTracker_';
    const isTornPDA = typeof window.flutter_inappwebview !== 'undefined';
 
    // Storage functions
    const getValue = isTornPDA
    ? (key, def) => JSON.parse(localStorage.getItem(key) || JSON.stringify(def))
    : GM_getValue;
    const setValue = isTornPDA
    ? (key, value) => localStorage.setItem(key, JSON.stringify(value))
    : GM_setValue;
 
    // HTTP request function
    const xmlhttpRequest = isTornPDA
    ? (details) => {
        window.flutter_inappwebview.callHandler('PDA_httpPost', details.url, details.headers, details.data)
            .then(response => {
            details.onload({
                status: response.status,
                responseText: response.data
            });
        })
            .catch(err => details.onerror(err));
    }
    : GM_xmlhttpRequest;
 
    // API key handling
    let API_KEY;
    if (isTornPDA) {
        API_KEY = "###PDA-APIKEY###"; // Hardcoded for TornPDA Change this manually if you want to use a different key.
        setValue(`${STORAGE_PREFIX}api_key`, API_KEY);
    } else {
        API_KEY = getValue(`${STORAGE_PREFIX}api_key`, null);
        if (!API_KEY) {
            API_KEY = prompt('Please enter your Torn API key (Public Access):');
            if (!API_KEY) {
                alert('Faction CPR Tracker: API key is required for functionality.');
                return;
            }
            setValue(`${STORAGE_PREFIX}api_key`, API_KEY);
            if (API_KEY) {
                submitCPRData(API_KEY, getValue(`${STORAGE_PREFIX}CheckpointPassRates`, {}));
            }
        }
    }
 
    async function submitCPRData(apiKey, checkpointPassRates) {
        return new Promise((resolve, reject) => {
            xmlhttpRequest({
                method: 'POST',
                url: API_ENDPOINT,
                headers: { 'Content-Type': 'application/json' },
                data: JSON.stringify({ apiKey, checkpointPassRates }),
                onload: (response) => {
                    if (response.status >= 200 && response.status < 300) {
                        console.log('CPR data submitted successfully');
                        resolve();
                    } else {
                        console.error('API error:', response.status, response.responseText);
                        reject(new Error('API error'));
                    }
                },
                onerror: (err) => {
                    console.error('Submission error:', err);
                    reject(err);
                }
            });
        });
    }
 
    function processCPRs(data) {
        const scenarioName = data.scenario.name;
        let CheckpointPassRates = getValue(`${STORAGE_PREFIX}CheckpointPassRates`, {});
 
        if (!CheckpointPassRates[scenarioName]) {
            CheckpointPassRates[scenarioName] = {};
            data.playerSlots.forEach(slot => {
                CheckpointPassRates[scenarioName][slot.name] = slot.player === null ? slot.successChance : 0;
            });
        } else {
            data.playerSlots.forEach(slot => {
                if (slot.player === null) {
                    CheckpointPassRates[scenarioName][slot.name] = slot.successChance;
                }
            });
        }
 
        setValue(`${STORAGE_PREFIX}CheckpointPassRates`, CheckpointPassRates);
    }
 
    // Fetch Interception
    const win = isTornPDA ? window : (typeof unsafeWindow !== 'undefined' ? unsafeWindow : window);
    const originalFetch = win.fetch;
    win.fetch = async function(resource, config) {
        const url = typeof resource === 'string' ? resource : resource.url;
        if (config?.method?.toUpperCase() !== 'POST' || !url.includes(TARGET_URL_BASE)) {
            return originalFetch.apply(this, arguments);
        }
 
        let isRecruitingGroup = false;
        if (config?.body instanceof FormData) {
            isRecruitingGroup = config.body.get('group') === 'Recruiting';
        } else if (config?.body) {
            isRecruitingGroup = config.body.toString().includes('group=Recruiting');
        }
 
        if (!isRecruitingGroup) {
            return originalFetch.apply(this, arguments);
        }
 
        const response = await originalFetch.apply(this, arguments);
        try {
            const json = JSON.parse(await response.clone().text());
            if (json.success && json.data && json.data.length > 1) {
                json.data.forEach(processCPRs);
                const API_KEY = getValue(`${STORAGE_PREFIX}api_key`, null);
                if (API_KEY) {
                    submitCPRData(API_KEY, getValue(`${STORAGE_PREFIX}CheckpointPassRates`, {}));
                }
            }
        } catch (err) {
            console.error('Error processing response:', err);
        }
        return response;
    };
})();
