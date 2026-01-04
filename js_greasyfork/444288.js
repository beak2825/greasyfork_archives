// ==UserScript==
// @name         AMQ Player Data
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Saves player stats to google spreadsheet
// @author       Raccomunk
// @connect      script.google.com
// @connect      script.googleusercontent.com
// @match        https://animemusicquiz.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=undefined.
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/444288/AMQ%20Player%20Data.user.js
// @updateURL https://update.greasyfork.org/scripts/444288/AMQ%20Player%20Data.meta.js
// ==/UserScript==

if (document.getElementById("startPage")) return;

let loadInterval = setInterval(() => {
    if (document.getElementById("loadingScreen").classList.contains("hidden")) {
        setup();
        clearInterval(loadInterval);
    }
}, 500);

let playerDataReady = false;
let playerData = [];

let quizReadyListener;
let answerResultsListener;
let returnLobbyVoteListener;
let quizEndListener;

function initializePlayerData() {
    clearPlayerData();
    playerDataReady = true;
}

function clearPlayerData() {
    playerData = [];
    playerDataReady = false;
}

function sendDataToSpreadsheet() {
    GM_xmlhttpRequest({
        method: "POST",
        url: "https://script.google.com/macros/s/AKfycbwneRDKRY8PluUMecuQpbBxCp1cqJjVuD1P1Nd0sxlwagcj0iPJ8bnRnoklNIMpPspQ1A/exec",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        data: "data=" + encodeURIComponent(JSON.stringify(playerData)),
        onload: function (response) {
            console.log("Successfully sent data to the spreadsheet");
            console.log(response);
        },
        onerror: function (response) {
            console.log("Error sending data to the spreadsheet");
            console.log(response);
        }
    });
}

function setup() {
    quizReadyListener = new Listener("quiz ready", (data) => {
        answerResultsListener.bindListener();
        quizEndListener.bindListener();

        initializePlayerData();
    });

    answerResultsListener = new Listener("answer results", (result) => {
        if (!playerDataReady) {
            initializePlayerData();
        }
        if (playerDataReady) {
            let player = result.players.find(x => quiz.players[x.gamePlayerId].isSelf);
            if (player) {
                let songType;
                switch (result.songInfo.type) {
                    case 1:
                        songType = 'Opening';
                        break;
                    case 2:
                        songType = 'Ending';
                        break;
                    case 3:
                        songType = 'Insert';
                        break;
                    default:
                        songType = 'Unknown';
                        break;
                }
                playerData.push({user: quiz.players[player.gamePlayerId]._name, name: result.songInfo.songName, artist: result.songInfo.artist, anime: result.songInfo.animeNames.english, type: songType, correct: (player.correct ? player.correct : ''), guessTime: (player.correct ? amqAnswerTimesUtility.playerTimes[player.gamePlayerId] : 0)});
            }
        }
    });

    quizEndListener = new Listener("quiz over", (payload) => {
        sendDataToSpreadsheet();

        answerResultsListener.unbindListener();
        quizEndListener.unbindListener();
    });
    quizReadyListener.bindListener();
}

//Credits for amqAnswerTimesUtility to author Zolhungaj
const amqAnswerTimesUtility = new function(){
    "use strict"
    this.songStartTime = 0
    this.playerTimes = []
    if (typeof(Listener) === "undefined") {
        return
    }
    new Listener("play next song", () => {
        this.songStartTime = Date.now()
        this.playerTimes = []
    }).bindListener()

    new Listener("player answered", (data) => {
        const time = Date.now() - this.songStartTime
        data.forEach(gamePlayerId => {
            this.playerTimes[gamePlayerId] = time
        })
    }).bindListener()

    new Listener("Join Game", (data) => {
        const quizState = data.quizState;
        if(quizState){
            this.songStartTime = Date.now() - quizState.songTimer * 1000
        }
    }).bindListener()
}()