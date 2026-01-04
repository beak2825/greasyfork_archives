// ==UserScript==
// @name         AzUjToOoPcL.AcYn
// @namespace    https://github.com/n0s2/zjoocScript
// @version      0.5
// @description  ZJOOC自动播放下一课，详细使用需求见附加信息或readme.md
// @author       ColdThunder11,00LT00,Moonose
// @match        *://www.zjooc.cn/ucenter/student/course/study/*/plan/detail/*
// @grant        none
// @supportURL   https://github.com/n0s2/zjoocScript
// @downloadURL https://update.greasyfork.org/scripts/428254/AzUjToOoPcLAcYn.user.js
// @updateURL https://update.greasyfork.org/scripts/428254/AzUjToOoPcLAcYn.meta.js
// ==/UserScript==
// TIPS:The script is the latesd edited by Moonose.

//     *Supporting pdf/child chapter study
//     *WechatID: ncnmsl


(function() {
    'use strict';
    var startTime=25000;//第一次脚本开始时间（毫秒），在这个时间之前需要确保完成课程选择和课程加载，否则会报错
    var playInterval=10000;//课程播放间隔时间（毫秒），在这个时间之前需要确保完成课程加载，否则会报错或者错误跳过
    var speedIndex = 0; // 速度，0：4倍速，1：2倍速，2：1.5倍速，3：1.25倍速，4：正常，5：0.5倍速
    var muteFlag = true; //是否静音
    var ifVideo = true;

    var nextVideoFunc=function(){
        var currentClass=document.getElementsByClassName("el-menu-item is-active")[1];//获取当前课程
        var childClass = document.getElementsByClassName("el-tabs__item is-top is-active")[1];//获取当前子课程
        var nextClass=currentClass.nextSibling;
        if(childClass.nextSibling == null){//切换子课程(下一子课程不存在)
            if(nextClass==null){
                currentClass.parentNode.parentNode.nextSibling.childNodes[0].click();//切换章节
                nextClass=currentClass.parentNode.parentNode.nextSibling.childNodes[1].childNodes[1];//将课程切换为下一章节的课程
            }
            if(nextClass==null){
                alert("所有课程已经学习完毕。");
            }
            nextClass.click();//切换章节
        }
        else{
            childClass.nextSibling.click();
        }
        setTimeout(
            function(){
                var v_tmp=document.getElementsByTagName("video")[0];
                if(v_tmp == null){//pdf学习
                    var pdf_button = document.getElementsByClassName("el-button el-button--default")[0];
                    pdf_button.click();//单击学习
                    nextVideoFunc();
                }
                else playVideoFunc();
            }//播放视频
            ,5000);
    }
    var playVideoFunc=function(){
        var vidf=document.getElementsByTagName("video")[0];
        var spd = vidf.parentElement.children[8];//播放速度的元素
        var cbf=vidf.parentNode.childNodes[2];
        var playLayerf=cbf.childNodes[0];
        /*速度*/
        //spd.children[speedIndex].click();
        //vidf.playbackRate = 16.0;
        var lastTime = vidf.duration;
        vidf.currentTime = lastTime-5;
        /*音量*/
        if(muteFlag){
            cbf.children[18].click();
        }
        window.setTimeout(function(){
            var vidf=document.getElementsByTagName("video")[0];
            var spd = vidf.parentElement.children[8];
            var cbf=vidf.parentNode.childNodes[2];
            var playLayerf=cbf.childNodes[0];
            /*速度*/
            //spd.children[speedIndex].click();
            //vidf.playbackRate = 16.0;
            var lastTime = vidf.duration;
            vidf.currentTime = lastTime-5;
            /*音量*/
            if(muteFlag){
            cbf.children[18].click();
        }
            playLayerf.click();
        },playInterval);
    };
    var detectiveFunc=function(){
        var vid=document.getElementsByTagName("video")[0];
        var cb=vid.parentNode.childNodes[2];
        var playLayer=cb.childNodes[0];
        var processBar=cb.childNodes[7];
        var processText;
        processText=processBar.innerText;
        var pctime=processText.split('/');
        var ctime=pctime[0].trim();
        var etime=pctime[1].trim();
        if(ctime==etime){
            nextVideoFunc();
            return;
        }
    };
    var ScritpFunc=function(){
        playVideoFunc();
        window.setInterval(detectiveFunc,playInterval);
    }
    window.setTimeout(ScritpFunc,startTime);
})();