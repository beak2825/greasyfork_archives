// ==UserScript==
// @name            智慧树自动答题
// @author          nine light
// @match           *://studyh5.zhihuishu.com/*
// @description     自动答题，自用
// @version         0.0.1
// @namespace https://greasyfork.org/users/451811
// @downloadURL https://update.greasyfork.org/scripts/401895/%E6%99%BA%E6%85%A7%E6%A0%91%E8%87%AA%E5%8A%A8%E7%AD%94%E9%A2%98.user.js
// @updateURL https://update.greasyfork.org/scripts/401895/%E6%99%BA%E6%85%A7%E6%A0%91%E8%87%AA%E5%8A%A8%E7%AD%94%E9%A2%98.meta.js
// ==/UserScript==
(function(){
    var playID, choose, close, 
        disposeKey = true,
        time1, time2,
        nextBtn;
    setInterval(function(){
        playID = document.getElementById("playButton");
        time1 = document.getElementsByClassName("currentTime")[0];
        time2 = document.getElementsByClassName("duration")[0];
        nextBtn = document.getElementById("nextBtn");
        if(time1.innerText == "00:00:03") {
            playID.click();
            playID.click();
        }
        if(playID && playID.className == "playButton" && disposeKey && time1 != time2) {
            console.log('success');
            disposeKey = false;
            choose = document.getElementsByClassName("item-topic");
            close = document.getElementsByClassName("el-dialog__close el-icon el-icon-close");
            choose[0].click();
            setTimeout(function(){
                close[close.length - 1].click();
                playID.click();
                disposeKey = true;
            }, 1000)
        }else if(time1.innerText == time2.innerText) {
            nextBtn.click();
        }
    },2000)
    
}());