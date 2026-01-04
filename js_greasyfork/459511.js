// ==UserScript==
// @name         b站视频自动宽屏模式
// @description  b站/哔哩哔哩/bilibili自动宽屏模式
// @version      1.0.2
// @author       hty
// @namespace    https://github.com/HTY-DBY/script-biliRight
// @icon         https://hty.ink/logo.jpg
// @grant        none
// @match        *.bilibili.com/bangumi*
// @match        *.bilibili.com/video*
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/459511/b%E7%AB%99%E8%A7%86%E9%A2%91%E8%87%AA%E5%8A%A8%E5%AE%BD%E5%B1%8F%E6%A8%A1%E5%BC%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/459511/b%E7%AB%99%E8%A7%86%E9%A2%91%E8%87%AA%E5%8A%A8%E5%AE%BD%E5%B1%8F%E6%A8%A1%E5%BC%8F.meta.js
// ==/UserScript==

// @note         1.0.2 描述信息的修改
// @note         1.0.1 描述信息的修改
// @note         1.0.0 这里是版本更新注释

// 宽屏处理
let timer_kp = setInterval(function () {
    if (document.getElementById('bilibili-player')) {
        if (!document.getElementsByClassName('bpx-state-entered')[0]) {
            try {
                document.getElementsByClassName('bpx-player-ctrl-wide')[0].click()
            } catch { }
        }
        if (!document.getElementsByClassName('squirtle-video-widescreen squirtle-video-item active')[0]) {
            try {
                document.getElementsByClassName('squirtle-video-widescreen squirtle-video-item')[0].click()
            } catch { }
        }
        if (!document.getElementsByClassName('bilibili-player-video-btn bilibili-player-video-btn-widescreen closed')[0]) {
            try {
                document.getElementsByClassName('bilibili-player-video-btn bilibili-player-video-btn-widescreen')[0].click()
            } catch { }
        }
        if (getComputedStyle(document.querySelector("#bilibili-player"), null).position == 'relative') {
            clearInterval(timer_kp)
        }
    }
}, 200)

