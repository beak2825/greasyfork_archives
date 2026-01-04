// ==UserScript==
// @name         Grundo's Cafe - Battledome Journal
// @namespace    https://www.grundos.cafe/
// @version      0.17
// @description  Keeps track of battledome history (prizes, moves per battle...) and some UI improvements
// @author       yon
// @match        *://*.grundos.cafe/dome*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=grundos.cafe
// @grant        GM.getValue
// @grant        GM.setValue
// @grant        GM.deleteValue
// @require      https://unpkg.com/jquery/dist/jquery.min.js
// @require      https://unpkg.com/gridjs/dist/gridjs.umd.js
// @downloadURL https://update.greasyfork.org/scripts/477948/Grundo%27s%20Cafe%20-%20Battledome%20Journal.user.js
// @updateURL https://update.greasyfork.org/scripts/477948/Grundo%27s%20Cafe%20-%20Battledome%20Journal.meta.js
// ==/UserScript==

// Community data: https://lookerstudio.google.com/s/jTcYlUzx0zQ

// Please contact Yon#epyslone for constructive feedback O:-)
var version = 0.17;

// Please update according to your timezone (should be midnight NST for your timezone)
var seasonStarts = {
                    6: "2025-02-21 09:00:00",
                    5: "2024-10-21 09:00:00",
                    4: "2024-06-21 09:00:00",
                    3: "2024-02-21 09:00:00",
                    2: "2023-10-02 09:00:00",
                    1: ""
};

(async function() {
    'use strict';

    try {
        if (document.URL.includes('grundos.cafe/dome/#journal')) {
            await showJournal();
            return;
        }
        showJournalLink();

        if (document.URL.includes('/dome/status')) {
            await GM.setValue('gc_bd_move_number', 0);
        }
        else if (document.URL.includes('/dome/1p/select')) {
            onSelectPage();
        }
        else if (document.URL.includes('/dome/1p/battle')) {
            await onBattlePage();
        }
        else if (document.URL.includes('/dome/1p/endbattle')) {
            await onBattleEndPage();
        }
    } catch (error) {
        let errorMessage = `
  <div class="error-message">
    <p>Oops! Something went wrong with the Battledome Journal script.</p>
    <p>Please check you have the latest option from <a href="https://greasyfork.org/en/scripts/477948-grundo-s-cafe-battledome-journal">here</a></p>
    <p>If it still does not work, please keep the tab open (or save the HTML) and contact Yon#epyslone, the script probably needs an update.</p>
  </div>
`;
        $('div[id="page_content"]').prepend(errorMessage);

        throw error;
    }
})();

function getDateString() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are zero-based
  const day = String(now.getDate()).padStart(2, '0');
  const hour = String(now.getHours()).padStart(2, '0');
  const minute = String(now.getMinutes()).padStart(2, '0');
  const second = String(now.getSeconds()).padStart(2, '0');

  return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
}

function showJournalLink() {
    let pageContents = $('div[id="page_content"]');
    if (pageContents.length > 0) {
        const htmlString = `
        <div id="battledome_journal_header" style="display: flex; justify-content: space-between; margin-bottom: 12px;">
            <div id="battledome_journal_withdraw"></div>
            <div id="battledome_journal_heal_hp"></div>
            <div id="battledome_journal_redirection"">
                <a href="https://www.grundos.cafe/dome/#journal" target="_blank">Go to Journal</a>
            </div>
        </div>`;
        pageContents[0].insertAdjacentHTML("afterbegin", htmlString);
    }
}

async function showJournal() {
    let journalElement = getJournalElement();

    replacePageWithElement(journalElement);

    await addExportButtonListener(journalElement);
    await addResetButtonListener(journalElement);
    await addSettingsButtonListener(journalElement);

    await loadGrid();
}

