// ==UserScript==
// @name         金螳螂云学堂视频不暂停
// @version      1.1
// @description  云学堂跳过暂停
// @author       keke31h
// @license      MIT
// @match        *.yunxuetang.cn/*
// @namespace    www.31ho.com
// @downloadURL https://update.greasyfork.org/scripts/475882/%E9%87%91%E8%9E%B3%E8%9E%82%E4%BA%91%E5%AD%A6%E5%A0%82%E8%A7%86%E9%A2%91%E4%B8%8D%E6%9A%82%E5%81%9C.user.js
// @updateURL https://update.greasyfork.org/scripts/475882/%E9%87%91%E8%9E%B3%E8%9E%82%E4%BA%91%E5%AD%A6%E5%A0%82%E8%A7%86%E9%A2%91%E4%B8%8D%E6%9A%82%E5%81%9C.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    var myPlayer = jwplayer();

    setInterval(autoContinue, 1000);
    setTimeout(setPlaybackRate, 2000);

    function setPlaybackRate() {
        if (myPlayer.getPlaybackRate() === 1) {
            myPlayer.setPlaybackRate(2);
        }
    }

    function handleClickContinue() {
        var continueButton = document.querySelector(".popup button.continue-button");
        if (continueButton) {
            continueButton.click();
        }
    }

    function autoContinue() {
        var knob = document.getElementsByClassName("jw-knob jw-reset")[0];
        var progress = parseFloat(knob.style.left);
        var scheduleText = $('#ScheduleText').html();

        if (progress >= 99 && scheduleText !== '100%') {
            myPlayer.seek(1);
        }

        if (scheduleText === '100%') {
            if (myPlayer.getState() !== "buffering") {
                myPlayer.seek(parseInt(player.bdPlayer.getDuration()));
            }
        }

        if (myPlayer.getState() === "paused") {
            myPlayer.play();
        }

        handleClickContinue();
    }

})();