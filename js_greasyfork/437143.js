// ==UserScript==
// @name         Elethor Loot
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Logs combat drops and calculates averages. Based on Xortrox's scripts
// @author       Athano
// @match        https://elethor.com/*
// @match        https://www.elethor.com/*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/437143/Elethor%20Loot.user.js
// @updateURL https://update.greasyfork.org/scripts/437143/Elethor%20Loot.meta.js
// ==/UserScript==

(function() {
    /* USER CONFIG */
    let resetDropsWhenSwitchingFight = true;
    /* END USER CONFIG */
    /* Do not edit anything below */

    let lastDrops = '';
    let allDrops = {};
    let totalDrops = 0;
    let enemyId = 0;
    let firstDrop = false;

    const moduleName = 'Elethor Loot';
    const version = '1.0';

    function displayLog() {
        window.socket.addEventListener("message", (e) => {
            try {
                const data = JSON.parse(JSON.parse(e.data).data);
                const actionName = data.action.name.toLowerCase();
                if (data.action && (actionName.startsWith('killed') || actionName.startsWith('changing to'))) {
                    if (firstDrop) {
                        if (resetDropsWhenSwitchingFight) {
                            resetDropData();
                        }
                        firstDrop = false;
                    }
                    if (enemyId === 0) {
                        enemyId = data.action.action_on || 0;
                    }
                    if (actionName.startsWith('changing to')) {
                        enemyId = data.action.action_on;
                        firstDrop = true;
                    }
                    const drops = data.combatLog.drops.map(drop => ({ name: drop.name, quantity: drop.quantity }))
                    lastDrops = drops;
                    data.combatLog.drops.forEach(drop => {
                        if (allDrops[drop.name]) {
                            allDrops[drop.name] = allDrops[drop.name] + drop.quantity
                        } else {
                            allDrops[drop.name] = drop.quantity
                        }
                    });
                    totalDrops++;
                    displayDropLog();
                }
            } catch(_error) {
                // fail silently
            }
        });
    }

    function dropText(dropLogEntry) {
        return dropLogEntry.map(drop => `${drop.name} x ${drop.quantity}`).join(', ');
    }

    function allDropsText() {
        return Object.entries(allDrops).map(([key,value]) => `${key} x ${value}`).join(', ') + ` (from ${totalDrops} actions)`;;
    }

    function allDropsAverageText() {
        return Object.entries(allDrops).map(([key,value]) => `${key} x ${(value / totalDrops).toFixed(2)}`).join(', ') + ` (average of ${totalDrops} actions)`;
    }

    function resetDropData() {
        lastDrops = '';
        allDrops = {};
        totalDrops = 0;
        enemyId = 0;

        document.getElementById('el-drop-log').value = '';
        document.getElementById('el-total-drops').innerText = '';
    }

    function confirmResetDropData() {
        if (window.confirm('Are you sure you want to reset the drop history?')) {
            resetDropData();
        }
    }

    async function displayDropLog() {
        await waitForBottomNav();
        if (lastDrops) {
            const dropLogContainerElement = document.getElementById('el-drop-log-container');
            const dropLogElement = document.getElementById('el-drop-log');
            const totalDropsElement = document.getElementById('el-total-drops');
            const bottomNav = document.getElementById('bottomNav');
            if (!dropLogContainerElement) {
                const dropLogContainer = document.createElement('div');
                dropLogContainer.id = 'el-drop-log-container';
                dropLogContainer.style.position = 'fixed';
                dropLogContainer.style.top = '160px';
                dropLogContainer.style.left = '0';
                dropLogContainer.style.minWidth = '180px';
                dropLogContainer.style.width = '265px';
                dropLogContainer.style.minHeight = '150px';
                dropLogContainer.style.height = '490px';
                dropLogContainer.style.background = "none";
                dropLogContainer.style.zIndex = 1000;
                dropLogContainer.style.resize = 'both';
                dropLogContainer.style.overflow = 'auto';
                dropLogContainer.style.fontSize = '10pt';
                dropLogContainer.style.display = 'flex';
                dropLogContainer.style.flexDirection = 'column';

                const dropLogContainerDragger = document.createElement('div');
                dropLogContainerDragger.id = 'el-drop-log-container-dragger';
                dropLogContainerDragger.style.background = 'repeating-linear-gradient( -45deg, #4e5d6c, #1f2d3b 100% )';
                dropLogContainerDragger.style.cursor = "move";
                dropLogContainerDragger.style.width = "100%";
                dropLogContainerDragger.style.minHeight = "10px";

                const dropTextLog = document.createElement('textarea');
                dropTextLog.id = 'el-drop-log';
                dropTextLog.style.color = '#dee5e3';
                dropTextLog.style.padding = '10px';
                dropTextLog.style.width = "100%";
                dropTextLog.style.backgroundColor = '#000000b3';
                dropTextLog.style.flexGrow = '1';
                dropTextLog.style.resize = 'none';

                dropTextLog.value=dropText(lastDrops);

                const totalDrops = document.createElement('div');
                totalDrops.id = 'el-total-drops';
                totalDrops.style.width = "100%";
                totalDrops.style.padding = '3px 7px';
                totalDrops.style.background = '#1f2d3bb3';
                totalDrops.style.fontSize = '8pt';
                totalDrops.innerText = allDropsText();

                const footer = document.createElement('div');
                footer.id = 'el-total-footer';
                footer.style.width = "100%";
                footer.style.background = '#1f2d3bb3';
                footer.style.fontSize = '8pt';
                footer.style.display = "flex";
                footer.style.justifyContent = "space-between";
                footer.style.alignItems = "center";

                const resetDropsButton = document.createElement('button');
                resetDropsButton.onclick = () => confirmResetDropData();
                resetDropsButton.innerText = "reset";
                resetDropsButton.style.width = '50px';
                resetDropsButton.style.border = '1px solid #8694a4';
                resetDropsButton.style.background = '#4e5d6c';
                resetDropsButton.style.margin = '5px';
                resetDropsButton.style.color = 'white';
                resetDropsButton.style.cursor = 'pointer';

                const resetDropsOptionContainer = document.createElement('div');
                resetDropsOptionContainer.style.display = "flex";
                resetDropsOptionContainer.style.padding = "5px"
                resetDropsOptionContainer.style.alignItems = "center";

                const resetDropsOption = document.createElement('input');
                resetDropsOption.checked = resetDropsWhenSwitchingFight;
                resetDropsOption.id = 'el-total-reset-drops-option';
                resetDropsOption.onclick = () => { resetDropsWhenSwitchingFight = resetDropsOption.checked };
                resetDropsOption.type = "checkbox";

                const resetDropsOptionLabel = document.createElement('label');
                resetDropsOptionLabel.for = "el-total-reset-drops-option";
                resetDropsOptionLabel.innerText = 'reset on fight change';

                dropLogContainer.appendChild(dropLogContainerDragger);
                dropLogContainer.appendChild(dropTextLog);
                dropLogContainer.appendChild(totalDrops);
                footer.appendChild(resetDropsButton);
                resetDropsOptionContainer.appendChild(resetDropsOption);
                resetDropsOptionContainer.appendChild(resetDropsOptionLabel);
                footer.appendChild(resetDropsOptionContainer);
                dropLogContainer.appendChild(footer);
                bottomNav.parentElement.appendChild(dropLogContainer);
                dragElement(dropLogContainer);
            } else {
                dropLogElement.value=dropLogElement.value+"\n"+dropText(lastDrops);
                totalDropsElement.innerText = allDropsText() +"\n\n"+ allDropsAverageText();
                dropLogElement.scrollTop = dropLogElement.scrollHeight;
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