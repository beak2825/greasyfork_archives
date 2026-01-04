// ==UserScript==
// @name         summer
// @version      2.1.0
// @description  自动收菜
// @note         更新于 2024年12月
// @author       怀沙
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
// @namespace    https://greasyfork.org/zh-CN/scripts/477107
// @downloadURL https://update.greasyfork.org/scripts/524024/summer.user.js
// @updateURL https://update.greasyfork.org/scripts/524024/summer.meta.js
// ==/UserScript==

var max_rewards = 30; //重复执行的次数
var pause_time = 60000; // 暂停时长建议为16分钟,也就是960000(60000毫秒=1分钟)
var search_words = []; //搜索词
var appkey = "610295eae2ef7d108331fcac1bd6bd4b"; //从api.gumengya.com网站申请的热门词接口APIKEY
var Hot_words_apis = "https://api.gumengya.com/Api/";

var default_search_words = [
    "盛年不重来，一日难再晨", "千里之行，始于足下", "少年易学老难成，一寸光阴不可轻", 
    "敏而好学，不耻下问", "海内存知已，天涯若比邻", "三人行，必有我师焉",
    "莫愁前路无知已，天下谁人不识君", "人生贵相知，何用金与钱", "天生我材必有用", 
    "海纳百川有容乃大；壁立千仞无欲则刚", "穷则独善其身，达则兼济天下", "读书破万卷，下笔如有神",
    "学而不思则罔，思而不学则殆", "一年之计在于春，一日之计在于晨", "莫等闲，白了少年头，空悲切", 
    "少壮不努力，老大徒伤悲", "一寸光阴一寸金，寸金难买寸光阴", "近朱者赤，近墨者黑",
    "吾生也有涯，而知也无涯", "纸上得来终觉浅，绝知此事要躬行", "学无止境", "己所不欲，勿施于人", 
    "天将降大任于斯人也", "鞠躬尽瘁，死而后已", "书到用时方恨少", "天下兴亡，匹夫有责",
    "人无远虑，必有近忧", "为中华之崛起而读书", "一日无书，百事荒废", "岂能尽如人意，但求无愧我心", 
    "人生自古谁无死，留取丹心照汗青", "吾生也有涯，而知也无涯", "生于忧患，死于安乐",
    "言必信，行必果", "读书破万卷，下笔如有神", "夫君子之行，静以修身，俭以养德", "老骥伏枥，志在千里", 
    "一日不读书，胸臆无佳想", "王侯将相宁有种乎", "淡泊以明志。宁静而致远,", "卧龙跃马终黄土"
];

var keywords_source = ['BaiduHot', 'TouTiaoHot', 'DouYinHot', 'WeiBoHot'];
var random_keywords_source = keywords_source[Math.floor(Math.random() * keywords_source.length)];
var current_source_index = 0;

async function douyinhot_dic() {
    while (current_source_index < keywords_source.length) {
        const source = keywords_source[current_source_index];
        let url;
        if (appkey) {
            url = Hot_words_apis + source + "?format=json&appkey=" + appkey;
        } else {
            url = Hot_words_apis + source;
        }
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('HTTP error! status: ' + response.status);
            }
            const data = await response.json();

            if (data.data.some(item => item)) {
                const names = data.data.map(item => item.title);
                return names;
            }
        } catch (error) {
            console.error('搜索词来源请求失败:', error);
        }

        current_source_index++;
    }

    console.error('所有搜索词来源请求失败');
    return default_search_words;
}

douyinhot_dic()
    .then(names => {
        search_words = names;
        exec();
    })
    .catch(error => {
        console.error(error);
    });

let menu1 = GM_registerMenuCommand('开始', function () {
    GM_setValue('Cnt', 0);
    location.href = "https://www.bing.com/?br_msg=Please-Wait";
}, 'o');

let menu2 = GM_registerMenuCommand('停止', function () {
    GM_setValue('Cnt', max_rewards + 10);
}, 'o');

function AutoStrTrans(st) {
    let yStr = st;
    let rStr = "";
    let zStr = "";
    let prePo = 0;
    for (let i = 0; i < yStr.length;) {
        let step = parseInt(Math.random() * 5) + 1;
        if (i > 0) {
            zStr = zStr + yStr.substr(prePo, i - prePo) + rStr;
            prePo = i;
        }
        i = i + step;
    }
    if (prePo < yStr.length) {
        zStr = zStr + yStr.substr(prePo, yStr.length - prePo);
    }
    return zStr;
}

function generateRandomString(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

function exec() {
    let randomDelay = Math.floor(Math.random() * 20000) + 10000;
    let randomString = generateRandomString(4);
    let randomCvid = generateRandomString(32);

    let currentSearchCount = GM_getValue('Cnt', 0); // 获取当前搜索次数，默认为0
    if (currentSearchCount >= max_rewards) {
        GM_setValue('Cnt', 0); // 重置计数器
        currentSearchCount = 0;
    }

    let tt = document.getElementsByTagName("title")[0];
    tt.innerHTML = "[" + currentSearchCount + " / " + max_rewards + "] " + tt.innerHTML;
    smoothScrollToBottom();
    GM_setValue('Cnt', currentSearchCount + 1); // 将计数器加1

    setTimeout(function () {
        let nowtxt = search_words[currentSearchCount];
        nowtxt = AutoStrTrans(nowtxt);
        if ((currentSearchCount + 1) % 5 === 0) {
            setTimeout(function () {
                location.href = "https://www.bing.com/search?q=" + encodeURI(nowtxt) + "&form=" + randomString + "&cvid=" + randomCvid;
            }, pause_time);
        } else {
            location.href = "https://www.bing.com/search?q=" + encodeURI(nowtxt) + "&form=" + randomString + "&cvid=" + randomCvid;
        }
    }, randomDelay);
}

function smoothScrollToBottom() {
    document.documentElement.scrollIntoView({ behavior: 'smooth', block: 'end' });
}
