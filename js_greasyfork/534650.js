// ==UserScript==
// @name         AMQ New Game Mode UI ver.🦝
// @namespace    racoonseki
// @version      1.15
// @description  Adds a user interface to new game mode to keep track of guesses
// @author       kempanator x racoonseki
// @match        https://animemusicquiz.com/*
// @grant        none
// @require      https://update.greasyfork.org/scripts/534648/1581420/AMQ%20Window%20Script.js
// @require      https://update.greasyfork.org/scripts/534649/1581421/AMQ%20Player%20Answer%20Times%20Utility.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/534650/AMQ%20New%20Game%20Mode%20UI%20ver%F0%9F%A6%9D.user.js
// @updateURL https://update.greasyfork.org/scripts/534650/AMQ%20New%20Game%20Mode%20UI%20ver%F0%9F%A6%9D.meta.js
// ==/UserScript==

"use strict";
if (typeof Listener === "undefined") return;

let loadInterval = setInterval(() => {
    if ($("#loadingScreen").hasClass("hidden")) {
        clearInterval(loadInterval);
        setup();
    }
}, 500);

const version = "1.10";
let ngmWindow;
let initialGuessCount = [];
let guessCounter = [];
let countButtons = [];
let answers = {};
let teamNumber = null;
let teamList = [];
let teamSlot = null;
let teamNames = [];
let correctGuesses = 0;
let remainingGuesses = 0;
let autoTrackCount = false;
let autoThrowSelfCount = false;
let autoSendTeamCount = 0;
let autocomplete = [];
let answerValidation = 1;
let sendFireMessage = 0;



$("#qpOptionContainer").width($("#qpOptionContainer").width() + 35);
$("#qpOptionContainer > div").append($(`<div id="qpNGM" class="clickAble qpOption">
<img class="qpMenuItem" src="https://i.ibb.co/sdmDCN0y/NTR2.png">
</div>`).click(() => ngmWindow.isVisible() ? ngmWindow.close() : ngmWindow.open()).popover({
    content: "New Game Mode UI",
    trigger: "hover",
    placement: "bottom"
}));