function getJournalElement() {
    let journalElement = document.createElement('div');
    let html = `
              <center>
                <div id="battledome_journal">
                  <h1>Battledome Journal</h1>
                  <button id="battledome_export">Export</button>
                  <button id="battledome_reset">Reset</button>
                  <div id="battledome_history"></div>
                  <div id="battledome_settings"></div>
                </div>
              </center>`;
    journalElement.innerHTML = html;

    let cssLink = document.createElement("link");
    cssLink.rel = "stylesheet";
    cssLink.href = "https://unpkg.com/gridjs/dist/theme/mermaid.min.css";
    journalElement.appendChild(cssLink);

    var styleElement = document.createElement('style');
    styleElement.textContent = `
        #battledome_journal {
            h1 { margin-bottom: 24px; }
            #battledome_export { font-size: 16px; padding: 8px 16px; }
            #battledome_reset { font-size: 16px; padding: 8px 16px; }
            #battledome_history { margin: 24px; }
            #battledome_settings { margin: 24px; }
            .gridjs-search { float: initial; width: "100%" }
            .gridjs-search-input { width: 100% }
        }`;
    journalElement.appendChild(styleElement);

    return journalElement;
}

async function loadGrid() {
    let rowsPerPage = 15;

    let rows = await getJournalHistoryRows();
    // start loading grid data
    let grid = new gridjs.Grid({
        columns: getJournalHistoryColumns(),
        data: rows,
        pagination: {
            limit: rowsPerPage,
            summary: true
        },
        resizable: true,
        search: {
            debounceTimeout: 0
        },
        sort: {
            multiColumn: true
        },
        autoWidth: true
    }).render(document.getElementById("battledome_history"));

    // show loading message
    let loadingElement = showLoadingMessage();

    // wait for grid to finish loading
    let expectedRows = Math.min(rows.length, rowsPerPage);
    await waitForGridCompleteLoad(expectedRows);

    // hide loading message
    hideLoadingMessage(loadingElement);

    fixGridJsTable();
}

function getJournalHistoryColumns() {
    return ["Season", "Date", "Opponent", "Result", "Difficulty (Win Count)", "Total Moves", "Pet HP", "Opponent HP", "Reward"];
}

async function getJournalHistoryRows() {
    let battlesData = await GM.getValue('gc_bd_battles_data', {'version': version});

    let tableData = [];

    let opponentNames = Object.keys(battlesData).filter(opponentName => battlesData.hasOwnProperty(opponentName) && opponentName !== 'version').sort();
    for (const opponentName of opponentNames) {
        let opponentData = battlesData[opponentName];
        for (let battleId in opponentData) {
            let battleData = opponentData[battleId];
            let date = battleData['date'];
            let season = getSeason(battleData['date']);
            let result = battleData['result'];
            let isDaily = battleData['is_daily'];
            let winCount = battleData['win_count'];
            let difficulty = isDaily ? 'Daily' : winCount ?? '?';
            let move_number = battleData['move_number'] ?? '?';
            let petHp = `${battleData['pet_info']['current_hp']} / ${battleData['pet_info']['max_hp']}`;
            let opponentHp = `${battleData['opponent_info']['current_hp']} / ${battleData['opponent_info']['max_hp']}`;
            let reward = battleData['prize_name'] ?? '';
            tableData.push([season, date, opponentName, result, difficulty, move_number, petHp, opponentHp, reward]);
        }
    }
    return tableData;
}

function getSeason(date) {
    let seasons = Object.keys(seasonStarts).sort().reverse();
    for (const season of seasons) {
        if (date >= seasonStarts[season]) {
            return season;
        }
    }
}

function showLoadingMessage() {
    let loadingElement = document.createElement('div');
    loadingElement.innerHTML = `
        <h2>Loading...</h2>
        <div class="loader"></div>
    `;
    var styleElement = document.createElement('style');
    styleElement.textContent = `
        h2 { color: #3498db; /* Blue */ }
        .loader {
                border: 16px solid #f3f3f3; /* Light grey */
                border-top: 16px solid #3498db; /* Blue */
                border-radius: 50%;
                width: 120px;
                height: 120px;
                animation: spin 2s linear infinite;
        }
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    `;
    loadingElement.appendChild(styleElement);
    $('div[class="gridjs-head"]')[0].parentNode.appendChild(loadingElement);
    return loadingElement;
}

function hideLoadingMessage(loadingElement) {
    loadingElement.style.display = "none";
}

async function waitForGridCompleteLoad(expectedRows) {
    let done = false;
    while (!done) {
        // wait 100 ms
        await new Promise(r => setTimeout(r, 100));
        // check
        let currentRows = $('table[role="grid"] > tbody > tr');
        if (currentRows && currentRows.length === expectedRows) {
            done = true;
        }
    }
}

