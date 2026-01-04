// ==UserScript==
// @name         bilibili播放视频倍速自定义（原生按钮，支持0-16倍速）
// @namespace    dzj0821
// @version      1.1
// @description  bilibili播放视频倍速自定义，与原生按钮兼容，自动记忆
// @author       dzj0821
// @include      http*://*bilibili.com/video/*
// @include      http*://*bilibili.com/list/*
// @include      http*://*bilibili.com/bangumi/*
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/507275/bilibili%E6%92%AD%E6%94%BE%E8%A7%86%E9%A2%91%E5%80%8D%E9%80%9F%E8%87%AA%E5%AE%9A%E4%B9%89%EF%BC%88%E5%8E%9F%E7%94%9F%E6%8C%89%E9%92%AE%EF%BC%8C%E6%94%AF%E6%8C%810-16%E5%80%8D%E9%80%9F%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/507275/bilibili%E6%92%AD%E6%94%BE%E8%A7%86%E9%A2%91%E5%80%8D%E9%80%9F%E8%87%AA%E5%AE%9A%E4%B9%89%EF%BC%88%E5%8E%9F%E7%94%9F%E6%8C%89%E9%92%AE%EF%BC%8C%E6%94%AF%E6%8C%810-16%E5%80%8D%E9%80%9F%EF%BC%89.meta.js
// ==/UserScript==

(function () {
    "use strict";
    //bilibili播放器限制，改这里也没用
    let SPEED_MIN_VALUE = 0
    let SPEED_MAX_VALUE = 16

    function getSpeedSetting() {
        let defaultValue = ["0.5", "0.75", "1.0", "1.25", "1.5", "2.0", "3.0", "4.0"]
        try {
            let setting = localStorage.getItem("dz_bilibili_video_custom_speed_setting")
            if (!setting) {
                return defaultValue
            }
            let arr = setting.split(" ")
            for (var value of arr) {
                let speed = parseFloat(value)
                if (isNaN(speed) || speed == 0 || speed < SPEED_MIN_VALUE || speed > SPEED_MAX_VALUE) {
                    return defaultValue
                }
            }
            return arr
        } catch (err) {
            return defaultValue
        }
    }

    function updateSpeedSetting(){
        let input = window.prompt("输入想显示的倍速，以空格分隔：", getSpeedSetting().join(" "))
        let arr = input.split(" ")
        for (var value of arr) {
            let speed = parseFloat(value)
            if (isNaN(speed)) {
                alert("【" + value + "】不是有效的速度")
                return
            }
            if (speed == 0) {
                alert("速度不能为0")
                return
            }
            if (speed < SPEED_MIN_VALUE) {
                alert("播放器速度下限为" + SPEED_MIN_VALUE + "，速度必须小于等于" + SPEED_MIN_VALUE)
                return
            }
            if (speed > SPEED_MAX_VALUE) {
                alert("播放器速度上限为" + SPEED_MAX_VALUE + "，速度必须小于等于" + SPEED_MAX_VALUE)
                return
            }
        }
        localStorage.setItem("dz_bilibili_video_custom_speed_setting", input)
        //重新初始化
        init()
    }

    GM_registerMenuCommand("更新倍速设置", updateSpeedSetting, null)

    function getSetSpeedOnLoadSetting() {
        return localStorage.getItem("dz_bilibili_video_custom_speed_set_speed_on_load") == "true"
    }

    function switchSetSpeedOnLoad() {
        localStorage.setItem("dz_bilibili_video_custom_speed_set_speed_on_load", !getSetSpeedOnLoadSetting())
        GM_unregisterMenuCommand(commandId)
        commandId = GM_registerMenuCommand(getSetSpeedOnLoadSetting() ? "记忆倍速：开启（点击关闭）" : "记忆倍速：关闭（点击开启）", switchSetSpeedOnLoad, null)
    }
    let commandId = GM_registerMenuCommand(getSetSpeedOnLoadSetting() ? "记忆倍速：开启（点击关闭）" : "记忆倍速：关闭（点击开启）", switchSetSpeedOnLoad, null)

    let speed = getSetSpeedOnLoadSetting() ? parseFloat(localStorage.getItem("dz_bilibili_video_custom_speed_value")) : 1
    let cacheItem = undefined
    if (isNaN(speed) || speed < SPEED_MIN_VALUE || speed > SPEED_MAX_VALUE) {
        speed = 1
    }
    update()

    function init() {
        let menu = document.querySelector(".bpx-player-ctrl-playbackrate-menu")
        if (!menu) {
            return false
        }
        if (!cacheItem) {
            let item = menu.children[0]
            if (!item) {
                return false
            }
            //复制一个新的
            item = item.cloneNode(false)
            //可能是激活的，去掉激活状态
            item.classList.remove("bpx-state-active")
            cacheItem = item
        }
        
        while (menu.children.length > 0) {
            menu.removeChild(menu.children[0])
        }
        let setting = getSpeedSetting()
        for (let i = setting.length - 1; i >= 0; i--) {
            let value = setting[i]
            let currentItem = document.importNode(cacheItem, false)
            currentItem.innerText = value + "x"
            currentItem.attributes["data-value"].value = parseFloat(value)
            currentItem.addEventListener("click", function(){
                speed = value
                localStorage.setItem("dz_bilibili_video_custom_speed_value", speed)
                let videoObj = document.querySelector("video") ?? document.querySelector("bwp-video")
                if (videoObj) {
                    videoObj.playbackRate = speed
                }
                // 后加的节点b站也会管理，不需要自行切换状态了
                // document.querySelector(".bpx-state-active").classList.remove("bpx-state-active")
                // currentItem.classList.add("bpx-state-active")
            })
            menu.appendChild(currentItem)
        }
        if (!menu.classList.contains("dz_bilibili_video_custom_speed_initialize")) {
            menu.classList.add("dz_bilibili_video_custom_speed_initialize")
        }
        return true
    }

    function update() {
        let videoObj = document.querySelector("video") ?? document.querySelector("bwp-video")
        if (!videoObj) {
            return
        }
        let menu = document.querySelector(".bpx-player-ctrl-playbackrate-menu")
        if (!menu) {
            return
        }
        if (!menu.classList.contains("dz_bilibili_video_custom_speed_initialize")) {
            //未初始化
            if (!init()) {
                return
            }
        }
        if (speed !== videoObj.playbackRate) {
            //切换到了新页面，重新适用倍速
            videoObj.playbackRate = speed
        }
    }

    setInterval(update, 200)
})();
