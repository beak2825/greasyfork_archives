// ==UserScript==
// @name         ZcxJames's hornex wave script
// @namespace    tampermonkey.net/
// @version      3.0
// @description  This is a script for hornex.pro that collects wave data from your current area and shares it with other users who are also using the script. You can view your area and wave progress in the bottom right corner, while the table on the right shows wave data uploaded by other users. Press Tab to hide the table, and click on the table to open the script control interface.
// @author       ZcxJames
// @homepage     https://zcxjames.top/zcxjames_hornex_wave_script
// @match        https://hornex.pro/*
// @grant        GM_xmlhttpRequest
// @connect      zcxjames.top
// @connect      103.193.151.90
// @license      GPL
// @downloadURL https://update.greasyfork.org/scripts/494390/ZcxJames%27s%20hornex%20wave%20script.user.js
// @updateURL https://update.greasyfork.org/scripts/494390/ZcxJames%27s%20hornex%20wave%20script.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const scriptVersion = '3.0';
    const regions = ['as1', 'as2', 'eu1', 'eu2', 'us1', 'us2'];
    let tableVisible = true;
    let previousServer = '';
    let previousZone = '';
    let currentServer = '';
    let currentZone = '';
    let progress = '';
    let showUltra = JSON.parse(localStorage.getItem('showUltra')) ?? false;
    let showSuper = JSON.parse(localStorage.getItem('showSuper')) ?? true;
    let showHyper = JSON.parse(localStorage.getItem('showHyper')) ?? true;


    const servers = {
        'eu1': 'rgb(166, 56, 237)', 'eu2': 'rgb(81, 121, 251)', 'as1': 'rgb(237, 61, 234)', 'us1': 'rgb(219, 130, 41)', 'us2': 'rgb(237, 236, 61)', 'as2': 'rgb(61, 179, 203)'
    };
    const zones = {
        'Ultra': 'rgb(255, 43, 117)', 'Super': 'rgb(43, 255, 163)', 'Hyper': 'rgb(92, 116, 176)', 'Waveroom': 'rgb(126, 239, 109)'
    };

function createTable(jsonData) {
    const existingTable = document.getElementById('jsonDataTable');
    if (existingTable) existingTable.remove();

    const columnCount = (showUltra ? 1 : 0) + (showSuper ? 1 : 0) + (showHyper ? 1 : 0);

    if (columnCount === 0) {
        tableVisible = false;
        return;
    }

    const tableWidth = columnCount * 75 + 50;
    const table = document.createElement('table');
    table.id = 'jsonDataTable';
    table.style.cssText = `
        position: fixed; top: 50%; right: 0; transform: translateY(-50%);
        border: 1px solid black; background-color: transparent;
        z-index: 1000; width: ${tableWidth}px; border-collapse: collapse; font-weight: lighter;
        cursor: pointer;
    `;

    table.innerHTML = `
        <thead>
            <tr><th style="border: 1px solid black;">&nbsp;</th>
                ${showUltra ? '<th style="border: 1px solid black;">Ultra</th>' : ''}
                ${showSuper ? '<th style="border: 1px solid black;">Super</th>' : ''}
                ${showHyper ? '<th style="border: 1px solid black;">Hyper</th>' : ''}
            </tr>
        </thead>
        <tbody>
            ${regions.map(region => `
                <tr>
                    <td style="border: 1px solid black;">${region}</td>
                    ${showUltra ? generateCell(region, 'Ultra', jsonData) : ''}
                    ${showSuper ? generateCell(region, 'Super', jsonData) : ''}
                    ${showHyper ? generateCell(region, 'Hyper', jsonData) : ''}
                </tr>`).join('')}
        </tbody>`;

    table.addEventListener('click', () => {
        showModal();
    });

    document.body.appendChild(table);
    table.style.display = tableVisible ? 'table' : 'none';
}

    function generateCell(region, type, jsonData) {
        const key = `${region}_${type}`;
        const data = jsonData[key] || {};
        const timeValue = data.time;
        const progress = data.progress || 'N/A';
        return `<td style="border: 1px solid black; color: ${timeValue ? 'orange' : 'black'};">${progress}</td>`;
    }


