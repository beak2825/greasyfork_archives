// ==UserScript==
// @name         得勝者移除學號浮水印
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  移除學號浮水印、自訂學號
// @author       You
// @match        https://*.jrbooks.com.tw/sweb/videoPlay.php
// @icon         https://www.google.com/s2/favicons?sz=64&domain=jrbooks.com.tw
// @grant        unsafeWindow
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/457082/%E5%BE%97%E5%8B%9D%E8%80%85%E7%A7%BB%E9%99%A4%E5%AD%B8%E8%99%9F%E6%B5%AE%E6%B0%B4%E5%8D%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/457082/%E5%BE%97%E5%8B%9D%E8%80%85%E7%A7%BB%E9%99%A4%E5%AD%B8%E8%99%9F%E6%B5%AE%E6%B0%B4%E5%8D%B0.meta.js
// ==/UserScript==

// match 這兩個網頁
// https://victor1.jrbooks.com.tw/sweb/play.php  這個好像不用
// https://victor1.jrbooks.com.tw/sweb/videoPlay.php  好像這個就可以了
console.log('start!')
GM_addStyle('.vjs-watermark{display:none !important}')  // 隱藏

// 移除 所有 vjs-watermark 的元素 但應該只有一個
let vjs_watermark_timer = setInterval(function() {
    let watermark = document.querySelectorAll('.vjs-watermark')
    // let watermark = document.querySelectorAll('.sButton')  // 測試用
    if (watermark.length) {
        console.log(`找到 ${watermark.length} 個 vjs-watermark 元素`);
        // clearTimeout(tmrShowWatermark)  // 結束不斷更新的 watermark
        // markId = "666666"  // 修改學號
        for (let i = 0; i < watermark.length; i++) {
            // console.log(watermark[i])
            watermark[i].remove()
        }
        console.log('vjs_watermark 元素已移除, vjs_watermark_timer 停止');
        clearInterval(vjs_watermark_timer)
    }
}, 1000)

// 移除 不斷再生的tmrShowWatermark
let remove_tmrShowWatermark_timer = setInterval(function() {
    // console.log(`typeof tmrShowWatermark, ${typeof unsafeWindow.tmrShowWatermark}`);
    if (typeof tmrShowWatermark != 'undefined') {
        clearTimeout(tmrShowWatermark)  // 結束不斷更新的 watermark
        console.log('tmrShowWatermark 已終止, remove_tmrShowWatermark_timer 停止');
        clearInterval(remove_tmrShowWatermark_timer)
    }
}, 1000)

// 修改成自訂學號
let replace_ID_timer = setInterval(function() {
    // console.log(`typeof markId, ${typeof unsafeWindow.markId}`);
    if (typeof markId != 'undefined') {
        markId = "666666"  // 修改學號
        console.log(`學號已更改為 ${markId} , replace_ID_timer 停止`);
        clearInterval(replace_ID_timer)
    }
}, 1000)

console.log('end!')