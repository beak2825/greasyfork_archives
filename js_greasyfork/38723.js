// ==UserScript==
// @name         MedalAid
// @namespace    http://tampermonkey.net/
// @version      1.3.0
// @author       lanyards
// @grant        GM_setValue
// @grant        GM_getValue
// @include      http://*.conquerclub.com/*
// @include      https://*.conquerclub.com/*
// @description  Displays unique wins for medals!
// @downloadURL https://update.greasyfork.org/scripts/38723/MedalAid.user.js
// @updateURL https://update.greasyfork.org/scripts/38723/MedalAid.meta.js
// ==/UserScript==

const medal = {STANDARD : 0,
               DOUBLES: 1,
               TRIPLES: 2,
               QUADRUPLES: 3,
               TERMINATOR: 4,
               ASSASSIN: 5,
               MANUALTROOPS: 6,
               FREESTYLE: 7,
               POLYMORPHIC: 8,
               NUCLEAR: 9,
               FOGOFWAR: 10,
               TRENCH: 11,
               SPEED: 12,
               TEAMMATE: 13,
               RANDOM: 14,
               BETA: 15,
               RATING: 16};

const opt = {DEFEAT_MEDALS: 0,
             MISSING_MEDALS: 1,
             OPEN_GAME_HIGHLIGHTING: 2,
             ACTIVE_TAB_MEDALS: 3,
             WAITING_TAB_MEDALS: 4,
             ELIM_FIN_TAB_MEDALS: 5,
             JOIN_GAMES_MEDALS: 6,
             GAME_FINDER_MEDALS: 7,
             PROFILE_MEDALS: 8,
             SCOREBOARD_MEDALS: 9};

var medalURLs = ['https://u.cubeupload.com/lanyards/standard.png',
                 'https://u.cubeupload.com/lanyards/doubles.png',
                 'https://u.cubeupload.com/lanyards/triples.png',
                 'https://u.cubeupload.com/lanyards/quadruples.png',
                 'https://u.cubeupload.com/lanyards/terminator.png',
                 'https://u.cubeupload.com/lanyards/assassin.png',
                 'https://u.cubeupload.com/lanyards/manualTroops.png',
                 'https://u.cubeupload.com/lanyards/freestyle.png',
                 'https://u.cubeupload.com/lanyards/polymorphic.png',
                 'https://u.cubeupload.com/lanyards/nuclear.png',
                 'https://u.cubeupload.com/lanyards/fogOfWar.png',
                 'https://u.cubeupload.com/lanyards/trench.png',
                 'https://u.cubeupload.com/lanyards/speed.png',
                 'https://u.cubeupload.com/lanyards/teammate.png',
                 'https://u.cubeupload.com/lanyards/random.png',
                 'https://u.cubeupload.com/lanyards/beta.png',
                 'https://u.cubeupload.com/lanyards/rating.png'];

var medalXURLs = ['https://u.cubeupload.com/lanyards/standardX.png',
                  'https://u.cubeupload.com/lanyards/doublesX.png',
                  'https://u.cubeupload.com/lanyards/triplesX.png',
                  'https://u.cubeupload.com/lanyards/quadruplesX.png',
                  'https://u.cubeupload.com/lanyards/terminatorX.png',
                  'https://u.cubeupload.com/lanyards/assassinX.png',
                  'https://u.cubeupload.com/lanyards/manualTroopsX.png',
                  'https://u.cubeupload.com/lanyards/freestyleX.png',
                  'https://u.cubeupload.com/lanyards/polymorphicX.png',
                  'https://u.cubeupload.com/lanyards/nuclearX.png',
                  'https://u.cubeupload.com/lanyards/fogOfWarX.png',
                  'https://u.cubeupload.com/lanyards/trenchX.png',
                  'https://u.cubeupload.com/lanyards/speedX.png',
                  'https://u.cubeupload.com/lanyards/teammateX.png',
                  'https://u.cubeupload.com/lanyards/randomX.png',
                  'https://u.cubeupload.com/lanyards/betaX.png',
                  'https://u.cubeupload.com/lanyards/ratingX.png'];

var medalTitles = ['Standard Defeat', 'Doubles Defeat', 'Triples Defeat', 'Quadruples Defeat',
                   'Terminator Defeat', 'Assassin Defeat', 'Manual Troops Defeat',
                   'Freestyle Defeat', 'Polymorphic Defeat', 'Nuclear Defeat',
                   'Fog of War Defeat', 'Trench Warfare Defeat', 'Speed Game Defeat',
                   'Teammate Win', 'Random Map Defeat', 'Beta Map Defeat', 'Rating Given'];

var medalXTitles = ['Missing Standard Defeat', 'Missing Doubles Defeat', 'Missing Triples Defeat',
                    'Missing Quadruples Defeat', 'Missing Terminator Defeat', 'Missing Assassin Defeat',
                    'Missing Manual Troops Defeat', 'Missing Freestyle Defeat', 'Missing Polymorphic Defeat',
                    'Missing Nuclear Defeat', 'Missing Fog of War Defeat', 'Missing Trench Warfare Defeat',
                    'Missing Speed Game Defeat', 'Missing Teammate Win', 'Missing Random Map Defeat',
                    'Missing Beta Map Defeat', 'Missing Rating Given'];

var botIds = [667743, 651617, 688572, 688573, 651618, 688574, 688575, 655218, 688576, 688577, 688578];

var userId;
var hash;
var lastScanTime;
var trackingMedal;
var options;

