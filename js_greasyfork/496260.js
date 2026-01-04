// ==UserScript==
// @name 移动端微软Rewards每日任务脚本 随机暂停 自动运行
// @version V7.2
// @description 自动运行，每次搜索后随机暂停 2~10分钟，带搜索进度悬浮提示，约3小时完成。
// @author 789cn
// @match https://*.bing.com/*
// @license GNU GPLv3
// @icon https://www.bing.com/favicon.ico
// @connect gumengya.com
// @run-at document-end
// @note 更新于 2026年01月02日
// @supportURL https://greasyfork.org/zh-TW/users/159588-789cn
// @homepageURL https://greasyfork.org/zh-TW/users/159588-789cn
// @grant GM_registerMenuCommand
// @grant GM_addStyle
// @grant GM_openInTab
// @grant GM_setValue
// @grant GM_getValue
// @grant GM_xmlhttpRequest
// @namespace https://greasyfork.org/zh-TW/users/159588-789cn
// @downloadURL https://update.greasyfork.org/scripts/496260/%E7%A7%BB%E5%8A%A8%E7%AB%AF%E5%BE%AE%E8%BD%AFRewards%E6%AF%8F%E6%97%A5%E4%BB%BB%E5%8A%A1%E8%84%9A%E6%9C%AC%20%E9%9A%8F%E6%9C%BA%E6%9A%82%E5%81%9C%20%E8%87%AA%E5%8A%A8%E8%BF%90%E8%A1%8C.user.js
// @updateURL https://update.greasyfork.org/scripts/496260/%E7%A7%BB%E5%8A%A8%E7%AB%AF%E5%BE%AE%E8%BD%AFRewards%E6%AF%8F%E6%97%A5%E4%BB%BB%E5%8A%A1%E8%84%9A%E6%9C%AC%20%E9%9A%8F%E6%9C%BA%E6%9A%82%E5%81%9C%20%E8%87%AA%E5%8A%A8%E8%BF%90%E8%A1%8C.meta.js
// ==/UserScript==
 
var max_rewards = Math.floor(Math.random() * (33 - 30 + 1)) + 30; // 随机每次搜索总次数
var search_words = []; // 搜索词
var appkey = "";// 从 https://www.gmya.net/api 网站申请的热门词接口APIKEY
var Hot_words_apis = "https://api.gmya.net/Api/"; // 故梦热门词API接口网站
 
var default_search_words = [
    "盛年不重来，一日难再晨", "千里之行，始于足下", "少年易学老难成，一寸光阴不可轻", "敏而好学，不耻下问",
    "海内存知已，天涯若比邻", "三人行，必有我师焉", "莫愁前路无知已，天下谁人不识君", "人生贵相知，何用金与钱",
    "天生我材必有用", "海纳百川有容乃大；壁立千仞无欲则刚", "穷则独善其身，达则兼济天下", "读书破万卷，下笔如有神",
    "学而不思则罔，思而不学则殆", "一年之计在于春，一日之计在于晨", "莫等闲，白了少年头，空悲切",
    "少壮不努力，老大徒伤悲", "一寸光阴一寸金，寸金难买寸光阴", "近朱者赤，近墨者黑",
    "吾生也有涯，而知也无涯", "纸上得来终觉浅，绝知此事要躬行", "学无止境", "己所不欲，勿施于人",
    "天将降大任于斯人也", "鞠躬尽瘁，死而后已", "书到用时方恨少", "天下兴亡，匹夫有责",
    "人无远虑，必有近忧", "为中华之崛起而读书", "一日无书，百事荒废", "岂能尽如人意，但求无愧我心",
    "人生自古谁无死，留取丹心照汗青", "吾生也有涯，而知也无涯", "生于忧患，死于安乐"
];
 
var keywords_source = ['ZhiHuHot','WeiBoHot','TouTiaoHot','DouYinHot', 'BaiduHot'];
var random_keywords_source = keywords_source[Math.floor(Math.random() * keywords_source.length)];
 
// 添加悬浮提示样式
GM_addStyle(`
    #rewards-progress {
        position: fixed;
        bottom: 10px;
        right: 10px;
        background: rgba(0,0,0,0.7);
        color: #fff;
        padding: 5px 10px;
        border-radius: 5px;
        z-index: 9999;
        font-size: 14px;
        font-family: sans-serif;
    }
`);
 
