// ==UserScript==
// @name         学堂在线小工具
// @namespace    https://tunkshif.one/
// @version      0.3
// @description  FXXK THIS SHXT ONLINE COURSES!
// @author       TunkShif
// @match        https://www.xuetangx.com/learn/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/419220/%E5%AD%A6%E5%A0%82%E5%9C%A8%E7%BA%BF%E5%B0%8F%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/419220/%E5%AD%A6%E5%A0%82%E5%9C%A8%E7%BA%BF%E5%B0%8F%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const maxPlaySpeed = 5.0; // 播放倍速, 实测播放器有内部上限, 不一定能按照改的速度加速播放, 实测倍速太高播放后系统不会判定为你看过了这个视频
    const checkVideoOverInterval = 15000; // 每隔多长时间检测一次视频是否播放完毕, 单位 ms
    var helpMessage = "使用说明\n"
    helpMessage += "等待视频加载出来之后点击 开始刷课 的按钮, 然后去查看视频播放器的倍速播放的选项, 选择那个 !!MAX!! 的选项\n"
    helpMessage += "然后坐着等待刷课就行了.一个视频播放完毕后会自动跳转播放下一个, 如果检测到作业页面了会自动跳过到下一个视频.\n"
    helpMessage += "有时候因为网络原因, 可能会出现视频卡住没加载出来, 而导致直接跳到下一个视频了\n"
    helpMessage += "所以记得检查所有视频都刷满了没有哦.\n默认最大播放倍速是 5 倍速, 再高的话系统就不会计入了.\n"
    helpMessage += "要做作业题之前记得刷新一下网页并且不要点 开始刷课 按钮! 不然进入到作业页面后仍然会自动跳转!"
    helpMessage += "有bug可以提,但不一定会修("

    function createButtons() {
        let buttons = document.createElement("div");
        buttons.className = "custom-buttons";
        buttons.style = "float: left";

        let btnHelp = document.createElement("button");
        btnHelp.innerText = "点我查看帮助";
        btnHelp.onclick = function() {
            alert(helpMessage);
        }

        let btnStart = document.createElement("button");
        btnStart.innerText = "点我开始刷课";
        btnStart.onclick = function() {
            setMaxSpeed();
            setInterval(smartNextPlay, checkVideoOverInterval);
        }

        buttons.append(btnHelp);
        buttons.append(btnStart);
        document.body.append(buttons);
    }

    function setMaxSpeed() {
        let player = document.querySelector(".xt_video_player_common_list");
        let speed = player.children[4];
        speed.setAttribute("data-speed", maxPlaySpeed);
        speed.setAttribute("keyt", maxPlaySpeed);
        speed.innerText = "!!MAX!!"
        console.log("[XUETANG TOOL]: Added max speed to the video player.");
    }

    function smartNextPlay() {
        let isVideoOver = document.querySelector(".pause_show") != null;
        let nextPage = document.querySelector("p.next");
        let currentUrl = window.location.href;
        let isVideoPage = currentUrl.search("video") != -1;

        if (!isVideoPage || isVideoOver) {
            nextPage.click();
            console.log("[XUETANG TOOL]: Move to the next page.");
        }

    }

    setTimeout(createButtons, 5000);

})();