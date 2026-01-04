// ==UserScript==
// @name         RoyaleApi Extension
// @namespace    Odahviing
// @version      3.7.1
// @description  Royaleapi Extension by Odahviing
// @author       Odahviing
// @include      https://royaleapi.com/clan/*
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/382656/RoyaleApi%20Extension.user.js
// @updateURL https://update.greasyfork.org/scripts/382656/RoyaleApi%20Extension.meta.js
// ==/UserScript==

// The New Version 3 !!
// Version 3.7.1 - Last one before quitting

// Configuration

var CLAN_NAME = "9LPQRRVQ"; // For now
var APIURL = `https://api-v3.royaleapi.com`;
var AUTH_KEY = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjczNywiaWRlbiI6IjU5ODYxOTM5NjMzMTUzNjQxNCIsIm1kIjp7InVzZXJuYW1lIjoiT2RhaHZpaW5nIiwiZGlzY3JpbWluYXRvciI6IjIyMzYiLCJrZXlWZXJzaW9uIjozfSwidHMiOjE1NjYwMjUwNDY2MDl9.6v4MKSl5yxMtiYoA6nglaOjAbQ5hPyb01aCakzVQPrE`;
var PROXY = true;
var CORSProxy = `https://cors-anywhere.herokuapp.com/`; // Proxy server to bypass CORS on client Addon
var DEBUG = 0;

// Game Status

var CARDS_AMOUNT = 95; // How many cards in game
var MAX_CARDS_LEVEL = 12; // What is the max level for cards in war games
var CLAN_LEVEL = 25; // This number represent the level of the clan and how strict promotions and demotions should be
var MINIMUM_DAYS_ELDER = 7; // Days to become Elder
var MAXIMUM_DAYS_MEMBER = 3; // Days to ignore inactive members

// War Points

var WAR_LEVEL = 15; // How much points should a winning get in clan-war, this settings setup all the penalties for losing
var WAR_MAX_LOG = 10; // How many fights we have in the API
var WAR_GOOD_AMOUNT = 50; // Blue marker
var MAX_SCORE_FOR_WAR = WAR_MAX_LOG * WAR_LEVEL;

// Deck Levels Points

var DECK_GOOD_AMOUNT = 90; // Blue marker
var MIN_RANK = 75; // Min deck level
var MAX_RANK = 100; // Max deck level
var RANK_CAP = 70; // Points cap for deck
var RANK_CAP_MINIMUM = 60; // How much minus points can someone get for his crappy deck
var MIN_CARD_LEVEL = 7;
var MAX_CARD_LEVEL = 12;;

// Donations Cap

var DONATIONS_MINIMUM = 25; // Below that it is a fine
var DONATIONS_GOOD_AMOUNT = 150; // Above this is blue marker and good number
var DONATIONS_MAX_AMOUNT = 200; // Cap for donations, above it is not relevant
var DONATIONS_SCORE_POINTS = 180; // How much score should donations get
var CAP_DONATIONS = 100; // Soft cap for donations before the reduce start
var CAP_DONATIONS_REDUCE = (DONATIONS_SCORE_POINTS + DONATIONS_MINIMUM - CAP_DONATIONS) / (DONATIONS_MAX_AMOUNT - CAP_DONATIONS); // Reduce %

// Rank Levels Points

var KICK_LIMIT = 0;
var MEMBER_LIMIT = CLAN_LEVEL * 2;
var ELDER_LIMIT = CLAN_LEVEL * 4;
var CO_LEADER_LIMIT = CLAN_LEVEL * 9;

// Clan War Points

var WAR_WINNING = WAR_LEVEL;
var WAR_LOSING = -WAR_WINNING / 4;
var WAR_MISSING = -WAR_WINNING * 3;
var WAR_CARD_MISSING = 1/3; // Missing 3 collection battles, is like missing one war battle

// Player Special