function fixGridJsTable() {
    // issue: the table does not load fully before interacting with it
    // small hack: interacting by sorting by date descending
    // todo: I need to either change library or find a better fix

    // sort asc
    $('table[role="grid"] > thead > tr > th[data-column-id="date"] > button')[0].click();
    // sort desc
    $('table[role="grid"] > thead > tr > th[data-column-id="date"] > button')[0].click();
}

function replacePageWithElement(element) {
    let page = document.querySelector('html');
    page.parentNode.replaceChild(element, page);
}

async function addExportButtonListener(journalElement) {
    let battlesData = await GM.getValue('gc_bd_battles_data', {'version': version});

    let exportElement = $('button[id="battledome_export"]');
    exportElement.click(exportFunction);
    async function exportFunction() {
        const filename = `${getDateString()}_battledome_journal.json`;
        const jsonString = JSON.stringify(battlesData, null, 2); // The third argument is for indentation
        const blob = new Blob([jsonString], { type: 'application/json' });
        const downloadLink = document.createElement('a');
        downloadLink.href = window.URL.createObjectURL(blob);
        downloadLink.download = filename;
        journalElement.appendChild(downloadLink);
        downloadLink.click();
        journalElement.removeChild(downloadLink);
    };
}

async function addResetButtonListener(journalElement) {
    let resetElement = $('button[id="battledome_reset"]');
    resetElement.click(resetFunction);
    async function resetFunction() {
        if (confirm("Do you really want to reset your Battledome Journal? This action cannot be undone (but you can export it first).") == true) {
            await GM.deleteValue('gc_bd_battles_data');
        }
    };
}

