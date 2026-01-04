// ==UserScript==
// @name         基金业协会视频自动播放
// @namespace    https://www.nekotofu.top/
// @homepage    https://www.nekotofu.top/
// @version      1.3.1
// @description 基金业协会视频自动下一个，但题目目前需要自己答。
// @author       misaka10032w
// @match        *://peixun.amac.org.cn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=microsoft.com
// @noframes
// @license MIT
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/453880/%E5%9F%BA%E9%87%91%E4%B8%9A%E5%8D%8F%E4%BC%9A%E8%A7%86%E9%A2%91%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/453880/%E5%9F%BA%E9%87%91%E4%B8%9A%E5%8D%8F%E4%BC%9A%E8%A7%86%E9%A2%91%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE.meta.js
// ==/UserScript==

(function () {
    'use strict';
    // 检查浏览器是否支持通知并在页面加载时请求权限
    if (!("Notification" in window)) {
        console.log("浏览器不支持通知");
    } else if (Notification.permission !== "granted") {
        Notification.requestPermission().then(permission => {
            if (permission !== "granted") {
                customLog("用户拒绝了通知权限", "red");
            }
        });
    }
    function sendNotification(title, content) {
        if (Notification.permission === "granted") {
            showNotification(title, content);
        } else {
            customLog("通知权限未授予，需要点击地址栏左边按钮重置通知权限", "red");
        }
    }
    function showNotification(title, content) {
        const notification = new Notification(title, { body: content });
        notification.onclick = () => {
            // TODO
            customLog("用户点击了通知", "green");
        };
    }
    //自定义LOG
    function customLog(message, backgroundColor, color = "white") {
        console.log(`%c${message}`, `background: ${backgroundColor}; color: ${color}; padding: 2px 4px; border-radius: 2px;`);
    }
    //关闭弹窗，这个方法不好使了，暂时不想改了，不耽误播放
    function closePopup() {
        const pop = document.querySelector(".class_float");
        if (pop.style.display != "none") {
            var close = pop.getElementsByClassName("btn-close")[0]
            close.click();
        }
    }
    //获取课程列表
    let nowPlaying;
    function getCourse() {
        const courseList = document.querySelectorAll(".catalog-content a");
        const ignoredClasses = ["studied", "test", "testRev", "testScore"];
        for (const course of courseList) {
            const hasIgnoredClass = ignoredClasses.some(cls => course.classList.contains(cls));
            if (!hasIgnoredClass) {
                customLog("存在未播放的项，播放列表未完成:", "yellow", "black");
                nowPlaying = course;
                customLog(nowPlaying.textContent, "yellow", "black");
                if (!nowPlaying.classList.contains("cur")) {
                    customLog("已播放完毕", "green");
                    nowPlaying.click();
                }
                return nowPlaying;
            }
        }
        // 所有项都已经播放，播放列表已完成
        return false;
    }
    //注册菜单
    const defaultPlaybackRate = 1.0;
    let playBackRate = GM_getValue('playBackRate', defaultPlaybackRate);
    const defaultMute = true;
    let playbackRateMenu = GM_registerMenuCommand(`播放速率：${GM_getValue('playBackRate', defaultPlaybackRate)}`, setPlaybackRate);
    let muteMenu = GM_registerMenuCommand(`${GM_getValue('isMute', defaultMute) ? '🔇' : '🔊'} 是否静音播放`, toggleMute);
    function setPlaybackRate() {
        const newRate = prompt('请输入新的播放速率，不建议太高，可能会被检测:', playBackRate);
        if (newRate !== null) {
            playBackRate = parseFloat(newRate);
            GM_setValue('playBackRate', playBackRate);
            updateMenuCommands();
        }
    }
    function toggleMute() {
        let isSetMute = GM_getValue('isMute', defaultMute);
        GM_setValue('isMute', !isSetMute);
        updateMenuCommands();
    }
    function updateMenuCommands() {
        GM_unregisterMenuCommand(playbackRateMenu);
        GM_unregisterMenuCommand(muteMenu);
        playbackRateMenu = GM_registerMenuCommand(`播放速率：${GM_getValue('playBackRate', defaultPlaybackRate)}`, setPlaybackRate);
        muteMenu = GM_registerMenuCommand(`${GM_getValue('isMute', defaultMute) ? '🔇' : '🔊'} 是否静音播放`, toggleMute);
    }
    //注册播放器事件
    function setupVideoPlayerEvents(player) {
        player.addEventListener("play", function () {
            customLog("视频开始播放", "green");
        });
        player.addEventListener("pause", function () {
            customLog("视频暂停，将在1000ms后继续播放", "red");
            setTimeout(() => { player.play(); }, 1000);
        });
        player.addEventListener("ended", function () {
            customLog("视频播放结束", "green");
        });
        player.addEventListener("timeupdate", function () {
            const currentplaybackRate = player.playbackRate;
            const isSetMute = GM_getValue('isMute', defaultMute);
            if (player.muted != isSetMute) {
                player.muted = isSetMute;
            }
            if (currentplaybackRate != playBackRate) {
                player.playbackRate = playBackRate;
            }
        })
    }
    function monitorPlayback(player) {
        let maxTime = 0;
        setInterval(() => {
            const currentTime = player.currentTime.toFixed(0);
            const duration = player.duration.toFixed(0);
            //console.log(`当前时间: ${currentTime} / 总时长: ${duration}`);
            //如果当前播放等于时长并且nowPlaying不为false（为文本代表有课程未看）则重新加载，防止更新延迟导致重看
            if (currentTime == duration && nowPlaying) {
                setTimeout(() => {
                    location.reload();
                }, 1000);
            } else if (currentTime != currentTime && player.paused) {
                player.play();
            }
            //记录一下当前时间，如果最新时间突然变小，证明视频被重新播放了
            customLog(`记录的时间：${maxTime}\n现在的时间：${currentTime}`, "green");
            maxTime = Number(currentTime) >= maxTime ? Number(currentTime) : (location.reload(), maxTime);
        }, 1000);
    }
    //播放处理
    if (document.querySelectorAll(".catalog-content a").length != 0) {
        nowPlaying = getCourse();
        //检查是否播放完毕，class包含studied即播放完毕
        if (!nowPlaying) {
            sendNotification("当前课程播放完毕！", "当前课程列表播放完毕，请考试或者切换下一个课程！")
            return true
        }
        //检查iframe，网站的播放器是个iframe，什么鬼写法
        var iframe = document.querySelector('iframe');
        let checkInterval = setInterval(function () {
            iframe = document.querySelector('iframe');
            if (iframe) {
                let iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
                let player = iframeDocument.getElementsByTagName("video")[0];
                console.log('找到播放器！:', player);
                setupVideoPlayerEvents(player);
                monitorPlayback(player)
                player.muted = true;
                player.play();
                clearInterval(checkInterval);
            }
        }, 500);
    }
})();