function printTotals() {
    let totals = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    let players = Object.keys(hash);

    for (let i = 0; i < players.length; i++) {
        let record = hash[players[i]];
        for (let j = 0; j < 17; j++) {
            if (record[j]) { totals[j]++; }
        }
    }

    console.log('Standard defeats : ' + totals[medal.STANDARD]);
    console.log('Doubles defeats : ' + totals[medal.DOUBLES]);
    console.log('Triples defeats : ' + totals[medal.TRIPLES]);
    console.log('Quadruples defeats : ' + totals[medal.QUADRUPLES]);
    console.log('Terminator defeats : ' + totals[medal.TERMINATOR]);
    console.log('Assassin defeats : ' + totals[medal.ASSASSIN]);
    console.log('Manual Troop defeats : ' + totals[medal.MANUALTROOPS]);
    console.log('Freestyle defeats : ' + totals[medal.FREESTYLE]);
    console.log('Polymorphic defeats : ' + totals[medal.POLYMORPHIC]);
    console.log('Nuclear defeats : ' + totals[medal.NUCLEAR]);
    console.log('Fog of War defeats : ' + totals[medal.FOGOFWAR]);
    console.log('Trench defeats : ' + totals[medal.TRENCH]);
    console.log('Speed defeats : ' + totals[medal.SPEED]);
    console.log('Teammate wins : ' + totals[medal.TEAMMATE]);
    console.log('Random Map defeats : ' + totals[medal.RANDOM]);
    console.log('Beta Map defeats : ' + totals[medal.BETA]);
    console.log('Ratings left : ' + totals[medal.RATING]);
}

function loadScoreboardIcons() {
    let tbody = document.querySelectorAll('#middleColumn > div > table > tbody')[0];
    let th = document.createElement('th');
    th.innerHTML = 'Defeats';
    tbody.children[0].appendChild(th);
    for (let i = 1; i < tbody.children.length; i++) {
        let tr = tbody.children[i];
        let playerId = tr.children[1].children[0].getAttribute('href').split('=')[2];
        let record = hash[playerId];
        let td = document.createElement('td');
        for (let j = 0; j < 17; j++) {
            let img = document.createElement('img');
            img.style.height = '15px';
            img.style.width = '15px';
            if (record && record[j]) {
                img.setAttribute('src', medalURLs[j]);
                img.setAttribute('title', medalTitles[j]);
            } else {
                img.setAttribute('src', medalXURLs[j]);
                img.setAttribute('title', medalXTitles[j]);
            }
            td.appendChild(img);
        }
        tr.appendChild(td);
    }
}