function setup() {
    [
        ["game chat update", (p) => p.messages.forEach(m => m.sender === selfName && parseMessage(m.message))],
        ["Game Chat Message", (p) => p.sender === selfName && parseMessage(p.message)],
        ["Game Starting", (p) => {
            let self = p.players.find(pl => pl.name === selfName);
            (self?.inGame && hostModal.$teamSize.slider("getValue") > 1 && hostModal.$scoring.slider("getValue") === quiz.SCORE_TYPE_IDS.LIVES)
                ? updateWindow(p.players) : clearWindow();
        }],
        ["Join Game", (p) => (p.quizState && p.settings.teamSize > 1 && p.settings.scoreType === quiz.SCORE_TYPE_IDS.LIVES)
            ? updateWindow(p.quizState.players) : clearWindow()],
        ["Spectate Game", clearWindow],
        ["quiz over", clearWindow],
        ["play next song", () => {
            if (quiz.teamMode && !quiz.isSpectator && hostModal.$scoring.slider("getValue") === quiz.SCORE_TYPE_IDS.LIVES) {
                answers = {};
                if (autoThrowSelfCount && guessCounter.length) {
                    setTimeout(() => socket.sendCommand({ type: "quiz", command: "quiz answer", data: { answer: String(guessCounter[teamSlot]) } }), 100);
                }
            }
        }],
        ["team member answer", (p) => {
            if (quiz.teamMode && hostModal.$scoring.slider("getValue") === quiz.SCORE_TYPE_IDS.LIVES) {
                answers[p.gamePlayerId] = { id: p.gamePlayerId, text: p.answer };
            }
        }],
        ["player answers", () => {
            if (quiz.teamMode && !quiz.isSpectator && hostModal.$scoring.slider("getValue") === quiz.SCORE_TYPE_IDS.LIVES) {
                for (let id in answers) {
                    answers[id].speed = amqAnswerTimesUtility.playerTimes[id];
                    answers[id].valid = autocomplete.includes(answers[id].text.toLowerCase());
                }
            }
        }],
        ["answer results", (p) => {
            if (!(quiz.teamMode && !quiz.isSpectator && hostModal.$scoring.slider("getValue") === quiz.SCORE_TYPE_IDS.LIVES)) return;
            const me = p.players.find(pl => pl.gamePlayerId === quiz.ownGamePlayerId);
            if (!me || me.score <= 0) return;

            if (autoTrackCount && Object.keys(answers).length) {
                const selfPlayer = p.players.find(pl => pl.gamePlayerId === quiz.ownGamePlayerId);

                const allCorrect = [...p.songInfo.altAnimeNames, ...p.songInfo.altAnimeNamesAnswers].map(x => x.toLowerCase());
                const correct = Object.values(answers).filter(a => allCorrect.includes(a.text.toLowerCase()));

                let validSet = correct;

                if (answerValidation === 1 && validSet.length === 0) {
                    const allAnswers = Object.values(answers).map(a => a.text.trim().toLowerCase());
                    const combined = allAnswers.join(" ");
                    if (allCorrect.includes(combined)) {
                        const freq = {};
                        allAnswers.forEach(text => {
                            freq[text] = (freq[text] || 0) + 1;
                        });
                        const repeated = Object.entries(freq).find(([word, count]) => count > 1);
                        if (repeated) {
                            const [word] = repeated;
                            const contributors = Object.values(answers).filter(a => a.text.trim().toLowerCase() === word);
                            const chosen = contributors[Math.floor(Math.random() * contributors.length)];
                            const index = teamList.indexOf(chosen.id);

                            countButtons[index].addClass("ngmAnimateCorrect");
                            setTimeout(() => countButtons[index].removeClass("ngmAnimateCorrect"), 2000);
                            guessCounter[index]--;
                            if (guessCounter.every(x => x <= 0)) guessCounter = [...initialGuessCount];
                            countButtons.forEach((btn, i) => btn.text(guessCounter[i]));

                            if (sendFireMessage === 1 || sendFireMessage === 2) {
                                const chosenName = teamNames[index];
                                const otherNames = contributors
                                    .filter(p => p && typeof p === "object" && p.id !== chosen.id)
                                    .map(p => teamNames[teamList.indexOf(p.id)])
                                    .join(", ");
                                const msg = otherNames
                                    ? `${otherNames} กระสุนด้าน ${chosenName} ลั่นกระสุน!! (เหลือ ${guessCounter[index]} นัด)`
                                    : `${chosenName} ลั่นกระสุน!! (เหลือ ${guessCounter[index]} นัด)`;

                                sendChatMessage(msg, sendFireMessage === 1);
                            }



                            if (autoSendTeamCount) sendChatMessage(guessCounter.join(" "), autoSendTeamCount === 1);
                            return;
                        }
                    }

                    validSet = Object.values(answers).filter(a => a.text.trim());
                }

                if (selfPlayer.correct && validSet.length) {
                    const fastest = Math.min(...validSet.map(a => a.speed));
                    const fastestPlayers = validSet.filter(a => a.speed === fastest);

                    if (fastestPlayers.length >= 1) {
                        const chosen = fastestPlayers[Math.floor(Math.random() * fastestPlayers.length)];
                        const index = teamList.indexOf(chosen.id);
                        countButtons[index].addClass("ngmAnimateCorrect");
                        setTimeout(() => countButtons[index].removeClass("ngmAnimateCorrect"), 2000);
                        guessCounter[index]--;
                        if (guessCounter.every(x => x <= 0)) guessCounter = [...initialGuessCount];
                        countButtons.forEach((btn, i) => btn.text(guessCounter[i]));

                        if (sendFireMessage === 1 || sendFireMessage === 2) {
                            const chosenName = teamNames[index];
                            const otherNames = fastestPlayers
                                .filter(p => p && typeof p === "object" && p.id !== chosen.id)
                                .map(p => teamNames[teamList.indexOf(p.id)])
                                .join(", ");
                            const msg = otherNames
                                ? `${otherNames} กระสุนด้าน ${chosenName} ลั่นกระสุน!! (เหลือ ${guessCounter[index]} นัด)`
                                : `${chosenName} ลั่นกระสุน!! (เหลือ ${guessCounter[index]} นัด)`;

                            sendChatMessage(msg, sendFireMessage === 1);
                        }


                        if (autoSendTeamCount) sendChatMessage(guessCounter.join(" "), autoSendTeamCount === 1);
                    } else {
                        console.log("NGM: Incorrect answer, no counter deducted.");
                    }
                }
            }

            correctGuesses = me.correctGuesses;
            $("#ngmCorrectAnswers").text(`Correct Answers: ${correctGuesses}`);
            if (initialGuessCount.length) {
                const total = initialGuessCount.reduce((a, b) => a + b);
                remainingGuesses = total - (correctGuesses % total);
            } else remainingGuesses = null;
            $("#ngmRemainingGuesses").text(remainingGuesses ? `Remaining Guesses: ${remainingGuesses}` : "");
        }]

    ].forEach(([event, func]) => new Listener(event, func).bindListener());

    ["get all song names", "update all song names"].forEach(event =>
        new Listener(event, () => setTimeout(() => {
            autocomplete = quiz.answerInput.typingInput.autoCompleteController.list.map(x => x.toLowerCase());
        }, 10)).bindListener()
    );

    ngmWindow = new AMQWindow({
        id: "ngmWindow",
        title: "NGM",
        zIndex: 1060,
        resizable: true,
        draggable: true
    });

    ngmWindow.addPanel({
        id: "ngmPanel",
        width: 1.0,
        height: "auto"
    });

    setupNGMWindow();

    applyStyles();
}


    // === Functions ===

    function parseMessage(content) {
        if (content === "/ngm") {
            ngmWindow.isVisible() ? ngmWindow.close() : ngmWindow.open();
        }
    }

    function sendChatMessage(text, teamChat) {
        socket.sendCommand({
            type: "lobby",
            command: "game chat message",
            data: { msg: " " + text, teamMessage: !!teamChat }
        });

    }

    function clearWindow() {
        $("#ngmGuessContainer").empty().append($(`<div id="ngmNotInGame">Not in team game with lives</div>`));
        $("#ngmCorrectAnswers").text("");
        $("#ngmRemainingGuesses").text("");
        guessCounter = [];
        countButtons = [];
        teamNumber = null;
        teamList = [];
        teamSlot = null;
        correctGuesses = 0;
        remainingGuesses = 0;
    }

    function shortenName(name, maxLength = 10) {
        return name.length > maxLength ? name.slice(0, maxLength - 1) + "…" : name;
    }


    function updateWindow(players) {
        const selfPlayer = players.find(p => p.name === selfName);
        const teamNumber = selfPlayer.teamNumber;
        const myTeamPlayers = players.filter(p => p.teamNumber === teamNumber);

        teamList = myTeamPlayers.map(p => p.gamePlayerId);
        teamNames = myTeamPlayers.map(p => p.name);

        const $ngmGuessContainer = $("#ngmGuessContainer").empty();
        countButtons = [];

        teamSlot = teamList.indexOf(selfPlayer.gamePlayerId);
        correctGuesses = selfPlayer.correctGuesses;

        for (let i = 0; i < teamList.length; i++) {
            const $slot = $(`<div class="ngmPlayerSlot"></div>`);
            const shortName = shortenName(teamNames[i]);
            const $nameLabel = $(`<div class="ngmPlayerName" title="${teamNames[i]}">${shortName}</div>`);
            const $button = $(`<div class="ngmButton ngmCount">${guessCounter[i] != null ? guessCounter[i] : ''}</div>`)
                .click(() => {
                    guessCounter[i] = guessCounter[i] <= 0
                        ? initialGuessCount[i]
                        : guessCounter[i] - 1;
                    $button.text(guessCounter[i]);
                });

            countButtons.push($button);
            $slot.append($nameLabel, $button);
            $ngmGuessContainer.append($slot);
        }

        resetCounter();
    }

    function resetCounter() {
        if (!teamList.length) return;

        const countText = $("#ngmInitialGuessCountInput").val().trim();
        if (!/^[0-9]+$/.test(countText)) {
            return counterError();
        }

        if (countText.length === 1) {
            initialGuessCount = Array(teamList.length).fill(parseInt(countText, 10));
        } else if (countText.length === teamList.length) {
            initialGuessCount = countText.split("").map(x => parseInt(x, 10));
        } else {
            return counterError();
        }

        guessCounter = [...initialGuessCount];
        countButtons.forEach((btn, i) => {
            btn.removeClass("disabled").text(guessCounter[i]);
        });

        const totalGuesses = initialGuessCount.reduce((a, b) => a + b, 0);
        if (totalGuesses === 0) {
            return counterError();
        }
        remainingGuesses = totalGuesses - (correctGuesses % totalGuesses);
        $("#ngmRemainingGuesses").text(
            remainingGuesses ? `Remaining Guesses: ${remainingGuesses}` : ""
        );
        $("#ngmCorrectAnswers").text(`Correct Answers: ${correctGuesses}`);
    }

    function counterError() {
        guessCounter = [];
        initialGuessCount = [];
        countButtons.forEach((x) => x.addClass("disabled").text("-"));
        $("#ngmCorrectAnswers").text("Invalid Settings");
        $("#ngmRemainingGuesses").text("");
    }

    function setupNGMWindow() {
        ngmWindow.window.find(".modal-header h2").remove();
        ngmWindow.window.find(".modal-header").append(`<div id="ngmTitle">New Game Mode</div><div id="ngmCorrectAnswers"></div><div id="ngmRemainingGuesses"></div>`);
        ngmWindow.panels[0].panel.append(`<div id="ngmGuessContainer" class="ngmRow"><div id="ngmNotInGame">Not in team game with lives</div></div>`);

        let $row1 = $(`<div class="ngmRow"></div>`);
        let $row2 = $(`<div class="ngmRow"></div>`);

        $row1.append($(`<div class="ngmButton" style="width: 60px; background-color: #ffffff; border-color: #cccccc; color: #000000;">Reset</div>`)
            .click(() => {
                quiz.inQuiz ? resetCounter() : clearWindow();
            })
        );
        $row1.append($(`<input type="text" id="ngmInitialGuessCountInput">`)
            .popover({
                title: "Initial Guess Count",
                content: "<p>Use 1 digit: everyone same<br>Use multiple digits: each player</p><p>Example: 5 or 5454</p>",
                placement: "bottom",
                trigger: "hover",
                container: "body",
                animation: false,
                html: true
            })
            .val("5")
        );

        $row2.append($(`<div class="ngmButton" style="width: 50px; background-color: #ffffff; border-color: #cccccc; color: #000000;">Auto</div>`)
            .click(function() {
                autoTrackCount = !autoTrackCount;
                if (autoTrackCount) {
                    $(this).css({"background-color": "#4497ea", "border-color": "#006ab7", "color": "#ffffff"});
                    $("#ngmSelfCountButton").removeClass("disabled");
                    $("#ngmTeamCountButton").removeClass("disabled");
                } else {
                    $(this).css({"background-color": "#ffffff", "border-color": "#cccccc", "color": "#000000"});
                    $("#ngmSelfCountButton").addClass("disabled");
                    $("#ngmTeamCountButton").addClass("disabled");
                }
            })
            .popover({
                title: "Auto Track",
                content: "<p>Auto update team guess count when answering.</p>",
                placement: "bottom",
                trigger: "hover",
                container: "body",
                animation: false,
                html: true
            })
        );

        $row2.append($(`<div id="ngmSelfCountButton" class="ngmButton ngmBtnSmall disabled"><i class="fa fa-user"></i></div>`)
            .click(function() {
                autoThrowSelfCount = !autoThrowSelfCount;
                if (autoThrowSelfCount) {
                    $(this).css({"background-color": "#4497ea", "border-color": "#006ab7", "color": "#ffffff"});
                } else {
                    $(this).css({"background-color": "#ffffff", "border-color": "#cccccc", "color": "#333333"});
                }
            })
            .popover({
                title: "Auto Throw Self Count",
                content: "Auto send your own count as answer when a song starts.",
                placement: "bottom",
                trigger: "hover",
                container: "body",
                animation: false,
                html: true
            })
        );

        $row2.append($(`<div id="ngmTeamCountButton" class="ngmButton ngmBtnSmall disabled"><i class="fa fa-comment"></i></div>`)
            .click(function() {
                autoSendTeamCount = (autoSendTeamCount + 1) % 3;
                if (autoSendTeamCount === 0) {
                    $(this).css({"background-color": "#ffffff", "border-color": "#cccccc", "color": "#333333"});
                } else if (autoSendTeamCount === 1) {
                    $(this).css({"background-color": "#4497ea", "border-color": "#006ab7", "color": "#ffffff"});
                } else if (autoSendTeamCount === 2) {
                    $(this).css({"background-color": "#9444EA", "border-color": "#6C00B7", "color": "#ffffff"});
                }
            })
            .popover({
                title: "Auto Send Team Count",
                content: "<p>Send team count after answer:<br>Blue = Team Chat<br>Purple = Public Chat</p>",
                placement: "bottom",
                trigger: "hover",
                container: "body",
                animation: false,
                html: true
            })
        );

        $row2.append($(`<div id="ngmFireMessageToggle" class="ngmButton ngmBtnSmall">
            <i class="fa fa-bullhorn"></i>
        </div>`)
        .click(function () {
            sendFireMessage = (sendFireMessage + 1) % 3; // 0 → 1 → 2 → 0 ...

            if (sendFireMessage === 0) {
                $(this).css({ "background-color": "#ffffff", "border-color": "#cccccc", "color": "#333333" }); // White = Off
            } else if (sendFireMessage === 1) {
                $(this).css({ "background-color": "#4497ea", "border-color": "#006ab7", "color": "#ffffff" }); // Blue = Team Chat
            } else if (sendFireMessage === 2) {
                $(this).css({ "background-color": "#9444EA", "border-color": "#6C00B7", "color": "#ffffff" }); // Purple = Public Chat
            }
        })
        .popover({
            title: "Fire Message",
            content: "<p>Announce who answered fastest:<br>Blue = Team Chat<br>Purple = Public Chat<br>White = Off</p>",
            placement: "bottom",
            trigger: "hover",
            container: "body",
            animation: false,
            html: true
        }));




        ngmWindow.panels[0].panel.append($row1).append($row2);
    }

