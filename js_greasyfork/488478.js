// ==UserScript==
// @name         Grundo's Cafe - Games Journal
// @namespace    https://www.grundos.cafe/
// @version      0.9
// @description  Keeps track of games rewards history (Community sharing can be disabled in the settings)
// @author       yon
// @match        *://*.grundos.cafe/games*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=grundos.cafe
// @grant        GM.getValue
// @grant        GM.setValue
// @grant        GM.deleteValue
// @require      https://unpkg.com/jquery/dist/jquery.min.js
// @require      https://unpkg.com/gridjs/dist/gridjs.umd.js
// @downloadURL https://update.greasyfork.org/scripts/488478/Grundo%27s%20Cafe%20-%20Games%20Journal.user.js
// @updateURL https://update.greasyfork.org/scripts/488478/Grundo%27s%20Cafe%20-%20Games%20Journal.meta.js
// ==/UserScript==

var version = 0.9;

(async function() {
    'use strict';

    try {
        if (document.URL.includes('grundos.cafe/games/#journal')) {
            await showJournal();
            return;
        }
        if (document.URL.endsWith('grundos.cafe/games/')) {
            showJournalLink();
        }
        else if (document.URL.includes('grundos.cafe/games/html5/')) {
            showJournalLink();
            await displayPastRewardsIfNeeded();
            await interceptAndLogReward();
        }
    } catch (error) {
        showError();

        throw error;
    }
})();

