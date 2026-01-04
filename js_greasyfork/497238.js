// ==UserScript==
// @name         Grundo's Cafe - Sakhmet Solitaire Journal
// @namespace    https://www.grundos.cafe/
// @version      0.12
// @description  Keeps track of Sakhmet Solitaire rewards history (Community sharing)
// @author       yon
// @match        *://*.grundos.cafe/games/sakhmet_solitaire*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=grundos.cafe
// @grant        GM.getValue
// @grant        GM.setValue
// @grant        GM.deleteValue
// @require      https://unpkg.com/jquery/dist/jquery.min.js
// @require      https://unpkg.com/gridjs/dist/gridjs.umd.js
// @downloadURL https://update.greasyfork.org/scripts/497238/Grundo%27s%20Cafe%20-%20Sakhmet%20Solitaire%20Journal.user.js
// @updateURL https://update.greasyfork.org/scripts/497238/Grundo%27s%20Cafe%20-%20Sakhmet%20Solitaire%20Journal.meta.js
// ==/UserScript==
 
var version = 0.12;
 
(async function() {
    'use strict';
 
    try {
        if (document.URL.includes('grundos.cafe/games/sakhmet_solitaire/#journal')) {
            await showJournal();
            return;
        }
 
        if (document.URL.includes('grundos.cafe/games/sakhmet_solitaire')) {
            if ($('div[id="gamearea"]').length > 0) {
                let drawsRemaining = $('div[class^="ss_counts"] > span')[0]?.textContent;
 
                let draw = null;
                if (drawsRemaining.includes('Round')) {
                    draw = 3;
                }
                else if (drawsRemaining !== null && drawsRemaining !== '') {
                    draw = 1;
                }
 
                await GM.setValue('gc_sakhmet_draw', draw);
            }
            else {
                showJournalLink();
                await displayPastRewardsIfNeeded();
                await interceptAndLogReward();
            }
        }
    } catch (error) {
        showError();
        throw error;
    }
})();
 
async function interceptAndLogReward() {
    $('main > div > strong').each(async function (i, e) {
        if (e.textContent === 'Congratulations!!!') {
            let gamesPlayed = null;
            let won = null;
            let winStreak = null;
            let prize = null;
            let prizeImage = null;
 
            $('main > div > p').each(function (i2, e2) {
                let text = e2.textContent;
                if (text.includes('Your current win streak is')) {
                    let regex = /(\d{1,3}(?:,\d{3})*|\d+)/g;
                    let matches = text.match(regex);
                    if (matches) {
                        gamesPlayed = matches[0];
                        won = matches[1];
                        winStreak = matches[2];
                    }
                }
                else if (text.includes('The Chomby also slides you')) {
                    let regex = /The Chomby also slides you a (.*?) - take care of it!/g;
                    let matches = regex.exec(text);
                    if (matches) {
                        prize = matches[1];
                        prizeImage = e2.parentElement.querySelector('img')['src'];
                    }
                }
            });
            if (winStreak > 0) {
                console.log(gamesPlayed, won, winStreak, prize);
 
                await logReward(gamesPlayed, won, winStreak, prize, prizeImage);
            }
        }
    });
}
 
async function logReward(gamesPlayed, won, winStreak, prize, prizeImage) {
    let draw = await GM.getValue('gc_sakhmet_draw');
    let newReward = {'date': getDateString(), 'prize': prize, 'prize_image': prizeImage, 'games_played': gamesPlayed, 'won': won, 'win_streak': winStreak, 'draw': draw};
    console.log(newReward);
 
    let gamesData = await GM.getValue('gc_sakhmet_rewards', {'version': version});
    if (gamesData['rewards'] === undefined) {
        gamesData['rewards'] = [];
    }
    gamesData['rewards'].push(newReward);
 
    await GM.setValue('gc_sakhmet_rewards', gamesData);
 
    await sendRewardIfNeeded(newReward);
}
 
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
 
async function sendRewardIfNeeded(newReward) {
    let settings = await GM.getValue('gc_sakhmet_settings', getDefaultSakhmetSettings());
    let setting = settings["share_rewards"];
    if (setting === "public" || setting === "private") {
        let username = $('div[id="userinfo"] a[href^="/userlookup/?user="]')[0].href.split('/?user=')[1];
        let privacy = setting;
 
        let formId = '1FAIpQLSfL6oerp4_HyORNVD2FqV5qCiLq5DxEHm-haoE-x8PC4G7MEw';
        const query = {
            "1350867233": version,
            "1534307698": newReward['date'],
            "1344427827": newReward['prize'],
            "1683717801": newReward['prize_image'],
            "1130612123": newReward['games_played'],
            "1191069949": newReward['won'],
            "1953250862": newReward['win_streak'],
            "1377143511": newReward['draw'],
            "1550065838": username,
            "1831400355": privacy
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
            console.log("Game data submitted");
        })
        .catch(error => {
            console.log("Error:", error);
            console.log(response)
        });
    }
}
 