var IGNORE_PLAYERS = ['Idan Marko', 'La Sarah', 'Nana', 'P0ET', 'idomadar', 'Movsho', 'Odahviing']; // Players that can't be demoted or promoted
var DUPLICATE_PLAYERS = []; // [{name: 'DHRC', keys: ['8GY200P08', '#9YY8LYUQJ'], count: 0}]; // If we have players with the same name, write their two keys, and when checking trohpies, go one by one. Can't think of a better solution

// Security Control

var MAX_POINTS = DONATIONS_SCORE_POINTS + RANK_CAP + MAX_SCORE_FOR_WAR;

// Player Class

class Player {
    constructor(id, name, role, cards, tower, wins, dons) {
        this.id = id;
        this.name = name;
        this.role = this.convertRole(role);

        this.deckPower = this.calcDeckPower(cards, tower);
        this.warDayWins = wins;
        this.overallDonations = dons;

        this.donations = 0;
        this.warWins = 0;
        this.warLosses = 0;
        this.warAvg = 0;
        this.warMissed = 0;
        this.overWeight = 0 ;
        this.donationsMulti = 1;

        this.activeInCurrentWar = false;

        this.playingDays = 0;
        this.isFullTime = false;
    }

    updateDonations(avg, count) {
        this.donations = isNaN(avg) == true ? 0 : avg;
        this.playingDays = count;

        if (this.donations > DONATIONS_MAX_AMOUNT) {
            this.overWeight = this.donations - DONATIONS_MAX_AMOUNT;
            this.donations = this.donations - this.overWeight;
        }

        if (this.playingDays >= ACTIVE_DAYS)
            this.isFullTime = true;
    }

    updateWar(count, avg, miss, fightMiss) {
        this.warWins = Math.round(count * avg);
        this.warLosses = count - this.warWins - miss;
        this.warMissed = parseFloat(parseInt(miss) + fightMiss * WAR_CARD_MISSING, 2);
        this.warAvg = avg ? avg : 0;
    }

    updateCurrent(status) {
        this.activeInCurrentWar = status;
    }

    convertRole(roleText) {
        if (roleText.indexOf('Co-') >= 0) return CO_LEADER_ROLE;
        if (roleText.indexOf('Member') >= 0) return MEMBER_ROLE;
        if (roleText.indexOf('Elder') >= 0) return ELDER_ROLE;
        return LEADER_ROLE;
    }

    iconPromotion(){
        if (this.role == LEADER_ROLE || this.role == CO_LEADER_ROLE) return SAME; // Leader will always be leader
        if (IGNORE_PLAYERS.findIndex(x => x == this.name) >= 0) return SAME;
        let score = this.playerScore;

        switch (this.role) {
            case CO_LEADER_ROLE: // No downloads for Co-Leader since 18/8
                return score < ELDER_LIMIT ?
                    DOWN : SAME;
            case ELDER_ROLE:
                if (score < MEMBER_LIMIT) return DOWN;
                return this.isFullTime == true && score >= CO_LEADER_LIMIT && this.warWins >= 3 ?
                    UP: SAME;
            case MEMBER_ROLE:
                if (score < KICK_LIMIT && this.playingDays > MAXIMUM_DAYS_MEMBER) return DOWN;
                return this.playingDays >= MINIMUM_DAYS_ELDER && score >= ELDER_LIMIT && this.warWins >= 1 ?
                    UP: SAME;
        }
    }

    calcDeckPower(cards, towerLevel) {
        let maxRank = CARDS_AMOUNT * MAX_CARDS_LEVEL;
        let deckRank = cards.reduce((a, b) => +a + +this.getCalcLevel(b['displayLevel']), 0);
        deckRank = (100 * deckRank / maxRank).toFixed(2);
        return deckRank < RANK_CAP_MINIMUM ? RANK_CAP_MINIMUM : deckRank;
    }

    getCalcLevel(level) {
        if (level < MIN_CARD_LEVEL) return MIN_CARD_LEVEL;
        if (level > MAX_CARD_LEVEL) return MAX_CARD_LEVEL;
        return level;
    }

    setDonationsMultiplayer(multi) {
        if (multi > 1){
            this.donationsMulti = multi;
        }
    }

