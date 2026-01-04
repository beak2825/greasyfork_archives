// ==UserScript==
// @name         CC直播自动领取宝箱
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  CC直播自动领取宝箱，需要自己进入直播间挂机，每天可领取15次!
// @author       Ayou
// @match        http://cc.163.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/376505/CC%E7%9B%B4%E6%92%AD%E8%87%AA%E5%8A%A8%E9%A2%86%E5%8F%96%E5%AE%9D%E7%AE%B1.user.js
// @updateURL https://update.greasyfork.org/scripts/376505/CC%E7%9B%B4%E6%92%AD%E8%87%AA%E5%8A%A8%E9%A2%86%E5%8F%96%E5%AE%9D%E7%AE%B1.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var isDraw = false;
    setInterval(() => {
        var time = document.getElementsByClassName("lottery-red js-lottery-cd")[0];
        if(time !== undefined){
            //console.log("Time: "+time.innerText);
            if(isDraw === false && equals(time.innerText,"")){
                document.getElementsByClassName("lottery-entrance-mask js-lottery-entrance-mask js-need-log-now")[0].click();
                document.getElementsByClassName("lottery-footer js-lottery-footer")[0].getElementsByTagName("a")[0].click();
                isDraw = true;
                console.log("draw lottery!"+isDraw);
                setTimeout(() => {
                    isDraw = false;
                    console.log("Draw: "+isDraw);
                    document.getElementsByClassName("lottery-close-btn win_shut")[0].click();
                }, 12000);
            }
        }
}, 1100);
})();

function equals(str1, str2)
{
    if(str1 == str2)
    {
        return true;
    }
    return false;
}