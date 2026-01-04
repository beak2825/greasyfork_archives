// ==UserScript==
// @name         自定义哔哩哔哩视频播放速度,记住播放速度
// @namespace    http://tampermonkey.net/
// @version      1.0.3
// @description  可以使用按键 z(恢复1倍速)、x（减0.1倍速）、c（加0.1倍速)、s(记住或忘记播放速度), 跳过充电
// @author       felix
// @icon         chrome://favicon/http://www.bilibili.com/
// @match        https://www.bilibili.com/video/*
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/424633/%E8%87%AA%E5%AE%9A%E4%B9%89%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E8%A7%86%E9%A2%91%E6%92%AD%E6%94%BE%E9%80%9F%E5%BA%A6%2C%E8%AE%B0%E4%BD%8F%E6%92%AD%E6%94%BE%E9%80%9F%E5%BA%A6.user.js
// @updateURL https://update.greasyfork.org/scripts/424633/%E8%87%AA%E5%AE%9A%E4%B9%89%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E8%A7%86%E9%A2%91%E6%92%AD%E6%94%BE%E9%80%9F%E5%BA%A6%2C%E8%AE%B0%E4%BD%8F%E6%92%AD%E6%94%BE%E9%80%9F%E5%BA%A6.meta.js
// ==/UserScript==
(function () {
    'use strict';

    // console.log(`[${GM_info.script.name}]: 开始运行`);

    // ===================================================配置区=====================================================================================
    var STORAGE_KEY = {
        BILIBILI_VIDEO_SPEED_SIWTCH: "bilibili_video_speed_switch",
        BILIBILI_VIDEO_SPEED: "bilibili_video_speed"
    };

    var SETTING = {
        STEP_SIZE: 0.1,
        MAX_SPEED: 5,
        MIN_SPEED: 0.1,
        REMEMBER_SPEED_MENU_ID: null,
    };

    var DOM_NAME = {
        SPEED: ".bilibili-player-video-btn-speed-name",
        VIDEO: "bwp-video",
        VIDEO_2: "video",
        JUMP_BUTTON: ".bilibili-player-electric-panel-jump",
        CUSTOMER_TOAST: ".bilibili-player-volumeHint.felix",
        CUSTOMER_TOAST_SUB_DOM: ".bilibili-player-volumeHint.felix .bilibili-player-volumeHint-text",
    }

    var CONSTANT_DATA = {
        REMOVE_SPEED_TOAST_INTERVAL: null
    }

    // ===================================================加载区=====================================================================================

    setTimeout(loading, 3000);

    function loading() {
        addToast();
        loadSpeed();
        addInterval();
    }

    function addInterval() {
        addSpeedInterval();
        addJumpElectricInterval();
    }

    // 每3秒检测一次播放速度
    function addSpeedInterval() {
        return setInterval(() => {
            var videoSpeed = getVideoSpeed();
            var videoSpeedTextNumber = getVideoSpeedTextNumber();
            if (Number(videoSpeed) !== videoSpeedTextNumber) {
                console.log("change speed", videoSpeedTextNumber)
                changeSpeed(videoSpeedTextNumber, false);
            }
        }, 3000);
    }

    // 跳过充电
    function addJumpElectricInterval() {
        return setInterval(() => {
            if ($(DOM_NAME.JUMP_BUTTON).length > 0) {
                $(DOM_NAME.JUMP_BUTTON).trigger('click')
            }
        }, 500)
    }

    function loadSpeed() {
        var speedSwitch = localStorage.getItem(STORAGE_KEY.BILIBILI_VIDEO_SPEED_SIWTCH)
        if (speedSwitch == "true") {
            var speed = localStorage.getItem(STORAGE_KEY.BILIBILI_VIDEO_SPEED);
            if (speed) {
                changeSpeed(speed, false);
                loadRemoveSpeedMenu();
            } else {
                loadSaveSpeedMenu();
            }
        }
    }

    // =============================================== toast ==========================================================
    function hasToast() {
        var toastDom = $(DOM_NAME.CUSTOMER_TOAST)
        return toastDom != null && toastDom != undefined;
    }

    function addToast() {
        var div = $(
            `
                <div class="bilibili-player-volumeHint felix" style="opacity: 100; display: none; ">
                    <span class="bilibili-player-volumeHint-text">felix</span>
                </div>
            `
        )
        $(".bilibili-player-video-wrap").append(div);
    }

    function toast(str) {
        $(DOM_NAME.CUSTOMER_TOAST).attr("style", '{ "opacity": 100, "display": "block" }');
        $(DOM_NAME.CUSTOMER_TOAST_SUB_DOM).text(str);

        if (CONSTANT_DATA.REMOVE_SPEED_TOAST_INTERVAL) {
            clearInterval(CONSTANT_DATA.REMOVE_SPEED_TOAST_INTERVAL);
        }
        CONSTANT_DATA.REMOVE_SPEED_TOAST_INTERVAL = setInterval(() => {
            var opacity = $(DOM_NAME.CUSTOMER_TOAST).css("opacity")
            opacity = opacity - 0.05;
            if (opacity <= 0.7) {
                $(DOM_NAME.CUSTOMER_TOAST).css("opacity", 0);
                $(DOM_NAME.CUSTOMER_TOAST).css("dispaly", "none");
                clearInterval(CONSTANT_DATA.REMOVE_SPEED_TOAST_INTERVAL);
            } else {
                $(DOM_NAME.CUSTOMER_TOAST).css("opacity", opacity);
            }
        }, 200);
    }

    // ===================================================获取控件区=====================================================================================
    function getVideo() {
        var video = document.querySelector(DOM_NAME.VIDEO)
        return video ? video : document.querySelector(DOM_NAME.VIDEO_2);
    }



    // ===================================================键盘监听区=====================================================================================
    document.onkeydown = function (e) {
        if (e.target.nodeName !== 'BODY') return;
        if (/^[zxcZXCsS]$/.test(e.key)) {
            if (e.key === 'z' || e.key === 'Z') changeSpeed(1, true);
            if (e.key === 'x' || e.key === 'X') reduceSpeed();
            if (e.key === 'c' || e.key === 'C') addSpeed();
            if (e.key === 's' || e.key === 'S') changeSaveSpeedSwitch();
        }
    };

    // ==================================================播放速度=================================================================================
    // 加载记住播放速度菜单
    function loadSaveSpeedMenu() {
        if (SETTING.REMEMBER_SPEED_MENU_ID) {
            GM_unregisterMenuCommand(SETTING.REMEMBER_SPEED_MENU_ID);
        }
        SETTING.REMEMBER_SPEED_MENU_ID = GM_registerMenuCommand("记住播放速度", openSaveSpeedSwitch);
    }

    // 加载忘记播放速度菜单
    function loadRemoveSpeedMenu() {
        if (SETTING.REMEMBER_SPEED_MENU_ID) {
            GM_unregisterMenuCommand(SETTING.REMEMBER_SPEED_MENU_ID);
        }
        SETTING.REMEMBER_SPEED_MENU_ID = GM_registerMenuCommand("忘记播放速度", closeSaveSpeedSwitch);
    }

    function changeSaveSpeedSwitch() {
        var speedSwitch = localStorage.getItem(STORAGE_KEY.BILIBILI_VIDEO_SPEED_SIWTCH);
        if (speedSwitch == "true") {
            // 当前是记住
            closeSaveSpeedSwitch();
            toast("已忘记");
        } else {
            openSaveSpeedSwitch();
            toast("已记住");
        }
    }

    // 开启记住播放速度开关
    function openSaveSpeedSwitch() {
        localStorage.setItem(STORAGE_KEY.BILIBILI_VIDEO_SPEED_SIWTCH, true);
        setSpeedToStorage();
    }

    // 关闭记住播放速度开关
    function closeSaveSpeedSwitch() {
        localStorage.setItem(STORAGE_KEY.BILIBILI_VIDEO_SPEED_SIWTCH, false);
        removeSpeedFromStorage();
    }

    // 保存播放速度到localStorage
    function setSpeedToStorage() {
        localStorage.setItem(STORAGE_KEY.BILIBILI_VIDEO_SPEED, getVideoSpeed());
        loadRemoveSpeedMenu();
    }

    // 从localStorage中删除保存的播放速度
    function removeSpeedFromStorage() {
        localStorage.removeItem(STORAGE_KEY.BILIBILI_VIDEO_SPEED);
        loadSaveSpeedMenu();
    }

    // 获取当前播放速度
    function getVideoSpeed() {
        return getVideo().playbackRate;
    }

    // 获取当前展示的播放速度
    function getVideoSpeedTextNumber() {
        var speedText = $(DOM_NAME.SPEED).text()
        if (speedText == "倍速") {
            speedText = "1";
        }
        speedText = speedText.replaceAll("x", "")
        return Number(speedText);
    }

    // 改变展示的播放速度文字
    function changeSpeedText(playSpeed) {
        $(DOM_NAME.SPEED).text(playSpeed);
    }

    // 减速
    function reduceSpeed(stepSize) {
        if (!stepSize) {
            stepSize = SETTING.STEP_SIZE;
        }
        var playSpeed = Number(getVideoSpeedTextNumber() - stepSize).toFixed(1);
        changeSpeed(playSpeed, true);
    }

    // 加速
    function addSpeed(stepSize) {
        if (!stepSize) {
            stepSize = SETTING.STEP_SIZE;
        }
        var playSpeed = Number(getVideoSpeedTextNumber() + stepSize).toFixed(1);
        changeSpeed(playSpeed, true);
    }

    // 改变播放速度
    function changeSpeed(playSpeed, showToast) {
        if (playSpeed && playSpeed >= SETTING.MIN_SPEED && playSpeed <= SETTING.MAX_SPEED) {
            doChangeSpeed(playSpeed);
            changeSpeedText(playSpeed);
            var saveSpeedswitch = localStorage.getItem(STORAGE_KEY.BILIBILI_VIDEO_SPEED_SIWTCH);
            if (saveSpeedswitch) {
                setSpeedToStorage();
            }
            if (!hasToast()) {
                addToast();
            }
            if (showToast) {
                toast(playSpeed);
            }
        }
    }

    // 执行调整播放速度
    function doChangeSpeed(playSpeed) {
        getVideo().playbackRate = Number(playSpeed);
    }
})();