    get warScore() {
        let warPoints = WAR_WINNING * this.warWins + WAR_LOSING * this.warLosses + WAR_MISSING * this.warMissed;
        return isNaN(warPoints) === true ? 0 : warPoints;
    }

    get donationScore() {
        let tmpDonations = this.donations * this.donationsMulti;
        if (tmpDonations < CAP_DONATIONS) return this.donations - DONATIONS_MINIMUM;
        if (tmpDonations > DONATIONS_MAX_AMOUNT)
        {
            this.overWeight = Math.max(tmpDonations - DONATIONS_MAX_AMOUNT, this.overWeight);
            tmpDonations = DONATIONS_MAX_AMOUNT;
        }

        tmpDonations = (tmpDonations - CAP_DONATIONS) * CAP_DONATIONS_REDUCE + CAP_DONATIONS - DONATIONS_MINIMUM;
        return tmpDonations;
    }

    get deckScore() {
        return (this.deckPower - MIN_RANK) / (MAX_RANK-MIN_RANK) * RANK_CAP;
    }

    get playerScore() {
        return this.donationScore + this.warScore + this.deckScore;
    }
}

class PlayerList {
    constructor() {
        this.list = [];
        this.donationsM = 1;
    }

    add(newPlayer) {
        if (this.find(newPlayer.id) == -1)
            this.list.push(newPlayer);
    }

    find(playerId) {
        return this.list.findIndex(x => x.id == playerId);
    }

    findByName(playerName) {
        return this.list.findIndex(x => x.name == playerName);
    }

    get(playerId) {
        return this.list[this.find(playerId)];
    }

    calc() {
        let allDons = this.list.reduce((a, b) => +a + +b['donations'] , 0);
        let allWei = this.list.reduce((a, b) => +a + +b['overWeight'] , 0);
        this.donationsM = (allDons + allWei) / allDons;
    }

    updatePlayerDonations(playerName, avg, count) {
        let isDup = DUPLICATE_PLAYERS.findIndex(x => x.name == playerName);
        let indexHelper = -1;

        if (isDup >= 0){
            let getKey = DUPLICATE_PLAYERS[isDup].keys[DUPLICATE_PLAYERS[isDup].count];
            DUPLICATE_PLAYERS[isDup].count = DUPLICATE_PLAYERS[isDup].count + 1;
            indexHelper = this.find(getKey);
        }
        else
            indexHelper = this.findByName(playerName);

        if (indexHelper > -1)
            this.list[indexHelper].updateDonations(avg, count);
    }

    updatePlayerWar(playerId, count, avg, miss, fightMiss) {
        let pIn = this.find(playerId);
        if (pIn > -1)
            this.list[pIn].updateWar(count, avg, miss, fightMiss);
    }

    updateCurrentWarStatus(playerId) {
        let pIn = this.find(playerId);
        if (pIn > -1)
            this.list[pIn].updateCurrent(true);
    }

    resetAllCurrentWar() {
        this.list.forEach(function (value){value.updateCurrent(false);});
    }

    get length() {
        return this.list.length;
    }
}

var playerList = new PlayerList();

// End Player Class

// Main Clan Page Functions

