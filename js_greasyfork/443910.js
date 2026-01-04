// ==UserScript==
// @name         Bet365 Colors
// @namespace    https://crack.cocaine
// @version      1.0.1
// @description  färglatt :D
// @author       Mathias
// @match        https://www.bet365.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bet365.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/443910/Bet365%20Colors.user.js
// @updateURL https://update.greasyfork.org/scripts/443910/Bet365%20Colors.meta.js
// ==/UserScript==

(function() {
    const debug = false;
    'use strict';
    console.log("Bet365: Initiating now.. :D");
    setInterval(() => {
        //console.log("Bet365: Colorizing..");
        let list = document.querySelectorAll(".myb-BetParticipant.myb-OpenBetParticipant.myb-OpenBetParticipant_MiniMatchLiveEnabled");
        list.forEach((el) => {
            let bettedOnEl = el.querySelector(".myb-BetParticipant_ParticipantSpan");
            let bettedOn = bettedOnEl.innerText.replace(/ /g, "");
            let teams = el.querySelector(".myb-BetParticipant_FixtureName").innerText.replace(/ /g, "").split("@");
            let score = el.querySelector(".myb-OpenBetScores_Score").innerText.replace(/ /g, "").split("-");
            if(bettedOn == teams[0]) {
                // Första score är det man bettat på
                if(score[0] > score[1])
                    bettedOnEl.style.setProperty("color", "#5cf278", "important");
                else if(score[0] == score[1])
                    bettedOnEl.style.setProperty("color", "#fcd123", "important");
                else
                    bettedOnEl.style.setProperty("color", "#f0565b", "important")
            } else {
                // Första score är det man inte bettat på
                if(score[0] > score[1])
                    bettedOnEl.style.setProperty("color", "#f0565b", "important");
                else if(score[0] == score[1])
                    bettedOnEl.style.setProperty("color", "#fcd123", "important");
                else
                    bettedOnEl.style.setProperty("color", "#5cf278", "important")
            }
        });
    }, 1000);
})();