async function addSettingsButtonListener(journalElement) {
    let settingsElement = $('div[id="battledome_settings"]')[0];
    let html = `
        <details>
            <summary>Settings</summary>
            <div id="battledome_settings_parameters"></div>
        </details>`;
    settingsElement.innerHTML = html;

    var styleElement = document.createElement('style');
    styleElement.textContent = `
        summary { font-weight: bold; font-size: 28px; }
        label { font-size: 24px; }
        select { font-size: 20px; margin-left: 8px; }
        textarea { width: 80%; height: 160px; }
        #battledome_settings_save { font-size: 16px; padding: 8px 16px; }`;
    settingsElement.appendChild(styleElement);

    let settingsDetailsElement = $('div[id="battledome_settings_parameters"]')[0];

    let parameters = {
        "share_rewards": {
            "label": "ε(´｡•᎑•`)っ 💕 Share your future prize rewards with the community 💕",
            "possibleValues": {
                "public": "Yes",
                "private": "Yes but keep my name hidden (only visible to admin)",
                "no": "No"
            },
            "defaultValue": "private"
        },
        "selection_sort_opponents": {
            "label": "(Opponent selection) Sort opponents",
            "possibleValues": {
                "difficulty": "By difficulty",
                "name": "By name"
            },
            "defaultValue": "no"
        },
        "display_withdraw": {
            "label": "(During battle) Display status withdraw page",
            "possibleValues": {
                "yes": "Yes",
                "no": "No"
            },
            "defaultValue": "yes"
        },
        "display_heal_hp": {
            "label": "(During battle) Display at how much HP the opponent will heal",
            "possibleValues": {
                "yes": "Yes",
                "no": "No"
            },
            "defaultValue": "yes"
        },
        "battle_sort_weapons_name": {
            "label": "(During battle) Order weapons by name",
            "possibleValues": {
                "yes": "Yes",
                "no": "No"
            },
            "defaultValue": "no"
        },
        "battle_limit_duplicate_weapons": {
            "label": "(During battle) Display a maximum of two similar weapons (useful for long RoDN fights)",
            "possibleValues": {
                "yes": "Yes",
                "no": "No"
            },
            "defaultValue": "no"
        },
        "display_previous_seasons_rewards": {
            "label": "(Battle result) Display previous seasons rewards",
            "possibleValues": {
                "yes": "Yes",
                "no": "No"
            },
            "defaultValue": "yes"
        },
        "rewards_sort_order": {
            "label": "(Battle result) Display opponent rewards in the following order",
            "possibleValues": {
                "desc": "Latest first",
                "asc": "Oldest first"
            },
            "defaultValue": "desc"
        },
        "aggregate_rewards": {
            "label": "(Battle result) Aggregate opponent rewards per item",
            "possibleValues": {
                "yes": "Yes",
                "no": "No"
            },
            "defaultValue": "no"
        },
        "battle_sort_weapons_list": {
            "label": "(During battle) Order weapons by the following list (case insensitive, use commas to separate weapons, specified will always be before the non-specified, non-specified will be ordered by the previous sort option)",
            "type": "textarea",
            "defaultValue": ""
        }
    };

    let currentSettings = await GM.getValue('gc_bd_settings', getDefaultSettings());
    console.log(currentSettings);

    for (const [parameter, values] of Object.entries(parameters)) {
        const label = document.createElement("label");
        label.setAttribute("for", parameter);
        label.textContent = values["label"] + ":";

        let parameterCurrentSetting = currentSettings[parameter] ?? values["defaultValue"];

        if (values["type"] == "textarea") {
            const textarea = document.createElement("textarea");
            textarea.id = parameter;
            textarea.textContent = parameterCurrentSetting;

            const paragraph = document.createElement("p");
            paragraph.appendChild(label);
            paragraph.appendChild(document.createElement("br"));
            paragraph.appendChild(textarea);

            settingsDetailsElement.appendChild(paragraph);
        }
        // dropdown
        else {
            const select = document.createElement("select");
            select.id = parameter;

            for (const [value, label] of Object.entries(values["possibleValues"])) {
                const option = document.createElement("option");
                option.value = value;
                option.textContent = label;
                if (value == parameterCurrentSetting) {
                    option.selected = true;
                }
                select.appendChild(option);
            }

            const paragraph = document.createElement("p");
            paragraph.appendChild(label);
            paragraph.appendChild(select);

            settingsDetailsElement.appendChild(paragraph);
        }
    }

    var saveSettingsElement = document.createElement('button');
    saveSettingsElement.id = 'battledome_settings_save';
    saveSettingsElement.textContent = 'Save settings';
    saveSettingsElement.addEventListener('click', saveSettingsFunction);
    async function saveSettingsFunction() {
        let newSettings = {};
        for (const [parameter, values] of Object.entries(parameters)) {
            let selectElement = document.getElementById(parameter);
            newSettings[parameter] = selectElement.value;
        }
        await GM.setValue('gc_bd_settings', newSettings);
        console.log('New settings:', newSettings);
        alert('Settings have been saved.')
    };
    settingsDetailsElement.appendChild(saveSettingsElement);
}

function getDefaultSettings() {
    let defaultSettings = {
        "share_rewards": "no",
        "selection_sort_opponents": "no",
        "display_withdraw": "yes",
        "display_heal_hp": "yes",
        "battle_sort_weapons_name": "no",
        "battle_limit_duplicate_weapons": "no",
        "display_previous_seasons_rewards": "yes",
        "rewards_sort_order": "desc",
        "aggregate_rewards": "no",
        "battle_sort_weapons_list": ""
    };
    return defaultSettings;
}

function onSelectPage() {
    displayOpponentOrderByNameIfNeeded();
}

async function displayOpponentOrderByNameIfNeeded() {
    let settings = await GM.getValue('gc_bd_settings', getDefaultSettings());
    let setting = settings["selection_sort_opponents"];
    if (setting === "name") {
        let tbodys = $('form[action="/dome/1p/select/"] > table[id="challengerlist"] > tbody');
        if (tbodys.length > 0) {
            let tbody = tbodys[0];
            let trs = {};
            tbody.querySelectorAll('tr:not(:first-child)').forEach(function (v) {
                let opponentName = v.querySelector('button').textContent.trim();
                trs[opponentName] = v;
                v.parentNode.removeChild(v);
            });

            let trsSorted = Object.entries(trs).sort((a, b) => {
                return a[0].localeCompare(b[0]);
            });
            for (const [opponentName, tr] of trsSorted) {
                tbody.appendChild(tr);
            }
        }
    }
}

