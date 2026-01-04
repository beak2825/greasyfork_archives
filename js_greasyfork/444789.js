// ==UserScript==
// @name         Elethor Fights
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  Logs fights and calculates averages.
// @author       Athano
// @match        https://elethor.com/*
// @match        https://www.elethor.com/*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/444789/Elethor%20Fights.user.js
// @updateURL https://update.greasyfork.org/scripts/444789/Elethor%20Fights.meta.js
// ==/UserScript==

(function() {
    /* USER CONFIG */
    let resetFightsWhenSwitchingFight = true;
    /* END USER CONFIG */
    /* Do not edit anything below */

    let lastFight = '';
    let allFights = {};
    let totalFights = 0;
    let enemyId = 0;
    let firstFight = false;

    const moduleName = 'Elethor Fights';
    const version = '0.5';

    function displayLog() {
        window.socket.addEventListener("message", (e) => {
            try {
                const data = JSON.parse(JSON.parse(e.data).data);
                const actionName = data.action.name.toLowerCase();
                if (data.action && (actionName.startsWith('killed') || actionName.startsWith('changing to'))) {
                  if (firstFight) {
                    if (resetFightsWhenSwitchingFight) {
                        resetFightData();
                    }
                    firstFight = false;
                  }

                  if (enemyId === 0) {
                      enemyId = data.action.action_on || 0;
                  }

                  if (actionName.startsWith('changing to')) {
                    enemyId = data.action.action_on;
                    firstFight = true;
                  }

                  const fight = { name: data.combatLog.monster, displayText: data.combatLog.monster, quantity: +data.combatLog.totalKills };
                  lastFight = fight;

                  if (allFights[fight.name]) {
                      allFights[fight.name] = allFights[fight.name] + fight.quantity
                  } else {
                      allFights[fight.name] = fight.quantity
                  }
                  totalFights++;
                  displayFightLog();
                }
            } catch(_error) {
                // fail silently
            }
        });
    }

    function fightText(fightLogEntry) {
        return `${fightLogEntry.displayText} x ${fightLogEntry.quantity}`;
    }

    function allFightsText() {
        return Object.entries(allFights).map(([key,value]) => `${key} x ${value}`).join(', ') + ` (from ${totalFights} actions)`;;
    }

    function allFightsAverageText() {
        return Object.entries(allFights).map(([key,value]) => `${key} x ${(value / totalFights).toFixed(2)}`).join(', ') + ` (average of ${totalFights} actions)`;
    }

    function resetFightData() {
        lastFight = '';
        allFights = {};
        totalFights = 0;
        enemyId = 0;

        document.getElementById('ef-fight-log').value = '';
        document.getElementById('ef-total-fights').innerText = '';
    }

    function confirmResetFightData() {
        if (window.confirm('Are you sure you want to reset the fight history?')) {
            resetFightData();
        }
    }

    async function displayFightLog() {
        await waitForBottomNav();
        if (lastFight) {
            const fightLogContainerElement = document.getElementById('ef-fight-log-container');
            const fightLogElement = document.getElementById('ef-fight-log');
            const totalFightsElement = document.getElementById('ef-total-fights');
            const bottomNav = document.getElementById('bottomNav');
            if (!fightLogContainerElement) {
                const fightLogContainer = document.createElement('div');
                fightLogContainer.id = 'ef-fight-log-container';
                fightLogContainer.style.position = 'fixed';
                fightLogContainer.style.top = '0';
                fightLogContainer.style.left = '0';
                fightLogContainer.style.background = "none";
                fightLogContainer.style.zIndex = 1000;
                fightLogContainer.style.resize = 'both';
                fightLogContainer.style.overflow = 'auto';
                fightLogContainer.style.fontSize = '10pt';
                fightLogContainer.style.display = 'flex';
                fightLogContainer.style.flexDirection = 'column';
                fightLogContainer.style.minWidth = '180px';
                fightLogContainer.style.width = '180px';
                fightLogContainer.style.minHeight = '150px';
                fightLogContainer.style.height = '150px';

                const fightLogContainerDragger = document.createElement('div');
                fightLogContainerDragger.id = 'ef-fight-log-container-dragger';
                fightLogContainerDragger.style.background = 'repeating-linear-gradient( -45deg, #4e5d6c, #1f2d3b 100% )';
                fightLogContainerDragger.style.cursor = "move";
                fightLogContainerDragger.style.width = "100%";
                fightLogContainerDragger.style.minHeight = "10px";

                const fightTextLog = document.createElement('textarea');
                fightTextLog.id = 'ef-fight-log';
                fightTextLog.style.color = '#dee5e3';
                fightTextLog.style.padding = '10px';
                fightTextLog.style.width = "100%";
                fightTextLog.style.backgroundColor = '#000000b3';
                fightTextLog.style.flexGrow = '1';
                fightTextLog.style.resize = 'none';

                fightTextLog.value=fightText(lastFight);

                const totalFights = document.createElement('div');
                totalFights.id = 'ef-total-fights';
                totalFights.style.width = "100%";
                totalFights.style.padding = '3px 7px';
                totalFights.style.background = '#1f2d3bb3';
                totalFights.style.fontSize = '8pt';
                totalFights.innerText = allFightsText();

                const footer = document.createElement('div');
                footer.id = 'ef-total-footer';
                footer.style.width = "100%";
                footer.style.background = '#1f2d3bb3';
                footer.style.fontSize = '8pt';
                footer.style.display = "flex";
                footer.style.justifyContent = "space-between";
                footer.style.alignItems = "center";

                const resetFightsButton = document.createElement('button');
                resetFightsButton.onclick = () => confirmResetFightData();
                resetFightsButton.innerText = "reset";
                resetFightsButton.style.width = '50px';
                resetFightsButton.style.border = '1px solid #8694a4';
                resetFightsButton.style.background = '#4e5d6c';
                resetFightsButton.style.margin = '5px';
                resetFightsButton.style.color = 'white';
                resetFightsButton.style.cursor = 'pointer';

                const resetFightsOptionContainer = document.createElement('div');
                resetFightsOptionContainer.style.display = "flex";
                resetFightsOptionContainer.style.padding = "5px"
                resetFightsOptionContainer.style.alignItems = "center";

                const resetFightsOption = document.createElement('input');
                resetFightsOption.checked = resetFightsWhenSwitchingFight;
                resetFightsOption.id = 'ef-total-reset-fights-option';
                resetFightsOption.onclick = () => { resetFightsWhenSwitchingFight = resetFightsOption.checked };
                resetFightsOption.type = "checkbox";

                const resetFightsOptionLabel = document.createElement('label');
                resetFightsOptionLabel.for = "ef-total-reset-fights-option";
                resetFightsOptionLabel.innerText = 'reset on fight change';

                fightLogContainer.appendChild(fightLogContainerDragger);
                fightLogContainer.appendChild(fightTextLog);
                fightLogContainer.appendChild(totalFights);
                footer.appendChild(resetFightsButton);
                resetFightsOptionContainer.appendChild(resetFightsOption);
                resetFightsOptionContainer.appendChild(resetFightsOptionLabel);
                footer.appendChild(resetFightsOptionContainer);
                fightLogContainer.appendChild(footer);
                bottomNav.parentElement.appendChild(fightLogContainer);
                dragElement(fightLogContainer);
            } else {
                fightLogElement.value=fightLogElement.value+"\n"+fightText(lastFight);
                totalFightsElement.innerText = allFightsText() +"\n\n"+ allFightsAverageText();
                fightLogElement.scrollTop = fightLogElement.scrollHeight;
            }
        }
    }

    (async function run() {
        await waitForField(window, 'socket');
        document.getElementsByTagName('html')[0].style.height = "100vh"
        displayLog();

        console.log(`[${moduleName} v${version}] Loaded.`);
    })();

    async function waitForBottomNav() {
        return new Promise((resolve, reject) => {
            const interval = setInterval(() => {
                if (document.getElementById('bottomNav')) {
                    clearInterval(interval);
                    resolve();
                }
            }, 300);
        });
    }

    async function waitForField(target, field) {
        return new Promise((resolve, reject) => {
            const interval = setInterval(() => {
                if (target[field] !== undefined) {
                    clearInterval(interval);
                    resolve();
                }
            }, 100);
        });
    }

    function dragElement(elmnt) {
        var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        if (document.getElementById(elmnt.id + "-dragger")) {
            document.getElementById(elmnt.id + "-dragger").onmousedown = dragMouseDown;
        }

        function dragMouseDown(e) {
            e = e || window.event;
            e.preventDefault();
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            document.onmousemove = elementDrag;
        }

        function elementDrag(e) {
            e = e || window.event;
            e.preventDefault();
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
            elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";

            if ((elmnt.offsetLeft + elmnt.offsetWidth) > document.getElementsByTagName('html')[0].offsetWidth) {
                elmnt.style.left = document.getElementsByTagName('html')[0].offsetWidth - elmnt.offsetWidth + "px";
            }

            if (elmnt.offsetLeft < 0) {
                elmnt.style.left = "0px";
            }

            if ((elmnt.offsetTop + elmnt.offsetHeight) > (document.getElementsByTagName('html')[0].offsetHeight)) {
                elmnt.style.top = (document.getElementsByTagName('html')[0].offsetHeight) - elmnt.offsetHeight + "px";
            }

            if (elmnt.offsetTop < 0) {
                elmnt.style.top = "0px";
            }
        }

        function closeDragElement() {
            document.onmouseup = null;
            document.onmousemove = null;
        }
    }
})();