function showModal() {
    if (document.getElementById('modalOverlay')) return;
    const modalOverlay = document.createElement('div');
    modalOverlay.id = 'modalOverlay';
    modalOverlay.style.cssText = `
        position: fixed; top: 0; left: 0; width: 100%; height: 100%;
        background: rgba(0, 0, 0, 0.5); z-index: 10000; display: flex; justify-content: center; align-items: center;
    `;

    const modalContent = document.createElement('div');
    modalContent.style.cssText = `
        background: white; padding: 20px; border-radius: 8px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); text-align: center; max-width: 600px;
        display: flex; flex-direction: row;
    `;

    const infoSidebar = document.createElement('div');
    infoSidebar.style.cssText = `
        flex: 1; background: #f0f0f0; padding: 10px; border-right: 1px solid #ddd;
    `;
        infoSidebar.innerHTML = `
            <h3>settings</h3>
            <label><input type="checkbox" id="showUltra" ${showUltra ? 'checked' : ''}> Ultra</label><br>
            <label><input type="checkbox" id="showSuper" ${showSuper ? 'checked' : ''}> Super</label><br>
            <label><input type="checkbox" id="showHyper" ${showHyper ? 'checked' : ''}> Hyper</label><br>
            <hr>
            <h3>information</h3>
            <button id="loadInfo">load script's info</button>
            <div id="infoContent" style="margin-top: 10px;"></div>
        `;

    modalContent.appendChild(infoSidebar);

    const infoArea = document.createElement('div');
    infoArea.id = 'infoArea';
    infoArea.style.cssText = `
        flex: 2; padding: 20px; display: flex; flex-direction: column;
    `;
    infoArea.innerHTML = `
        <h2>About ZcxJames's hornex wave script</h2>
        <p>author:ZcxJames</p>
        <p>version: ${scriptVersion}</p>
        <p>Script homepage: <a href="https://zcxjames.top/zcxjames_hornex_wave_script/" target="_blank">zcxjames.top/zcxjames_hornex_wave_script/</a></p>
        <button id="closeModalBtn">close</button>
    `;
    modalContent.appendChild(infoArea);

    modalOverlay.appendChild(modalContent);
    document.body.appendChild(modalOverlay);

    document.getElementById('closeModalBtn').addEventListener('click', () => {
        modalOverlay.remove();
    });

    document.getElementById('loadInfo').addEventListener('click', () => {
        loadScriptInfo();
    });

        document.getElementById('showUltra').addEventListener('change', (event) => {
            showUltra = event.target.checked;
            localStorage.setItem('showUltra', JSON.stringify(showUltra));
            fetchAndUpdateTable();
        });
        document.getElementById('showSuper').addEventListener('change', (event) => {
            showSuper = event.target.checked;
            localStorage.setItem('showSuper', JSON.stringify(showSuper));
            fetchAndUpdateTable();
        });
        document.getElementById('showHyper').addEventListener('change', (event) => {
            showHyper = event.target.checked;
            localStorage.setItem('showHyper', JSON.stringify(showHyper));
            fetchAndUpdateTable();
        });
    }

    function loadScriptInfo() {
document.getElementById('loadInfo').addEventListener('click', () => {
    GM_xmlhttpRequest({
        method: 'GET',
        url: 'https://zcxjames.top/script_info.txt',
        onload: response => {
            document.getElementById('infoArea').style.cssText = `
                height: 400px;
                overflow-y: auto;
                padding: 10px;
                border: 1px solid #ccc;
                background-color: #f9f9f9;
                word-wrap: break-word;
            `;
            document.getElementById('infoArea').innerHTML = `
                <h2>about ZcxJames's hornex wave script</h2>
                <p>${response.responseText}</p>
                <button id="closeModalBtn">close</button>
            `;

            document.getElementById('closeModalBtn').addEventListener('click', () => {
                modalOverlay.remove();
            });
        }
    });
});
    }

    function fetchAndUpdateTable() {
        GM_xmlhttpRequest({
            method: 'GET',
            url: 'https://zcxjames.top/wave.json',
            onload: response => createTable(JSON.parse(response.responseText))
        });
    }

function toggleTableVisibility(event) {
    if (event.key === 'Tab') {
        event.preventDefault();

        if (!showUltra && !showSuper && !showHyper) {
            showUltra = false;
            showSuper = true;
            showHyper = true;

            localStorage.setItem('showUltra', JSON.stringify(showUltra));
            localStorage.setItem('showSuper', JSON.stringify(showSuper));
            localStorage.setItem('showHyper', JSON.stringify(showHyper));

            fetchAndUpdateTable();
            tableVisible = true;
        } else {
            tableVisible = !tableVisible;
        }

        const table = document.getElementById('jsonDataTable');
        if (table) table.style.display = tableVisible ? 'table' : 'none';
    }
}