async function onBattlePage() {
    // retrieve our pet's info
    let petInfo = {'name': null, 'current_hp': null, 'max_hp': null};
    let petElement = $('div[id="hpbars"] > table > tbody > tr:nth-child(3) > td:nth-child(1)')[0];
    petInfo['name'] = petElement.innerHTML.split('<br>')[0].trim();
    let petHps = $(petElement).find('strong').text();
    petInfo['current_hp'] = parseInt(petHps.split('/')[0].trim());
    petInfo['max_hp'] = parseInt(petHps.split('/')[1].trim());

    // retrieve our opponent's info
    let opponentInfo = {'name': null, 'current_hp': null, 'max_hp': null};
    let opponentElement = $('div[id="hpbars"] > table > tbody > tr:nth-child(3) > td:nth-child(3)')[0];
    opponentInfo['name'] = opponentElement.innerHTML.split('<br>')[0].trim();
    let opponentHps = $(opponentElement).find('strong').text();
    opponentInfo['current_hp'] = parseInt(opponentHps.split('/')[0].trim());
    opponentInfo['max_hp'] = parseInt(opponentHps.split('/')[1].trim());

    await GM.setValue('gc_bd_pet_info', petInfo);
    await GM.setValue('gc_bd_opponent_info', opponentInfo);

    // works with the Battledome Utility script too
    const buttons = document.querySelectorAll('input[type="submit"][value="Go!"]');
    buttons.forEach(button => {
        button.addEventListener('click', async function (event) {
            // event.preventDefault();

            let moveNumber = await GM.getValue('gc_bd_move_number', 0);
            moveNumber += 1;
            await GM.setValue('gc_bd_move_number', moveNumber);
            console.log("Move number:", moveNumber);
        });
    });

    await displayWithdrawPageIfNeeded();
    await displayHealHpIfNeeded(opponentInfo['max_hp']);
    await displayLimitDuplicateWeaponsIfNeeded();
    await displayWeaponUpdatedOrderIfNeeded();
}

async function displayWithdrawPageIfNeeded() {
    let settings = await GM.getValue('gc_bd_settings', getDefaultSettings());
    let setting = settings["display_withdraw"];
    if (setting === "yes") {
        $('div[id="battledome_journal_withdraw"]').append('<a href="https://www.grundos.cafe/dome/status/">Withdraw</a>');
    }
}

async function displayHealHpIfNeeded(opponentMaxHp) {
    let settings = await GM.getValue('gc_bd_settings', getDefaultSettings());
    let setting = settings["display_heal_hp"];
    if (setting === "yes") {
        let message = `Opponent will heal when reaching ${Math.floor(opponentMaxHp * 0.4)} HP`;
        $('div[id="battledome_journal_heal_hp"]').append(message);
    }
}

async function displayLimitDuplicateWeaponsIfNeeded() {
    // skip this setting if Battledome Utility (keyboard) script is active
    if ($('form[action="/dome/1p/battle/"] div[id="bd-table"]').length > 0) {
      return;
    }

    let settings = await GM.getValue('gc_bd_settings', getDefaultSettings());
    let setting = settings["battle_limit_duplicate_weapons"];
    if (setting === "yes") {
        let tbodys = $('form[id="bd-form"] > table > tbody');
        if (tbodys.length > 0) {
            let tbody = tbodys[0];
            let weaponNames = {};
            let trs = [];
            let tds = [];
            tbody.querySelectorAll('tr > td').forEach(function (v) {
                let weaponName = v.querySelector('label').textContent.trim();
                weaponNames[weaponName] = (weaponNames[weaponName] || 0) + 1;
                if (weaponNames[weaponName] <= 2) {
                    tds.push(v);
                }
                v.parentNode.removeChild(v);
            });
            tbody.querySelectorAll('tr').forEach(function (v) {
                trs.push(v);
                v.parentNode.removeChild(v);
            });
            const td_per_tr = 4;
            for (let i = 0; i < tds.length; i++) {
                let tr = trs[Math.floor(i / td_per_tr)];
                tr.appendChild(tds[i]);
                if (i % td_per_tr == 0) {
                    tbody.appendChild(tr);
                }
            }
        }
    }
}

