// ==UserScript==
// @name         Elethor Mining
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Logs ore mined and calculates averages. Based on Xortrox's scripts
// @author       Athano
// @match        https://elethor.com/*
// @match        https://www.elethor.com/*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/438275/Elethor%20Mining.user.js
// @updateURL https://update.greasyfork.org/scripts/438275/Elethor%20Mining.meta.js
// ==/UserScript==

(function() {
    /* USER CONFIG */
    let resetMinesWhenSwitchingNode = true;
    /* END USER CONFIG */
    /* Do not edit anything below */

    let allMines = {};
    let oreRecord = {};
    let totalMines = 0;
    let nodeId = 0;
    let firstMine = false;

    const moduleName = 'Elethor Mining';
    const version = '0.3';

    const miningOreIds = {
        2: 'Orthoclase',
        3: 'Anorthite',
        4: 'Ferrisum',
        5: 'Rhenium',
        6: 'Jaspil',
    };

    function displayLog() {
        window.socket.addEventListener("message", (e) => {
            try {
                const data = JSON.parse(JSON.parse(e.data).data);
                if (!!(data.id && data.qty)) {
                    console.log(data, miningOreIds[data.id])
                    if (typeof miningOreIds[data.id] === 'string') {
                        let increase = +data.qty;
                        let firstTimeOreRecorded = false;
                        if (oreRecord[data.id]) {
                            increase = increase - oreRecord[data.id];
                            oreRecord[data.id] = +data.qty
                        } else {
                            firstTimeOreRecorded = true;
                            oreRecord[data.id] = +data.qty
                        }
                        const mine = { name: miningOreIds[data.id], quantity: increase }
                        if (!firstTimeOreRecorded) {
                            if (allMines[mine.name]) {
                                allMines[mine.name] = allMines[mine.name] + mine.quantity
                            } else {
                                allMines[mine.name] = mine.quantity
                            }
                            displayMiningLog(miningText(mine));
                        } else {
                            displayMiningLog('[' + mine.name + '] Setting total ore amount on first gather as ' + mine.quantity);
                        }
                        return;
                    }
                    return;
                }

                const actionName = data.action.name.toLowerCase();
                if (data.action && (actionName.startsWith('gather') || actionName.startsWith('changing resource'))) {
                    if (firstMine) {
                        if (resetMinesWhenSwitchingNode) {
                            resetMineData();
                        }
                        firstMine = false;
                    }
                    if (nodeId === 0) {
                        nodeId = data.action.action_on || 0;
                    }
                    if (actionName.startsWith('changing resource')) {
                        nodeId = data.action.action_on;
                        firstMine = true;
                    }
                    //Format is:
                    // { name: "Gathered 1076 Orthoclase" }
                    const mine = { name: data.action.name.split(' ')[2], quantity: +data.action.name.split(' ')[1] }
                    if (allMines[mine.name]) {
                        allMines[mine.name] = allMines[mine.name] + mine.quantity
                    } else {
                        allMines[mine.name] = mine.quantity
                    }
                    totalMines++;
                    displayMiningLog(miningText(mine));
                }
            } catch(_error) {
                // fail silently
            }
        });
    }

    function miningText(mineLogEntry) {
        console.log(mineLogEntry)
        return `${mineLogEntry.name} x ${mineLogEntry.quantity}`;
    }

    function allMinesText() {
        return Object.entries(allMines).map(([key,value]) => `${key} x ${value}`).join(', ') + ` (from ${totalMines} actions)`;;
    }

    function allMinesAverageText() {
        return Object.entries(allMines).map(([key,value]) => `${key} x ${(value / (key === 'Skasix' ? totalMines : totalMines - 1)).toFixed(2)}`).join(', ') + ` (average of ${totalMines} actions)`;
    }

    function resetMineData() {
        allMines = {};
        totalMines = 0;
        nodeId = 0;

        document.getElementById('eo-mine-log').value = '';
        document.getElementById('eo-total-mines').innerText = '';
    }

    function confirmResetMineData() {
        if (window.confirm('Are you sure you want to reset the mine history?')) {
            resetMineData();
        }
    }

    async function displayMiningLog(miningText) {
        await waitForBottomNav();
        if (miningText) {
            const mineLogContainerElement = document.getElementById('eo-mine-log-container');
            const mineLogElement = document.getElementById('eo-mine-log');
            const totalMinesElement = document.getElementById('eo-total-mines');
            const bottomNav = document.getElementById('bottomNav');
            if (!mineLogContainerElement) {
                const mineLogContainer = document.createElement('div');
                mineLogContainer.id = 'eo-mine-log-container';
                mineLogContainer.style.position = 'fixed';
                mineLogContainer.style.top = 'calc(100vh - 350px)';
                mineLogContainer.style.left = '33vw';
                mineLogContainer.style.minWidth = '180px';
                mineLogContainer.style.width = '180px';
                mineLogContainer.style.minHeight = '150px';
                mineLogContainer.style.height = '200px';
                mineLogContainer.style.background = "none";
                mineLogContainer.style.zIndex = 1000;
                mineLogContainer.style.resize = 'both';
                mineLogContainer.style.overflow = 'auto';
                mineLogContainer.style.fontSize = '10pt';
                mineLogContainer.style.display = 'flex';
                mineLogContainer.style.flexDirection = 'column';

                const mineLogContainerDragger = document.createElement('div');
                mineLogContainerDragger.id = 'eo-mine-log-container-dragger';
                mineLogContainerDragger.style.background = 'repeating-linear-gradient( -45deg, #4e5d6c, #1f2d3b 100% )';
                mineLogContainerDragger.style.cursor = "move";
                mineLogContainerDragger.style.width = "100%";
                mineLogContainerDragger.style.minHeight = "10px";

                const miningTextLog = document.createElement('textarea');
                miningTextLog.id = 'eo-mine-log';
                miningTextLog.style.color = '#dee5e3';
                miningTextLog.style.padding = '10px';
                miningTextLog.style.width = "100%";
                miningTextLog.style.backgroundColor = '#000000b3';
                miningTextLog.style.flexGrow = '1';
                miningTextLog.style.resize = 'none';

                miningTextLog.value=miningText;

                const totalMines = document.createElement('div');
                totalMines.id = 'eo-total-mines';
                totalMines.style.width = "100%";
                totalMines.style.padding = '3px 7px';
                totalMines.style.background = '#1f2d3bb3';
                totalMines.style.fontSize = '8pt';
                totalMines.innerText = allMinesText();

                const footer = document.createElement('div');
                footer.id = 'eo-total-footer';
                footer.style.width = "100%";
                footer.style.background = '#1f2d3bb3';
                footer.style.fontSize = '8pt';
                footer.style.display = "flex";
                footer.style.justifyContent = "space-between";
                footer.style.alignItems = "center";

                const resetMinesButton = document.createElement('button');
                resetMinesButton.onclick = () => confirmResetMineData();
                resetMinesButton.innerText = "reset";
                resetMinesButton.style.width = '50px';
                resetMinesButton.style.border = '1px solid #8694a4';
                resetMinesButton.style.background = '#4e5d6c';
                resetMinesButton.style.margin = '5px';
                resetMinesButton.style.color = 'white';
                resetMinesButton.style.cursor = 'pointer';

                const resetMinesOptionContainer = document.createElement('div');
                resetMinesOptionContainer.style.display = "flex";
                resetMinesOptionContainer.style.padding = "5px"
                resetMinesOptionContainer.style.alignItems = "center";

                const resetMinesOption = document.createElement('input');
                resetMinesOption.checked = resetMinesWhenSwitchingNode;
                resetMinesOption.id = 'eo-total-reset-mines-option';
                resetMinesOption.onclick = () => { resetMinesWhenSwitchingNode = resetMinesOption.checked };
                resetMinesOption.type = "checkbox";

                const resetMinesOptionLabel = document.createElement('label');
                resetMinesOptionLabel.for = "eo-total-reset-mines-option";
                resetMinesOptionLabel.innerText = 'reset on node change';

                mineLogContainer.appendChild(mineLogContainerDragger);
                mineLogContainer.appendChild(miningTextLog);
                mineLogContainer.appendChild(totalMines);
                footer.appendChild(resetMinesButton);
                resetMinesOptionContainer.appendChild(resetMinesOption);
                resetMinesOptionContainer.appendChild(resetMinesOptionLabel);
                footer.appendChild(resetMinesOptionContainer);
                mineLogContainer.appendChild(footer);
                bottomNav.parentElement.appendChild(mineLogContainer);
                dragElement(mineLogContainer);
            } else {
                mineLogElement.value=mineLogElement.value+"\n"+miningText;
                totalMinesElement.innerText = allMinesText() +"\n\n"+ allMinesAverageText();
                mineLogElement.scrollTop = mineLogElement.scrollHeight;
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