function updateIndicator() {
    currentServer = Object.keys(servers).find(server =>
        document.querySelector(`div.btn.active[style="background-color: ${servers[server]};"]`)) || '';
    currentZone = Object.keys(zones).find(zone =>
        document.querySelector(`div.zone-name[stroke="${zone}"]`)) || '';
    if (document.querySelector('div.zone-name[stroke="Waveroom"]')) currentZone = 'waveroom';

    const waveSpan = document.querySelector('body > div.hud > div.zone > div.progress > span[stroke]');
    const waveText = waveSpan ? waveSpan.getAttribute('stroke') : '';
    const waveMatch = waveText.match(/Wave (\d+)/i);
    progress = waveMatch ? 'Wave ' + waveMatch[1] : '0%';

    document.querySelectorAll('div.bar').forEach(bar => {
        const matches = bar.style.transform.match(/translate\(calc\(-(\d+(\.\d+)?)% \+ \d+(\.\d+)?em\), 0px\)/);
        if (matches && matches[1]) {
            const tempProgress = (100 - parseFloat(matches[1])).toFixed(4);
            if (parseFloat(tempProgress) > parseFloat(progress)) progress = tempProgress + '%';
        }
    });

    document.getElementById('indicator').textContent = `${currentServer || 'Server not detected'} - ${currentZone || 'Zone not detected'} - Progress: ${progress}`;
}

function sendPost() {
    if (document.hidden) {
        return;
    }

    const waveEndingSpan = document.querySelector('span[stroke="Wave Ending..."]');
    if (waveEndingSpan) {
        return;
    }

    if (currentServer !== previousServer || currentZone !== previousZone) {
        previousServer = currentServer;
        previousZone = currentZone;
        return;
    }

    const data = { server: currentServer, zone: currentZone, progress: progress };
    GM_xmlhttpRequest({
        method: "POST",
        url: "http://103.193.151.90:5000",
        data: JSON.stringify(data),
        headers: { "Content-Type": "application/json" }
    });
}

    function setupIndicator() {
        const indicator = document.createElement('div');
        indicator.id = 'indicator';
        indicator.style.cssText = 'position: fixed; bottom: 20px; right: 0; background-color: transparent; padding: 10px; z-index: 10000;';
        document.body.appendChild(indicator);
    }

    function checkVersion() {
        GM_xmlhttpRequest({
            method: 'GET',
            url: 'https://zcxjames.top/version.json',
            onload: response => {
                const remoteVersion = JSON.parse(response.responseText).version;
                if (remoteVersion !== scriptVersion) {
                    displayVersionWarning();
                }
            }
        });
    }

    function displayVersionWarning() {
        const warningDiv = document.createElement('div');
        warningDiv.id = 'versionWarning';
        warningDiv.style.cssText = 'position: fixed; bottom: 0; right: 0; background-color: red; color: white; padding: 10px; z-index: 10000; font-weight: bold; text-align: center;';
        warningDiv.innerHTML = 'The script has a new version.<br>Please update your script at<br><a href="https://zcxjames.top/zcxjames_hornex_wave_script/" style="color: white;">zcxjames.top/zcxjames_hornex_wave_script</a>';
        document.body.appendChild(warningDiv);
    }

    function updateTable(jsonData) {
        const table = document.getElementById('jsonDataTable');
        if (table) {
            table.innerHTML = `
                <thead>
                    <tr><th style="border: 1px solid black;">&nbsp;</th>
                        ${showUltra ? '<th style="border: 1px solid black;">Ultra</th>' : ''}
                        ${showSuper ? '<th style="border: 1px solid black;">Super</th>' : ''}
                        ${showHyper ? '<th style="border: 1px solid black;">Hyper</th>' : ''}
                    </tr>
                </thead>
                <tbody>
                    ${regions.map(region => `
                        <tr>
                            <td style="border: 1px solid black;">${region}</td>
                            ${showUltra ? generateCell(region, 'Ultra', jsonData) : ''}
                            ${showSuper ? generateCell(region, 'Super', jsonData) : ''}
                            ${showHyper ? generateCell(region, 'Hyper', jsonData) : ''}
                        </tr>`).join('')}
                </tbody>`;
        }
    }


    document.addEventListener('keydown', toggleTableVisibility);
    setInterval(fetchAndUpdateTable, 1000);
    setInterval(sendPost, 1000);
    setupIndicator();
    checkVersion();

    const observerConfig = { attributes: true, subtree: true, attributeFilter: ['style', 'class'] };
    const observer = new MutationObserver(updateIndicator);
    const hudZone = document.querySelector('body > div.hud > div.zone');
    if (hudZone) {
        observer.observe(hudZone.querySelector('div.zone-name'), observerConfig);
        observer.observe(hudZone.querySelector('div.progress > div'), observerConfig);
        observer.observe(hudZone.querySelector('div.progress > span'), observerConfig);
    }
    observer.observe(document.querySelector('body > div.menu'), observerConfig);

    (function animate() {
        updateIndicator();
        requestAnimationFrame(animate);
    })();
})();