async function loadClanList() {

    getEstimatedDonations();
    let roster = document.getElementById('roster');
    roster.getElementsByClassName('sorted ascending')[0].innerHTML = `S<span class="mobile-hide">tats</span>`;
    roster.getElementsByClassName('mobile-hide')[4].innerHTML = 'Score';
    roster.getElementsByClassName('mobile-hide')[5].innerHTML = `Donations (${parseInt(100 * DONATIONS_SCORE_POINTS / MAX_POINTS)}%)`;
    roster.getElementsByClassName('mobile-hide')[6].innerHTML = `Deck (${parseInt(100 * RANK_CAP / MAX_POINTS)}%)`;
    roster.getElementsByClassName('mobile-hide')[7].innerHTML = `War (${parseInt(100 * MAX_SCORE_FOR_WAR / MAX_POINTS)}%)`;
    roster.getElementsByClassName('mobile-hide')[2].innerHTML = `${KICK_LIMIT} | ${MEMBER_LIMIT} | ${ELDER_LIMIT} | ${CO_LEADER_LIMIT} | ${MAX_POINTS}`;
    roster.getElementsByClassName('mobile-hide')[2].style = `text-align: center!important;`;

    let trs = document.getElementById('roster').getElementsByTagName('tr');
    for (let i = 1 ; i < trs.length; i++) {
        // Get Name
        let playerInnerName = trs[i].getElementsByTagName('td')[1].getElementsByTagName('a')[0].innerHTML;
        let playerName = playerInnerName.substring(0, playerInnerName.indexOf('<')).trim();
        updateLoaderText(`${getP(i+1, trs.length - 1)}% - Loading ${playerName} Data`);
        let playerRole = trs[i].getElementsByTagName('td')[4].innerHTML;
        let playerId = trs[i].getElementsByTagName('td')[5].innerHTML.trim();

        // Debug Flag Bypass
        if (DEBUG > 0 && i > DEBUG) continue;

        let result = await sendAPIRequest(API_PLAYER_DATA, playerId);
        var playerItem = new Player(playerId, playerName, playerRole, result.cards,
                                    parseInt(result.stats.level),
                                    parseInt(result.games.warDayWins),
                                    parseInt(result.stats.totalDonations));
        playerList.add(playerItem);
    }
}

function displayScriptResults() {
    updateLoaderText(`${getP(-1, playerList.length)}% - Painting Script Results`);
    playerList.calc();
    var roleAmount = [0,0,0,0];
    let roster = document.getElementById('roster');
    let trs = roster.getElementsByTagName('tr');

    for (let i = 1 ; i < trs.length; i++) {
        let playerId = trs[i].getElementsByTagName('td')[5].innerHTML.trim();
        let playerRank = trs[i].getElementsByClassName('right aligned mobile-hide')[0].innerHTML;
        var playerItem = playerList.get(playerId);

        if (playerItem == undefined) continue;
        roleAmount[playerItem.role-1]++;

        if (playerItem.isFullTime == true)
            trs[i].getElementsByClassName('mobile-hide')[0].style = `font-weight: bold`;
        else
            trs[i].getElementsByClassName('mobile-hide')[0].innerHTML += ` (${playerItem.playingDays})`;

        // Painting
        trs[i].getElementsByTagName('td')[0].innerHTML = `${playerRank} - ( ${playerItem.overallDonations.toLocaleString()} / ${playerItem.warDayWins} )`;
        trs[i].getElementsByTagName('td')[0].style = `background-color:#${getColorForStats(playerRank, playerItem.overallDonations, playerItem.warDayWins)}`;
        trs[i].getElementsByClassName('mobile-hide')[0].innerHTML += ` ${playerItem.iconPromotion()}`;

        playerItem.setDonationsMultiplayer(playerList.donationsM);
        trs[i].getElementsByClassName('right aligned mobile-hide')[0].innerHTML = parseInt(playerItem.playerScore);

        // Donations Column Data
        paintItem(trs[i], 'right aligned mobile-hide', 1,
                  `${playerItem.donations}${(playerItem.overWeight > 0 ? ` + ${parseInt(playerItem.overWeight)}`: ``)}`,
                  `text-align: center!important;background-color:#${getColorForTrophies(playerItem.donations)}`
                  );

        // Deck Column Data
        paintItem(trs[i], 'right aligned mobile-hide', 2,
                  `${playerItem.deckPower}%`,
                  `text-align: center!important;background-color:#${getColorForDeck(playerItem.deckPower)}`
                 );

        // War Column Data
        paintItem(trs[i], 'mobile-hide', 5,
                  `${playerItem.warWins} of ${playerItem.warLosses + playerItem.warWins} (${Math.round(100 * playerItem.warAvg)}%)${playerItem.warMissed > 0 ? ` - ${paintX(playerItem.warMissed)}` : ''}`,
                  `text-align: center!important;background-color:#${getColorForWar(playerItem.warScore)}; ${playerItem.activeInCurrentWar == true ? ';font-weight: bold' : ''}`
                 );

        // Score Bar Graph
        paintItem(trs[i], 'mobile-hide', 1,
                  paintPlace(playerItem),
                  `text-align: center!important;`
                 );
    }

    document.getElementById('table_th_name').innerHTML += ` (${roleAmount[3]} - ${roleAmount[2]} - ${roleAmount[1]} - ${roleAmount[0]})`;
    roster.getElementsByClassName('mobile-hide')[1].click();
    updateLoaderText(`Script Finished!`);
}