function highlightGame(element, players, map, gameType, manual, freestyle, nuclear, fog, trench, speed) {
    let betaMaps = ['2015 World Cup', 'Krazy Kingdoms', 'Pirates and Merchants', 'Promontory Summit', 'Slovakia', 'Trafalaxy', 'Ziggurat'];
    let medalMissing = [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false];

    let open = false;
    for (let i = 0; i < players.length; i++) {
        if (players[i] == 'Empty') { open = true; }
    }
    if (!open) { return; }

    if (gameType == 'Standard' && trackingMedal[medal.STANDARD]) {
        for (let i = 0; i < players.length; i++) {
            if (players[i] == 'Empty' || players[i] == 'Reserved' || players[i] == userId) { continue; }
            let record = hash[players[i]];
            if (record == undefined || !record[medal.STANDARD]) { medalMissing[medal.STANDARD] = true; break; }
        }
    }

    if (gameType == 'Doubles') {
        for (let i = 0; i < players.length; i++) {
            if (players[i] == 'Empty' || players[i] == 'Reserved' || players[i] == userId) { continue; }
            let record = hash[players[i]];
            if (trackingMedal[medal.DOUBLES] && (record == undefined || !record[medal.DOUBLES])) {
                for (let j = 0; j < players.length; j += 2) {
                    if (i >= j && i < j + 2) { continue; }
                    if (players[j] == 'Empty' ||
                        players[j + 1] == 'Empty') { medalMissing[medal.DOUBLES] = true; break; }
                }
            }
            if (trackingMedal[medal.TEAMMATE] && (record == undefined || !record[medal.TEAMMATE])) {
                for (let j = (i - (i % 2)); j < (i - (i % 2) + 2); j++) {
                    if (players[j] == 'Empty') { medalMissing[medal.TEAMMATE] = true; break; }
                }
            }
        }
    }

    if (gameType == 'Triples') {
        for (let i = 0; i < players.length; i++) {
            if (players[i] == 'Empty' || players[i] == 'Reserved' || players[i] == userId) { continue; }
            let record = hash[players[i]];
            if (trackingMedal[medal.TRIPLES] && (record == undefined || !record[medal.TRIPLES])) {
                for (let j = 0; j < players.length; j += 3) {
                    if (i >= j && i < j + 3) { continue; }
                    if (players[j] == 'Empty' ||
                        players[j + 1] == 'Empty' ||
                        players[j + 2] == 'Empty') { medalMissing[medal.TRIPLES] = true; break; }
                }
            }
            if (trackingMedal[medal.TEAMMATE] && (record == undefined || !record[medal.TEAMMATE])) {
                for (let j = (i - (i % 3)); j < (i - (i % 3) + 3); j++) {
                    if (players[j] == 'Empty') { medalMissing[medal.TEAMMATE] = true; break; }
                }
            }
        }
    }

    if (gameType == 'Quadruples') {
        for (let i = 0; i < players.length; i++) {
            if (players[i] == 'Empty' || players[i] == 'Reserved' || players[i] == userId) { continue; }
            let record = hash[players[i]];
            if (trackingMedal[medal.QUADRUPLES] && (record == undefined || !record[medal.QUADRUPLES])) {
                for (let j = 0; j < players.length; j += 4) {
                    if (i >= j && i < j + 4) { continue; }
                    if (players[j] == 'Empty' ||
                        players[j + 1] == 'Empty'||
                        players[j + 2] == 'Empty' ||
                        players[j + 3] == 'Empty') { medalMissing[medal.QUADRUPLES] = true; break; }
                }
            }
            if (trackingMedal[medal.TEAMMATE] && (record == undefined || !record[medal.TEAMMATE])) {
                for (let j = (i - (i % 4)); j < (i - (i % 4) + 4); j++) {
                    if (players[j] == 'Empty') { medalMissing[medal.TEAMMATE] = true; break; }
                }
            }
        }
    }

    if (gameType == 'Terminator' && trackingMedal[medal.TERMINATOR]) {
        for (let i = 0; i < players.length; i++) {
            if (players[i] == 'Empty' || players[i] == 'Reserved' || players[i] == userId) { continue; }
            let record = hash[players[i]];
            if (record == undefined || !record[medal.TERMINATOR]) { medalMissing[medal.TERMINATOR] = true; break; }
        }
    }

    if (gameType == 'Assassin' && trackingMedal[medal.ASSASSIN]) {
        for (let i = 0; i < players.length; i++) {
            if (players[i] == 'Empty' || players[i] == 'Reserved' || players[i] == userId) { continue; }
            let record = hash[players[i]];
            if (record == undefined || !record[medal.ASSASSIN]) { medalMissing[medal.ASSASSIN] = true; break; }
        }
    }

    if (manual && trackingMedal[medal.MANUALTROOPS]) {
        for (let i = 0; i < players.length; i++) {
            if (players[i] == 'Empty' || players[i] == 'Reserved' || players[i] == userId) { continue; }
            let record = hash[players[i]];
            if (record == undefined || !record[medal.MANUALTROOPS]) { medalMissing[medal.MANUALTROOPS] = true; break; }
        }
    }

    if (freestyle && trackingMedal[medal.FREESTYLE]) {
        for (let i = 0; i < players.length; i++) {
            if (players[i] == 'Empty' || players[i] == 'Reserved' || players[i] == userId) { continue; }
            let record = hash[players[i]];
            if (record == undefined || !record[medal.FREESTYLE]) { medalMissing[medal.FREESTYLE] = true; break; }
        }
    }

    if (gameType == 'Polymorphic' && trackingMedal[medal.POLYMORPHIC]) {
        for (let i = 0; i < players.length; i++) {
            if (players[i] == 'Empty' || players[i] == 'Reserved' || players[i] == userId) { continue; }
            let record = hash[players[i]];
            if (record == undefined || !record[medal.POLYMORPHIC]) { medalMissing[medal.POLYMORPHIC] = true; break; }
        }
    }

    if (nuclear && trackingMedal[medal.NUCLEAR]) {
        for (let i = 0; i < players.length; i++) {
            if (players[i] == 'Empty' || players[i] == 'Reserved' || players[i] == userId) { continue; }
            let record = hash[players[i]];
            if (record == undefined || !record[medal.NUCLEAR]) { medalMissing[medal.NUCLEAR] = true; break; }
        }
    }

    if (fog && trackingMedal[medal.FOGOFWAR]) {
        for (let i = 0; i < players.length; i++) {
            if (players[i] == 'Empty' || players[i] == 'Reserved' || players[i] == userId) { continue; }
            let record = hash[players[i]];
            if (record == undefined || !record[medal.FOGOFWAR]) { medalMissing[medal.FOGOFWAR] = true; break; }
        }
    }

    if (trench && trackingMedal[medal.TRENCH]) {
        for (let i = 0; i < players.length; i++) {
            if (players[i] == 'Empty' || players[i] == 'Reserved' || players[i] == userId) { continue; }
            let record = hash[players[i]];
            if (record == undefined || !record[medal.TRENCH]) { medalMissing[medal.TRENCH] = true; break; }
        }
    }

    if (speed && trackingMedal[medal.SPEED]) {
        for (let i = 0; i < players.length; i++) {
            if (players[i] == 'Empty' || players[i] == 'Reserved' || players[i] == userId) { continue; }
            let record = hash[players[i]];
            if (record == undefined || !record[medal.SPEED]) { medalMissing[medal.SPEED] = true; break; }
        }
    }

    if (map == 'Random' && trackingMedal[medal.RANDOM]) {
        for (let i = 0; i < players.length; i++) {
            if (players[i] == 'Empty' || players[i] == 'Reserved' || players[i] == userId) { continue; }
            let record = hash[players[i]];
            if (record == undefined || !record[medal.RANDOM]) { medalMissing[medal.RANDOM] = true; break; }
        }
    }

    if (betaMaps.indexOf(map) != -1 && trackingMedal[medal.BETA]) {
        for (let i = 0; i < players.length; i++) {
            if (players[i] == 'Empty' || players[i] == 'Reserved' || players[i] == userId) { continue; }
            let record = hash[players[i]];
            if (record == undefined || !record[medal.BETA]) { medalMissing[medal.BETA] = true; break; }
        }
    }

    /*if (trackingMedal[medal.RATING]) {
        for (let i = 0; i < players.length; i++) {
            if (players[i] == 'Empty' || players[i] == 'Reserved' || players[i] == userId) { continue; }
            let record = hash[players[i]];
            if (record == undefined || !record[medal.RATING]) { medalMissing[medal.RATING] = true; break; }
        }
    }*/

    for (let i = 0; i < medalMissing.length; i++) {
        if (medalMissing[i]) {
            //show potential medals?
            element.style.backgroundColor = 'gold';
            element.style.background = 'linear-gradient(gold, rgba(218, 165, 32, 0.75))';
            break;
        }
    }
}

