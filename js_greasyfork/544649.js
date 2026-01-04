// ==UserScript==
// @name         Torn OC 2 Requirements
// @namespace    https://github.com/SOLiNARY
// @version      0.2
// @description  Torn Organised Crimes v2.0 requirements for roles
// @author       Silmaril [2665762]
// @license      MIT License
// @match        https://www.torn.com/factions.php?step=your
// @match        https://www.torn.com/factions.php?step=your*
// @match        https://torn.com/factions.php?step=your
// @match        https://torn.com/factions.php?step=your*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/544649/Torn%20OC%202%20Requirements.user.js
// @updateURL https://update.greasyfork.org/scripts/544649/Torn%20OC%202%20Requirements.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const CRIMES_TAB = '#/tab=crimes';
    const CRIMES_REQUIREMENTS = {'Blast from the Past': {'Bomber': 70, 'Engineer': 70, 'Hacker': 70, 'Muscle': 70, 'Picklock #1': 70, 'Picklock #2': 0},
                                'Break the Bank': {'Robber': 60, 'Thief #1': 60, 'Thief #2': 60, 'Muscle #1': 60, 'Muscle #2': 60, 'Muscle #3': 60},
                                'Stacking the Deck': {'Cat Burglar': 68, 'Driver': 50, 'Imitator': 68, 'Hacker': 68},
                                'Ace in the Hole': {'Hacker': 63, 'Driver': 53, 'Imitator': 63, 'Muscle #1': 63, 'Muscle #2': 63}};

    const observerTarget = document.querySelector("#faction-crimes");
    const observerConfig = { attributes: false, childList: true, characterData: false, subtree: true };
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(mutationRaw => {
            if (window.location.href.indexOf(CRIMES_TAB) > -1){
                let mutation = mutationRaw.target;
                if (String(mutation.className).indexOf('description___') > -1){
                    let crimeParentRow = mutation.parentNode.parentNode.parentNode;
                    let crimeTitle = crimeParentRow.querySelector('[class^=scenario] > [class^=wrapper___] > [class^=panel___] > [class^=panelTitle___]').textContent;
                    let crimeRequirements = CRIMES_REQUIREMENTS[crimeTitle];
                    if (crimeRequirements === undefined) return;
                    crimeParentRow.querySelectorAll('[class^=wrapper___] > [class^=wrapper___]').forEach(crime => {
                        let slotTitle = crime.querySelector('[class^=slotHeader___] > [class^=title___]').textContent;
                        let slotSkill = Number(crime.querySelector('[class^=slotHeader___] > [class^=successChance___]').textContent);
                        if (crime.className.indexOf('waitingJoin___') > -1){
                            let roleRequirement = crimeRequirements[slotTitle];
                            if (roleRequirement !== undefined){
                                if (slotSkill < roleRequirement){
                                    let roleJoinBtn = crime.querySelector('[class^=slotBody___] > [class^=joinContainer___] > [class^=joinButtonContainer___] > [class*=joinButton___]');
                                    roleJoinBtn.setAttribute('disabled', true);
                                    roleJoinBtn.textContent = `<${roleRequirement}`;
                                    roleJoinBtn.style.color = 'crimson';
                                }
                            }
                        }
                    });
                }
            }
        });
    });
    observer.observe(observerTarget, observerConfig);
})();