// Paint Results

function paintItem(elem, className, index, inHtml = undefined, inStyle = undefined) {
    if (inHtml)
        elem.getElementsByClassName(className)[index].innerHTML = inHtml;

    if (inStyle)
        elem.getElementsByClassName(className)[index].style = inStyle;
}

function paintX(num){
    num = Math.round(num * 3, 0);
    let str = '';
    for (let i = num; i > 0; i--) str += 'X';
    return str;

}

function paintPlace(item) {
    let score = item.playerScore;
    let role = item.role
    var low = 0, high = 0;

    switch (role)
    {
        case LEADER_ROLE:
        case CO_LEADER_ROLE:
            high = MAX_POINTS;
            low = MEMBER_LIMIT;
            break;
        case ELDER_ROLE:
            high = CO_LEADER_LIMIT;
            low = MEMBER_LIMIT;
            break;
        case MEMBER_ROLE:
            high = ELDER_LIMIT;
            low = KICK_LIMIT;
            break;
    }

    let tRight = high - score;
    let tLeft = score - low;

    let tValue = tLeft / (tLeft + tRight);
    let fValue = Math.round(tValue * LINE_LENGTH);
    let fString = '';

    for (let i = 0; i < fValue && i < LINE_LENGTH; i ++) fString += '_';
    fString += '|';
    for (let i = Math.max(0, fValue); i < LINE_LENGTH; i ++) fString += '_';

    if (tRight < 0)
        fString = `<font color="MediumBlue">${fString}</font>`;
    else
    if (tLeft < 0)
        fString = `<font color="OrangeRed">${fString}</font>`;

    return `  ${fString}  `;
}

function getColorForTrophies(value){
    if (value >= DONATIONS_GOOD_AMOUNT) return GOOD;
    if (value >= DONATIONS_GOOD_AMOUNT / 2) return MID;
    if (value > 0) return LOW;
    return BAD;
}

function getColorForDeck(value){
    if (value >= DECK_GOOD_AMOUNT) return GOOD;
    if (value >= (DECK_GOOD_AMOUNT + MIN_RANK) / 2) return MID;
    if (value >= MIN_RANK) return LOW;
    return BAD;
}

function getColorForStats(level, donations, warWins){
    if (level < 10 || warWins < 10 || donations < 10000)
        return BAD;
    if (level == 10 || warWins < 20 || donations < 20000)
        return LOW;
    if (level == 11 || warWins < 40 || donations < 40000)
        return MID;
    return GOOD;
}

function getColorForWar(value){
    if (value >= WAR_GOOD_AMOUNT) return GOOD;
    if (value >= WAR_GOOD_AMOUNT / 2) return MID;
    if (value > 0) return LOW;
    return BAD;
}

function getEstimatedDonations() {
    let playersInClan = document.getElementsByClassName('ui grid clan_stats')[0].getElementsByClassName('column')[6].getElementsByClassName('value')[0].innerHTML;
    playersInClan = playersInClan.substring(0, playersInClan.indexOf(' '));
    var donationsEl = document.getElementsByClassName('ui grid clan_stats')[0].getElementsByClassName('column')[5].getElementsByClassName('value')[0];

    let current = parseInt(donationsEl.innerHTML.replace(',',''));
    let cDate = new Date();
    let cDay = cDate.getDay() == 0 ? 7: cDate.getDay();
    let minutesSince = (cDay - 1) * 24 * 60 + cDate.getHours() * 60 + cDate.getMinutes();
    let minutesWeek = 7 * 24 * 60;
    let result = parseInt((current / minutesSince) * minutesWeek);

    donationsEl.innerHTML += ` (${result.toLocaleString()}) `;
}