async function displayWeaponUpdatedOrderIfNeeded() {
    // for now, skip this setting if Battledome Utility (keyboard) script is active
    // if you want to order weapons, you can put this script before the keyboard script by:
    // Tampermonkey: Settings -> General -> Position: set it lower than the keyboard script
    if ($('form[action="/dome/1p/battle/"] div[id="bd-table"]').length > 0) {
      return;
    }

    let settings = await GM.getValue('gc_bd_settings', getDefaultSettings());
    let byNameSetting = settings["battle_sort_weapons_name"];
    let byListSetting = settings["battle_sort_weapons_list"] ?? "";
    if (byNameSetting === "yes" || byListSetting !== "") {
        let tbodys = $('form[id="bd-form"] > table > tbody');
        if (tbodys.length > 0) {
            let tbody = tbodys[0];
            let weapons = {};
            let trs = [];
            let tds = [];
            tbody.querySelectorAll('tr > td').forEach(function (v) {
                let weaponName = v.querySelector('label').textContent.trim();
                if (weaponName in weapons) {
                    weapons[weaponName].push(v);
                }
                else
                {
                    weapons[weaponName] = [v];
                }
                v.parentNode.removeChild(v);
            });
            tbody.querySelectorAll('tr').forEach(function (v) {
                trs.push(v);
                v.parentNode.removeChild(v);
            });
            let weaponsSorted = getSortedWeapons(weapons, byNameSetting, byListSetting);
            for (const [weaponName, td] of weaponsSorted) {
                tds.push(td);
            }
            let tdsFlat = tds.flat();
            const td_per_tr = 4;
            for (let i = 0; i < tdsFlat.length; i++) {
                let tr = trs[Math.floor(i / td_per_tr)];
                tr.appendChild(tdsFlat[i]);
                if (i % td_per_tr == 0) {
                    tbody.appendChild(tr);
                }
            }
        }
    }
}

function getSortedWeapons(weapons, byNameSetting, byListSetting) {
    let weaponsSorted = Object.entries(weapons);
    if (byNameSetting === "yes") {
        weaponsSorted = Object.entries(weapons).sort((a, b) => {
            // a[0] is the weapon name
            return a[0].localeCompare(b[0]);
        });
    }
    if (byListSetting !== "") {
        let expectedOrder = byListSetting.split(',');
        expectedOrder = removeDuplicates(expectedOrder);

        let weaponsFoundInList = [];
        expectedOrder.forEach(expectedWeapon => {
            for (const weapon of weaponsSorted) {
                // weapon[0] is the weapon name
                if (weapon[0].toLowerCase() === expectedWeapon.toLowerCase().trim()) {
                    weaponsFoundInList.push(weapon);
                }
            }
        });

        let weaponsNotFoundInList = [];
        weaponsSorted.forEach(weapon => {
            if (!weaponsFoundInList.includes(weapon)) {
                weaponsNotFoundInList.push(weapon);
            }
        });

        // concatenate both lists
        weaponsSorted = [...weaponsFoundInList, ...weaponsNotFoundInList];
    }
    return weaponsSorted;
}

function removeDuplicates(weapons) {
    const uniqueSet = new Set();
    const result = [];
    for (const item of weapons) {
        if (!uniqueSet.has(item)) {
            uniqueSet.add(item);
            result.push(item);
        }
    }
    return result;
}

