// ==UserScript==
// @name         Grundo's Battledome Log
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Logs Battledome rewards with a button to export
// @author       Superlink, Gem
// @match        https://grundos.cafe/*
// @match        https://www.grundos.cafe/*
// @icon         https://www.grundos.cafe/static/images/favicon.66a6c5f11278.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/478960/Grundo%27s%20Battledome%20Log.user.js
// @updateURL https://update.greasyfork.org/scripts/478960/Grundo%27s%20Battledome%20Log.meta.js
// ==/UserScript==
/* globals $ */

(function() {
    'use strict';

    if(window.location.href.match('1p/battle')) {
        const challenger = (($('#hpbars > table > tbody > tr:nth-child(3) > td:nth-child(3)')[0]).firstChild.nodeValue).slice(1);
        localStorage.setItem('challenger', challenger);
    };

    if(window.location.href.match('/1p/endbattle')) {
        const item = $('#prize_blurb > p:first-child > strong').text();

        if (item) {
            const rewardHistoryRaw = localStorage.getItem('bd-reward-history');
            const challenger = localStorage.getItem('challenger');

            let rewardHistory = {};
            if (rewardHistoryRaw) {
                rewardHistory = JSON.parse(rewardHistoryRaw);
            }

            const rewardHistoryForChallenger = rewardHistory[challenger];
            if (!rewardHistoryForChallenger) {
                const rewards = {
                    [item]: 1
                };
                rewardHistory[challenger] = rewards;
            } else {
                console.log(rewardHistoryForChallenger, rewardHistoryForChallenger[item]);
                const currentFrequency = rewardHistoryForChallenger[item] || 0;
                rewardHistory[challenger][item] = currentFrequency + 1;
            }

            localStorage.setItem('bd-reward-history', JSON.stringify(rewardHistory));

            //Set Reward History Since Last Export
            const currentRewardHistoryRaw = localStorage.getItem('current-bd-reward-history');
            let currentRewardHistory = {};
            if (currentRewardHistoryRaw) {
                currentRewardHistory = JSON.parse(currentRewardHistoryRaw);
            }

            const currentRewardHistoryForChallenger = currentRewardHistory[challenger];
            if (!currentRewardHistoryForChallenger) {
                const rewards = {
                    [item]: 1
                };
                currentRewardHistory[challenger] = rewards;
            } else {
                console.log(currentRewardHistoryForChallenger, currentRewardHistoryForChallenger[item]);
                const currentRewardFrequency = currentRewardHistoryForChallenger[item] || 0;
                currentRewardHistory[challenger][item] = currentRewardFrequency + 1;
            }

            localStorage.setItem('current-bd-reward-history', JSON.stringify(currentRewardHistory));
        }

    }

    let exportButton = document.createElement("button");
    exportButton.id = "exportButton";
    exportButton.innerHTML = 'Export BD Data';
    document.querySelector("#sb_banner").append(exportButton);
    $("#exportButton").click(() => {
      window.open().document.write(localStorage.getItem('current-bd-reward-history'));
      let empty = {};
      localStorage.setItem('current-bd-reward-history', JSON.stringify(empty));
    });

    const customCSS = `
      #exportButton {
        height: fit-content;
        width: 100%;
        background-color: orange;
        border: 1px solid pink;
        padding: 5px;
        box-sizing: border-box;
        margin: 10px 0;
      }`;

    $("<style>").prop("type", "text/css").html(customCSS).appendTo("head");
})();