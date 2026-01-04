// ==UserScript==
// @name         云学堂视频不暂停
// @version      0.6
// @description  跳过暂停且自动设置为二倍速播放
// @author       Airli
// @license      MIT
// @match        *.yunxuetang.cn/kng/course*
// @connect      Airli
// @namespace com.fly
// @downloadURL https://update.greasyfork.org/scripts/434582/%E4%BA%91%E5%AD%A6%E5%A0%82%E8%A7%86%E9%A2%91%E4%B8%8D%E6%9A%82%E5%81%9C.user.js
// @updateURL https://update.greasyfork.org/scripts/434582/%E4%BA%91%E5%AD%A6%E5%A0%82%E8%A7%86%E9%A2%91%E4%B8%8D%E6%9A%82%E5%81%9C.meta.js
// ==/UserScript==

// Your code here...
setInterval(autoContinue,1000);
setTimeout(abcd,2000);
setTimeout(setInterval(sub,100000),3000);
function abcd(){
    if(myPlayer.getPlaybackRate() == 1){
        myPlayer.setPlaybackRate(2);
    }
    sub();
}
function autoContinue() {
    //var continueBtn = document.getElementById("reStartStudy");
    var a = parseFloat(document.getElementsByClassName("jw-knob jw-reset")[0].style.left);
    /*if(continueBtn && continueBtn.click){
        location.reload();
    }*/
    if(a>=99 && $('#ScheduleText').html() != '100%'){
        myPlayer.seek("1");
    }
    if($('#ScheduleText').html() == '100%'){
        if(myPlayer.getState() != "buffering"){
            myPlayer.seek(parseInt(player.bdPlayer.getDuration()));
        }
    }
    if(myPlayer.getState() == "paused"){
        myPlayer.play();
    }
}
function sub(){
    submitStudy();
}