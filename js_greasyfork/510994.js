// ==UserScript==
// @name         Bing Rewards脚本_电脑端
// @version      0.0.6
// @description  Rewards每日搜索任务。
// @note         原作者‘怀沙2049’，在原脚本上做了针对个人的修改，仅个人使用及备份。
// @author       NDGSYX
// @match        https://*.bing.com/*
// @exclude      https://rewards.bing.com/*
// @license      GNU GPLv3
// @icon         https://www.bing.com/favicon.ico
// @run-at       document-end
// @grant        GM_registerMenuCommand
// @grant        GM_addStyle
// @grant        GM_openInTab
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @connect      api.996663.xyz
// @namespace    https://greasyfork.org/zh-CN/scripts/510994
// @downloadURL https://update.greasyfork.org/scripts/510994/Bing%20Rewards%E8%84%9A%E6%9C%AC_%E7%94%B5%E8%84%91%E7%AB%AF.user.js
// @updateURL https://update.greasyfork.org/scripts/510994/Bing%20Rewards%E8%84%9A%E6%9C%AC_%E7%94%B5%E8%84%91%E7%AB%AF.meta.js
// ==/UserScript==

var max_rewards = Math.floor(Math.random() * 9) + 36; //重复执行的次数36-44随机
//每执行4次搜索后插入暂停时间,解决账号被监控不增加积分的问题
var pause_time = Math.floor(Math.random() * 600000) + 900000; // 暂停时长15-25分钟随机(900000-1500000毫秒)
var search_words = []; //搜索词

//默认搜索词，热门搜索词请求失败时使用
var default_search_words = ["摘星造梦", "你是路过我一生风景的人", "敏而好学，不耻下问", "海内存知已，天涯若比邻", "三人行，必有我师焉",
    "莫愁前路无知已，天下谁人不识君", "人生贵相知，何用金与钱", "天生我材必有用", "急，在线等", "穷则独善其身，达则兼济天下", "读书破万卷，下笔如有神",
    "学而不思则罔，思而不学则殆", "一年之计在于春，一日之计在于晨", "如烟火绽放夜空", "少壮不努力，老大徒伤悲", "一寸光阴一寸金，寸金难买寸光阴", "近朱者赤，近墨者黑",
    "吾生也有涯，而知也无涯", "网易云", "学无止境", "己所不欲，勿施于人", "天将降大任于斯人也", "鞠躬尽瘁，死而后已", "书到用时方恨少", "天下兴亡，匹夫有责",
    "人无远虑，必有近忧", "为中华之崛起而读书", "一日无书，百事荒废", "岂能尽如人意，但求无愧我心", "人生自古谁无死，留取丹心照汗青", "吾生也有涯，而知也无涯", "生于忧患，死于安乐",
    "言必信，行必果", "读书破万卷，下笔如有神", "夫君子之行，静以修身，俭以养德", "QQ音乐", "一日不读书，胸臆无佳想", "王侯将相宁有种乎", "淡泊以明志。宁静而致远,", "卧龙跃马终黄土"]

/**
 * 从API获取随机热词。
 * @returns {Promise<string[]>} 返回搜索到的name属性值列表或默认搜索词列表
 */
async function douyinhot_dic() {
    return new Promise((resolve) => {
        GM_xmlhttpRequest({
            method: "GET",
            url: "http://api.996663.xyz:8008/get_random_hotword",
            onload: function(response) {
                try {
                    const data = JSON.parse(response.responseText);
                    resolve([data.keyword]);
                } catch (error) {
                    console.error('解析API响应失败:', error);
                    resolve(default_search_words);
                }
            },
            onerror: function(error) {
                console.error('获取随机热词失败:', error);
                resolve(default_search_words);
            }
        });
    });
}
douyinhot_dic()
    .then(names => {
        //   console.log(names[0]);
        search_words = names;
        exec()
    })
    .catch(error => {
        console.error(error);
    });

// 定义菜单命令：开始
let menu1 = GM_registerMenuCommand('开始', function () {
    GM_setValue('Cnt', 0); // 将计数器重置为0
    location.href = "https://www.bing.com/?br_msg=Please-Wait"; // 跳转到Bing首页
}, 'o');

// 定义菜单命令：停止
let menu2 = GM_registerMenuCommand('停止', function () {
    GM_setValue('Cnt', max_rewards + 10); // 将计数器设置为超过最大搜索次数，以停止搜索
}, 'o');

// 自动将字符串中的字符进行替换
function AutoStrTrans(st) {
    let yStr = st; // 原字符串
    let rStr = ""; // 插入的混淆字符，可以自定义自己的混淆字符串
    let zStr = ""; // 结果字符串
    let prePo = 0;
    for (let i = 0; i < yStr.length;) {
        let step = parseInt(Math.random() * 5) + 1; // 随机生成步长
        if (i > 0) {
            zStr = zStr + yStr.substr(prePo, i - prePo) + rStr; // 将插入字符插入到相应位置
            prePo = i;
        }
        i = i + step;
    }
    if (prePo < yStr.length) {
        zStr = zStr + yStr.substr(prePo, yStr.length - prePo); // 将剩余部分添加到结果字符串中
    }
    return zStr;
}

// 生成指定长度的包含大写字母、小写字母和数字的随机字符串
function generateRandomString(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        // 从字符集中随机选择字符，并拼接到结果字符串中
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

async function exec() {
    // 生成随机延迟时间
    let randomDelay = Math.floor(Math.random() * 20000) + 10000; // 生成10秒到30秒之间的随机数
    let randomString = generateRandomString(4); //生成4个长度的随机字符串
    let randomCvid = generateRandomString(32); //生成32位长度的cvid
    'use strict';

    // 检查计数器的值，若为空则设置为超过最大搜索次数
    if (GM_getValue('Cnt') == null) {
        GM_setValue('Cnt', max_rewards + 10);
    }

    // 获取当前搜索次数
    let currentSearchCount = GM_getValue('Cnt');
    if (currentSearchCount >= max_rewards) return;

    // 每次执行前获取新热词
    let nowtxt = await douyinhot_dic().then(names => names[0]).catch(() => default_search_words[Math.floor(Math.random() * default_search_words.length)]);
    nowtxt = AutoStrTrans(nowtxt);

    let tt = document.getElementsByTagName("title")[0];
    tt.innerHTML = "[" + currentSearchCount + " / " + max_rewards + "] " + tt.innerHTML;
    smoothScrollToBottom();
    GM_setValue('Cnt', currentSearchCount + 1);

    setTimeout(function () {
        // 检查是否需要暂停
        if ((currentSearchCount + 1) % 5 === 0) {
            setTimeout(function () {
                location.href = currentSearchCount <= max_rewards / 2
                    ? "https://www.bing.com/search?q=" + encodeURI(nowtxt) + "&form=" + randomString + "&cvid=" + randomCvid
                    : "https://cn.bing.com/search?q=" + encodeURI(nowtxt) + "&form=" + randomString + "&cvid=" + randomCvid;
            }, pause_time);
        } else {
            location.href = currentSearchCount <= max_rewards / 2
                ? "https://www.bing.com/search?q=" + encodeURI(nowtxt) + "&form=" + randomString + "&cvid=" + randomCvid
                : "https://cn.bing.com/search?q=" + encodeURI(nowtxt) + "&form=" + randomString + "&cvid=" + randomCvid;
        }
    }, randomDelay);
    // 实现平滑滚动到页面底部的函数
    function smoothScrollToBottom() {
         document.documentElement.scrollIntoView({ behavior: 'smooth', block: 'end' });
        }
}