async function displayPastRewardsIfNeeded() {
    let settings = await GM.getValue('gc_sakhmet_settings', getDefaultSakhmetSettings());
    let setting = settings["display_rewards"];
    if (setting !== "yes") {
        return;
    }
 
    let gamesData = await GM.getValue('gc_sakhmet_rewards', {'version': version});
    let gameData = gamesData['rewards'];
    if (!gameData) {
        return;
    }
 
    await displayPastRewardsFromGameData(gameData);
}
 
async function displayPastRewardsFromGameData(gameData) {
    const prizesElement = document.createElement('div');
    prizesElement.className = 'prizes';
 
    const prizesTextElement = document.createElement('p');
    prizesTextElement.className = 'prizes-text center';
    prizesTextElement.textContent = 'Here are all the rewards you have got so far:';
    prizesElement.appendChild(prizesTextElement);
 
    const prizesListElement = document.createElement('div');
    prizesListElement.className = 'itemList';
 
    let settings = await GM.getValue('gc_sakhmet_settings', getDefaultSakhmetSettings());
 
    let setting = settings["rewards_sort_order"];
    if (setting === "desc") {
        gameData = gameData.reverse();
    }
 
    setting = settings["aggregate_rewards"];
    if (setting === "yes") {
        let aggregatedCounts = {};
        let gameDataFiltered = [];
        for (let rowData of gameData) {
            let prizeName = rowData['prize'];
            if (prizeName in aggregatedCounts) {
                aggregatedCounts[prizeName] += 1;
            }
            else
            {
                aggregatedCounts[prizeName] = 1;
                gameDataFiltered.push(rowData);
            }
        }
        for (let rowData of gameDataFiltered) {
            let prizeName = rowData['prize'];
            rowData['count'] = aggregatedCounts[prizeName];
        }
        gameData = gameDataFiltered;
    }
 
    gameData.forEach(rowData => {
        let prizeName = rowData['prize'] ?? 'Nothing';
        let count = rowData['count'] ?? 0; // generated from aggregate_rewards setting, 0 means 1 but the count won't show
        let shownPrizeName = prizeName;
        if (count > 0) {
            shownPrizeName += ' x' + count;
        }
 
        const invItem = document.createElement('div');
        invItem.className = 'shop-item';
 
        const img = document.createElement('img');
        img.className = 'med-image border-1';
        img.src = rowData['prize_image'] ?? 'https://grundoscafe.b-cdn.net/items/petpetlab_soot.gif';
 
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
 
    $('main').append(prizesElement);
 
    return prizesElement;
}
 
function showJournalLink() {
    let pageContents = $('main');
    if (pageContents.length > 0) {
        const htmlString = `
        <div id="sakhmet_journal_header" style="display: flex; justify-content: flex-end; margin-bottom: 12px;">
            <div id="sakhmet_journal_redirection">
                <a href="https://www.grundos.cafe/games/sakhmet_solitaire/#journal" target="_blank">Go to Journal</a>
            </div>
        </div>`;
        pageContents[0].insertAdjacentHTML("beforeend", htmlString);
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
                <div id="sakhmet_journal">
                  <h1>Games Journal</h1>
                  <button id="sakhmet_export">Export</button>
                  <button id="sakhmet_reset">Reset</button>
                  <div id="sakhmet_history"></div>
                  <div id="sakhmet_settings"></div>
                </div>
              </center>`;
    journalElement.innerHTML = html;
 
    let cssLink = document.createElement("link");
    cssLink.rel = "stylesheet";
    cssLink.href = "https://unpkg.com/gridjs/dist/theme/mermaid.min.css";
    journalElement.appendChild(cssLink);
 
    var styleElement = document.createElement('style');
    styleElement.textContent = `
        #sakhmet_journal {
            h1 { margin-bottom: 24px; }
            #sakhmet_export { font-size: 16px; padding: 8px 16px; }
            #sakhmet_reset { font-size: 16px; padding: 8px 16px; }
            #sakhmet_history { margin: 24px; }
            #sakhmet_settings { margin: 24px; }
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
    }).render(document.getElementById("sakhmet_history"));
 
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
    return ["Date", "Prize", "Games Played", "Won", "Win Streak", "Cards Per Draw"];
}
 
async function getJournalHistoryRows() {
    let gamesData = await GM.getValue('gc_sakhmet_rewards', {'version': version});
 
    let tableData = [];
    for (const rowData of gamesData['rewards']) {
        let date = rowData['date'];
        let reward = rowData['prize'] ?? 'Nothing';
        let gamesPlayed = rowData['games_played'];
        let won = rowData['won'];
        let winStreak = rowData['win_streak'];
        let draw = rowData['draw'];
        tableData.push([date, reward, gamesPlayed, won, winStreak, draw]);
    }
    return tableData;
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
    let gamesData = await GM.getValue('gc_sakhmet_rewards', {'version': version});
 
    let exportElement = $('button[id="sakhmet_export"]');
    exportElement.click(exportFunction);
    function exportFunction() {
        const filename = `${getDateString()}_sakhmet_journal.json`;
        const jsonString = JSON.stringify(gamesData, null, 2); // The third argument is for indentation
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
    let resetElement = $('button[id="sakhmet_reset"]');
    resetElement.click(resetFunction);
    async function resetFunction() {
        if (confirm("Do you really want to reset your Sakhmet Solitaire Journal? This action cannot be undone (but you can export it first).") == true) {
            await GM.deleteValue('gc_sakhmet_rewards');
        }
    };
}
 
async function addSettingsButtonListener(journalElement) {
    let settingsElement = $('div[id="sakhmet_settings"]')[0];
    let html = `
        <details>
            <summary>Settings</summary>
            <div id="sakhmet_settings_parameters"></div>
        </details>`;
    settingsElement.innerHTML = html;
 
    var styleElement = document.createElement('style');
    styleElement.textContent = `
        summary { font-weight: bold; font-size: 28px; }
        label { font-size: 24px; }
        select { font-size: 20px; margin-left: 8px; }
        #sakhmet_settings_save { font-size: 16px; padding: 8px 16px; }`;
    settingsElement.appendChild(styleElement);
 
    let settingsDetailsElement = $('div[id="sakhmet_settings_parameters"]')[0];
 
    let defaultSettings = getDefaultSakhmetSettings();
 
    let currentSettings = await GM.getValue('gc_sakhmet_settings', defaultSettings);
 
    let parameters = {
        "share_rewards": {
            "label": "ε(´｡•᎑•`)っ 💕 Share your future prize rewards with the community 💕",
            "possibleValues": {
                "public": "Show my name",
                "private": "Keep my name hidden (only visible to admin)"
            },
            "defaultValue": defaultSettings["share_rewards"]
        },
        "display_rewards": {
            "label": "Display rewards below games",
            "possibleValues": {
                "yes": "Yes",
                "no": "No"
            },
            "defaultValue": defaultSettings["display_rewards"]
        },
        "rewards_sort_order": {
            "label": "Display rewards in the following order",
            "possibleValues": {
                "desc": "Latest first",
                "asc": "Oldest first"
            },
            "defaultValue": defaultSettings["rewards_sort_order"]
        },
        "aggregate_rewards": {
            "label": "Aggregate game rewards per item",
            "possibleValues": {
                "yes": "Yes",
                "no": "No"
            },
            "defaultValue": defaultSettings["aggregate_rewards"]
        },
    };
 
    for (const [parameter, values] of Object.entries(parameters)) {
        const label = document.createElement("label");
        label.setAttribute("for", parameter);
        label.textContent = values["label"] + ":";
 
        const select = document.createElement("select");
        select.id = parameter;
 
        let parameterCurrentSetting = currentSettings[parameter] ?? values["defaultValue"];
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
 
    var saveSettingsElement = document.createElement('button');
    saveSettingsElement.id = 'sakhmet_settings_save';
    saveSettingsElement.textContent = 'Save settings';
    saveSettingsElement.addEventListener('click', saveSettingsFunction);
    async function saveSettingsFunction() {
        let newSettings = {};
        for (const [parameter, values] of Object.entries(parameters)) {
            let selectElement = document.getElementById(parameter);
            newSettings[parameter] = selectElement.value;
        }
        await GM.setValue('gc_sakhmet_settings', newSettings);
        console.log('New settings:', newSettings);
        alert('Settings have been saved.')
    };
    settingsDetailsElement.appendChild(saveSettingsElement);
}
 
function getDefaultSakhmetSettings() {
    let defaultSettings = {
        "share_rewards": "private",
        "display_rewards": "yes",
        "rewards_sort_order": "desc",
        "aggregate_rewards": "yes"
    };
    return defaultSettings;
}
 
function showError() {
    let errorMessage = `
  <div class="error-message">
    <p>Oops! Something went wrong with the Sakhmet Solitaire Journal script.</p>
    <p>Please check you have the latest option from <a href="https://greasyfork.org/en/scripts/497238-grundo-s-cafe-sakhmet-solitaire-journal">here</a></p>
    <p>If it still does not work, please keep the tab open (or save the HTML) and contact Yon#epyslone, the script probably needs an update.</p>
  </div>
`;
    $('main').prepend(errorMessage);
}