function highlightGames() {
    if (/player.php\?mode=find2/.test(window.location.href)) {
        let timer;
        let callback = function() {
            if (timer) { clearTimeout(timer); }
            timer = setTimeout(() => {
                let games = document.querySelectorAll('div.curved');
                games = Array.prototype.slice.call(games);
                games = games.map(x => x.children[0].children[0].children[1].children[0]);
                for (let i = 0; i < games.length; i++) {
                    let options = games[i].getElementsByClassName('gameoptions')[0];
                    let map = options.children[0].innerHTML;
                    options = options.children[2].children;
                    let speed = false, gameType = 'Standard', nuclear = false, freestyle = false,
                        fog = false, trench = false, manual = false;
                    for (let j = 0; j < options.length; j++) {
                        if (/Speed/.test(options[j].innerHTML)) { speed = true; }
                        if (/Terminator/.test(options[j].innerHTML)) { gameType = 'Terminator'; }
                        if (/Assassin/.test(options[j].innerHTML)) { gameType = 'Assassin'; }
                        if (/Poly/.test(options[j].innerHTML)) { gameType = 'Polymorphic'; }
                        if (/Doubles/.test(options[j].innerHTML)) { gameType = 'Doubles'; }
                        if (/Triples/.test(options[j].innerHTML)) { gameType = 'Triples'; }
                        if (/Quadruples/.test(options[j].innerHTML)) { gameType = 'Quadruples'; }
                        if (/Nuclear/.test(options[j].innerHTML)) { nuclear = true; }
                        if (/Freestyle/.test(options[j].innerHTML)) { freestyle = true; }
                        if (/Fog/.test(options[j].innerHTML)) { fog = true; }
                        if (/Trench/.test(options[j].innerHTML)) { trench = true; }
                        if (/Manual/.test(options[j].innerHTML)) { manual = true; }
                    }
                    let lis = games[i].getElementsByClassName('players')[0].children;
                    let players = [];
                    for (let j = 0; j < lis.length; j++) {
                        if (lis[j].innerHTML.split(' ')[0] == 'Empty') { players[j] = 'Empty'; }
                        else if (lis[j].innerHTML.split(' ')[0] == 'Reserved') { players[j] = 'Reserved'; }
                        else { players[j] = lis[j].getElementsByTagName('a')[0].getAttribute('href').split('=')[2]; }
                    }
                    highlightGame(games[i], players, map, gameType, manual, freestyle, nuclear, fog, trench, speed);
                }
            }, 1000);
        };
        let observer = new MutationObserver(callback);
        observer.observe(document.getElementById('results_games'), {childList: true});
    }

    if (/player.php\?mode=join/.test(window.location.href)) {
        let games = document.getElementsByClassName('listing')[0].childNodes[1].children;
        for (let i = 1; i < games.length; i++) {
            if (games[i].children[1] == undefined) { continue; }
            let typeTroopsOrder = games[i].children[1].innerHTML;
            let map = games[i].children[2].innerHTML.split('<br>')[0];
            let spoilsFortsGameplay = games[i].children[3].innerHTML;
            let roundLength = games[i].children[4].innerHTML;
            let lis = games[i].children[5].children[0].children;
            let speed = false, gameType = 'Standard', nuclear = false, freestyle = false,
                fog = false, trench = false, manual = false;
            if (/Doubles/.test(typeTroopsOrder)) { gameType = 'Doubles'; }
            if (/Triples/.test(typeTroopsOrder)) { gameType = 'Triples'; }
            if (/Quadruples/.test(typeTroopsOrder)) { gameType = 'Quadruples'; }
            if (/Terminator/.test(typeTroopsOrder)) { gameType = 'Terminator'; }
            if (/Assassin/.test(typeTroopsOrder)) { gameType = 'Assassin'; }
            if (/Manual/.test(typeTroopsOrder)) { manual = true;}
            if (/Freestyle/.test(typeTroopsOrder)) { freestyle = true; }
            if (/Polymorphic/.test(typeTroopsOrder)) { gameType = 'Polymorphic'; }
            if (/Nuclear/.test(spoilsFortsGameplay)) { nuclear = true; }
            if (/Fog/.test(spoilsFortsGameplay)) { fog = true; }
            if (/Trench/.test(spoilsFortsGameplay)) { trench = true; }
            if (/Minutes/.test(roundLength)) { speed = true; }
            let players = [];
            for (let j = 0; j < lis.length; j++) {
                if (/Empty/.test(lis[j].innerHTML)) { players[j] = 'Empty'; }
                else if (/Reserved/.test(lis[j].innerHTML)) { players[j] = 'Reserved'; }
                else { players[j] = lis[j].getElementsByTagName('a')[0].getAttribute('href').split('=')[2]; }
            }
            let className = games[i].className;
            games[i].classList.remove(className);
            games[i].style.borderBottom = '1px solid #454';
            games[i].style.backgroundColor = (className == 'odd' ? '#eee' : '#ddd');
            highlightGame(games[i], players, map, gameType, manual, freestyle, nuclear, fog, trench, speed);
        }
    }
}