function applyStyles() {
    const style = document.createElement("style");
    style.id = "newGameModeUIStyle";
    style.textContent = `
    #qpNGM {
        width: 30px;
        margin-right: 5px;
    }

    #ngmWindow {
        min-width: 300px;
        min-height: 250px !important;
        height: auto !important;
        font-family: 'Segoe UI', 'Helvetica Neue', sans-serif;
    }

    #ngmWindow .modal-content {
        height: auto !important;
        max-height: none !important;
        padding-bottom: 12px;
    }

    #ngmWindow .modal-header {
        padding: 10px 15px;
        line-height: normal;
        flex-direction: column;
        align-items: flex-start;
        border: none;
        background: transparent;
    }

    #ngmWindow .close {
        top: 10px;
        right: 10px;
        position: absolute;
    }

    #ngmWindow .customWindowContent {
        position: relative !important;
    }

    #ngmWindow .modal-dialog {
        height: auto !important;
        max-height: none !important;
    }

    #ngmTitle {
        font-size: 16px;
        font-weight: 600;
        margin-bottom: 4px;
        color: #ffffff;
    }

    #ngmCorrectAnswers,
    #ngmRemainingGuesses {
        font-size: 13px;
        color: #aaa;
    }

    #ngmGuessContainer {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
    }



    .ngmPlayerSlot {
        display: flex;
        flex-direction: column;
        align-items: center;
        max-width: 100px;
        word-break: break-word;
    }

    .ngmPlayerName {
        font-size: 11px;
        color: #ccc;
        text-align: center;
        width: 100%;
        max-width: 100px;
    }



    .ngmCount {
        background-color: #f6f6f6;
        color: #222;
        border: none;
        border-radius: 6px;
        width: 44px;
        height: 36px;
        font-weight: 500;
        font-size: 14px;
        text-align: center;
        line-height: 36px;
    }

    .ngmRow {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 5px;
        margin-bottom: 7px;
        margin-top: 7px;
        flex-wrap: wrap;
    }

    .ngmButton {
        background-color: #eeeeee;
        color: #111;
        border: none;
        border-radius: 6px;
        height: 36px;
        padding: 0 12px;
        font-size: 14px;
        font-weight: 500;
        min-width: 60px;
        box-sizing: border-box;
        transition: background-color 0.2s ease;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
    }

    .ngmButton:hover {
        background-color: #dddddd;
    }

    .ngmBtnSmall {
        width: 36px;
        height: 36px;
        min-width: 36px;
        padding: 0;
        font-size: 14px;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    #ngmInitialGuessCountInput {
        height: 36px;
        padding: 0 12px;
        font-size: 14px;
        border-radius: 6px;
        border: none;
        background-color: #f9f9f9;
        color: #111;
        min-width: 130px;
        box-sizing: border-box;
    }

    #ngmNotInGame {
        text-align: center;
        color: #888;
        width: 100%;
        margin: 12px 0;
    }

    .ngmAnimateCorrect {
        animation: ngmColorAnimationBlue 2s ease-in;
    }

    .ngmAnimateWrong {
        animation: ngmColorAnimationRed 2s ease-in;
    }

    @keyframes ngmColorAnimationBlue {
        from { background-color: #4497ea; color: #fff; }
        to   { background-color: #f6f6f6; color: #222; }
    }

    @keyframes ngmColorAnimationRed {
        from { background-color: #d9534f; color: #fff; }
        to   { background-color: #f6f6f6; color: #222; }
    }
    `;
    document.head.appendChild(style);
}



