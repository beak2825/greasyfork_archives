// ==UserScript==
// @name         Microsoft Bing Rewards每日任务脚本 随机暂停 
// @name:zh-TW   Microsoft Bing Rewards每日任務腳本 隨機暫停 
// @name:en      Microsoft Bing Rewards Daily Task Script
// @version      V7.2.1
// @description  自动完成微软Rewards每日搜索任务，随机暂停时间，增加搜索行为的自然性，约100分钟完成。
// @description:zh-TW 自動完成微軟Rewards每日搜索任務，隨機暫停時間，增加搜索行為的自然性，約100分鐘完成。
// @description:en  Automatically complete Microsoft Rewards daily search tasks, with random pause times to enhance the naturalness of search behavior, approximately 100 minutes to complete, enhancing the naturalness of search behavior.
// @note         更新于 2025年10月02日
// @author       789cn
// @match        https://*.bing.com/*
// @exclude      https://rewards.bing.com/*
// @license      GNU GPLv3
// @icon         https://www.bing.com/favicon.ico
// @connect      gumengya.com
// @run-at       document-end
// @grant        GM_registerMenuCommand
// @grant        GM_addStyle
// @grant        GM_openInTab
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @namespace    https://greasyfork.org/zh-TW/scripts/496117
// @downloadURL https://update.greasyfork.org/scripts/496117/Microsoft%20Bing%20Rewards%E6%AF%8F%E6%97%A5%E4%BB%BB%E5%8A%A1%E8%84%9A%E6%9C%AC%20%E9%9A%8F%E6%9C%BA%E6%9A%82%E5%81%9C.user.js
// @updateURL https://update.greasyfork.org/scripts/496117/Microsoft%20Bing%20Rewards%E6%AF%8F%E6%97%A5%E4%BB%BB%E5%8A%A1%E8%84%9A%E6%9C%AC%20%E9%9A%8F%E6%9C%BA%E6%9A%82%E5%81%9C.meta.js
// ==/UserScript==

// 更新日志: 2025-10-02: 修改为每次搜索随机暂停1-3分钟，每3-5次搜索随机暂停5-8分钟，总搜索次数随机30-33次。

var max_rewards = Math.floor(Math.random() * (33 - 30 + 1)) + 30; // 随机每次搜索总次数
var big_pause = Math.floor(Math.random() * (480000 - 300000 + 1)) + 300000; // 随机大暂停时间（5到8分钟）
var search_words = []; // 搜索词
var appkey = ""; // APIKEY
var Hot_words_apis = "https://api.gmya.net/Api/";

var default_search_words = [
    "盛年不重来，一日难再晨", "千里之行，始于足下", "少年易学老难成，一寸光阴不可轻", "敏而好学，不耻下问", "海内存知已，天涯若比邻",
    "三人行，必有我师焉", "莫愁前路无知已，天下谁人不识君", "人生贵相知，何用金与钱", "天生我材必有用", "海纳百川有容乃大；壁立千仞无欲则刚",
    "穷则独善其身，达则兼济天下", "读书破万卷，下笔如有神", "学而不思则罔，思而不学则殆", "一年之计在于春，一日之计在于晨",
    "莫等闲，白了少年头，空悲切", "少壮不努力，老大徒伤悲", "一寸光阴一寸金，寸金难买寸光阴", "近朱者赤，近墨者黑",
    "吾生也有涯，而知也无涯", "纸上得来终觉浅，绝知此事要躬行", "学无止境", "己所不欲，勿施于人", "天将降大任于斯人也",
    "鞠躬尽瘁，死而后已", "书到用时方恨少", "天下兴亡，匹夫有责", "人无远虑，必有近忧", "为中华之崛起而读书", "一日无书，百事荒废",
    "岂能尽如人意，但求无愧我心", "人生自古谁无死，留取丹心照汗青", "生于忧患，死于安乐", "言必信，行必果", "夫君子之行，静以修身，俭以养德",
    "老骥伏枥，志在千里", "一日不读书，胸臆无佳想", "王侯将相宁有种乎", "淡泊以明志。宁静而致远", "卧龙跃马终黄土"
];

var keywords_source = ['BaiduHot', 'TouTiaoHot', 'DouYinHot', 'WeiBoHot'];
var current_source_index = 0;

// ================== 每日重置 ==================
function checkAndResetDaily() {
    const today = new Date().toDateString();
    const lastReset = GM_getValue('lastReset', '');
    if (lastReset !== today) {
        GM_setValue('Cnt', 0);
        GM_setValue('lastReset', today);
        GM_setValue('stopped', false);
        max_rewards = Math.floor(Math.random() * (33 - 30 + 1)) + 30;
        big_pause = Math.floor(Math.random() * (480000 - 300000 + 1)) + 300000;
        GM_setValue('next_interval', Math.floor(Math.random() * (5 - 3 + 1)) + 3);
        GM_setValue('searches_since_big', 0);
        return true;
    }
    return false;
}