function loadProfileIcons() {
    let playerId = window.location.href.split('=')[2];
    if (playerId == userId) { return; }
    let record = hash[playerId];
    let dl = document.getElementsByClassName('left-box details')[0];
    let dt = document.createElement('dt');
    dt.innerHTML = 'Medal Progress:';
    dl.insertBefore(dt, dl.childNodes[17]);
    let dd = document.createElement('dd');
    for (let i = 0; i < 17; i++) {
        let img = document.createElement('img');
        if (record && record[i]) {
            img.setAttribute('src', medalURLs[i]);
            img.setAttribute('title', medalTitles[i]);
        } else {
            img.setAttribute('src', medalXURLs[i]);
            img.setAttribute('title', medalXTitles[i]);
        }
        if (i == 9) { dd.innerHTML += '</br>'; }
        dd.appendChild(img);
    }
    dl.insertBefore(dd, dt.nextSibling);
}

function loadIcons() {
    var i, j, k, playerId, record;
    if ((/player.php\?mode=mygames1/.test(window.location.href) && options[opt.ACTIVE_TAB_MEDALS]) ||
        (/player.php\?mode=mygames2/.test(window.location.href) && options[opt.WAITING_TAB_MEDALS]) ||
        (/player.php\?mode=mygames3/.test(window.location.href) && options[opt.ELIM_FIN_TAB_MEDALS]) ||
        (/player.php\?mode=mygames4/.test(window.location.href) && options[opt.ELIM_FIN_TAB_MEDALS]) ||
        (/player.php\?mode=join/.test(window.location.href) && options[opt.JOIN_GAMES_MEDALS])) {
        var playerLists = document.getElementsByClassName('players');
        for (i = 0; i < playerLists.length; i++) {
            var listItems = playerLists[i].getElementsByTagName('li');
            for (j = 0; j < listItems.length; j++) {
                if (/Empty/.test(listItems[j].innerHTML) || /Reserved/.test(listItems[j].innerHTML)) { continue; }
                playerId = listItems[j].getElementsByTagName('a')[0].getAttribute('href').split('=')[2];
                if (playerId == userId) { continue; }
                record = hash[playerId];
                for (k = 0; k < 17; k++) {
                    if (trackingMedal[k]) {
                        if ((record == undefined || !record[k]) && options[1]) {
                            let img = document.createElement('img');
                            img.setAttribute('src', medalXURLs[k]);
                            img.setAttribute('title', medalXTitles[k]);
                            img.style.height = '15px';
                            img.style.width = '15px';
                            listItems[j].appendChild(img);
                            listItems[j].innerHTML += '<wbr>';
                        } else if (record != undefined && record[k] && options[0]) {
                            let img = document.createElement('img');
                            img.setAttribute('src', medalURLs[k]);
                            img.setAttribute('title', medalTitles[k]);
                            img.style.height = '15px';
                            img.style.width = '15px';
                            listItems[j].appendChild(img);
                            listItems[j].innerHTML += '<wbr>';
                        }
                    }
                }
            }
        }
    } else if (/player.php\?mode=find2/.test(window.location.href) && options[opt.GAME_FINDER_MEDALS]) {
        let timer;
        let callback = function() {
            if (timer) { clearTimeout(timer); }
            timer = setTimeout(() => {
                let playerLists = document.getElementsByClassName('players');
                for (i = 0; i < playerLists.length; i++) {
                    let listItems = playerLists[i].getElementsByTagName('li');
                    for (j = 0; j < listItems.length; j++) {
                        if (/Empty/.test(listItems[j].innerHTML) || /Reserved/.test(listItems[j].innerHTML)) { continue; }
                        playerId = listItems[j].getElementsByTagName('a')[0].getAttribute('href').split('=')[2];
                        if (playerId == userId) { continue; }
                        record = hash[playerId];
                        for (k = 0; k < 17; k++) {
                            if (trackingMedal[k]) {
                                if ((record == undefined || !record[k]) && options[1]) {
                                    img = document.createElement('img');
                                    img.setAttribute('src', medalXURLs[k]);
                                    img.setAttribute('title', medalXTitles[k]);
                                    img.style.height = '15px';
                                    img.style.width = '15px';
                                    listItems[j].appendChild(img);
                                    listItems[j].innerHTML += '<wbr>';
                                } else if (record != undefined && record[k] && options[0]) {
                                    img = document.createElement('img');
                                    img.setAttribute('src', medalURLs[k]);
                                    img.setAttribute('title', medalTitles[k]);
                                    img.style.height = '15px';
                                    img.style.width = '15px';
                                    listItems[j].appendChild(img);
                                    listItems[j].innerHTML += '<wbr>';
                                }
                            }
                        }
                    }
                }
            }, 1000);
        };
        let observer = new MutationObserver(callback);
        observer.observe(document.getElementById('results_games'), {childList: true});
    }
}

function scanComplete() {
    delete hash[userId];
    for (let i = 0; i < botIds.length; i++){
        delete hash[botIds[i]];
    }
    GM_setValue('hash', JSON.stringify(hash));
    lastScanTime = new Date();
    GM_setValue('lastScanTime', JSON.stringify(lastScanTime));
    let infoBar = document.getElementById('infoBar');
    infoBar.innerHTML = 'Last scan: ' + formatDateTime();
    printTotals();
}

function newRecord() {
    return [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false];
}

