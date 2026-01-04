// ==UserScript==
// @name         ZJOOC自动播放（新版）
// @namespace    https://gitee.com/xgdl
// @version      0.1
// @description  巴拉巴拉
// @author       温职谢狗蛋
// @match         *://www.zjooc.cn/ucenter/student/course/study/*/plan/detail/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/407111/ZJOOC%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE%EF%BC%88%E6%96%B0%E7%89%88%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/407111/ZJOOC%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE%EF%BC%88%E6%96%B0%E7%89%88%EF%BC%89.meta.js
// ==/UserScript==

(function () {
    'use strict';
    var startTime = 3500; //第一次脚本开始时间（毫秒），在这个时间之前需要确保完成课程选择和课程加载，否则会报错
    var playInterval = 6500; //课程播放间隔时间（毫秒），在这个时间之前需要确保完成课程加载，否则会报错或者错误跳过
    var speedIndex = 1; // 速度，0：4倍速，1：2倍速，2：1.5倍速，3：1.25倍速，4：正常，5：0.5倍速
    var muteFlag = true; //是否静音
    var nextVideoFunc = function () {
        var currentClass = document.getElementsByClassName("el-menu-item is-active")[1];
        var nextClass = currentClass.nextSibling;

        if (nextClass == null) {
            console.log("当前所有课程已经学习完毕。");
            //下一个章节
            var a = currentClass.parentNode.parentNode.nextSibling.childNodes[0];
            a.click();

            //子节点

            nextClass = currentClass.parentNode.parentNode.nextSibling.childNodes[1].childNodes[0].nextSibling;

        }
        console.log(nextClass);
        nextClass.click();
        playVideoFunc();
    }
    // 播放视频
    var playVideoFunc = function () {
        var vidf = document.getElementsByTagName("video")[0];
        //清晰度
        var spd = vidf.parentElement.children[8];
        //总菜单
        var cbf = vidf.parentNode.childNodes[3];
        //开启按钮
        var playLayerf = cbf.childNodes[0];
        //静音按钮
        var muteLayerf = cbf.childNodes[18];
        /*音量*/
        if (muteFlag) {
            console.log("Click Mute");
            muteLayerf.click();
        }
        window.setTimeout(function () {
            var vidf = document.getElementsByTagName("video")[0];
            //清晰度
            var spd = vidf.parentElement.children[8];
            //总菜单
            var cbf = vidf.parentNode.childNodes[3];
            //开启按钮
            var playLayerf = cbf.childNodes[0];
            //静音按钮
            var muteLayerf = cbf.childNodes[18];
            /*音量*/
            if (muteFlag) {
                console.log("Click Mute");
                muteLayerf.click();
            }
            playLayerf.click();
        }, playInterval);
    };
    // 检测方法
    var detectiveFunc = function () {
        var vid = document.getElementsByTagName("video")[0];
        //总菜单
        var cb = vid.parentNode.childNodes[3];
        //开启按钮
        var playLayerf = cb.childNodes[0];
        //进度条
        var processBar = cb.childNodes[7];
        var processText;
        processText = processBar.innerText;
        var pctime = processText.split('/');
        var ctime = pctime[0].trim();
        var etime = pctime[1].trim();
        if (ctime == etime) {
            nextVideoFunc();
            return;
        }
    };
    var ScritpFunc = function () {
        playVideoFunc();
        window.setInterval(detectiveFunc, playInterval);
    }
    window.setTimeout(ScritpFunc, startTime);
})();