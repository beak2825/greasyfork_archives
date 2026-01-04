// ==UserScript==
// @name         Challenge Tournament Handler
// @version      1.0.0
// @description  Records links of challenges and computes the number of correct countries for each participant
// @match        https://www.geoguessr.com/*
// @author       victheturtle#5159
// @license      MIT
// @require      https://greasyfork.org/scripts/460322-geoguessr-styles-scan/code/Geoguessr%20Styles%20Scan.js?version=1151654
// @require      https://greasyfork.org/scripts/4274-filesaver-js/code/FileSaverjs.js?version=13748
// @icon         https://www.svgrepo.com/show/64130/cup.svg
// @namespace    https://greasyfork.org/users/967692-victheturtle
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/475454/Challenge%20Tournament%20Handler.user.js
// @updateURL https://update.greasyfork.org/scripts/475454/Challenge%20Tournament%20Handler.meta.js
// ==/UserScript==


// List the IDs of players you want to exclude from the leaderboards, with quotes, separated by comas. For example: banned = ["id1", "id2", "id3"]
const banned = []


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

let addedGameIds = new Set()
let exportProgress = null

function checkGameMode() {
    return location.pathname.includes("/challenge");
}
function isInTournament() {
    return localStorage.getItem("CTH_on" ?? "0") == "1"
}
function setInTournament(bool) {
    return localStorage.setItem("CTH_on", (bool) ? "1" : "0")
}
function getGameIdsOfTournament() {
    let links = localStorage.getItem("CTH_links") ?? ""
    if (links == "") return []
    return links.split(",")
}
function addGameIdToTournament(gameId) {
    if (addedGameIds.has(gameId)) return
    addedGameIds.add(gameId)
    let links = getGameIdsOfTournament()
    if (links.includes(gameId)) return
    links.push(gameId)
    localStorage.setItem(`CTH_links`, links.join(","))
}
function getGameData(gameId) {
    return JSON.parse(localStorage.getItem(`CTH_${gameId}`) ?? '{"success":false}')
}
function saveGameData(gameId, data) {
    localStorage.setItem(`CTH_${gameId}`, JSON.stringify(data))
}
function clearGameData(gameId) {
    localStorage.removeItem(`CTH_${gameId}`)
}
function clearTournamentData() {
    for (let gameId of getGameIdsOfTournament()) {
        clearGameData(gameId)
    }
    addedGameIds.clear()
    localStorage.removeItem(`CTH_links`)
}

let shownAlert = false
async function getCountryCode(latlng) {
    if (window.sgs == undefined) {
        if (!shownAlert) {
            shownAlert = true
            window.alert("To make this script work, you also need to install echandler's Simple Reverse Geocoding Script.")
        }
        return
    }
    let sgsRes = await window.sgs.reverse(latlng);

    if (sgsRes.error) {
        return ""
    }

    return sgsRes.country.admin_country_code
}

async function fetchAndSaveChallengeData(gameId) {
    let data = {players: []}
    let paginationToken = ""
    let rounds = []
    let failed = false
    while (paginationToken != null && !failed) {
        await fetch(`https://www.geoguessr.com/api/v3/results/highscores/${gameId}?limit=50&paginationToken=${paginationToken}`)
            .then(resp => resp.json())
            .then(json => {
            if (paginationToken === "") {
                data.rounds = json.items[0].game.rounds.map(guess => { return {lat: guess.lat, lng: guess.lng} })
            }
            for (let entry of json.items) {
                if (banned.includes(entry.userId)) continue
                data.players.push({
                    id: entry.userId,
                    name: entry.playerName,
                    score: entry.totalScore,
                    guesses: entry.game.player.guesses.map(guess => { return {lat: guess.lat, lng: guess.lng} })
                })
            }
            paginationToken = json.paginationToken
            if (paginationToken == null) {
                return
            }
        }).catch(e => {failed = true})
    }
    data.success = !failed
    saveGameData(gameId, data)
}
async function getDataOfGame(gameId) {
    let data = getGameData(gameId)
    if (!data.success) return {}
    let roundCodes = []
    for (let round of data.rounds) {
        roundCodes.push(await getCountryCode(round))
    }
    let gameData = {}
    for (let player of data.players) {
        let countryScore = 0
        for (let i in player.guesses) {
            let guessCode = await getCountryCode(player.guesses[i])
            if (roundCodes[i] == guessCode && roundCodes[i] != "") {
                countryScore += 1
            }
        }
        gameData[player.id] = {id: player.id, name: player.name, score: player.score, countryScore: countryScore}
    }
    return gameData
}
async function getDataOfTournament() {
    let tournamentData = {}
    updateProgress(0)
    let i = 0
    let gameIds = getGameIdsOfTournament()
    for (let gameId of gameIds) {
        await fetchAndSaveChallengeData(gameId)
        let gameData = await getDataOfGame(gameId)
        for (let playerId in gameData) {
            if (tournamentData[playerId] == undefined) {
                tournamentData[playerId] = gameData[playerId]
                tournamentData[playerId].games = 1
            } else {
                tournamentData[playerId].score += gameData[playerId].score
                tournamentData[playerId].countryScore += gameData[playerId].countryScore
                tournamentData[playerId].games += 1
            }
        }
        i += 1
        updateProgress(Math.round(i * 100 / gameIds.length))
    }
    return tournamentData
}

