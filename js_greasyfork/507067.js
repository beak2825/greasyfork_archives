// ==UserScript==
// @name         Bing Rewards 修改版
// @version      V1.0.4
// @license      GNU GPLv3
// @description  修改自@huaisha2049 Microsoft Bing Rewards每日任务脚本 V3.0.0
// @description  V1.0.4 修改单次搜索延时180~270s
// @author       Bizzy
// @match        https://cn.bing.com/*
// @icon         https://www.bing.com/favicon.ico
// @connect      gumengya.com
// @run-at       document-end
// @grant        GM_registerMenuCommand
// @grant        GM_addStyle
// @grant        GM_openInTab
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @namespace https://greasyfork.org/users/1363712
// @downloadURL https://update.greasyfork.org/scripts/507067/Bing%20Rewards%20%E4%BF%AE%E6%94%B9%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/507067/Bing%20Rewards%20%E4%BF%AE%E6%94%B9%E7%89%88.meta.js
// ==/UserScript==

var max_rewards = 30; //重复执行的次数
var random_delay = Math.floor(Math.random() * 90000) + 180000; // 毫秒，搜索间隔180~270s
var search_words = []; //搜索词
var bing_url = "https://cn.bing.com/"

//默认搜索词，热门搜索词请求失败时使用
var default_search_words = ["盛年不重来，一日难再晨", "千里之行，始于足下", "少年易学老难成，一寸光阴不可轻", "敏而好学，不耻下问", "海内存知已，天涯若比邻","三人行，必有我师焉",
                            "莫愁前路无知已，天下谁人不识君", "人生贵相知，何用金与钱", "天生我材必有用", "海纳百川有容乃大；壁立千仞无欲则刚", "穷则独善其身，达则兼济天下", "读书破万卷，下笔如有神",
                            "学而不思则罔，思而不学则殆", "一年之计在于春，一日之计在于晨", "莫等闲，白了少年头，空悲切", "少壮不努力，老大徒伤悲", "一寸光阴一寸金，寸金难买寸光阴","近朱者赤，近墨者黑",
                            "吾生也有涯，而知也无涯", "纸上得来终觉浅，绝知此事要躬行", "学无止境", "己所不欲，勿施于人", "天将降大任于斯人也", "鞠躬尽瘁，死而后已", "书到用时方恨少","天下兴亡，匹夫有责",
                            "人无远虑，必有近忧","为中华之崛起而读书","一日无书，百事荒废","岂能尽如人意，但求无愧我心","人生自古谁无死，留取丹心照汗青","吾生也有涯，而知也无涯","生于忧患，死于安乐",
                            "言必信，行必果","读书破万卷，下笔如有神","夫君子之行，静以修身，俭以养德","老骥伏枥，志在千里","一日不读书，胸臆无佳想","王侯将相宁有种乎","淡泊以明志。宁静而致远,","卧龙跃马终黄土"]
//{weibohot}微博热搜榜//{douyinhot}抖音热搜榜/{zhihuhot}知乎热搜榜/{baiduhot}百度热搜榜/{toutiaohot}今日头条热搜榜/
var keywords_source = ['BaiduHot','TouTiaoHot','DouYinHot', 'WeiBoHot'];
var random_keywords_source = keywords_source[Math.floor(Math.random() * keywords_source.length)]
var current_source_index = 0; // 当前搜索词来源的索引

/**
 * 尝试从多个搜索词来源获取搜索词，如果所有来源都失败，则返回默认搜索词。
 * @returns {Promise<string[]>} 返回搜索到的name属性值列表或默认搜索词列表
 */
async function douyinhot_dic() {
    return new Promise((resolve, reject) => {
        // 假设 random_keywords_source 和 default_search_words 已定义
        const url = "https://api.gumengya.com/Api/" + random_keywords_source;

        fetch(url)
            .then(response => response.json()) // 将响应转换为 JSON
            .then(data => {
            // 检查 data.data 是否是数组且有至少一个项
            if (Array.isArray(data.data) && data.data.length > 0) {
                // 提取标题
                const names = data.data.map(item => item.title);

                // 随机排序函数
                const shuffleArray = array => {
                    for (let i = array.length - 1; i > 0; i--) {
                        const j = Math.floor(Math.random() * (i + 1));
                        [array[i], array[j]] = [array[j], array[i]]; // 交换元素
                    }
                    return array;
                };

                // 随机排序标题数组
                const shuffledNames = shuffleArray(names);
                resolve(shuffledNames);
            } else {
                // 如果没有数据，使用默认搜索词
                resolve(default_search_words);
            }
        })
            .catch(error => {
            // 出现错误时返回默认搜索词
            console.error('Error fetching data:', error);
            resolve(default_search_words);
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
    location.href = bing_url + "?mkt=zh-CN"; // 跳转到Bing首页
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

function exec() {
    // 生成随机延迟时间
    let randomDelay = Math.floor(Math.random() * 20000) + 10000; // 10000 毫秒 = 10 秒
    let randomString = generateRandomString(4); //生成4个长度的随机字符串
    let randomCvid = generateRandomString(32); //生成32位长度的cvid
    'use strict';

    // 检查计数器的值，若为空则设置为超过最大搜索次数
    if (GM_getValue('Cnt') == null) {
        GM_setValue('Cnt', max_rewards + 10);
    }

    // 获取当前搜索次数
    let currentSearchCount = GM_getValue('Cnt');

    // 根据计数器的值选择搜索引擎
    if (currentSearchCount < max_rewards) {
        let tt = document.getElementsByTagName("title")[0];
        tt.innerHTML = "[" + currentSearchCount + " / " + max_rewards + "] " + tt.innerHTML; // 在标题中显示当前搜索次数

        setTimeout(function () {
            GM_setValue('Cnt', currentSearchCount + 1); // 将计数器加1
            let nowtxt = search_words[currentSearchCount]; // 获取当前搜索词
            nowtxt = AutoStrTrans(nowtxt); // 对搜索词进行替换

            location.href = bing_url + "search?q=" + encodeURI(nowtxt) + "&form=" + randomString + "&cvid=" + randomCvid; // 在Bing搜索引擎中搜索
        }, random_delay);
    }
    else
    {
        console.log("超过指定次数，跳出Rewards")
    }
}