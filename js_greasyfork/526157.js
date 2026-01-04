// ==UserScript==
// @name         移动端微软Rewards每日任务脚本
// @version      2025.02.07.3
// @description  自动执行必应搜索任务，支持自定义开始时间和循环次数
// @author       怀沙2049
// @match        https://*.bing.com/*
// @license      GNU GPLv3
// @icon         https://www.bing.com/favicon.ico
// @connect      gumengya.com
// @run-at       document-end
// @note         更新于 2024年12月24日
// @supportURL   https://greasyfork.org/zh-CN/users/1192640-huaisha1224
// @homepageURL  https://greasyfork.org/zh-CN/users/1192640-huaisha1224
// @grant        GM_registerMenuCommand
// @grant        GM_addStyle
// @grant        GM_openInTab
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @namespace    https://greasyfork.org/zh-CN/users/1192640-huaisha1224
// @downloadURL https://update.greasyfork.org/scripts/526157/%E7%A7%BB%E5%8A%A8%E7%AB%AF%E5%BE%AE%E8%BD%AFRewards%E6%AF%8F%E6%97%A5%E4%BB%BB%E5%8A%A1%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/526157/%E7%A7%BB%E5%8A%A8%E7%AB%AF%E5%BE%AE%E8%BD%AFRewards%E6%AF%8F%E6%97%A5%E4%BB%BB%E5%8A%A1%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

// 基础配置参数
var max_rewards = 30; // 单次执行的最大搜索次数
var pause_time = 960000; // 每5次搜索的暂停时间（16分钟 = 960000毫秒）
var start_time = "08:00"; // 默认每天开始时间
var loop_count = 1; // 默认循环次数
var isManualStop = false; // 手动停止标志
var current_loop = 0; // 当前循环次数计数
var search_words = []; // 存储搜索关键词的数组
var appkey = ""; // 故梦API的密钥，从api.gumengya.com申请
var Hot_words_apis = "https://api.gumengya.com/Api/"; // 故梦热门词API接口

// 默认搜索关键词（当API获取失败时使用）
var default_search_words = [
    "盛年不重来，一日难再晨", "千里之行，始于足下", "少年易学老难成，一寸光阴不可轻", 
    "敏而好学，不耻下问", "海内存知已，天涯若比邻", "三人行，必有我师焉",
    // ... 其他默认搜索词 ...
];

// 可用的热搜来源
var keywords_source = ['ZhiHuHot', 'WeiBoHot', 'TouTiaoHot', 'DouYinHot', 'BaiduHot'];
// 随机选择一个热搜来源
var random_keywords_source = keywords_source[Math.floor(Math.random() * keywords_source.length)];

/**
 * 从API获取热门搜索词
 * @returns {Promise} 返回包含搜索词的Promise对象
 */
function douyinhot_dic() {
    // 构建API请求URL
    let url = appkey ? 
        Hot_words_apis + random_keywords_source + "?format=json&appkey=" + appkey :
        Hot_words_apis + random_keywords_source;

    return new Promise((resolve, reject) => {
        fetch(url)
            .then(response => response.json())
            .then(data => {
                if (data.data.some(item => item)) {
                    const names = data.data.map(item => item.title);
                    resolve(names);
                } else {
                    console.log('API返回数据为空，使用默认搜索词');
                    resolve(default_search_words);
                }
            })
            .catch(error => {
                console.log('获取API数据失败，使用默认搜索词');
                resolve(default_search_words);
                reject(error);
            });
    });
}

// 初始化搜索词并开始执行
douyinhot_dic()
    .then(names => {
        search_words = names;
        exec();
    })
    .catch(error => {
        console.error('获取搜索词失败:', error);
    });

// 注册菜单命令
GM_registerMenuCommand('开始', function() {
    isManualStop = false;
    GM_setValue('IsManualStop', false);
    GM_setValue('Cnt', 0);
    current_loop = 0;
    GM_setValue('CurrentLoop', 0);
    console.log('任务开始执行');
    location.href = "https://www.bing.com/?br_msg=Please-Wait";
});

GM_registerMenuCommand('停止', function() {
    isManualStop = true;
    GM_setValue('IsManualStop', true);
    GM_setValue('Cnt', max_rewards + 10);
    console.log('已手动停止任务');
    let tt = document.getElementsByTagName("title")[0];
    tt.innerHTML = "任务已手动停止";
    location.reload();
});

// 添加设置开始时间的菜单命令
GM_registerMenuCommand('设置每日开始时间', function() {
    const newTime = prompt('请输入每日开始时间（24小时制，格式如 08:00）：', start_time);
    if (newTime && /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(newTime)) {
        start_time = newTime;
        GM_setValue('StartTime', start_time);
        alert(`每日开始时间已设置为 ${start_time}`);
    } else {
        alert('时间格式不正确，请使用24小时制（如：08:00）');
    }
});

// 添加设置循环次数的菜单命令
GM_registerMenuCommand('设置每日循环次数', function() {
    const newCount = prompt('请输入每日循环次数（1-10）：', loop_count);
    if (newCount && !isNaN(newCount) && newCount > 0 && newCount <= 10) {
        loop_count = parseInt(newCount);
        GM_setValue('LoopCount', loop_count);
        alert(`每日循环次数已设置为 ${loop_count} 次`);
    } else {
        alert('请输入1-10之间的数字');
    }
});
/**
 * 生成指定长度的随机字符串
 * @param {number} length 要生成的字符串长度
 * @returns {string} 随机字符串
 */