async function interceptAndLogReward() {
    var originalOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(method, url) {
        try {
            if (method === 'POST' && url.endsWith('/games/process/')) {
                this.addEventListener('load', async function() {
                    // Example: "Success! You get a x2 NP \nFeatured Game Bonus!\nYou've also been awarded\na Secret Laboratory Map 3!"
                    let responseText = this.responseText.replaceAll('\n', ' ');
                    if (responseText.includes("You've also been awarded")) {
                        let reward = responseText;
                        let match = responseText.match(/You've also been awarded a(?:n)? (.+?)(?=\!)/i);
                        if (match) {
                            reward = match[1];
                        }
                        else {
                            match = responseText.match(/You've also been awarded (.+?)(?=\!)/i);
                            if (match) {
                                reward = match[1];
                            }
                        }

                        let isFeaturedGame = (responseText.includes('Featured Game') || $('main > div > strong:contains(featured today)').length == 1) ? 'TRUE' : 'FALSE';

                        let game = $('h1[id="game-header"]')[0]?.textContent;

                        await logReward(game, reward, isFeaturedGame);
                    }
                });
            }
        } catch (error) {
            showError();
        }
        originalOpen.apply(this, arguments);
    };
}

async function logReward(game, reward, isFeaturedGame) {
    let newReward = {'date': getDateString(), 'game': game, 'url': document.URL, 'reward': reward, 'is_featured_game': isFeaturedGame};
    console.log(newReward);

    let gamesData = await GM.getValue('gc_games_rewards', {'version': version});
    if (gamesData['game'] === undefined) {
        gamesData['game'] = [];
    }
    gamesData['game'].push(newReward);

    await GM.setValue('gc_games_rewards', gamesData);

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
    let settings = await GM.getValue('gc_games_settings', getDefaultGamesSettings());
    let setting = settings["share_rewards"];
    if (setting === "public" || setting === "private") {
        let username = $('div[id="userinfo"] a[href^="/userlookup/?user="]')[0].href.split('/?user=')[1];
        let privacy = setting;

        let formId = '1FAIpQLSfS9W682NADVesEGVN_VO0ZBjgE7PRBPUDj3Qpmnu9sZjVWzA';
        const query = {
            "1350867233": version,
            "1534307698": newReward['date'],
            "1053758418": newReward['game'],
            "153236007": newReward['url'],
            "1007726898": newReward['reward'],
            "1344427827": newReward['is_featured_game'],
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
            console.log("Game data submitted");
        })
        .catch(error => {
            console.log("Error:", error);
            console.log(response)
        });
    }
}

async function displayPastRewardsIfNeeded() {
    let settings = await GM.getValue('gc_games_settings', getDefaultGamesSettings());
    let setting = settings["display_rewards"];
    if (setting !== "yes") {
        return;
    }

    let game = $('h1[id="game-header"]')[0]?.textContent;
    if (!game) {
        return;
    }

    let gamesData = await GM.getValue('gc_games_rewards', {'version': version});
    let gameData = gamesData[game];
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

    let settings = await GM.getValue('gc_games_settings', getDefaultGamesSettings());

    let setting = settings["rewards_sort_order"];
    if (setting === "desc") {
        gameData = gameData.reverse();
    }

    setting = settings["aggregate_rewards"];
    if (setting === "yes") {
        let aggregatedCounts = {};
        let gameDataFiltered = [];
        for (let rowData of gameData) {
            let prizeName = rowData['reward'];
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
            let prizeName = rowData['reward'];
            rowData['count'] = aggregatedCounts[prizeName];
        }
        gameData = gameDataFiltered;
    }

    gameData.forEach(rowData => {
        if (!rowData['reward']) {
            return;
        }

        let prizeName = rowData['reward'];
        let count = rowData['count'] ?? 0; // generated from aggregate_rewards setting, 0 means 1 but the count won't show
        let shownPrizeName = prizeName;
        if (count > 0) {
            shownPrizeName += ' x' + count;
        }

        const invItem = document.createElement('div');
        invItem.className = 'shop-item';

        /* TODO?
        const img = document.createElement('img');
        img.className = 'med-image border-1';
        img.src = prizeImage;*/

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

        //invItem.appendChild(img);
        invItem.appendChild(itemDiv);
        invItem.appendChild(linksDiv);

        prizesListElement.appendChild(invItem);
    });
    prizesElement.appendChild(prizesListElement);

    $('div[id="page_content"]').append(prizesElement);

    return prizesElement;
}

function showJournalLink() {
    let pageContents = $('div[id="page_content"]');
    if (pageContents.length > 0) {
        const htmlString = `
        <div id="games_journal_header" style="display: flex; justify-content: flex-end; margin-bottom: 12px;">
            <div id="games_journal_redirection">
                <a href="https://www.grundos.cafe/games/#journal" target="_blank">Go to Journal</a>
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
                <div id="games_journal">
                  <h1>Games Journal</h1>
                  <button id="games_export">Export</button>
                  <button id="games_reset">Reset</button>
                  <div id="games_history"></div>
                  <div id="games_settings"></div>
                </div>
              </center>`;
    journalElement.innerHTML = html;

    let cssLink = document.createElement("link");
    cssLink.rel = "stylesheet";
    cssLink.href = "https://unpkg.com/gridjs/dist/theme/mermaid.min.css";
    journalElement.appendChild(cssLink);

    var styleElement = document.createElement('style');
    styleElement.textContent = `
        #games_journal {
            h1 { margin-bottom: 24px; }
            #games_export { font-size: 16px; padding: 8px 16px; }
            #games_reset { font-size: 16px; padding: 8px 16px; }
            #games_history { margin: 24px; }
            #games_settings { margin: 24px; }
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
    }).render(document.getElementById("games_history"));

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
    return ["Date", "Game", "Reward", "Is Featured?"];
}

async function getJournalHistoryRows() {
    let gamesData = await GM.getValue('gc_games_rewards', {'version': version});

    let tableData = [];

    let games = Object.keys(gamesData).filter(name => gamesData.hasOwnProperty(name) && name !== 'version').sort();
    for (const game of games) {
        let gameData = gamesData[game];
        for (let i in gameData) {
            let rowData = gameData[i];
            let date = rowData['date'];
            let gameName = rowData['game'];
            let reward = rowData['reward'] ?? '';
            let isFeaturedGame = rowData['is_featured_game'];
            tableData.push([date, gameName, reward, isFeaturedGame]);
        }
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
    let gamesData = await GM.getValue('gc_games_rewards', {'version': version});

    let exportElement = $('button[id="games_export"]');
    exportElement.click(exportFunction);
    function exportFunction() {
        const filename = `${getDateString()}_games_journal.json`;
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
    let resetElement = $('button[id="games_reset"]');
    resetElement.click(resetFunction);
    async function resetFunction() {
        if (confirm("Do you really want to reset your Games Journal? This action cannot be undone (but you can export it first).") == true) {
            await GM.deleteValue('gc_games_rewards');
        }
    };
}

async function addSettingsButtonListener(journalElement) {
    let settingsElement = $('div[id="games_settings"]')[0];
    let html = `
        <details>
            <summary>Settings</summary>
            <div id="games_settings_parameters"></div>
        </details>`;
    settingsElement.innerHTML = html;

    var styleElement = document.createElement('style');
    styleElement.textContent = `
        summary { font-weight: bold; font-size: 28px; }
        label { font-size: 24px; }
        select { font-size: 20px; margin-left: 8px; }
        #games_settings_save { font-size: 16px; padding: 8px 16px; }`;
    settingsElement.appendChild(styleElement);

    let settingsDetailsElement = $('div[id="games_settings_parameters"]')[0];

    let defaultSettings = getDefaultGamesSettings();

    let currentSettings = await GM.getValue('gc_games_settings', defaultSettings);

    let parameters = {
        "share_rewards": {
            "label": "ε(´｡•᎑•`)っ 💕 Share your future prize rewards with the community 💕",
            "possibleValues": {
                "public": "Yes",
                "private": "Yes but keep my name hidden (only visible to admin)",
                "no": "No"
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
    saveSettingsElement.id = 'games_settings_save';
    saveSettingsElement.textContent = 'Save settings';
    saveSettingsElement.addEventListener('click', saveSettingsFunction);
    async function saveSettingsFunction() {
        let newSettings = {};
        for (const [parameter, values] of Object.entries(parameters)) {
            let selectElement = document.getElementById(parameter);
            newSettings[parameter] = selectElement.value;
        }
        await GM.setValue('gc_games_settings', newSettings);
        console.log('New settings:', newSettings);
        alert('Settings have been saved.')
    };
    settingsDetailsElement.appendChild(saveSettingsElement);
}

function getDefaultGamesSettings() {
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
    <p>Oops! Something went wrong with the Games Journal script.</p>
    <p>Please check you have the latest option from <a href="https://greasyfork.org/en/scripts/488478-grundo-s-cafe-games-journal">here</a></p>
    <p>If it still does not work, please keep the tab open (or save the HTML) and contact Yon#epyslone, the script probably needs an update.</p>
  </div>
`;
    $('div[id="page_content"]').prepend(errorMessage);
}