// End Paint Results

// Load Data From Sources

async function loadDonationsPage() {
    updateLoaderText(`${getP(-4, playerList.length)}% - Updating Donations Page Data`);
    await sendRequst(`https://royaleapi.com/clan/${CLAN_NAME}/history/v2?field=donations`).then(function(item){
        let scriptText = item.getElementsByTagName('script')[37].innerHTML;
        scriptText = scriptText.substring(scriptText.indexOf('members:') + 8, scriptText.indexOf('container')).trim();
        let parsedJson = scriptText.substring(0,scriptText.length-1);
        var charList = JSON.parse(scriptText.substring(0,scriptText.length-1));

        let currentValue = 0;
        let preValue = 0;

        for (let i = 0; i < charList.length; i++) {
            let sum = 0;
            let count = 0;
            let preValue = null;

            let donations = charList[i].donation_series;

            for (let j = 0; j < donations.length; j++) {
                currentValue = donations[j].donation;
                if (currentValue == null) continue;
                if (currentValue == 0 && preValue == null) continue;

                let dailyDon = (preValue > currentValue) ? currentValue : currentValue - preValue;

                preValue = currentValue;
                sum = sum +  dailyDon;
                count++;
            }

            playerList.updatePlayerDonations(charList[i].member['name'], (sum / count).toFixed(2), count);
        }
    });
}

async function loadWarPage() {
    updateLoaderText(`${getP(-3, playerList.length)}% - Updating War Page Data`);
    await sendRequst(`https://royaleapi.com/clan/${CLAN_NAME}/war/analytics`).then(function(item){
        var mainTable = item.getElementsByTagName('tbody')[0];
        var trs = mainTable.getElementsByTagName('tr');
        var secondTable = item.getElementsByTagName('tbody')[1];
        var secondTrs = secondTable.getElementsByTagName('tr');

        for (let i = 1; i < trs.length; i++) {
            let playerId = trs[i].getElementsByTagName('a')[0].href.substring(29,38);
            let clms = trs[i].getElementsByClassName('right aligned');
            let avg = parseFloat(clms[0].innerHTML);
            let count = clms[1].innerHTML;
            let mia = clms[2].innerHTML;
            let fightMissCount = 2 * (secondTrs[i].innerHTML.match(/\(1\)/g) || []).length + (secondTrs[i].innerHTML.match(/\(2\)/g) || []).length
            playerList.updatePlayerWar(playerId, count, avg, mia, fightMissCount);
        }
    });
}

async function loadCurrentWarPage() {
    updateLoaderText(`${getP(-2, playerList.length)}% - Updating Current War Data`);
    let results = await sendAPIRequest(API_CLAN_WAR_DATA, CLAN_NAME);
    let participants = results['participants'];
    playerList.resetAllCurrentWar();
    if (!participants) return;
    for (const part of participants) {
        playerList.updateCurrentWarStatus(part.tag);
    }
}

// End Load Data From Sources

// Donations Page Functions

function donationsPage() {
    let objTbl = document.getElementById('hist_container');
    let objRows = objTbl.getElementsByClassName('member_row_container');

    let currentValue = 0;
    let preValue = 0;

    for (let i = 0; i < objRows.length; i++) {
        let starter = false;
        let sum = 0;

        let objCols = objRows[i].getElementsByClassName('member_cell');
        for (let j = 0; j < objCols.length; j++) {
            objCols[j].align = "center";
            currentValue = parseInt(objCols[j].outerHTML.split("\"")[7]);

            let dailyDon = (preValue > currentValue) ?
                currentValue :
                currentValue - preValue;

            objCols[j].innerHTML =  dailyDon;
            sum = sum + dailyDon;

            if (currentValue > 0 && starter == false) starter = true;

            preValue = currentValue;
            let donationsAmount = parseInt(objCols[j].innerHTML);
            objCols[j].style = `background-color:#${getColorForDonations(donationsAmount, starter)}`;
        }

        objCols[0].remove(); // Remove First and Second Column
        objCols[1].remove();
        let playerName = objRows[i].getElementsByClassName('member_name')[0].innerHTML.trim();
        objRows[i].getElementsByClassName('member_name')[0].innerHTML += ` (${sum}) `;
    }
}