function generateRandomString(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}

/**
 * 平滑滚动到页面底部
 */
function smoothScrollToBottom() {
    document.documentElement.scrollIntoView({ behavior: 'smooth', block: 'end' });
}

/**
 * 检查是否到达开始时间
 * @returns {boolean} 是否可以开始执行
 */
function isTimeToStart() {
    const now = new Date();
    const [startHour, startMinute] = start_time.split(':').map(Number);
    return now.getHours() === startHour && now.getMinutes() === startMinute;
}

/**
 * 等待直到下一个开始时间
 */
function waitUntilNextStart() {
    const now = new Date();
    const [startHour, startMinute] = start_time.split(':').map(Number);
    const next = new Date(now);
    next.setHours(startHour, startMinute, 0, 0);
    
    // 如果当前时间已过今天的开始时间，则设置为明天
    if (now >= next) {
        next.setDate(next.getDate() + 1);
    }
    
    const timeToWait = next - now;
    console.log(`等待到下一个开始时间: ${start_time}（还需 ${Math.floor(timeToWait/1000/60)} 分钟）`);
    
    // 设置定时器等待到开始时间
    setTimeout(() => {
        console.log('到达开始时间，开始执行任务...');
        current_loop = 0; // 重置循环计数
        GM_setValue('CurrentLoop', current_loop);
        GM_setValue('Cnt', 0);
        location.reload();
    }, timeToWait);
}

/**
 * 执行搜索操作
 * @param {string} baseUrl 搜索基础URL
 * @param {number} count 当前搜索次数
 * @param {string} randomString 随机表单标识
 * @param {string} randomCvid 随机会话ID
 * @param {number} randomDelay 随机延迟时间
 */
function performSearch(baseUrl, count, randomString, randomCvid, randomDelay) {
    // 更新页面标题显示进度
    let tt = document.getElementsByTagName("title")[0];
    tt.innerHTML = `[第${current_loop + 1}轮: ${count} / ${max_rewards}] ${tt.innerHTML}`;
    
    // 执行滚动
    smoothScrollToBottom();
    
    // 更新计数器
    GM_setValue('Cnt', count + 1);

    setTimeout(function() {
        let nowtxt = search_words[count];
        
        // 每5次搜索后暂停
        if ((count + 1) % 5 === 0) {
            console.log(`暂停${pause_time/1000}秒后继续搜索...`);
            setTimeout(function() {
                location.href = `${baseUrl}?q=${encodeURI(nowtxt)}&form=${randomString}&cvid=${randomCvid}`;
            }, pause_time);
        } else {
            location.href = `${baseUrl}?q=${encodeURI(nowtxt)}&form=${randomString}&cvid=${randomCvid}`;
        }
    }, randomDelay);
}

/**
 * 主要执行函数
 */
function exec() {
    // 检查手动停止状态
    isManualStop = GM_getValue('IsManualStop', false);
    current_loop = GM_getValue('CurrentLoop', 0);
    
    // 如果是手动停止状态，不执行搜索
    if (isManualStop) {
        let tt = document.getElementsByTagName("title")[0];
        tt.innerHTML = "任务已手动停止";
        return;
    }

    // 生成随机参数
    let randomDelay = Math.floor(Math.random() * 20000) + 10000; // 10-30秒随机延迟
    let randomString = generateRandomString(4);
    let randomCvid = generateRandomString(32);
    
    // 初始化计数器
    if (GM_getValue('Cnt') == null) {
        GM_setValue('Cnt', max_rewards + 10);
    }

    let currentSearchCount = GM_getValue('Cnt');

    // 处理搜索任务完成的情况
    if (currentSearchCount >= max_rewards) {
        let tt = document.getElementsByTagName("title")[0];
        
        if (isManualStop) {
            tt.innerHTML = "任务已手动停止";
            console.log('任务已手动停止，需要手动重新开始');
            return;
        }
        
        // 检查是否需要继续循环
        if (current_loop < loop_count - 1) {
            console.log(`完成第 ${current_loop + 1} 次循环，共 ${loop_count} 次`);
            current_loop++;
            GM_setValue('CurrentLoop', current_loop);
            GM_setValue('Cnt', 0);
            location.reload();
        } else {
            tt.innerHTML = "今日任务全部完成，等待明天开始时间...";
            console.log(`完成所有 ${loop_count} 次循环，等待明天 ${start_time} 继续`);
            waitUntilNextStart();
        }
        return;
    }

    // 执行搜索任务
    if (currentSearchCount <= max_rewards / 2) {
        performSearch("https://www.bing.com/search", currentSearchCount, randomString, randomCvid, randomDelay);
    } else if (currentSearchCount < max_rewards) {
        performSearch("https://cn.bing.com/search", currentSearchCount, randomString, randomCvid, randomDelay);
    }
}

// 脚本初始化
(function() {
    // 读取保存的设置
    const savedStartTime = GM_getValue('StartTime');
    if (savedStartTime) {
        start_time = savedStartTime;
    }
    
    const savedLoopCount = GM_getValue('LoopCount');
    if (savedLoopCount) {
        loop_count = savedLoopCount;
    }
    
    isManualStop = GM_getValue('IsManualStop', false);
    current_loop = GM_getValue('CurrentLoop', 0);
    
    // 如果不是手动停止状态，检查是否需要等待开始时间
    if (!isManualStop && GM_getValue('Cnt', 0) >= max_rewards) {
        waitUntilNextStart();
    }
})();