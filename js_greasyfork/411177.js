// ==UserScript==
// @name         JAVSEEN.TV 儲存捷徑助手 v1.00
// @namespace    https://www.facebook.com/airlife917339
// @version      1.00
// @description  feel free to donate BTC: 1xb8F4x76ptN2H9MUAhZjvofKw2im1sdq
// @author       Kevin Chang
// @match        https://javseen.tv/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/411177/JAVSEENTV%20%E5%84%B2%E5%AD%98%E6%8D%B7%E5%BE%91%E5%8A%A9%E6%89%8B%20v100.user.js
// @updateURL https://update.greasyfork.org/scripts/411177/JAVSEENTV%20%E5%84%B2%E5%AD%98%E6%8D%B7%E5%BE%91%E5%8A%A9%E6%89%8B%20v100.meta.js
// ==/UserScript==

// 版本: 1.00
// 最後更新: 2020-09-10
// 更新內容: 標題過長時，自動縮減

// 取得網頁標題字串
var title = document.querySelector('head > title').innerText
// 取得標題字元長度
var title_len = title.length
// 如果網頁標題長度過長才縮短
if(title_len >= 100) {
    shorten_title()
}

function shorten_title() {
    // 宣告迴圈初始值
    var i;
    // 宣告JAV id為字串
    var jav_id = '';
    // 取得第一個空白以前的字串即為JAV id
    for(i = 0; i < title_len; i++) {
        if(title[i] !== ' ') {
            jav_id += title[i]
        } else {
            break;
        }
    }
    // 宣告新的標題為 jav_id - JavSeen.Tv
    var new_title = jav_id + ' - JavSeen.Tv';
    // 更改網頁標題
    document.querySelector('head > title').innerText = new_title
}