async function onBattleEndPage() {
    let resultElements = $('div[id="hpbars"] > table > tbody > tr > td:nth-child(1)');
    if (resultElements && resultElements.length > 0) {
        let result = resultElements[0].textContent.trim();

        let prizeName = null;
        let isDaily = null;
        let prizeImage = null;
        let prizeElements = $('div[id="prize_blurb"] > p');
        if (prizeElements && prizeElements.length > 0) {
            prizeName = $(prizeElements[0]).find('strong').text();

            isDaily = prizeElements[0].textContent.includes('daily challenge');

            prizeImage = $(prizeElements[1]).find('img').attr('src');
        }

        let winCount = null;
        if (result === 'Winner') {
            let winCountElements = $('div[id="record_blurb"] > p');
            if (winCountElements && winCountElements.length > 0) {
                let winCountText = winCountElements[0].textContent.trim();
                let winCountWords = winCountText.split(' ');
                winCount = winCountWords[winCountWords.length - 2];
            }
        }

        let petInfo = await GM.getValue('gc_bd_pet_info', {'name': null, 'current_hp': null, 'max_hp': null});
        let opponentInfo = await GM.getValue('gc_bd_opponent_info', {'name': null, 'current_hp': null, 'max_hp': null});

        let moveNumber = await GM.getValue('gc_bd_move_number', null);

        let battleData = {'date': getDateString(), 'pet_info': petInfo, 'opponent_info': opponentInfo, 'result': result, 'win_count': winCount, 'prize_name': prizeName,
                          'prize_image': prizeImage, 'move_number': moveNumber, 'is_daily': isDaily};
        console.log(battleData);

        let battlesData = await GM.getValue('gc_bd_battles_data', {'version': version});
        if (battlesData[opponentInfo['name']] === undefined) {
            battlesData[opponentInfo['name']] = [];
        }
        battlesData[opponentInfo['name']].push(battleData);

        battlesData = versionUpgrader(battlesData);

        await GM.setValue('gc_bd_battles_data', battlesData);

        await showPrizesFromOpponentData(battlesData[opponentInfo['name']]);

        await GM.setValue('gc_bd_move_number', 0);

        await sendRewardsDataIfNeeded(battleData);
    }
}

async function showPrizesFromOpponentData(opponentData) {
    const prizesElement = document.createElement('div');
    prizesElement.className = 'prizes';

    const prizesTextElement = document.createElement('p');
    prizesTextElement.className = 'prizes-text center';
    prizesTextElement.textContent = 'Here are all the rewards you have got so far:';
    prizesElement.appendChild(prizesTextElement);

    const prizesListElement = document.createElement('div');
    prizesListElement.className = 'itemList';

    let settings = await GM.getValue('gc_bd_settings', getDefaultSettings());

    let setting = settings["display_previous_seasons_rewards"];
    if (setting === "no") {
        let currentSeason = getSeason(getDateString());
        opponentData = opponentData.filter(battleData => getSeason(battleData['date']) === currentSeason);
    }

    setting = settings["rewards_sort_order"];
    if (setting === "desc") {
        opponentData = opponentData.reverse();
    }

    setting = settings["aggregate_rewards"];
    if (setting === "yes") {
        let aggregatedCounts = {};
        let opponentDataFiltered = [];
        for (let battleData of opponentData) {
            let prizeName = battleData['prize_name'];
            if (prizeName in aggregatedCounts) {
                aggregatedCounts[prizeName] += 1;
            }
            else
            {
                aggregatedCounts[prizeName] = 1;
                opponentDataFiltered.push(battleData);
            }
        }
        for (let battleData of opponentDataFiltered) {
            let prizeName = battleData['prize_name'];
            battleData['count'] = aggregatedCounts[prizeName];
        }
        opponentData = opponentDataFiltered;
    }

    opponentData.forEach(battleData => {
        if (!battleData['prize_image']) {
            return;
        }

        let prizeName = battleData['prize_name'];
        let prizeImage = battleData['prize_image'];
        let count = battleData['count'] ?? 0; // generated from aggregate_rewards setting, 0 means 1 but the count won't show
        let shownPrizeName = prizeName;
        if (count > 0) {
            shownPrizeName += ' x' + count;
        }

        const invItem = document.createElement('div');
        invItem.className = 'shop-item';

        const img = document.createElement('img');
        img.className = 'med-image border-1';
        img.src = prizeImage;

        const itemDiv = document.createElement('div');
        itemDiv.className = 'item-info';
        itemDiv.innerHTML = `<span>${shownPrizeName}</span>`;

        const linksDiv = document.createElement('div');
        linksDiv.id = prizeName + '-links';
        linksDiv.className = 'searchhelp';
        linksDiv.setAttribute('style', `display: flex; justify-content: center; align-items: center; gap: 4px;`);

        const formattedName = prizeName.replaceAll(' ', '%20');

        const swLink = document.createElement('a');
        swLink.href = `/market/wizard/?query=${formattedName}`;
        swLink.target = '_blank';
        const swImg = document.createElement('img');
        swImg.src = 'https://grundoscafe.b-cdn.net/misc/wiz.png';
        swLink.appendChild(swImg);
        linksDiv.appendChild(swLink);

        const sdbLink = document.createElement('a');
        sdbLink.href = `/safetydeposit/?page=1&query=${formattedName}&exact=1`;
        sdbLink.target = '_blank';
        const sdbImg = document.createElement('img');
        sdbImg.src = 'https://grundoscafe.b-cdn.net/misc/sdb.gif';
        sdbLink.appendChild(sdbImg);
        linksDiv.appendChild(sdbLink);

        const tpLink = document.createElement('a');
        tpLink.href = `/island/tradingpost/browse/?query=${formattedName}`;
        tpLink.target = '_blank';
        const tpImg = document.createElement('img');
        tpImg.src = 'https://grundoscafe.b-cdn.net/misc/tp.png';
        tpLink.appendChild(tpImg);
        linksDiv.appendChild(tpLink);

        const wlLink = document.createElement('a');
        wlLink.href = `/wishlist/search/?query=${formattedName}`;
        wlLink.target = '_blank';
        const wlImg = document.createElement('img');
        wlImg.src = 'https://grundoscafe.b-cdn.net/misc/wish_icon.png';
        wlLink.appendChild(wlImg);
        linksDiv.appendChild(wlLink);

        invItem.appendChild(img);
        invItem.appendChild(itemDiv);
        invItem.appendChild(linksDiv);

        prizesListElement.appendChild(invItem);
    });
    prizesElement.appendChild(prizesListElement);

    $('div[id="page_content"]').append(prizesElement);

    return prizesElement;
}