async function computeTournamentLeaderboard() {
    let data = await getDataOfTournament()
    let list = []
    for (let playerId in data) {
        list.push(data[playerId])
    }
    return list.sort((u, v) => {
        if (v.countryScore > u.countryScore) return 1
        if (v.countryScore < u.countryScore) return -1
        if (v.games < u.games) return 1
        if (v.games > u.games) return -1
        return v.score - u.score
    })
}

function currentGameId() {
    return location.pathname.split("/")[2]
}

window.toggleCTH = (e) => {
    if (document.querySelector('#CTH_checkbox')) {
        document.querySelector('#CTH_checkbox').checked = e.checked;
    }
    if (document.querySelector('#CTH_text')) {
        document.querySelector('#CTH_text').innerText = `Tournament ${(e.checked) ? "on" : "off"}`;
    }
    setInTournament(e.checked)
    addGameIdToTournament(currentGameId())
}

function tableToHtml(headerLine, table) {
    let tableHTML = ""
    let headerLineHTML = ""
    for (let item of headerLine) {
        headerLineHTML += `<th class="h">${item}</th>`
    }
    tableHTML += `<tr>${headerLineHTML}</tr>`
    let i = 0
    for (let line of table) {
        let lineHTML = ""
        for (let item of line) {
            lineHTML += `<td${(i == 1) ? ' class="p"' : ''}>${item}</td>`
        }
        tableHTML += `<tr>${lineHTML}</tr>`
        i = 1-i
    }
    return `<style>th,td {text-align: center; padding:2px 8px 2px 8px;} .h { background-color: rgb(192, 192, 192); } .p { background-color: rgb(240, 240, 240); }</style>
    <table border="1" style="border-collapse: collapse;">${tableHTML}</table>`
}
function updateProgress(progress) {
    exportProgress = progress
    if (document.getElementById("exportButton")) {
        document.getElementById("exportButton").innerText = "Export tournament leaderboard" + ((progress != null) ? ` (${progress}%)` : "")
    }
}

async function buildLeaderboardAndSave() {
    updateProgress(0)
    let leaderboard = await computeTournamentLeaderboard()
    let headerLine = ["#", "Player", "Correct countries", "Total score", "Games played"]
    let table = []
    let i = 0
    for (let player of leaderboard) {
        i += 1
        table.push([i, `<a href=https://www.geoguessr.com/user/${player.id}>${player.name}</a>`, player.countryScore, player.score, player.games])
    }

    let html = tableToHtml(headerLine, table)
    var file = new File([html], `Tournament result ${Date.now()}.html`, {type: "text/html;charset=utf-8"});
    saveAs(file);
    updateProgress(null)
}

function removeActionButtons() {
    setTimeout(() => {
    actionButtonsAdded = ""
    document.getElementById("actionButtons").remove()
    }, 100)
}

window.exportCTH = () => {
    if (exportProgress != null) return
    buildLeaderboardAndSave()
}

window.startCTH = () => {
    setInTournament(true)
    addGameIdToTournament(currentGameId())
    removeActionButtons()
}

window.stopCTH = () => {
    setInTournament(false)
    removeActionButtons()
}

window.clearCTH = () => {
    setInTournament(false)
    clearTournamentData()
    removeActionButtons()
}

