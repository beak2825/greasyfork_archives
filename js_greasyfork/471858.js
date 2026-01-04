// ==UserScript==
// @name         Wall Time Ends TCT
// @namespace    http://tampermonkey.net/
// @version      0.71
// @description  See under each wall when it's estimated that it ends
// @author       olesien
// @match        https://www.torn.com/factions.php*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @require      https://cdn.jsdelivr.net/npm/dayjs@1/dayjs.min.js
// @require      https://cdn.jsdelivr.net/npm/dayjs@1/plugin/utc.js
// @grant        none
// @license      BSD
// @downloadURL https://update.greasyfork.org/scripts/471858/Wall%20Time%20Ends%20TCT.user.js
// @updateURL https://update.greasyfork.org/scripts/471858/Wall%20Time%20Ends%20TCT.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let warn5MinBefore = false;
    let hasWarned = false; //Don't change
    // Your code here...
    dayjs.extend(window.dayjs_plugin_utc)

    const runTerritory = (territory) => {
        const wrap = territory?.querySelector(".faction-progress-wrap");
        const oldCurentProgressEl = territory.querySelector(".current-progress");

        const oldMinTimeEl = territory.querySelector(".min-time");
        if (wrap) {
            const currentProgressEl = oldCurentProgressEl ?? document.createElement("div");
            const minTimeEl = oldMinTimeEl ?? document.createElement("div");
            currentProgressEl.className = "current-progress";
            minTimeEl.className = "min-time";

            const score = wrap.querySelector(".score");
            const split = score.innerText.split("/");
            const shieldIconEl = territory?.querySelector(".shield-icon");
            const swordIconEl = territory?.querySelector(".swords-icon");
            if (split.length >= 2 && swordIconEl && shieldIconEl) {
                const curr = Number(split[0].replaceAll(",", ""));
                const max = Number(split[1].replaceAll(",", ""));
                const slots = Math.round(max / 50000);
                const defenders = Number(shieldIconEl.parentElement.innerText);
                const attackers = Number(swordIconEl.parentElement.innerText)
                const secondsLeft = Math.round((max - curr) / slots);
                minTimeEl.innerHTML = `<p>MIN: ${dayjs(Date.now() + (secondsLeft * 1000)).utc().format("ddd - HH:mm:ss")}</p>`;
                wrap.appendChild(minTimeEl);
                if (attackers === defenders || (defenders > attackers && curr <= 100)) {
                    currentProgressEl.innerHTML = `<p>CURR: NEVER</p>`;
                    wrap.appendChild(currentProgressEl);
                } else {
                    //One has more, we can use math yay
                    const advantageCount = attackers > defenders ? attackers : defenders;
                    //Pick either time until 0 or time until max depending on who is winning
                    const curSecondsLeft = Math.round((attackers > defenders ? (max - curr) : curr) / advantageCount);
                    currentProgressEl.innerHTML = `<p>CURR: ${dayjs(Date.now() + (curSecondsLeft * 1000)).utc().format("ddd - HH:mm:ss")}</p>`;
                    wrap.appendChild(currentProgressEl);
                }

            }
        }
    }
    //Used for speech warning
    const checkTerritory = (territory) => {
        if (hasWarned) return;
        const wrap = territory?.querySelector(".faction-progress-wrap");
        if (wrap) {
            const score = wrap.querySelector(".score");
            const split = score.innerText.split("/");
            const shieldIconEl = territory?.querySelector(".shield-icon");
            const swordIconEl = territory?.querySelector(".swords-icon");
            if (split.length >= 2 && swordIconEl && shieldIconEl) {
                const curr = Number(split[0].replaceAll(",", ""));
                const max = Number(split[1].replaceAll(",", ""));
                const slots = Math.round(max / 50000);
                const defenders = Number(shieldIconEl.parentElement.innerText);
                const attackers = Number(swordIconEl.parentElement.innerText)
                const secondsLeft = Math.round((max - curr) / slots);
                if (attackers >= defenders) {
                    //One has more, we can use math yay
                    const advantageCount = attackers;
                    //Pick either time until 0 or time until max depending on who is winning
                    const curSecondsLeft = Math.round((max - curr) / advantageCount);
                    console.log(curSecondsLeft);

                    //Warn
                    if (curSecondsLeft < 300) { // 5 minutes

                        let attackerName = "attacker";
                        let defenderName = "defender";
                        //Find who is who
                        const opponentNameEl = territory.querySelector(".opponentFactionName___OIYNk");
                        const currentNameEl = territory.querySelector(".currentFactionName___BWEax");
                        if (opponentNameEl && currentNameEl) {
                            if (swordIconEl.parentElement.parentElement.classList.contains("enemy-count")) {
                                //Attackers are the baddies
                                attackerName = opponentNameEl.innerText;
                                defenderName = currentNameEl.innerText;
                            } else {
                                //Attackers are the friendlies
                                attackerName = currentNameEl.innerText;
                                defenderName = opponentNameEl.innerText;
                            }
                        }
                        let msg = new SpeechSynthesisUtterance();
                        msg.text = `${attackerName} will win against ${defenderName} in under 5 minutes`;
                        window.speechSynthesis.speak(msg);
                        hasWarned = true;
                    }

                }

            }
        }
    }
    const doIt = (root) => {
        const territories = root.querySelectorAll(".status-wrap");
        //Add timer on each
        territories?.forEach(territory => {
            runTerritory(territory);
            const shieldIconEl = territory?.querySelector(".shield-icon");
            const swordIconEl = territory?.querySelector(".swords-icon");
            const observer = new MutationObserver((_, observer) => {
                console.log("running observer");
                runTerritory(territory);
            });
            console.log(shieldIconEl, swordIconEl);
            observer.observe(shieldIconEl.parentElement, { characterData: true, attributes: false, childList: false, subtree: true });
            observer.observe(swordIconEl.parentElement, { characterData: true, attributes: false, childList: false, subtree: true });

            //Add checker to see if wall is close to ending
            if (warn5MinBefore) {
                const observer2 = new MutationObserver((_, observer) => {
                    console.log("running observer2");
                    checkTerritory(territory);
                });
                const scoreEl = territory?.querySelector(".score");
                observer2.observe(scoreEl.parentElement, { characterData: true, attributes: false, childList: false, subtree: true });

            }


        })
    }
    const observer = new MutationObserver((_, observer) => {
        console.log("running observer");
        const root = document.querySelector('#faction_war_list_id');
        if (root) {
            observer.disconnect();
            doIt(root);
        }
    });
    observer.observe(document, { subtree: true, childList: true });
})();