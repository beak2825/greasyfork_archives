// ==UserScript==
// @name         Chainflix自动切换视频
// @namespace    Chainflix_yier
// @version      0.2
// @description  Chainflix自动切换视频，minutes这个参数可调节每个视频停留时间，适配H5和Web端
// @author       yier qq:3074117452
// @match        https://m.chainflix.net/*
// @match        https://www.chainflix.net/*
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/502095/Chainflix%E8%87%AA%E5%8A%A8%E5%88%87%E6%8D%A2%E8%A7%86%E9%A2%91.user.js
// @updateURL https://update.greasyfork.org/scripts/502095/Chainflix%E8%87%AA%E5%8A%A8%E5%88%87%E6%8D%A2%E8%A7%86%E9%A2%91.meta.js
// ==/UserScript==

(function () {
    var minutes = 10 //每个视频停留分钟数
    var Loop = minutes * 60
    var Keetime = Loop
    var initialize_video = false
    setInterval(function () {
        var button_click = document.querySelector("#contentPlayer > div.player-ternal > div:nth-child(3) > div > div.col.pt-2.px-4 > div > div:nth-child(2) > button > span > div")
        var span_text = document.querySelector("#app > div > main > div > div > div.row.fill-height.no-gutters.overflow-x-hidden > div > div > div.content-info-area_0dp\\+W > div.row.no-gutters.mt-6.flex-nowrap.overflow-hidden.flex-column.flex-lg-row > div.col.pr-lg-4 > p > span")
        if (initialize_video == true) {
            var video_ended = document.getElementById("contentPlayer_html5_api")
            if (video_ended != null) {
                initialize_video = null
                if(video_ended.muted == false){
                    video_ended.muted = true //强制静音视频
                }
                video_ended.addEventListener("ended", function () {
                    Keetime = Loop
                    button_click.click()
                })
            }
        } //挂载视频播放结束事件 自动切换下一个视频
        if (button_click == null) {
            Keetime = Loop
            initialize_video = false
        } else {
            Keetime = Keetime - 1
            if (Keetime <= 0) {
                Keetime = Loop
                button_click.click()
            } else {
                if(initialize_video == false){
                    initialize_video = true
                }
                if (span_text != null) {
                    span_text.innerText = Keetime + " 秒后自动切换下一个视频"
                }
            }
        }
    }, 1000)
})();
