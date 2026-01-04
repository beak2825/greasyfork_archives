// ==UserScript==
// @name         FMP More Player Info
// @name:zh-CN   FMP More Player Info
// @description  Get more players information
// @description:zh-CN  获取更多信息
// @version      0.11
// @match        https://footballmanagerproject.com/Team/Player*
// @match        https://www.footballmanagerproject.com/Team/Player*
// @exclude      https://footballmanagerproject.com/Team/Players*
// @exclude      https://www.footballmanagerproject.com/Team/Players*
// @license      MIT
// @namespace https://greasyfork.org/users/1304483
// @downloadURL https://update.greasyfork.org/scripts/508685/FMP%20More%20Player%20Info.user.js
// @updateURL https://update.greasyfork.org/scripts/508685/FMP%20More%20Player%20Info.meta.js
// ==/UserScript==

(function (){
    'use strict';
    var textLocalized={
        title:"更多信息",
        marketValue:"市场价值",
        agentValue:"回收价值",
        minBid:"最小报价",
        maxBid:"最多报价",
        rating:"评星"
    }

    const currentUrl = window.location.href;
    const urlObj = new URL(currentUrl);
    const id = urlObj.searchParams.get('id');

    const moreInfoDiv = document.createElement('div');
    moreInfoDiv.className = 'board fmpx box';
    moreInfoDiv.style.flexGrow = 0;
    moreInfoDiv.style.flexBasis = '200px';

    const titleDiv = document.createElement('div');
    titleDiv.className = 'title';
    const mainDiv = document.createElement('div');
    mainDiv.className = 'main';
    mainDiv.textContent = textLocalized.title;
    titleDiv.appendChild(mainDiv)
    moreInfoDiv.appendChild(titleDiv);

    const infoDiv = document.createElement('div');
    infoDiv.className = 'moreinfo';
    infoDiv.style.color = 'white';
    GetMarketValue(id,function(marketValue) {
        infoDiv.innerHTML += '<span style="color:#fffa33">' + textLocalized.marketValue + ': </span>'
        infoDiv.innerHTML += SeprateNumber(marketValue);
        infoDiv.innerHTML += '<br>'
        infoDiv.innerHTML += '<span style="color:#fffa33">' + textLocalized.agentValue + ': </span>'
        infoDiv.innerHTML += SeprateNumber(marketValue/2);
        infoDiv.innerHTML += '<br>'
    });
    GetBidInfo(id,function(isBotTeam,maxBid,minBid){
        infoDiv.innerHTML += '<span style="color:#fffa33">' + textLocalized.minBid + ': </span>'
        infoDiv.innerHTML += SeprateNumber(Math.floor(minBid));
        infoDiv.innerHTML += '<br>'
        if(!isBotTeam && maxBid){
            infoDiv.innerHTML += '<span style="color:#fffa33">' + textLocalized.maxBid + ': </span>'
            infoDiv.innerHTML += SeprateNumber(maxBid);
            infoDiv.innerHTML += '<br>'
        }
    });
    GetPlayers(id,function(rating){
        infoDiv.innerHTML += '<span style="color:#fffa33">' + textLocalized.rating + ': </span>'
        infoDiv.innerHTML += rating/10;
        infoDiv.innerHTML += '<br>'
    });
    moreInfoDiv.appendChild(infoDiv);

    const targetElement = document.getElementById('ActionsBoard');
    targetElement.parentNode.insertBefore(moreInfoDiv, targetElement);

})();

function GetMarketValue(pid,callback){
    $.ajax({
        type: "GET",
        url: '/Players/GetPlayerMarketValue',
        data: {
            playerid: pid,
        },
        success: function (result) {
            console.log(result);
            callback(result.marketValue);
        }
    });
}

function GetBidInfo(pid,callback){
    $.ajax({
        type: "POST",
        url: '/Players/GetDirectBidInfo',
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify({
            playerid: pid,
        }),
        success: function (result) {
            console.log(result);
            callback(result.player.isBotTeam,result.player.maxBid,result.player.minimumBid);
        }
    });
}

function GetPlayers(pid,callback){
    $.getJSON({
      "url": ("/Team/Player?handler=PlayerData&playerId=" + pid),
      "datatype": "json",
      "contentType": "application/json",
      "type": "GET"
    },
      function (ajaxResults) {
        console.log(ajaxResults);
        callback(ajaxResults.player.marketInfo.rating);
        ajaxResults.player.pos=fp2pos(ajaxResults.player.fp);
        var skills=decode(ajaxResults.player.skills,ajaxResults.player.pos)
        console.log(skills);
      }
    );
}

function decode(binsk, pos) {
    var skills = Uint8Array.from(atob(binsk), c => c.charCodeAt(0));

    var sk = {};

    if (pos === 0) {
        sk.Han = skills[0] / 10;
        sk.One = skills[1] / 10;
        sk.Ref = skills[2] / 10;
        sk.Aer = skills[3] / 10;
        sk.Ele = skills[4] / 10;
        sk.Jum = skills[5] / 10;
        sk.Kic = skills[6] / 10;
        sk.Thr = skills[7] / 10;
        sk.Pos = skills[8] / 10;
        sk.Sta = skills[9] / 10;
        sk.Pac = skills[10] / 10;
        sk.For = skills[11] / 10;
        sk.Rou = (skills[12] * 256 + skills[13]) / 100;
    }
    else {
        sk.Mar = skills[0] / 10;
        sk.Tak = skills[1] / 10;
        sk.Tec = skills[2] / 10;
        sk.Pas = skills[3] / 10;
        sk.Cro = skills[4] / 10;
        sk.Fin = skills[5] / 10;
        sk.Hea = skills[6] / 10;
        sk.Lon = skills[7] / 10;
        sk.Pos = skills[8] / 10;
        sk.Sta = skills[9] / 10;
        sk.Pac = skills[10] / 10;
        sk.For = skills[11] / 10;
        sk.Rou = (skills[12] * 256 + skills[13]) / 100;
    }

    return sk;
}

function fp2pos(fp) {
  switch (fp) {
    case "GK": return 0;
    case "DC": return 4;
    case "DL": return 5;
    case "DR": return 6;
    case "DMC": return 8;
    case "DML": return 9;
    case "DMR": return 10;
    case "MC": return 16;
    case "ML": return 17;
    case "MR": return 18;
    case "OMC": return 32;
    case "OML": return 33;
    case "OMR": return 34;
    case "FC": return 64;
  }

  return -1;
}

function SeprateNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}