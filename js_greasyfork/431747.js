// ==UserScript==
// @name         12580车主服务显示中奖时间
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  12580车主服务抽奖转盘显示中奖时间
// @author       苦苦守候
// @match        https://czfw.12580.com/
// @icon         https://www.google.com/s2/favicons?domain=12580.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/431747/12580%E8%BD%A6%E4%B8%BB%E6%9C%8D%E5%8A%A1%E6%98%BE%E7%A4%BA%E4%B8%AD%E5%A5%96%E6%97%B6%E9%97%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/431747/12580%E8%BD%A6%E4%B8%BB%E6%9C%8D%E5%8A%A1%E6%98%BE%E7%A4%BA%E4%B8%AD%E5%A5%96%E6%97%B6%E9%97%B4.meta.js
// ==/UserScript==

(function() {
    'use strict';
    setTimeout(()=>{
        const winners = document.querySelector('uni-page-body>uni-view').__vue__.$options.parent.winners;
        for(var i in winners){
            const winner = winners[i];
            console.log("winner", winner.ctime, winner.userName, winner.activityPrizeName);
            winner.userName = winner.ctime;
        }
    }, 1500);

    // Your code here...
})();