function douyinhot_dic() {
    let url;
    if (appkey) {
        url = Hot_words_apis + random_keywords_source + "?format=json&appkey=" + appkey;
    } else {
        url = Hot_words_apis + random_keywords_source;
    }
    return new Promise((resolve, reject) => {
        fetch(url)
            .then(response => response.json())
            .then(data => {
                if (data.data.some(item => item)) {
                    const names = data.data.map(item => item.title);
                    resolve(names);
                } else {
                    resolve(default_search_words);
                }
            })
            .catch(error => {
                resolve(default_search_words);
                reject(error);
            });
    });
}
 
// 检查并每天 0 点重置计数器
function checkAndResetDaily() {
    const today = new Date().toDateString();
    const lastReset = GM_getValue('lastReset', '');
    if (lastReset !== today) {
        GM_setValue('Cnt', 0);
        GM_setValue('lastReset', today);
        GM_setValue('stopped', false);
        max_rewards = Math.floor(Math.random() * (33 - 30 + 1)) + 30;
    }
}
 
// 创建或更新悬浮提示
function updateProgress(count) {
    let progressDiv = document.getElementById('rewards-progress');
    if (!progressDiv) {
        progressDiv = document.createElement('div');
        progressDiv.id = 'rewards-progress';
        document.body.appendChild(progressDiv);
    }
    progressDiv.innerText = `搜索进度: ${count} / ${max_rewards}`;
}
 
// 自动启动
douyinhot_dic().then(names => {
    search_words = names;
    checkAndResetDaily();
    exec();
}).catch(error => console.error(error));
 
// 菜单命令
GM_registerMenuCommand('开始', function () {
    GM_setValue('stopped', false);
    checkAndResetDaily();
    location.href = "https://www.bing.com/?br_msg=Please-Wait";
}, 'o');
 
GM_registerMenuCommand('停止', function () {
    GM_setValue('stopped', true);
    console.log("已停止运行");
}, 'o');
 
// 随机字符串生成
function generateRandomString(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}
 
function exec() {
    if (GM_getValue('stopped', false)) {
        console.log("检测到停止标志，脚本终止。");
        return;
    }
 
    let randomDelay = Math.floor(Math.random() * 20000) + 10000; // 10-30秒
    let randomString = generateRandomString(4);
    let randomCvid = generateRandomString(32);
 
    if (GM_getValue('Cnt') == null) GM_setValue('Cnt', 0);
    let currentSearchCount = GM_getValue('Cnt');
 
    // 更新悬浮提示
    updateProgress(currentSearchCount);
 
    if (currentSearchCount < max_rewards) {
        currentSearchCount++;
        GM_setValue('Cnt', currentSearchCount);
 
        let tt = document.getElementsByTagName("title")[0];
        tt.innerHTML = `[${currentSearchCount} / ${max_rewards}] ${tt.innerHTML}`;
        smoothScrollToBottom();
 
        setTimeout(function () {
            if (GM_getValue('stopped', false)) return;
            let nowtxt = search_words[currentSearchCount - 1];
            let searchUrl = currentSearchCount < max_rewards / 2
                ? `https://www.bing.com/search?q=${encodeURI(nowtxt)}&form=${randomString}&cvid=${randomCvid}`
                : `https://cn.bing.com/search?q=${encodeURI(nowtxt)}&form=${randomString}&cvid=${randomCvid}`;
 
            let pause_time = Math.floor(Math.random() * (600000 - 120000 + 1)) + 120000; // 随机暂停2-10分钟
            setTimeout(function() { if (!GM_getValue('stopped', false)) location.href = searchUrl; }, pause_time);
        }, randomDelay);
    }
 
    // 定时器：每天0点重启
    const now = new Date();
    const msUntilMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1).getTime() - now.getTime();
    setTimeout(function () {
        checkAndResetDaily();
        douyinhot_dic().then(names => {
            search_words = names;
            exec();
        });
    }, msUntilMidnight);
 
    function smoothScrollToBottom() {
        document.documentElement.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
}