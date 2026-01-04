// ==UserScript==
// @name         Microsoft Bing Rewards每日任务脚本 自用修改 by 诺子小姐
// @version      V1.5
// @description  自动完成微软Rewards每日搜索任务,每次运行时获取热门词,随机选择搜索词
// @note         更新于 2025年09月27日 - 根据新的API要求更新热门词获取逻辑
// @author       诺子
// @match        https://*.bing.com/*
// @exclude      https://rewards.bing.com/*
// @license      GNU GPLv3
// @icon         https://www.bing.com/favicon.ico
// @connect      pearktrue.cn
// @run-at       document-end
// @grant        GM_registerMenuCommand
// @grant        GM_addStyle
// @grant        GM_openInTab
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @namespace    https://greasyfork.org/zh-CN/scripts/477107
// @downloadURL https://update.greasyfork.org/scripts/542373/Microsoft%20Bing%20Rewards%E6%AF%8F%E6%97%A5%E4%BB%BB%E5%8A%A1%E8%84%9A%E6%9C%AC%20%E8%87%AA%E7%94%A8%E4%BF%AE%E6%94%B9%20by%20%E8%AF%BA%E5%AD%90%E5%B0%8F%E5%A7%90.user.js
// @updateURL https://update.greasyfork.org/scripts/542373/Microsoft%20Bing%20Rewards%E6%AF%8F%E6%97%A5%E4%BB%BB%E5%8A%A1%E8%84%9A%E6%9C%AC%20%E8%87%AA%E7%94%A8%E4%BF%AE%E6%94%B9%20by%20%E8%AF%BA%E5%AD%90%E5%B0%8F%E5%A7%90.meta.js
// ==/UserScript==


var max_rewards = Math.floor(Math.random() * (45 - 35 + 1)) + 35; // 生成随机重复执行的次数（35 到 45 次之间）
// 每执行4次搜索后插入暂停时间,解决账号被监控不增加积分的问题
var pause_time = Math.floor(Math.random() * (900000 - 600000 + 1)) + 600000; // 生成随机暂停时间（10 到 15 分钟之间）
var search_words = []; //搜索词
var Hot_words_apis = "https://api.pearktrue.cn/api/dailyhot/"; // 新API接口地址

// 默认搜索词，热门搜索词请求失败时使用
var default_search_words = [
    // 自然景观与地理知识类
    "壶口瀑布冬季结冰期是几月",
    "张家界天门山盘山公路有多少弯",
    "桂林阳朔十里画廊最佳徒步路线",
    "青海湖湟鱼洄游最佳观赏时间",
    "新疆独库公路每年开放几个月",
    // 省略部分默认搜索词（保持原有内容）
];

// 新API支持的热门词来源 (使用中文名称作为title参数)
var keywords_source = [
    '哔哩哔哩', // B站热搜
    '微博',     // 微博热搜
    '百度',     // 百度热搜
    '抖音',     // 抖音热搜
    '知乎'      // 知乎热搜
];
var current_source_index = 0; // 当前搜索词来源的索引

/**
 * 从新API获取热门搜索词
 * @returns {Promise<string[]>} 返回搜索到的关键词列表或默认搜索词列表
 */
async function getHotKeywords() {
    while (current_source_index < keywords_source.length) {
        const source = keywords_source[current_source_index];
        // 构建带title参数的API请求地址
        const url = `${Hot_words_apis}?title=${encodeURIComponent(source)}`;

        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP错误: ${response.status}`);
            }

            const result = await response.json();

            // 检查API返回的code是否为200，并且data字段是数组
            if (result.code === 200 && Array.isArray(result.data)) {
                let keywords = result.data.map(item => item.title || item.name || '').filter(k => k && k.trim().length > 0);

                // 去重
                keywords = [...new Set(keywords)];

                if (keywords.length > 0) {
                    console.log(`从 [${source}] 获取到 ${keywords.length} 个关键词`);
                    return keywords;
                } else {
                     console.warn(`从 [${source}] 获取的关键词列表为空`);
                }
            } else {
                // 如果API返回的格式不正确或code不是200，则抛出错误
                throw new Error(`API返回数据格式错误或请求失败: ${result.msg || '未知错误'}`);
            }
        } catch (error) {
            console.error(`获取 [${source}] 热门词失败:`, error);
        }

        current_source_index++; // 尝试下一个来源
    }

    // 所有来源都失败时使用默认搜索词
    console.error('所有热门词来源请求失败，使用默认搜索词');
    return default_search_words;
}

// 执行搜索初始化
getHotKeywords()
    .then(keywords => {
        search_words = keywords;
        exec();
    })
    .catch(error => {
        console.error('初始化失败:', error);
        search_words = default_search_words;
        exec();
    });

// 定义菜单命令：开始
GM_registerMenuCommand('开始', function () {
    GM_setValue('Cnt', 0);
    location.href = "https://www.bing.com/?br_msg=Please-Wait";
}, 'o');

// 定义菜单命令：停止
GM_registerMenuCommand('停止', function () {
    GM_setValue('Cnt', max_rewards + 10);
}, 'o');

// 搜索词混淆处理
function AutoStrTrans(st) {
    let yStr = st;
    let rStr = ""; // 可根据需要添加混淆字符
    let zStr = "";
    let prePo = 0;
    for (let i = 0; i < yStr.length;) {
        let step = parseInt(Math.random() * 5) + 1;
        if (i > 0) {
            zStr += yStr.substr(prePo, i - prePo) + rStr;
            prePo = i;
        }
        i += step;
    }
    if (prePo < yStr.length) {
        zStr += yStr.substr(prePo);
    }
    return zStr;
}

// 生成随机字符串
function generateRandomString(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}

// 平滑滚动到页面底部
function smoothScrollToBottom() {
    window.scrollTo({
        top: document.body.scrollHeight,
        behavior: 'smooth'
    });
}

// 主执行函数（增加随机搜索词功能）
function exec() {
    let randomDelay = Math.floor(Math.random() * 20000) + 10000; // 10-30秒随机延迟
    let randomString = generateRandomString(4);
    let randomCvid = generateRandomString(32);
    'use strict';

    // 初始化计数器
    if (GM_getValue('Cnt') === null) {
        GM_setValue('Cnt', max_rewards + 10);
    }

    let currentSearchCount = GM_getValue('Cnt');

    if (currentSearchCount < max_rewards) {
        // 更新页面标题显示进度
        const title = document.getElementsByTagName("title")[0];
        title.innerHTML = `[${currentSearchCount} / ${max_rewards}] ${title.innerHTML}`;

        smoothScrollToBottom();
        GM_setValue('Cnt', currentSearchCount + 1);

        setTimeout(() => {
            // 关键修改：从搜索词列表中随机挑选一个（而非顺序循环）
            let wordIndex = Math.floor(Math.random() * search_words.length);
            let nowtxt = search_words[wordIndex];
            nowtxt = AutoStrTrans(nowtxt);

            // 构建搜索URL
            const searchUrl = `https://www.bing.com/search?q=${encodeURI(nowtxt)}&form=${randomString}&cvid=${randomCvid}`;

            // 每5次搜索添加一次暂停
            if ((currentSearchCount + 1) % 5 === 0) {
                console.log(`第${currentSearchCount + 1}次搜索（随机词：${nowtxt}），进入暂停期`);
                setTimeout(() => {
                    location.href = searchUrl;
                }, pause_time);
            } else {
                console.log(`第${currentSearchCount + 1}次搜索（随机词：${nowtxt}）`);
                location.href = searchUrl;
            }
        }, randomDelay);
    } else {
        console.log(`已完成${max_rewards}次搜索任务`);
    }
}