// ==UserScript==
// @name         ZJOOC自动播放
// @namespace    https://github.com/ColdThunder11/ZJOOCAutoPlay
// @version      0.3
// @description  ZJOOC自动播放下一课，详细使用需求见附加信息或readme.md
// @author       ColdThunder11,00LT00,liudanT800
// @match        *://www.zjooc.cn/ucenter/student/course/study/*/plan/detail/*
// @grant        none
// @supportURL   https://github.com/ColdThunder11/ZJOOCAutoPlay/issues
// @downloadURL https://update.greasyfork.org/scripts/397189/ZJOOC%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/397189/ZJOOC%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var startTime = 25000; // 脚本开始时间（毫秒）
    var playInterval = 10000; // 检查间隔时间（毫秒）
    var speedIndex = 0; // 播放速度
    var muteFlag = true; // 是否静音

    // 获取所有 role="tab" 的元素，并排除不需要的 tab
    var getTabs = function() {
        var allTabs = document.querySelectorAll('[role="tab"]');
        var filteredTabs = [];

        allTabs.forEach(function(tab, index) {
            // 排除前两个 tab
            if (index >= 2) {
                filteredTabs.push(tab);
            }
        });

        return filteredTabs;
    };

    // 跳转到下一个 tab
    var nextTabFunc = function() {
        var tabs = getTabs();
        var currentTab = Array.from(tabs).find(tab => tab.getAttribute('aria-selected') === 'true');
        var currentIndex = tabs.indexOf(currentTab);
        var nextTab = tabs[currentIndex + 1];

        if (nextTab) {
            nextTab.click(); // 点击下一个 tab
            // 重新获取所有的 tab 并等待 DOM 更新
            setTimeout(() => {
                playVideoFunc(); // 播放当前 tab 的内容
            }, 1000); // 延迟1秒等待DOM更新
        } else {
            // 所有 tab 都已跳转完毕，跳转到下一个课程
            nextVideoFunc();
        }
    };

    // 跳转到下一个课程
    var nextVideoFunc = function() {
        var currentClass = document.getElementsByClassName("el-menu-item is-active")[1];
        var nextClass = currentClass.nextSibling;

        if (nextClass == null) {
            currentClass.parentNode.parentNode.nextSibling.childNodes[0].click();
            nextClass = currentClass.parentNode.parentNode.nextSibling.childNodes[1].childNodes[1];
        }

        if (nextClass == null) {
            alert("所有课程已经学习完毕。");
        } else {
            nextClass.click();
            playVideoFunc();
        }
    };
    
    var playVideoFunc=function(){
        var vidf=document.getElementsByTagName("video")[0];
        var spd = vidf.parentElement.children[8];
        var cbf=vidf.parentNode.childNodes[2];
        var playLayerf=cbf.childNodes[0];
        /*速度*/
        spd.children[speedIndex].click();
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
            spd.children[speedIndex].click();
            /*音量*/
            if(muteFlag){
            cbf.children[18].click();
        }
            playLayerf.click();
        },playInterval);
    };

    // 检查当前 tab 的内容是否完成
    var detectiveFunc = function() {
        var vid = document.getElementsByTagName("video")[0];
        if (vid) {
            var cb = vid.parentNode.childNodes[2];
            var processBar = cb.childNodes[7];
            var processText = processBar.innerText;
            var pctime = processText.split('/');
            var ctime = pctime[0].trim();
            var etime = pctime[1].trim();

            if (ctime == etime) {
                // 当前视频播放完毕，跳转到下一个 tab
                console.log("当前视频播放完毕，跳转到下一个 tab")
                nextTabFunc();
            }
        }
    };

    // 主函数
    var ScritpFunc = function() {
        playVideoFunc();
        window.setInterval(detectiveFunc, playInterval);
    };

    window.setTimeout(ScritpFunc, startTime);
})();