async function sendRewardsDataIfNeeded(battleData) {
    if (!battleData['prize_image']) {
        return;
    }

    // Based with permission on Twiggies's "GC - Quest Reward Stat Collector"
    // https://greasyfork.org/en/scripts/482138-gc-quest-reward-stat-collector/code
    let settings = await GM.getValue('gc_bd_settings', getDefaultSettings());
    let setting = settings["share_rewards"];
    if (setting === "public" || setting === "private") {
        let username = $('div[id="userinfo"] a[href^="/userlookup/?user="]')[0].href.split('/?user=')[1];
        let privacy = setting;

        let formId = '1FAIpQLScaNFSPpvA81XbST7hxyA3bJQ0lDRQTn6deSjFFkQLsn_kAuQ';
        const query = {
            "1350867233": version,
            "1534307698": battleData['date'],
            "1053758418": battleData['opponent_info']['name'],
            "1344427827": battleData['is_daily'],
            "1007726898": battleData['prize_name'],
            "1375386844": battleData['prize_image'],
            "1128869702": battleData['win_count'],
            "348938961": battleData['move_number'],
            "202326325": battleData['pet_info']['current_hp'],
            "1821086970": battleData['pet_info']['max_hp'],
            "1775514780": battleData['opponent_info']['max_hp'],
            "1550065838": username,
            "815139160": privacy,
        };
        let formLink = `https://docs.google.com/forms/d/e/${formId}/formResponse?usp=pp_url`;
        for (const [key, value] of Object.entries(query)) {
            formLink += `&entry.${key}=${value}`;
        }

        let opts = {
            mode: 'no-cors',
            referrer: 'no-referrer',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }

        let response = fetch(formLink, opts)
        .then(response => {
            console.log("Battle data submitted");
        })
        .catch(error => {
            console.log("Error:", error);
            console.log(response)
        });
    }
}

// updates the previous battles data if needed during version change
function versionUpgrader(battlesData) {
  if (battlesData['version'] <= 0.2) {
      for (let opponentName in battlesData) {
          if (battlesData.hasOwnProperty(opponentName) && opponentName !== 'version') {
              let opponentData = battlesData[opponentName];
              for (let battleId in opponentData) {
                  if (opponentData[battleId]['result'] === 'won') {
                      opponentData[battleId]['result'] = 'Winner';
                  } else if (opponentData[battleId]['result'] === 'lost') {
                      opponentData[battleId]['result'] = 'Loser';
                  }
              }
          }
      }

      battlesData['version'] = version;
  }
  return battlesData;
}

// TODO:
// import past data
// better search/filters
// fix search bar speed
// filter the list of healing opponents
// move number does not always work when using utility script
// error when keyboard utility script is ordered before this script