function getColorForDonations(value, starter){
    if (value >= DONATIONS_GOOD_AMOUNT) return GOOD;
    if (value >= DONATIONS_GOOD_AMOUNT / 2) return MID;
    if (value == 0)
        return (starter == false) ? WHITE : BAD;
    return LOW;
}

function getColorForRole(value) {
    if (value.indexOf('Leader') >= 0)
        return GOOD;
    if (value.indexOf('Elder') >= 0)
        return MID;
    if (value.indexOf('Member') >= 0)
        return LOW;
    return BAD;
}

// End  Donations Page Functions

// Main

function loaders() {
    return new Promise(async function (fulfill, reject){
        updateLoaderText(`0% - Script is Starting`);
        await loadClanList();
        await loadDonationsPage();
        await loadWarPage();
        await loadCurrentWarPage();
        return fulfill();
    });
}

(function() {
    'use strict';
    let url = document.URL;
    if (url.indexOf(CLAN_NAME) < 0) return;

    if (url.indexOf('donations') >= 0)
        return donationsPage();

    if (url.indexOf('war') >= 0)
        return;

    loaders().then(function() {
        displayScriptResults();
    });
})();

// Consts

var ACTIVE_DAYS = 28;

// API Enum

var API_PLAYER_DATA = 1;
var API_CLAN_WAR_DATA = 2;
var API_ENDPOINTS_DATA = 3;

// Role Enum

var MEMBER_ROLE = 1;
var ELDER_ROLE = 2;
var CO_LEADER_ROLE = 3;
var LEADER_ROLE = 4;

// Graphics

var GOOD = "66CCFF";
var MID = "CCFFCC";
var LOW = "FFFFCC";
var BAD = "FF9999";
var WHITE = "FFFFFF"
var LINE_LENGTH = 20;
var UP = '▲';
var DOWN = '▼';
var SAME = '';

// Logs

var loaderText;
function updateLoaderText(text) {
    if (loaderText == undefined)
        loaderText = document.getElementById('page_content').getElementsByClassName('ui attached segment')[3];
    loaderText.innerHTML = text;
}

function getP(index, length) {
    let loadPages = 5;
    if (index < 0)
        index = length + loadPages + index;
    return parseInt(index * 100 / (length + loadPages));
}

// Network
function sendAPIRequest(pageId, tagId) {
    return new Promise(function (fulfill) {
        var url = `${PROXY == true ? CORSProxy : ''}${APIURL}`;
        switch (pageId)
        {
            case API_PLAYER_DATA:
                url += `/player/${tagId}`;
                break;
            case API_CLAN_WAR_DATA:
                url += `/clan/${tagId}/war`;
                break;
        }

        var settings = {
            "async": true,
            "crossDomain": true,
            "url": url,
            "method": "GET",
            "headers": {
                "auth": AUTH_KEY,
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest'
            }
        }

        $.ajax(settings).done(function (response) {
            return fulfill(response);
        }).fail(function(xhr, status, error) {
            updateLoaderText(`Error Code: ${xhr.status} - ${error}`);
        });
    });
}

function sendRequst(url) {
    return new Promise(function (fulfill, reject){
        var xhttp = new XMLHttpRequest();
        xhttp.open("GET", url , true);
        xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhttp.send();
        xhttp.onreadystatechange = function () {
          if(xhttp.readyState === 4 && xhttp.status === 200) {
              var div = document.createElement('div');
              div.id = "req_id";
              div.innerHTML = xhttp.responseText;
              return fulfill(div);
          }
        };
    });
}