function isBetaMap(gameElement) {

    let map = gameElement.getElementsByTagName('map')[0].childNodes[0].nodeValue;

    if (map == '2015 World Cup') { return true; }
    if (map == 'Krazy Kingdoms') { return true; }
    if (map == 'Pirates and Merchants') { return true; }
    if (map == 'Promontory Summit') { return true; }
    if (map == 'Slovakia') { return true; }
    if (map == 'Trafalaxy') { return true; }
    if (map == 'Ziggurat') { return true; }

    try {
        let gameInitTime = gameElement.getElementsByTagName('events')[0].children[0].getAttribute('timestamp');
        /* Quenched in 2013 */
        if (map == '4 Star Meats') { return (gameInitTime < 1381786320); }                //Oct 14, 2013 5:32pm
        if (map == 'Labyrinth') { return (gameInitTime < 1381788180); }                   //Oct 14, 2013 6:03pm
        if (map == 'Vertex') { return (gameInitTime < 1381789020); }                      //Oct 14, 2013 6:17pm
        if (map == 'Austrum') { return (gameInitTime < 1381789020); }                     //Oct 14, 2013 6:17pm

        /* Quenched in 2014 */
        if (map == 'USA 2.1') { return (gameInitTime < 1394926440); }                     //Mar 15, 2014 7:34pm
        if (map == 'Conquer 500') { return (gameInitTime < 1400774400); }                 //May 22, 2014 12:00pm
        if (map == 'Ethiopia') { return (gameInitTime < 1400774460); }                    //May 22, 2014 12:01pm
        if (map == 'Tribal War - Ancient Israel') { return (gameInitTime < 1400774520); } //May 22, 2014 12:02pm
        if (map == 'Baltic States') { return (gameInitTime < 1414377240); }               //Oct 26, 2014 10:34pm

        /* Quenched in 2015 */
        if (map == 'Three Kingdoms of China') { return (gameInitTime < 1422830880); }     //Feb 1, 2015 5:48pm
        if (map == 'District of Alaska') { return (gameInitTime < 1432573920); }          //May 25, 2015 1:12pm
        if (map == 'Spanish Armada') { return (gameInitTime < 1432574400); }              //May 25, 2015 1:20pm
        if (map == 'The Temple of Jinn') { return (gameInitTime < 1432575600); }          //May 25, 2015 1:40pm
        if (map == 'Czecho Slovak Fragmentation') { return (gameInitTime < 1432576620); } //May 25, 2015 1:57pm
        if (map == 'Rail South America') { return (gameInitTime < 1432576800); }          //May 25, 2015 2:00pm
        if (map == 'France 2.1') { return (gameInitTime < 1435622820); }                  //Jun 29, 2015 8:07pm
        if (map == 'WWI Gallipoli') { return (gameInitTime < 1446509580); }               //Nov 2, 2015 7:13pm
    } catch(error) {
        let gameNumber = gameElement.getElementsByTagName('game_number')[0].childNodes[0].nodeValue;
        console.log('Game ' + gameNumber + ' has no event log.');
        return false;
    }

    return false;
}

function recordWin(gameElement) {

    let gameType = gameElement.getElementsByTagName('game_type')[0].childNodes[0].nodeValue;
    let isManualTroops = (gameElement.getElementsByTagName('initial_troops')[0].childNodes[0].nodeValue == 'M');
    let isFreestyle = (gameElement.getElementsByTagName('play_order')[0].childNodes[0].nodeValue == 'F');
    let isNuclear = (gameElement.getElementsByTagName('bonus_cards')[0].childNodes[0].nodeValue == '4');
    let isFogOfWar = (gameElement.getElementsByTagName('war_fog')[0].childNodes[0].nodeValue == 'Y');
    let isTrench = (gameElement.getElementsByTagName('trench_warfare')[0].childNodes[0].nodeValue == 'Y');
    let roundLength = gameElement.getElementsByTagName('speed_game')[0].childNodes[0].nodeValue;
    let isSpeed = (roundLength == '1' || roundLength == '2' || roundLength == '3' || roundLength == '4' || roundLength == '5');
    let isRandom = (gameElement.getElementsByTagName('random_map')[0].childNodes[0].nodeValue == 'Y');
    let isBeta = isBetaMap(gameElement);

    let players = gameElement.getElementsByTagName('players')[0].children;
    for (let i = 0; i < players.length; i++) {
        let playerId = players[i].childNodes[0].nodeValue;
        let record = hash[playerId] || newRecord();

        if (gameType == 'S') { record[medal.STANDARD] = true; }
        else if (gameType == 'D') {
            if (players[i].getAttribute('state') == 'Lost') { record[medal.DOUBLES] = true; }
            else { record[medal.TEAMMATE] = true; hash[playerId] = record; continue; }
        }else if (gameType == 'T') {
            if (players[i].getAttribute('state') == 'Lost') { record[medal.TRIPLES] = true; }
            else { record[medal.TEAMMATE] = true; hash[playerId] = record; continue; }
        } else if (gameType == 'Q') {
            if (players[i].getAttribute('state') == 'Lost') { record[medal.QUADRUPLES] = true; }
            else { record[medal.TEAMMATE] = true; hash[playerId] = record; continue; }
        } else if (gameType == 'C') { record[medal.TERMINATOR] = true; }
        else if (gameType == 'A') { record[medal.ASSASSIN] = true; }
        else if (gameType == 'P') { record[medal.POLYMORPHIC] = true; }

        if (isManualTroops) { record[medal.MANUALTROOPS] = true; }
        if (isFreestyle) { record[medal.FREESTYLE] = true; }
        if (isNuclear) { record[medal.NUCLEAR] = true; }
        if (isFogOfWar) { record[medal.FOGOFWAR] = true; }
        if (isTrench) { record[medal.TRENCH] = true; }
        if (isSpeed) { record[medal.SPEED] = true; }
        if (isRandom) { record[medal.RANDOM] = true; }
        if (isBeta) { record[medal.BETA] = true; }

        hash[playerId] = record;
    }
}