// ================== 获取热门搜索词 ==================
async function douyinhot_dic() {
    while (current_source_index < keywords_source.length) {
        const source = keywords_source[current_source_index];
        let url = appkey ? Hot_words_apis + source + "?format=json&appkey=" + appkey : Hot_words_apis + source;
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error('HTTP error! status: ' + response.status);
            const data = await response.json();
            if (data.data.some(item => item)) return data.data.map(item => item.title);
        } catch (error) {
            console.error('搜索词来源请求失败:', error);
        }
        current_source_index++;
    }
    console.error('所有搜索词来源请求失败');
    return default_search_words;
}

// ================== 菜单 ==================
GM_registerMenuCommand('开始', function () {
    GM_setValue('stopped', false);
    // ✅ 不再强制清零，保持计数器延续
    checkAndResetDaily();
    location.href = "https://www.bing.com/?br_msg=Please-Wait";
}, 'o');

GM_registerMenuCommand('停止', function () {
    GM_setValue('stopped', true);
    console.log("已停止运行");
}, 'o');

// ================== 工具函数 ==================
function AutoStrTrans(st) {
    let yStr = st, rStr = "", zStr = "", prePo = 0;
    for (let i = 0; i < yStr.length;) {
        let step = parseInt(Math.random() * 5) + 1;
        if (i > 0) {
            zStr = zStr + yStr.substr(prePo, i - prePo) + rStr;
            prePo = i;
        }
        i = i + step;
    }
    if (prePo < yStr.length) zStr = zStr + yStr.substr(prePo, yStr.length - prePo);
    return zStr;
}

function generateRandomString(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < length; i++) result += characters.charAt(Math.floor(Math.random() * characters.length));
    return result;
}

// ================== 悬浮搜索进度提示 ==================
(function () {
    'use strict';
    const floatDiv = document.createElement('div');
    floatDiv.id = 'bingSearchProgress';
    floatDiv.innerText = '[0 / ' + max_rewards + ']';
    document.body.appendChild(floatDiv);

    GM_addStyle(`
        #bingSearchProgress {
            position: fixed;
            top: 100px;   /* 下移 */
            right: 20px;
            z-index: 9999;
            background: rgba(0,0,0,0.6);
            color: #fff;
            font-size: 18px;
            font-weight: bold;
            padding: 12px 18px;
            border-radius: 10px;
            box-shadow: 0 0 12px rgba(0,0,0,0.5);
            pointer-events: none;
        }
    `);

    function updateProgress() {
        const currentSearchCount = GM_getValue('Cnt', 0);
        floatDiv.innerText = `[${currentSearchCount} / ${max_rewards}]`;
    }

    setInterval(updateProgress, 1000);
    window.updateBingSearchProgress = updateProgress;
})();

// ================== 主执行 ==================
function exec() {
    if (GM_getValue('stopped', false)) {
        console.log("检测到停止标志，脚本终止。");
        return;
    }

    let randomDelay = Math.floor(Math.random() * 20000) + 10000;
    let randomString = generateRandomString(4);
    let randomCvid = generateRandomString(32);

    if (GM_getValue('Cnt') == null) GM_setValue('Cnt', 0);
    let currentSearchCount = GM_getValue('Cnt');

    if (currentSearchCount < max_rewards) {
        // ✅ 修复计数器不同步：先递增
        currentSearchCount++;
        GM_setValue('Cnt', currentSearchCount);

        let tt = document.getElementsByTagName("title")[0];
        tt.innerHTML = "[" + currentSearchCount + " / " + max_rewards + "] " + tt.innerHTML;
        smoothScrollToBottom();

        setTimeout(function () {
            if (GM_getValue('stopped', false)) return;
            let nowtxt = search_words[currentSearchCount - 1];
            nowtxt = AutoStrTrans(nowtxt);
            let searchUrl = currentSearchCount < max_rewards / 2
                ? `https://www.bing.com/search?q=${encodeURI(nowtxt)}&form=${randomString}&cvid=${randomCvid}`
                : `https://cn.bing.com/search?q=${encodeURI(nowtxt)}&form=${randomString}&cvid=${randomCvid}`;
            let small_pause = Math.floor(Math.random() * (180000 - 60000 + 1)) + 60000; // 随机小暂停1-3分钟
            let total_pause = small_pause;
            let since = GM_getValue('searches_since_big', 0);
            let interval = GM_getValue('next_interval', 3);
            since++;
            if (since >= interval) {
                total_pause += big_pause;
                since = 0;
                let new_interval = Math.floor(Math.random() * (5 - 3 + 1)) + 3;
                GM_setValue('next_interval', new_interval);
            }
            GM_setValue('searches_since_big', since);
            setTimeout(function () { if (!GM_getValue('stopped', false)) location.href = searchUrl; }, total_pause);
        }, randomDelay);
    }

    // 次日零点自动重置
    const now = new Date();
    const msUntilMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1).getTime() - now.getTime();
    setTimeout(function () {
        if (checkAndResetDaily()) {
            douyinhot_dic().then(names => {
                search_words = names;
                exec();
            }).catch(console.error);
        }
    }, msUntilMidnight);

    function smoothScrollToBottom() {
        document.documentElement.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
}

// ================== 初始化 ==================
douyinhot_dic().then(names => {
    search_words = names;
    checkAndResetDaily();
    exec();
}).catch(console.error);