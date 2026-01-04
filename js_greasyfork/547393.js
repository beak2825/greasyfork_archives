// ==UserScript==
// @name Microsoft Bing Rewards每日任务脚本 自动运行
// @name:zh-TW Microsoft Bing Rewards每日任務腳本 自动运行
// @name:en Microsoft Bing Rewards Daily auto run
// @version V7.3
// @description 群晖 Windows开机自动运行Rewards每日搜索任务，随机暂停时间，增加搜索行为的自然性，约4小时完成。
// @description:zh-TW 群暉 Windows開機自動運行Rewards每日蒐索任務，隨機暫停時間，增加蒐索行爲的自然性，約4小時完成。
// @description:en Synology Windows boot auto-run Rewards daily search task, with random pause times to enhance the naturalness of search behavior, approximately 4 hours to complete.
// @note 更新于 2026年01月02日
// @author 789cn
// @match https://*.bing.com/*
// @exclude https://rewards.bing.com/*
// @license GNU GPLv3
// @icon https://www.bing.com/favicon.ico
// @connect gumengya.com
// @run-at document-end
// @grant GM_registerMenuCommand
// @grant GM_addStyle
// @grant GM_openInTab
// @grant GM_setValue
// @grant GM_getValue
// @grant GM_xmlhttpRequest
// @namespace https://greasyfork.org/zh-TW/scripts/496117
// @downloadURL https://update.greasyfork.org/scripts/547393/Microsoft%20Bing%20Rewards%E6%AF%8F%E6%97%A5%E4%BB%BB%E5%8A%A1%E8%84%9A%E6%9C%AC%20%E8%87%AA%E5%8A%A8%E8%BF%90%E8%A1%8C.user.js
// @updateURL https://update.greasyfork.org/scripts/547393/Microsoft%20Bing%20Rewards%E6%AF%8F%E6%97%A5%E4%BB%BB%E5%8A%A1%E8%84%9A%E6%9C%AC%20%E8%87%AA%E5%8A%A8%E8%BF%90%E8%A1%8C.meta.js
// ==/UserScript==
 
var max_rewards = Math.floor(Math.random() * (33 - 30 + 1)) + 30; // 随机每次搜索总次数
var search_words = []; // 搜索词
var appkey = ""; // 从 https://www.gmya.net/api 申请的热门词接口APIKEY
var Hot_words_apis = "https://api.gmya.net/Api/"; // 故梦热门词API接口网站
 
// 默认搜索词，热门搜索词请求失败时使用
var default_search_words = [
    "盛年不重来，一日难再晨", "千里之行，始于足下", "少年易学老难成，一寸光阴不可轻",
    "敏而好学，不耻下问", "海内存知已，天涯若比邻", "三人行，必有我师焉",
    "莫愁前路无知已，天下谁人不识君", "人生贵相知，何用金与钱", "天生我材必有用",
    "海纳百川有容乃大；壁立千仞无欲则刚", "穷则独善其身，达则兼济天下", "读书破万卷，下笔如有神",
    "学而不思则罔，思而不学则殆", "一年之计在于春，一日之计在于晨", "莫等闲，白了少年头，空悲切",
    "少壮不努力，老大徒伤悲", "一寸光阴一寸金，寸金难买寸光阴", "近朱者赤，近墨者黑",
    "吾生也有涯，而知也无涯", "纸上得来终觉浅，绝知此事要躬行", "学无止境",
    "己所不欲，勿施于人", "天将降大任于斯人也", "鞠躬尽瘁，死而后已", "书到用时方恨少",
    "天下兴亡，匹夫有责", "人无远虑，必有近忧", "为中华之崛起而读书", "一日无书，百事荒废",
    "岂能尽如人意，但求无愧我心", "人生自古谁无死，留取丹心照汗青", "吾生也有涯，而知也无涯",
    "生于忧患，死于安乐", "言必信，行必果", "读书破万卷，下笔如有神",
    "夫君子之行，静以修身，俭以养德", "老骥伏枥，志在千里", "一日不读书，胸臆无佳想",
    "王侯将相宁有种乎", "淡泊以明志。宁静而致远", "卧龙跃马终黄土"
];
 