function scanPage(xmlDoc) {
    let games = xmlDoc.getElementsByTagName('game');
    for (let i = 0; i < games.length; i++) {
        let players = games[i].getElementsByTagName('players')[0].children;
        for (let j = 0; j < players.length; j++) {
            if (players[j].childNodes[0].nodeValue == userId) {
                if (players[j].getAttribute('state') == 'Won') {
                    recordWin(games[i]);
                }
                break;
            }
        }
    }
}

function scanGamesHelper(username, page, numPages) {
    let url = window.location.protocol + '//www.conquerclub.com/api.php?mode=gamelist&gs=F&events=Y&un=' + encodeURIComponent(username);
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            let xmlDoc = xhttp.responseXML;
            let infoBar = document.getElementById('infoBar');
            infoBar.innerHTML = 'Scanning page ' + page + ' of ' + numPages;
            setTimeout(function() {
                scanPage(xmlDoc);
                if (page < numPages) {
                    scanGamesHelper(username, page + 1, numPages);
                } else {
                    scanComplete();
                }
            }, 1);
        }
    };
    xhttp.open('GET', url + '&page=' + page, true);
    xhttp.send();
}

function scanGames() {
    hash = [];
    let username = document.querySelectorAll("a[href='logout.php']")[0].innerHTML.split("<b>")[1].split("</b>")[0];
    let url = window.location.protocol + '//www.conquerclub.com/api.php?mode=gamelist&gs=F&events=Y&un=' + encodeURIComponent(username);
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            let xmlDoc = xhttp.responseXML;
            let numPages = xmlDoc.getElementsByTagName("page")[0].childNodes[0].nodeValue.split(" ")[2];
            let infoBar = document.getElementById('infoBar');
            infoBar.innerHTML = 'Scanning page ' + 1 + ' of ' + numPages;
            setTimeout(function() {
                scanPage(xmlDoc);
                if (numPages > 1) {
                    scanGamesHelper(username, 2, numPages);
                } else {
                    scanComplete();
                }
            }, 1);
        }
    };
    xhttp.open('GET', url, true);
    xhttp.send();
}

function formatDateTime() {
    if (lastScanTime == undefined) {
        return 'N/A';
    }
    let d = new Date(lastScanTime);
    let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    let minutes = d.getMinutes();
    minutes = minutes < 10 ? '0' + minutes.toString() : minutes.toString();
    return months[d.getMonth()] + ' ' + d.getDate() + ', ' + d.getHours() + ':' + minutes;
}

function checkboxToggled(i) {
    let checkbox = document.getElementById('checkbox' + i);
    if (i < 30) {
        trackingMedal[i] = checkbox.checked;
        GM_setValue('trackingMedal', JSON.stringify(trackingMedal));
    } else {
        options[i - 30] = checkbox.checked;
        GM_setValue('options', JSON.stringify(options));
    }
}

function createOptionsUl() {
    let li, checkbox, span;
    let menuDetails = [' Defeat Medals', ' Missing Medals', 'Open Game Highlighting', 'Medals in Active Tab',
                       'Medals in Waiting Tab', 'Medals in Elim/Fin Tabs', 'Medals in Join Games',
                       'Medals in Game Finder', 'Medals on User Profiles', 'Medals on Scoreboard'];
    let ul = document.createElement('ul');
    for (let i = 0; i < 10; i++) {
        li = document.createElement('li');
        checkbox = document.createElement('input');
        checkbox.setAttribute('id', 'checkbox' + (i + 30));
        checkbox.setAttribute('type', 'checkbox');
        checkbox.checked = options[i];
        checkbox.onclick = function f() { checkboxToggled(this.getAttribute('id').split('x')[1]); };
        li.appendChild(checkbox);
        if (i == 0) {
            let img = document.createElement('img');
            img.setAttribute('src', medalURLs[9]);
            img.style.height = '15px';
            img.style.width = '15px';
            li.appendChild(img);
        } else if (i == 1) {
            let img = document.createElement('img');
            img.setAttribute('src', medalXURLs[9]);
            img.style.height = '15px';
            img.style.width = '15px';
            li.appendChild(img);
        }
        span = document.createElement('span');
        span.innerHTML = menuDetails[i];
        li.appendChild(span);
        ul.appendChild(li);
    }
    return ul;
}

