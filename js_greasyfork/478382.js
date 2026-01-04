// ==UserScript==
// @name         hupu nba
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  修正hupu nba看数据bug和改进数据页表格排版
// @author       iibb
// @match        https://nba.hupu.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=hupu.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/478382/hupu%20nba.user.js
// @updateURL https://update.greasyfork.org/scripts/478382/hupu%20nba.meta.js
// ==/UserScript==

(function() {
'use strict';
var diff = 19902299;
if (/https?:\/\/nba\.hupu\.com\/($|\?.*)/.test(location.href)){
    $('a[href*="/games/"]').each(function(index,element){
        //console.log(element.href);
        var regResult = element.href.match(/(.*\/games\/(?:boxscore|playbyplay)\/)(\d+)/);
        if (regResult && regResult.length > 2){
            element.href =  regResult[1] + (regResult[2] - diff);
        }
    })
    $('span[data-href*="/games/"]').each(function(index,element){
        var href = element.getAttribute("data-href");
        //console.log(href);
        var regResult = href.match(/(.*\/games\/(?:boxscore|playbyplay)\/)(\d+)/);
        if (regResult && regResult.length > 2){
            element.setAttribute("data-href", regResult[1] + (regResult[2] - diff));
        }
    })
}

if (/https?:\/\/nba\.hupu\.com\/games\/boxscore\/\d+($|\?.*)/.test(location.href)){
    $('table#J_away_content,#J_home_content').find('tr').each(function(i,e){
        //debugger;
        var tds = $(this).find('td');
        var tdArray = $.makeArray(tds);
        var newtdArray = [tdArray[0], tdArray[1], tdArray[2], tdArray[14]/*得分*/, tdArray[8]/*篮板*/, tdArray[9]/*助攻*/, tdArray[3], tdArray[4], tdArray[5], tdArray[6], tdArray[7]
            , tdArray[11]/*抢断*/, tdArray[13]/*封盖*/, tdArray[12]/*失误*/, tdArray[10]/*犯规*/, tdArray[15]/*+-*/];

        tds.remove();

        $.each(newtdArray, function(index, td){
            e.append(td);
        });
    })
}
})();