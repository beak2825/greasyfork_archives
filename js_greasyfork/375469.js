// ==UserScript==
// @name         BL R9.75 Roulette Script
// @namespace    Bootleggers R9.75
// @version      0.0.3
// @description  Bet on red, double if you lose
// @author       BD
// @match        https://www.bootleggers.us/roulette.php
// @update       https://greasyfork.org/scripts/375469-bl-r9-75-roulette-script/code/BL%20R975%20Roulette%20Script.user.js
// @downloadURL https://update.greasyfork.org/scripts/375469/BL%20R975%20Roulette%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/375469/BL%20R975%20Roulette%20Script.meta.js
// ==/UserScript==

$("<center><input id='playbtn' type='button' value='Start Playing!'></input></center><br>").insertBefore($(".insideTables").children()[0]);
var minBet = 100;
var maxBet;
var maxBetMustBe = 51200;
var win;
var lostBet;
var observer;
var play = false;

$("#playbtn").on("click", function() {
    if ($("#playbtn")[0].value == "Start Playing!") {
        play = true;
        RunScript();
        $("#playbtn")[0].value = "Stop Playing!";
    } else {
        play = false;
        $("#playbtn")[0].value = "Start Playing!";
    }
});

function RunScript() {
    if (play) {
        maxBet = $("#maxInfo")[0].innerText.replace(/[&\/\\#,+()$~%.":*?<>{}]/g, "");
        win = $("#outcomeT")[0].innerText != "" ? $("#outcomeT")[0].innerText == "WIN!" : "null";
        lostBet = $("#outcomeB")[0].innerText.replace(/[&\/\\#,+()$~%.":*?<>{}-]/g, "");
        if (maxBet >= maxBetMustBe) {
            if (win == false) {
                Bet(2*lostBet);
            } else {
                Bet(minBet);
            }
        }
    }
}

function Bet(chips) {
    var chipsArray = {};
    var decimalValue = chips.toString().length*1;
    for (let i = decimalValue; i >= 1; i--) {
        var deduct = $("#chipBox" + i)[0].innerText.replace(/[,$]/g, "").match(/\d+/g)[0]*1;
        while (chips >= 0) {
            chipsArray[i] = chipsArray[i] == null ? 0 : chipsArray[i];
            if (chips - deduct < 0) {
                break;
            } else {
                chips -= deduct;
                chipsArray[i] += 1;
            }
        }
    }

    var curBet = $("#curBetInfo")[0].innerText.replace(/[,$]/g, "")*1;
    $("#chipBoxremover").click();
    var clearChipCount = $("#chipBank").children().length;
    for (let i = 0; i <= clearChipCount; i++) {
        document.querySelectorAll("[href=\"javascript:placeChip('red');\"]")[0].click();
    }

    for (let x in chipsArray) {
        $("#chipBox" + x).click();
        if (chipsArray[x] > 0) {
            for (let i = 0; i < chipsArray[x]; i++) {
                document.querySelectorAll("[href=\"javascript:placeChip('red');\"]")[0].click();
            }
        }
    }

    document.querySelectorAll("[href=\"javascript:spinWheel();\"]")[0].click();
    ObserveDOM();
    //http://www.blimg.us/images/game/casino/roulette/spinning.gif
}

function ObserveDOM() {
    observer = new MutationObserver(mutation => {
        if (document.querySelectorAll("[src='//www.blimg.us/images/game/casino/roulette/spinning.gif']")[0] == null) {
            observer.disconnect()
            RunScript();
        }
    });

    observer.observe(document.body, {
        childList: true,
        attributes: true,
        subtree: true,
        characterData: true
    });
}