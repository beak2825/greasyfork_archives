// ==UserScript==
// @name         study.juran.com.cn
// @namespace    easyhome
// @version      2.0
// @description  仅用于内部使用！！代码重写，支持倍速。
// @author       wangqifei
// @icon         https://avatars.githubusercontent.com/u/8955860?v=4
// @match        http://*.yunxuetang.cn/kng/trn/mybuyedcourse.htm
// @match        http://*.yunxuetang.cn/kng/view/package/*
// @match        http://*.yunxuetang.cn/kng/course/package/video/*
// @match        http://*.yunxuetang.cn/kng/course/package/scorm/*
// @match        http*://study.juran.com.cn/kng/course/package/*
// @match        http*://study.juran.com.cn/sty/index.html
// @match        http://study.juran.com.cn/sty/*
// @match        http*://study.juran.com.cn/kng/course/package/*
// @match        http*://study.juran.com.cn/kng/view/package/*
// @match        http*://study.juran.com.cn/exam/test/examquestionpreview.htm*
// @match        http*://study.juran.com.cn/kng/plan/video/*
// @match        http*://study.juran.com.cn/kng/plan/*
// @match        http*://study.juran.com.cn/plan/*
// @match        http*://study.juran.com.cn/exam/test/userexam.htm*
// @connect      Airli
// @namespace com.fly
// @downloadURL https://update.greasyfork.org/scripts/436881/studyjurancomcn.user.js
// @updateURL https://update.greasyfork.org/scripts/436881/studyjurancomcn.meta.js
// ==/UserScript==
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
