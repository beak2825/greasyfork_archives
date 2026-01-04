// ==UserScript==
// @name         Microsoft Bing Rewards每日任務腳本
// @version      V2.0.1.13
// @description  自動完成微軟Rewards每日搜索任務,適合繁體寶寶體質。
// @author       干旱受音
// @match        https://www.bing.com/*
// @license      GNU GPLv3
// @icon         https://www.bing.com/favicon.ico
// @run-at       document-end
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @require      https://unpkg.com/toastify-js@1.11.2/src/toastify-js
// @namespace    https://greasyfork.org/zh-TW/scripts/499413
// @downloadURL https://update.greasyfork.org/scripts/523809/Microsoft%20Bing%20Rewards%E6%AF%8F%E6%97%A5%E4%BB%BB%E5%8B%99%E8%85%B3%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/523809/Microsoft%20Bing%20Rewards%E6%AF%8F%E6%97%A5%E4%BB%BB%E5%8B%99%E8%85%B3%E6%9C%AC.meta.js
// ==/UserScript==

// 引入 Toastify 的 CSS
GM_addStyle(`
@import url("https://cdn.jsdelivr.net/npm/toastify-js/src/toastify.min.css")
`);

function toast(text, backgroundColor) {
    Toastify({
        text,
        backgroundColor,
        duratio:3000, // ms
    }).showToast();
}

function toast_succ(text) {
    toast(text, "linear-gradient(to right, #00b09b, #96c93d)")

}
function toast_fail(text) {
    toast(text, "linear-gradient(to right, #cb3060, #cd39a6)")
}

var query_home = "https://www.bing.com/search?q=";
var delay_base = 5000 //5000 // 延遲時間 ms
//var start_cnt = 25 // 起始計數
//==
var max_rewards = GM_getValue('Max') || 30; // 執行總次數
//每執行4次搜索後插入暫停時間,解決帳號被監控不增加積分的問題
var pause_time = 6000 //6000; // 暫停時長建議為10分鐘（600000毫秒=10分鐘）
var search_words = []; //搜索詞

const ALPHA_DIGI = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
const ALPHA_LOWER = 'abcdefghijklmnopqrstuvwxyz';

async function timer(t) {
    return new Promise(reso=>{
        setTimeout(reso, t)
    })
}
function randIntInc(n, s=0) { // rand int inclusive
    return ((Math.random() * (n+1)) | 0) + s
}
function randInt(n, s=0) { // rand int
    return ((Math.random() * n) | 0) + s
}
// 生成指定長度的包含大寫字母、小寫字母和數字的隨機字符串
function randString(characters, length) {
    return Array(length).fill().map(_=>randInt(characters.length)).map(i=>characters.charAt(i)).join('');
}
// 生成指定長度的拼音碼
function randPinyin(length) {
    return randString(ALPHA_LOWER, length);
}

async function googlepinyin(pinyin) {
    let b_url = `https://inputtools.google.com/request?text=${pinyin}&itc=zh-hant-t-i0-pinyin&num=1&ie=utf-8&oe=utf-8&app=demopage`
    try {
        let response = await fetch(b_url)
        let text = await response.json()
        return text[1][0][1][0]
     } catch (error) {
         console.error('拼音碼轉換請求失敗:', error);
         return pinyin
     }
}

async function make_pinyin_dict(n) {
 const f = _ => googlepinyin(randPinyin(randInt(4,3)))
 return Promise.all(Array(n).fill().map(f))
}

/**/
async function load_dict(n) {
    if (window.name == '') {
        const words = await make_pinyin_dict(n)
        window.name = JSON.stringify(words)
        console.log('name prop is set with:', window.name)
    }
    search_words = JSON.parse(window.name)
}

function page_load() {
    let currentSearchCount = GM_getValue('Cnt');
    console.log("次數:" + currentSearchCount);
    if (currentSearchCount < max_rewards ) {
        load_dict(max_rewards)
            .then(exec)
    } else {
        window.name = ''
        toast_succ("未開始或已完成")
    }
}
page_load()

// 定義菜單命令：停止
const menuClose = GM_registerMenuCommand('停止', function () {
    GM_setValue('Cnt', max_rewards); // 將計數器設置為超過最大搜索次數，以停止搜索
}, 'x');

// 定義菜單命令：開始搜索
const menuStart30 = GM_registerMenuCommand('搜索30次', function () {
    GM_setValue('Cnt', 0); // 將計數器重置為0
    GM_setValue('Max', 30); // 設置最大計數器
    page_load()
}, 'd');

const menuStart20 = GM_registerMenuCommand('搜索20次', function () {
    GM_setValue('Cnt', 0); // 將計數器重置為0
    GM_setValue('Max', 20); // 設置最大計數器
    page_load()
}, 'm');

const menuStartL = GM_registerMenuCommand(`歷史次數（${max_rewards}次）搜索`, function () {
    GM_setValue('Cnt', 0); // 將計數器重置為0
    page_load()
}, 'L');

 // 在新的窗口中使用 prompt
const menuStartN = GM_registerMenuCommand("指定次數搜索（在新窗口中輸入數字）", function() {
    const newWindow = window.open("", "_blank");
    if (!newWindow) {
        toast_fail("無法打開新窗口，請檢查瀏覽器設置！");
        return
    }

    const userInput = newWindow.prompt("請輸入內容：", max_rewards);
    newWindow.close();

    const t = parseInt(userInput)
    if (isNaN(parseInt(t))) {
        toast_fail("未輸入或格式錯誤");
        return
    }

    console.log("輸入的搜索次數：", t);
    toast_succ(`輸入的搜索次數：${t}`);

    if (0 < t <= 30) {
        max_rewards = t
    }

    GM_setValue('Cnt', 0); // 將計數器重置為0
    GM_setValue('Max', max_rewards); // 將計數器重置為0
    page_load()

}, "n"); // "n" 是快捷鍵，您可以根據需要設置


async function exec() {
    // 生成隨機延遲時間
    let randomDelay = randIntInc(delay_base, delay_base + 2000); // 10000 毫秒 = 10 秒
    let randomString = randString(ALPHA_DIGI, 4); //生成4個長度的隨機字符串
    let randomCvid = randString(ALPHA_DIGI, 32); //生成32位長度的cvid
    'use strict';

    // 檢查計數器的值，若為空則設置為超過最大搜索次數
    if (GM_getValue('Cnt') == null) {
        GM_setValue('Cnt', max_rewards);
    }
    if (GM_getValue('Cnt') > max_rewards) {
        console.log("loop 結束")
        return
    }

    // 獲取當前搜索次數
    let currentSearchCount = GM_getValue('Cnt');

    // 根據計數器的值選擇搜索引擎
    let tt = document.getElementsByTagName("title")[0];
    tt.innerHTML = "[" + currentSearchCount + " / " + max_rewards + "] " + tt.innerHTML; // 在標題中顯示當前搜索次數

    await timer(randomDelay)

    if (GM_getValue('Cnt') < max_rewards) {
        GM_setValue('Cnt', currentSearchCount + 1); // 將計數器加1
    }

    let nowtxt = search_words[currentSearchCount]; // 獲取當前搜索詞
    let href = query_home + encodeURI(nowtxt) + "&form=" + randomString + "&cvid=" + randomCvid; // 在Bing搜索引擎中搜索

    // 檢查是否需要暫停
    if ((currentSearchCount + 1) % 5 === 0) {
        // 暫停指定時長
        await timer(pause_time)
    }
    location.href = href // 在Bing搜索引擎中搜索
}