// ==UserScript==
// @name         B站长按快进模式
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  B站鼠标中键快进模式模拟手机长按快进，可调节任意速率
// @author       Demon
// @match        https://www.bilibili.com/video/*
// @require      https://lf3-cdn-tos.bytecdntp.com/cdn/expire-1-M/limonte-sweetalert2/11.4.4/sweetalert2.all.min.js
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant        GM_registerMenuCommand
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_listValues
// @grant        unsafeWindow
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/448661/B%E7%AB%99%E9%95%BF%E6%8C%89%E5%BF%AB%E8%BF%9B%E6%A8%A1%E5%BC%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/448661/B%E7%AB%99%E9%95%BF%E6%8C%89%E5%BF%AB%E8%BF%9B%E6%A8%A1%E5%BC%8F.meta.js
// ==/UserScript==

;(function () {
    "use strict"
    const key = 'bilibili_quick_rate'
    const v = document.querySelector("video")

    let rate = GM_getValue(key) || 3
    let quick = false;
    let bak = 0;
    let deep = 0;

    document.addEventListener("mousedown", (e) => {
        if (e.button === 1) {
            deep++
            quick = !quick
            if (quick) {
                bak = v.playbackRate
                v.playbackRate = rate // 设置快进速度
            } else {
                v.playbackRate = bak // 恢复之前速度
            }
        }
    })

    // 用于取消快进模式
    document.addEventListener("mouseup", (e) => {
        if (e.button === 1) {
            deep--
            if (deep < 0) {
                deep = 0
                v.playbackRate = bak
                quick = false
            }
        }
    })

    const setVideoQuickRate = async () => {
        let newRate = await Swal.fire({
            title: "设置视频快进模式播放速率，最快16倍率，最慢0相当于暂停",
            input: "range",
            inputAttributes: {
                min: 0,
                max: 16,
                step: 0.1,
            },
            inputValue: +rate,
        })

        if (newRate.isConfirmed) {
            rate = +newRate.value
            GM_setValue(key, rate);
            Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: `设置成功，当前采用速率为: ${rate}`,
                showConfirmButton: false,
                timer: 1500
            })
        }
    }

    GM_registerMenuCommand("设置快进速率", () => setVideoQuickRate())
})()
