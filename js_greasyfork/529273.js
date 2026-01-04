// ==UserScript==
// @name         FMP Nation Player More Info
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Get more infomation of NT
// @match        https://footballmanagerproject.com/NationalTeam/NtPlayers?id=*
// @match        https://footballmanagerproject.com/NationalTeam/NtPlayers
// @match        https://www.footballmanagerproject.com/NationalTeam/NtPlayers?id=*
// @match        https://www.footballmanagerproject.com/NationalTeam/NtPlayers
// @grant        none
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/529273/FMP%20Nation%20Player%20More%20Info.user.js
// @updateURL https://update.greasyfork.org/scripts/529273/FMP%20Nation%20Player%20More%20Info.meta.js
// ==/UserScript==
(function() {
    'use strict';

    // 配置参数
    const CHECK_INTERVAL = 500; // 检查间隔(毫秒)
    const MAX_ATTEMPTS = 30; // 最大尝试次数
    let attemptCount = 0;

    const observer = setInterval(() => {
        // 终止条件检测
        if (attemptCount++ > MAX_ATTEMPTS) {
            clearInterval(observer);
            return;
        }

        // 检测到目标变量存在时
        if (typeof window.team !== 'undefined' && Object.keys(window.team).length !== 0) {
            clearInterval(observer);
            addNTInfo();
        }
    }, CHECK_INTERVAL);
})();

function addNTInfo() {
    const goalkeepers = team.gkList;
    const outfielders = team.plList;

    goalkeepers.forEach(addPlayerInfo);
    outfielders.forEach(addPlayerInfo);
}

function addPlayerInfo (player) {
    $.getJSON({
        "url": ("/Team/Player?handler=PlayerData&playerId=" + player.info.id),
        "datatype": "json",
        "contentType": "application/json",
        "type": "GET"
    },function (ajaxResults) {
        player.info.rating = ajaxResults.player.marketInfo.rating;
        player.info.pubTalents = ajaxResults.player.pubTalents;
        player.info.teamNationCode = ajaxResults.player.team.nationCode;
        player.info.leagueID = ajaxResults.player.team.leagueID;
    });
}