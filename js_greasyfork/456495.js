// ==UserScript==
// @name         OnlineMathContestColorizer
// @namespace    https://twitter.com/rusa6111
// @version      123.45
// @description  Colorize performance values in OMC's user pages.
// @author       rusa6111
// @match        https://onlinemathcontest.com/users/*
// @grant        none
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/456495/OnlineMathContestColorizer.user.js
// @updateURL https://update.greasyfork.org/scripts/456495/OnlineMathContestColorizer.meta.js
// ==/UserScript==

$(function() {
    function colorize(cell){
        const value = cell.text();
        cell.text("");
        var colorClass = '#000000'; // 黒
        if(value <  400) colorClass = '#808080';   // 灰
        else if(value <  800) colorClass = '#804040';  // 茶
        else if(value < 1200) colorClass = '#008000';  // 緑
        else if(value < 1600) colorClass = '#00C0C0';   // 水
        else if(value < 2000) colorClass = '#0000FF';   // 青
        else if(value < 2400) colorClass = '#C0C000'; // 黄
        else if(value < 2800) colorClass = '#FF8000'; // 橙
        else if(value < 3200) colorClass = '#FF0000';    // 赤#C4C7CC
        else /*            */ colorClass = '#965C2C';    // 銅
        cell.append('<span style="color: ' + colorClass + ';">' + value + '</span>');
    };
 
    $('.table').find('tbody').find('tr').each(function(i, contestInfo) {
        const tds = $(contestInfo).find('td');
        colorize($(tds[3]));
        colorize($(tds[4]));
    });
});