// ==UserScript==
// @name         FMP Club Player More Info
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  Get more infomation of player
// @match        https://footballmanagerproject.com/Team/Players?id=*
// @match        https://footballmanagerproject.com/Team/Players
// @match        https://www.footballmanagerproject.com/Team/Players?id=*
// @match        https://www.footballmanagerproject.com/Team/Players
// @grant        none
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/530165/FMP%20Club%20Player%20More%20Info.user.js
// @updateURL https://update.greasyfork.org/scripts/530165/FMP%20Club%20Player%20More%20Info.meta.js
// ==/UserScript==
(function() {
    'use strict';

    // 配置参数
    const CHECK_INTERVAL = 1000; // 检查间隔(毫秒)
    const MAX_ATTEMPTS = 30; // 最大尝试次数
    let attemptCount = 0;

    const observer = setInterval(() => {
        // 终止条件检测
        if (attemptCount++ > MAX_ATTEMPTS) {
            clearInterval(observer);
            console.log("More Info Failed");
            return;
        }

        // 检测到目标变量存在时
        if (typeof window.teams !== 'undefined' && Object.keys(window.teams).length !== 0) {
            addTeamInfo();
            clearInterval(observer);
            console.log("More Info Success");
        }
    }, CHECK_INTERVAL);
})();

function addTeamInfo() {
    for (let ID in teams){
        const goalkeepers = teams[ID].gkList;
        const outfielders = teams[ID].plList;
        console.log(goalkeepers);
        console.log(outfielders);
        goalkeepers.forEach(addPlayerInfo);
        outfielders.forEach(addPlayerInfo);
    }
}

function addPlayerInfo (player) {
    $.getJSON({
        "url": ("/Team/Player?handler=PlayerData&playerId=" + player.info.id),
        "datatype": "json",
        "contentType": "application/json",
        "type": "GET"
    },function (ajaxResults) {
        player.info.rating = ajaxResults.player.marketInfo.rating;
        player.info.wage = ajaxResults.player.wage;
        player.info.pubTalents = ajaxResults.player.pubTalents;
    });
}