var keywords_source = ['BaiduHot', 'TouTiaoHot', 'DouYinHot', 'WeiBoHot'];
var random_keywords_source = keywords_source[Math.floor(Math.random() * keywords_source.length)];
var current_source_index = 0; // 当前搜索词来源的索引
 
// 添加简单的 UI 样式，显示搜索进度
GM_addStyle(`
    #rewards-progress {
        position: fixed;
        top: 100px;
        right: 10px;
        background: #333;
        color: #fff;
        padding: 5px 10px;
        border-radius: 5px;
        z-index: 1000;
        font-size: 14px;
    }
`);
 
/**
 * 检查是否需要重置搜索计数（每天00:00）
 * @returns {boolean} 如果是新的一天，返回 true
 */
function checkAndResetDaily() {
    const today = new Date().toDateString(); // 获取当前日期（不含时间）
    const lastReset = GM_getValue('lastReset', ''); // 获取上次重置的日期
 
    if (lastReset !== today) {
        GM_setValue('Cnt', 0); // 重置搜索计数
        GM_setValue('lastReset', today); // 更新重置日期
        max_rewards = Math.floor(Math.random() * (33 - 28 + 1)) + 28; // 重新随机生成搜索总次数
        return true; // 表示新的一天，重置完成
    }
    return false; // 表示不是新的一天，无需重置
}
 
/**
 * 尝试从多个搜索词来源获取搜索词，如果所有来源都失败，则返回默认搜索词。
 * @returns {Promise<string[]>} 返回搜索到的title属性值列表或默认搜索词列表
 */
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
 
// 执行搜索
douyinhot_dic()
    .then(names => {
        search_words = names;
        checkAndResetDaily(); // 检查是否需要重置
        exec(); // 开始执行搜索
    })
    .catch(error => {
        console.error(error);
    });
 
// 定义菜单命令：开始
GM_registerMenuCommand('开始', function () {
    GM_setValue('Cnt', 0); // 重置计数器
    checkAndResetDaily(); // 手动开始时也检查重置
    exec(); // 直接调用 exec() 开始搜索
}, 'o');
 
// 定义菜单命令：停止
GM_registerMenuCommand('停止', function () {
    GM_setValue('Cnt', max_rewards + 10); // 停止搜索
}, 'o');
 
// 自动将字符串中的字符进行替换
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
 
// 生成指定长度的随机字符串
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
    'use strict';
 
    // 初始化计数器
    if (GM_getValue('Cnt') == null) {
        GM_setValue('Cnt', 0); // 首次运行初始化为 0
    }
 
    let currentSearchCount = GM_getValue('Cnt');
 
    // 显示搜索进度
    let progressDiv = document.createElement('div');
    progressDiv.id = 'rewards-progress';
    progressDiv.innerText = `搜索进度: ${currentSearchCount} / ${max_rewards}`;
    document.body.appendChild(progressDiv);
 
    if (currentSearchCount < max_rewards) {
        let tt = document.getElementsByTagName("title")[0];
        tt.innerHTML = `[${currentSearchCount} / ${max_rewards}] ${tt.innerHTML}`;
        smoothScrollToBottom();
        GM_setValue('Cnt', currentSearchCount + 1);
        setTimeout(function () {
            let nowtxt = search_words[currentSearchCount];
            nowtxt = AutoStrTrans(nowtxt);
            let searchUrl = currentSearchCount < max_rewards / 2
                ? `https://www.bing.com/search?q=${encodeURI(nowtxt)}&form=${randomString}&cvid=${randomCvid}`
                : `https://cn.bing.com/search?q=${encodeURI(nowtxt)}&form=${randomString}&cvid=${randomCvid}`;
            let pause_time = Math.floor(Math.random() * (780000 - 180000 + 1)) + 180000; // 随机暂停3-13分钟
            setTimeout(function () {
                location.href = searchUrl;
            }, pause_time);
        }, randomDelay);
    }
 
    // 检查是否接近午夜，并在午夜后重新运行
    const now = new Date();
    const msUntilMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1).getTime() - now.getTime();
    setTimeout(function () {
        if (checkAndResetDaily()) {
            douyinhot_dic()
                .then(names => {
                    search_words = names;
                    exec(); // 重新运行搜索
                })
                .catch(error => {
                    console.error(error);
                });
        }
    }, msUntilMidnight);
 
    function smoothScrollToBottom() {
        document.documentElement.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
}
 