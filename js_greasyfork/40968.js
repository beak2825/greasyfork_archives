// ==UserScript==
// @name         Dailyindiegame Extension
// @namespace    http://tampermonkey.net/
// @description  em....很弱的脚本.DIG商店自动隐藏无卡及已拥有游戏
// @match        *://www.dailyindiegame.com/content*
// @match        *://dailyindiegame.com/content*
// @require      https://cdn.bootcss.com/jquery/2.2.4/jquery.min.js
// @version      20180510
// @downloadURL https://update.greasyfork.org/scripts/40968/Dailyindiegame%20Extension.user.js
// @updateURL https://update.greasyfork.org/scripts/40968/Dailyindiegame%20Extension.meta.js
// ==/UserScript==

(function() {
    $(document).ready(function(){
        var gameList,gameNum,gcard,owned,ownapp,digacc;
        gameList = $("tr.DIG3_14_Gray");
        gameNum = gameList.length;
        for(var i=0;i<gameNum;i++){
            gcard = gameList[i].children[2].innerText;
            if(gcard===""){
                $(gameList[i]).hide();
            }
        }
        digacc = $("td.DIG3_14_Orange");
        for(var n=0;n<digacc.length;n++){
            if(digacc[n].innerText===""){
                $(digacc[n]).parent().hide();
            }
        }
        setTimeout(function(){
            owned = $("span[style='color: green; cursor: help;']");
            for(var j=0;j<owned.length;j++){
                ownapp = owned[j].innerText;
                if(ownapp===" ✔"){
                    $(owned[j]).parent().parent().hide();
                }
            }
        //延迟时间
        },4444);
    });
})();