function createMedalTrackingUl() {
    let li, checkbox, img, span;
    let menuDetails = [' Standard Medal', ' Doubles Medal', ' Triples Medal', ' Quadruples Medal',
                       ' Terminator Medal', ' Assassin Medal', ' Manual Troops Medal', ' Freestyle Medal',
                       ' Polymorphic Medal', ' Nuclear Medal', ' Fog of War Medal', ' Trench Medal',
                       ' Speed Game Medal', ' Teammate Medal', ' Random Map Medal', ' Beta Map Medal', ' Rating Medal'];
    let ul = document.createElement('ul');
    for (let i = 0; i < 17; i++) {
        li = document.createElement('li');
        checkbox = document.createElement('input');
        checkbox.setAttribute('id', 'checkbox' + i);
        checkbox.setAttribute('type', 'checkbox');
        checkbox.checked = trackingMedal[i];
        checkbox.onclick = function f() { checkboxToggled(this.getAttribute('id').split('x')[1]); };
        li.appendChild(checkbox);
        img = document.createElement('img');
        img.setAttribute('src', medalURLs[i]);
        img.style.height = '15px';
        img.style.width = '15px';
        li.appendChild(img);
        span = document.createElement('span');
        span.innerHTML = menuDetails[i];
        li.appendChild(span);
        ul.appendChild(li);
    }
    return ul;
}

function toggleMenu(id) {
    let div = document.getElementById(id);
    if (div.style.display == "block") { div.style.display = "none"; }
    else { div.style.display = "block"; }
}

function loadMenu() {
    let leftNav, a, div, ul;
    if (/forum/.test(window.location.href)) {leftNav = document.getElementsByClassName('vnav')[0]; }
    else { leftNav = document.getElementById('leftnav'); }

    let menuHeader = document.createElement('h3');
    menuHeader.innerHTML = 'MedalAid ' + GM_info.script.version;
    leftNav.appendChild(menuHeader);

    let infoBar = document.createElement('span');
    infoBar.setAttribute('id', 'infoBar');
    infoBar.innerHTML= 'Last scan: ' + formatDateTime();
    leftNav.appendChild(infoBar);

    let menuList = document.createElement('ul');

    let scanItem = document.createElement('li');
    a = document.createElement('a');
    a.setAttribute('href', 'PleaseEnableJavascript.html');
    a.onclick = function f() {scanGames(); return false;};
    a.innerHTML = 'Scan Games';
    scanItem.appendChild(a);
    menuList.appendChild(scanItem);

    let medalTrackingItem = document.createElement('li');
    a = document.createElement('a');
    a.setAttribute('href', 'PleaseEnableJavascript.html');
    a.onclick = function f() { toggleMenu('medalTrackingDiv'); return false; };
    a.innerHTML = 'Medal Tracking';
    medalTrackingItem.appendChild(a);
    div = document.createElement('div');
    div.setAttribute('id', 'medalTrackingDiv');
    ul = createMedalTrackingUl();
    div.appendChild(ul);
    div.style.display = 'none';
    medalTrackingItem.appendChild(div);
    menuList.appendChild(medalTrackingItem);

    let optionsItem = document.createElement('li');
    a = document.createElement('a');
    a.setAttribute('href', 'PleaseEnableJavascript.html');
    a.onclick = function f() { toggleMenu('optionsDiv'); return false; };
    a.innerHTML = 'Options';
    optionsItem.appendChild(a);
    div = document.createElement('div');
    div.setAttribute('id', 'optionsDiv');
    ul = createOptionsUl();
    div.appendChild(ul);
    div.style.display = 'none';
    optionsItem.appendChild(div);
    menuList.appendChild(optionsItem);

    let threadItem = document.createElement('li');
    a = document.createElement('a');
    a.setAttribute('href', window.location.protocol + '//www.conquerclub.com/forum/viewtopic.php?f=529&t=226714');
    a.innerHTML = 'Script Thread / User Guide';
    threadItem.appendChild(a);
    menuList.appendChild(threadItem);

    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            let version = xhttp.responseXML.getElementById('script-stats').children[9].children[0].innerHTML;
            if (GM_info.script.version != version) {
                let updateItem = document.createElement('li');
                a = document.createElement('a');
                a.setAttribute('href', window.location.protocol + '//greasyfork.org/en/scripts/38723-medalaid');
                a.innerHTML = '<b>Ugrade to ' + version + '</b>';
                a.style.backgroundColor = 'gold';
                a.style.background = 'linear-gradient(gold, rgba(218, 165, 32, 0.75))';
                updateItem.appendChild(a);
                menuList.appendChild(updateItem);
            }
        }
    };
    xhttp.open('GET', window.location.protocol + '//greasyfork.org/en/scripts/38723-medalaid', true);
    xhttp.responseType = 'document';
    xhttp.send();

    leftNav.appendChild(menuList);
}

function loadScript() {

    userId = JSON.parse(GM_getValue('userId', null));
    if (!userId) {
        userId = document.getElementById('wall').parentElement.getAttribute('href').split('=')[2].split('#')[0];
        GM_setValue('userId', JSON.stringify(userId));
    }

    hash = JSON.parse(GM_getValue('hash', null)) || [];
    lastScanTime = JSON.parse(GM_getValue('lastScanTime', null));

    trackingMedal = JSON.parse(GM_getValue('trackingMedal', null)) ||
        [true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true];

    options = JSON.parse(GM_getValue('options', null)) || [true, true, true, true, true, true, true, true, true, true];
    if (options.length < 10) {
        while (options.length < 10) {
            options.push(true);
        }
        GM_setValue('options', JSON.stringify(options));
    }

    loadMenu();

    if (options[opt.OPEN_GAME_HIGHLIGHTING]) {
        highlightGames();
    }

    loadIcons();

    if (/memberlist.php\?mode=viewprofile/.test(window.location.href) && options[opt.PROFILE_MEDALS]) {
        loadProfileIcons();
    }

    if (/public.php\?mode=scoreboard(?!\d)/.test(window.location.href) && options[opt.SCOREBOARD_MEDALS]) {
        loadScoreboardIcons();
    }
}

loadScript();