const cup = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="#ffffff"
height="1.75rem" width="1.75rem" version="1.1" id="Capa_1" viewBox="0 0 489.4 489.4" xml:space="preserve"
style="margin:0.125rem;">
<g>
	<path d="M369.75,0h-250.2v44.3h-85.6V110c0,47.2,38.4,85.6,85.6,85.6h1.5c7.9,51.3,47,92.2,97.2,103v70.9h-30.7
    c-9.5,0-17.1,7.7-17.1,17.1v22.5h-26.2v80.3h200.9v-80.3h-26.2v-22.5c0-9.5-7.7-17.1-17.1-17.1h-30.7v-70.9
    c50.3-10.8,89.3-51.8,97.2-103h1.5c47.2,0,85.6-38.4,85.6-85.6V44.3h-85.6V0H369.75z M119.55,152.3c-23.3,0-42.3-19-42.3-42.3V87.6
    h42.3V152.3z M301.45,121.7l-25.7,21.7l8,32.7c1.5,6.1-5.2,11-10.6,7.7l-28.5-17.8l-28.6,17.7c-5.4,3.3-12.1-1.5-10.6-7.7l8-32.7
    l-25.6-21.6c-4.8-4.1-2.3-12,4-12.4l33.5-2.4l12.8-31.2c2.4-5.9,10.7-5.9,13.1,0l12.7,31.1l33.5,2.4
    C303.75,109.7,306.25,117.6,301.45,121.7z M411.95,87.6V110c0,23.3-18.9,42.3-42.2,42.3V87.6H411.95z"/>
</g>
</svg>`

let menuOption = (e) => `
<label class="${cn("game-options_option__")} ${cn("game-options_editableOption__")}">
  ${cup}
  <div class="${cn("game-options_optionLabel__")}" id="CTH_text">Tournament ${(e) ? "on" : "off"}</div>
  <div class="${cn("game-options_optionInput__")}"><input type="checkbox" class="${cn("toggle_toggle__")}" id="CTH_checkbox"${(e) ? " checked" : ""} onclick="toggleCTH(this)"></div>
</label>
`

let exportButton = () => `<div class="${cn("friends-button_challengeFriendButton__")}" style="margin:0px 10px 0px 10px; padding-left:0.5rem" onclick="exportCTH()">
    <div class="${cn("friends-button_label__")}" id="exportButton">Export tournament leaderboard${(exportProgress != null) ? ` (${exportProgress}%)` : ""}</div>
  </div>`

let startButton = (hasData) => `<div class="${cn("friends-button_challengeFriendButton__")}" style="margin:0px 10px 0px 10px; padding-left:0.5rem" onclick="startCTH()">
    <div class="${cn("friends-button_label__")}">${(hasData) ? "Resume" : "Start"} tournament (this game included)</div>
  </div>`

let stopButton = () => `<div class="${cn("friends-button_challengeFriendButton__")}" style="margin:0px 10px 0px 10px; padding-left:0.5rem" onclick="stopCTH()">
    <div class="${cn("friends-button_label__")}">Stop tournament</div>
  </div>`

let clearButton = () => `<div class="${cn("friends-button_challengeFriendButton__")}" style="margin:0px 10px 0px 10px; padding-left:0.5rem" onclick="clearCTH()">
    <div class="${cn("friends-button_label__")}">Clear tournament data</div>
  </div>`

let actionButtons = (hasData, inTournament) => `
<div class="${cn("results_challengeFriends__")}" id="actionButtons">
  ${(hasData) ? exportButton() : ''}
  ${(!inTournament) ? startButton(hasData) : ''}
  ${(inTournament) ? stopButton() : ''}
  ${(hasData) ? clearButton() : ''}
</div>
`

let actionButtonsAdded = ""
new MutationObserver(async (mutations) => {
    if (location.pathname.includes("/challenge/")) {
        if (isInTournament()) addGameIdToTournament(currentGameId())
        await scanStyles()
        let menuItems = document.querySelectorAll('[class*="in-game_layout__"] [class*="game-options_option__"]');
        if (menuItems.length == 4) {
            menuItems[3].insertAdjacentHTML('beforebegin', menuOption(isInTournament()))
        }
    } else if (location.pathname.includes("/results/")) {
        let resultSwitch = document.querySelector('[class*="results_switch__"]')
        await scanStyles()
        if (resultSwitch && actionButtonsAdded != location.pathname && checkAllStylesFound(["results_challengeFriends__"])) {
            actionButtonsAdded = location.pathname
            resultSwitch.insertAdjacentHTML('afterend', actionButtons(getGameIdsOfTournament().length > 0, isInTournament()))
        }
    }
}).observe(document.body, { subtree: true, childList: true });
