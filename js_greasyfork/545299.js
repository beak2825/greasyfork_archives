// ==UserScript==
// @name        Microsoft Bing Rewards每日任务脚本-修改版
// @version     V4.1.0
// @description 这是一个根据原作者 怀沙2049 的脚本（https://greasyfork.org/zh-CN/scripts/477107）进行修改的自动化工具。它旨在完成微软 Bing Rewards 每日搜索任务，并通过从多个热门词来源获取搜索词来模拟真实搜索。此版本特别新增了“暂停”、“继续”和“结束”功能，为用户提供了更灵活的任务控制。更换api接口添加根据日期切换搜索源，暂停，继续，结束功能，并加入了搜索词日缓存。此版本更新了“开始 / 重置”命令，使其强制刷新当日缓存，并加入了搜索词数组的打印输出。
// @note        V4.1.0恢复单源获取逻辑，每日搜索次数调整为 40。如果主来源搜索词不足 40 个，将自动从剩余来源依次补充词汇，直到满足 40 次要求或遍历完所有来源。
// @author      nullpoint
// @match       https://*.bing.com/*
// @exclude     https://rewards.bing.com/*
// @exclude     https://rewards.microsoft.com/*
// @exclude     https://rewards.tc.bing.net/*
// @license     GNU GPLv3
// @icon        https://www.bing.com/favicon.ico
// @connect     api.pearktrue.cn
// @run-at      document-end
// @grant       GM_registerMenuCommand
// @grant       GM_addStyle
// @grant       GM_openInTab
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_xmlhttpRequest
// @namespace   https://greasyfork.org/users/1328961
// @downloadURL https://update.greasyfork.org/scripts/545299/Microsoft%20Bing%20Rewards%E6%AF%8F%E6%97%A5%E4%BB%BB%E5%8A%A1%E8%84%9A%E6%9C%AC-%E4%BF%AE%E6%94%B9%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/545299/Microsoft%20Bing%20Rewards%E6%AF%8F%E6%97%A5%E4%BB%BB%E5%8A%A1%E8%84%9A%E6%9C%AC-%E4%BF%AE%E6%94%B9%E7%89%88.meta.js
// ==/UserScript==

// --- 配置区域 ---
/**
 * 获取本轮任务的最大搜索次数（只随机一次）
 * 规则：
 * - 若缓存存在，则直接使用缓存值
 * - 若缓存不存在，则随机生成一次并写入缓存
 * - 仅在“开始 / 重置”时才会重新随机
 */
function getMaxRewards() {
    const cached = GM_getValue('MaxRewards', null);

    if (typeof cached === 'number' && cached > 0) {
        return cached;
    }

    // 👉 这里才是真正的“随机一次”
    const value = Math.floor(Math.random() * 6) + 50; // 50–55
    GM_setValue('MaxRewards', value);

    console.log(`🎯 本轮任务 max_rewards 已随机确定为：${value}`);
    return value;
}

// ⚠️ 全局唯一来源
var max_rewards = getMaxRewards();
// 每执行3次搜索后插入长暂停,解决账号被监控不增加积分的问题。 (原脚本逻辑)
// 暂停时间约为 25.4 分钟 到 33.8 分钟 (原代码逻辑： Math.floor(Math.random() * 506400) + 1523400)
// 差值 (2628000 - 1524000 = 1104000)
var pause_time = Math.floor(Math.random() * 1104000) + 1524000;

var search_words = []; // 搜索词
var appkey = "89118da655a994e0"; // 从https://www.gmya.net/api 网站申请的热门词接口APIKEY (目前脚本未使用此key)
var Hot_words_apis = "https://api.pearktrue.cn/api/dailyhot/"; // 故梦热门词API接口网站

// 默认搜索词，热门搜索词请求失败时使用
var default_search_words = [
    "如何配置路由器", "电脑蓝屏怎么回事", "手机电池保养方法", "最新款手机性能评测", "智能家居产品推荐", "人工智能发展趋势", "云计算是什么", "大语言模型原理", "机器学习入门教程",
    "如何学习编程", "编程语言排行榜", "如何提高工作效率", "番茄工作法介绍", "健康饮食食谱", "办公室健身小技巧", "深度学习框架比较", "区块链技术应用", "元宇宙概念解析",
    "如何选择适合自己的耳机", "笔记本电脑选购指南", "汽车保养常识", "新能源汽车技术", "股票市场行情分析", "个人理财规划", "投资理财入门", "如何制作PPT", "Excel函数大全",
    "数据分析工具推荐", "项目管理软件", "如何提升演讲技巧", "时间管理方法", "高效学习方法", "咖啡的种类和制作", "烘焙入门食谱", "健身计划安排", "冥想的好处", "心理健康调适",
    "如何缓解压力", "情绪管理技巧"
];

// 定义所有可能的搜索词来源
var keywords_sources_all = ['抖音', '百度', '今日头条', '豆瓣讨论', '哔哩哔哩', '百度贴吧'];

// --- 工具函数 ---
/**
 * 获取一次长暂停时间（每次调用都会重新随机）
 * 25.4 分钟 ~ 33.8 分钟
 */
function getLongPauseTime() {
    return Math.floor(Math.random() * 1104000) + 1524000;
}
/**
 * 初始化下一次长暂停触发阈值（2–4 次）
 */
function resetLongPauseCounter() {
    const next = Math.floor(Math.random() * 3) + 2; // 2–4
    GM_setValue('NextLongPauseAfter', next);
    GM_setValue('ShortSearchCounter', 0);
    console.log(`🔁 下一次长暂停将在 ${next} 次短搜索后触发`);
}


/**
 * 获取今天的日期字符串 (YYYY-MM-DD)
 */
function getTodayDateString() {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0'); // 月份是 0-based
    const dd = String(today.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
}
// --- 无侵入式拟人化滚动实现（含“可能不滚动”） ---
function smoothScrollToBottom() {
    'use strict';
    const shouldScroll = Math.random() < 0.45;
    if (!shouldScroll) {
        console.log("👀 本页快速浏览，无滚动行为");
        return;
    }

    (async function humanizedScroll() {
        let current = window.scrollY;
        const documentHeight = document.documentElement.scrollHeight;
        const viewLimit = window.innerHeight * (Math.random() * 2 + 2);

        console.log("📖 启动拟人化阅读滚动...");

        while (current < documentHeight && current < viewLimit) {
            if (typeof simulateNoise === 'function') {
                try { simulateNoise(); } catch (e) {}
            }

            const isFocusing = Math.random() > 0.75;
            const scrollStep = isFocusing
            ? (Math.random() * 100 + 50)
            : (Math.random() * 400 + 200);
            const waitTime = isFocusing
            ? (Math.random() * 2500 + 1500)
            : (Math.random() * 800 + 400);

            current += scrollStep;
            window.scrollTo({ top: current, behavior: 'smooth' });
            await new Promise(r => setTimeout(r, waitTime));

            if (Math.random() < 0.3) {
                const backStep = Math.random() * 300 + 100;
                current = Math.max(0, current - backStep);
                window.scrollBy({ top: -backStep, behavior: 'smooth' });
                await new Promise(r => setTimeout(r, 800 + Math.random() * 600));
                console.log("⬆️ 模拟回看动作");
            }
        }

        console.log("✅ 拟人化阅读滚动完成");
    })();
}



// 改造后的 simulateNoise
function simulateNoise() {
    const x = Math.floor(Math.random() * window.innerWidth);
    const y = Math.floor(Math.random() * window.innerHeight);

    // 只模拟鼠标移动（最安全）
    window.dispatchEvent(
        new MouseEvent('mousemove', {
            clientX: x,
            clientY: y,
            bubbles: true
        })
    );

    // 极低概率“假点击”，且必须是 body 本身
    if (Math.random() < 0.02) {
        const el = document.elementFromPoint(x, y);
        if (el === document.body) {
            document.body.dispatchEvent(
                new MouseEvent('mousedown', { bubbles: true })
            );
            document.body.dispatchEvent(
                new MouseEvent('mouseup', { bubbles: true })
            );
        }
    }
}




/**
 * 使用 GM_xmlhttpRequest 发送跨域请求，并返回 Promise
 * @param {string} source 搜索词来源
 * @returns {Promise<string[]>} 解析后的搜索词列表
 */
function fetchHotWords(source) {
    return new Promise((resolve, reject) => {
        // API URL 格式: https://api.pearktrue.cn/api/dailyhot/?title=抖音
        const url = Hot_words_apis + '?title=' + source;

        GM_xmlhttpRequest({
            method: "GET",
            url: url,
            timeout: 15000, // 15秒超时
            onload: function(response) {
                if (response.status === 200) {
                    try {
                        const data = JSON.parse(response.responseText);
                        // 检查 API 返回结构和数据有效性
                        if (data && data.code === 200 && data.data && Array.isArray(data.data) && data.data.length > 0) {
                            const names = data.data.map(item => item.title).filter(title => title); // 提取 title 属性值
                            if (names.length > 0) {
                                resolve(names);
                            } else {
                                reject(new Error(`API返回数据中无有效搜索词，来源：${source}`));
                            }
                        } else {
                            reject(new Error(`API返回数据为空或无效 (Code: ${data ? data.code : 'N/A'})，来源：${source}`));
                        }
                    } catch (e) {
                        reject(new Error(`JSON解析失败，来源：${source}`));
                    }
                } else {
                    reject(new Error(`HTTP请求失败，状态码：${response.status}，来源：${source}`));
                }
            },
            onerror: function(error) {
                // 报告更详细的错误信息，有助于调试
                const errorMessage = error.error || '未知网络错误';
                reject(new Error(`网络请求错误: ${errorMessage}，来源：${source}`));
            },
            ontimeout: function() {
                reject(new Error(`请求超时，来源：${source}`));
            }
        });
    });
}

/**
 * 尝试从缓存或多个搜索词来源获取搜索词。
 * 已修改为：以单来源为主，不足 max_rewards 时从其他来源补充。
 * @returns {Promise<string[]>} 返回搜索词列表
 */
async function get_search_words() {
    const todayDate = getTodayDateString();
    const limit = max_rewards; // 目标搜索词数量 (40)

    // 1. 检查缓存
    const lastFetchDate = GM_getValue('LastFetchDate', '');
    const cachedWordsJson = GM_getValue('CachedWords', '[]');

    if (lastFetchDate === todayDate && cachedWordsJson !== '[]') {
        try {
            const cachedWords = JSON.parse(cachedWordsJson);
            if (cachedWords.length > 0) {
                console.log(`✅ 成功从缓存获取今日搜索词 (${cachedWords.length} 个词)。`);
                return cachedWords;
            }
        } catch (e) {
            console.error("缓存搜索词解析失败，将重新获取。", e);
            // 缓存损坏，继续执行获取逻辑
        }
    }

    // 2. 缓存失效或不存在，执行获取逻辑
    console.log(`--- 缓存失效或日期更新，重新从API获取搜索词 (今日日期: ${todayDate}) ---`);

    // 【阶段 1】: 确定主要来源并尝试获取词汇
    const dayOfMonth = new Date().getDate(); // 获取今天是几号 (1-31)
    const totalSources = keywords_sources_all.length;

    // 确定主要来源（单源逻辑）
    const primarySourceIndex = (dayOfMonth - 1) % totalSources;
    const primarySource = keywords_sources_all[primarySourceIndex];

    console.log(`💡 今天选择的主要搜索源是：【${primarySource}】。`);

    let combinedNames = [];

    try {
        const names = await fetchHotWords(primarySource);
        combinedNames = names;
        console.log(`✅ 成功从主要来源【${primarySource}】获取 ${names.length} 个搜索词。`);
    } catch (error) {
        console.error(`❌ 请求主要来源【${primarySource}】搜索源失败:`, error.message);
    }

    // 3. 【阶段 2】: 检查词汇是否足够，不足时从其余来源补充
    let neededCount = limit - combinedNames.length;

    if (neededCount > 0) {
        console.log(`--- 词汇不足 (${combinedNames.length} / ${limit})，尝试从其余来源补充 ${neededCount} 个词 ---`);

        // 找出尚未尝试的来源 (即除了 primarySource 之外的所有源)
        const remainingSources = keywords_sources_all.filter(source =>
                                                             source !== primarySource
                                                            );

        // 顺序尝试剩余来源，补充词库
        for (const source of remainingSources) {
            if (neededCount <= 0) break; // 已经补充足够

            try {
                const names = await fetchHotWords(source);

                // 只取需要的数量
                const termsToTake = Math.min(neededCount, names.length);
                const newTerms = names.slice(0, termsToTake);

                // 将新词汇添加到总列表
                combinedNames.push(...newTerms);
                neededCount -= termsToTake; // 更新还需要多少词

                console.log(`✅ 成功从补充源【${source}】获取 ${newTerms.length} 个搜索词。`);
                console.log(`   -> 仍需补充 ${neededCount} 个词。`);
            } catch (error) {
                // 忽略错误，继续下一个来源
                console.error(`❌ 请求补充源【${source}】失败，继续下一个。`);
            }
        }

        if (neededCount > 0) {
            console.warn(`⚠️ 已遍历所有来源，但未能凑齐 ${limit} 个搜索词。最终数量：${combinedNames.length}。`);
        }
    }

    // 4. 最终结果处理
    if (combinedNames.length > 0) {
        // 成功获取部分或全部词汇，写入缓存并返回
        GM_setValue('CachedWords', JSON.stringify(combinedNames));
        GM_setValue('LastFetchDate', todayDate);
        console.log(`🎉 词汇获取成功，并已缓存。最终总共获取 ${combinedNames.length} 个搜索词。`);
        return combinedNames;
    }

    // 5. 彻底失败，回退到默认词库
    console.error('❌ 所有搜索词来源请求彻底失败。使用默认词库，不进行缓存。');
    return default_search_words;
}


/**
 * 自动将字符串中的字符进行替换 (用于混淆搜索词)
 * 优化：将 rStr 设置为 " " (空格)，以在搜索词中随机插入空格进行混淆。
 * 如果不需要混淆，可以修改 rStr 为 "" 或直接在调用 exec() 时跳过此函数。
 */
function AutoStrTrans(st) {
    let yStr = st; // 原字符串
    let rStr = ""; // 插入的混淆字符，已设置为空格
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

// --- 核心执行函数 ---

// 新增函数：立即执行下一次搜索（用于菜单命令）
function exec_next_search_immediately() {
    'use strict';

    // 避免在暂停状态下执行
    if (GM_getValue('isPaused', false)) {
        console.log("任务当前已暂停，请先点击“继续”或再次点击“下一次搜索”。");
        return;
    }

    // 获取当前搜索次数，如果未设置，则默认为0
    let currentSearchCount = GM_getValue('Cnt', 0);

    // 如果计数器值已经超过最大次数，则重置为0开始新一轮
    if (currentSearchCount >= max_rewards) {
        currentSearchCount = 0;
        GM_setValue('Cnt', 0);
    }

    if (currentSearchCount < max_rewards && search_words.length > 0) {
        let randomString = generateRandomString(4);
        let randomCvid = generateRandomString(32);

        let nowtxt = search_words[currentSearchCount % search_words.length]; // 使用取模确保不越界
        nowtxt = AutoStrTrans(nowtxt);

        let searchUrl;
        // 分批使用不同的域名模拟用户行为 (根据新的 40 次限制调整)
        if (currentSearchCount < max_rewards / 2) { // 40 / 2 = 20 次
            searchUrl = "https://www.bing.com/search?q=" + encodeURIComponent(nowtxt) + "&form=" + randomString + "&cvid=" + randomCvid;
        } else {
            searchUrl = "https://cn.bing.com/search?q=" + encodeURIComponent(nowtxt) + "&form=" + randomString + "&cvid=" + randomCvid;
        }

        // 更新计数器并跳转
        GM_setValue('Cnt', currentSearchCount + 1);
        console.log(`🚀 立即执行第 ${currentSearchCount + 1} 次搜索: ${nowtxt}`);
        location.href = searchUrl;

    } else {
        console.log("所有搜索任务已完成或搜索词库为空。");
        GM_setValue('isPaused', false);
    }
}


function exec() {
    'use strict';

    // 检查是否已暂停，如果已暂停则直接返回，等待“继续”命令。
    if (GM_getValue('isPaused', false)) {
        console.log("任务处于暂停状态，等待继续命令。");
        return;
    }

    // 新增：检查是否需要进行人机验证
    let captchaHeader = document.querySelector('.captcha_header');
    if (captchaHeader && captchaHeader.textContent.includes('最后一步')) {
        GM_setValue('isPaused', true);
        console.log("⚠️ 检测到人机验证，脚本已自动暂停。请手动完成验证后，在油猴菜单中点击“继续”以恢复。");
        return; // 暂停脚本执行
    }

    // 获取当前搜索次数，如果未设置，则默认为超过最大搜索次数（即不自动开始）
    let currentSearchCount = GM_getValue('Cnt', max_rewards + 10);
    // 初始化下一次长暂停
    if (!GM_getValue('NextLongPauseAfter')) {
        const next = Math.floor(Math.random() * 3) + 2; // 2~4 次
        GM_setValue('NextLongPauseAfter', next);
        GM_setValue('ShortSearchCounter', 0);
    }
    // 如果当前页面是搜索结果页，则增加计数器
    if (location.href.includes("/search") && GM_getValue('lastCountUrl', '') !== location.href) {
        let currentSearchCount = GM_getValue('Cnt', 0);
        GM_setValue('Cnt', currentSearchCount + 1);
        GM_setValue('lastCountUrl', location.href); // 防止重复增加
        console.log(`✅ 已完成搜索第 ${currentSearchCount + 1} 次`);
    }

    // 只有在任务没有完成时才执行搜索
    if (currentSearchCount < max_rewards && search_words.length > 0) {
        let tt = document.getElementsByTagName("title")[0];
        // 只有当 <title> 标签存在时才修改它的内容
        if (tt) {
            tt.innerHTML = `[${currentSearchCount + 1} / ${max_rewards}] 自动搜索中... | ${tt.innerHTML}`;
        }

        // 滚动页面到底部，模拟用户行为 (V1.2.1: 增加了随机上滑逻辑)
        smoothScrollToBottom();

        // 生成随机延迟时间 (25秒到90秒)
        let randomDelay = Math.floor(Math.random() * 65000) + 25000;

        console.log(`⏰ ${currentSearchCount + 1} 次搜索将在 ${Math.floor(randomDelay / 1000)} 秒后执行...`);

        setTimeout(function () {
            // 在定时器内部再次检查暂停状态，防止用户在延迟期间点击暂停
            if (GM_getValue('isPaused', false)) {
                console.log("延迟期间收到暂停命令，已取消本次搜索。");
                return;
            }

            let randomString = generateRandomString(4);
            let randomCvid = generateRandomString(32);
            let nowtxt = search_words[currentSearchCount % search_words.length]; // 获取当前搜索词
            nowtxt = AutoStrTrans(nowtxt); // 对搜索词进行替换

            let searchUrl;
            // 根据计数器的值选择搜索引擎 (根据新的 40 次限制调整)
            if (currentSearchCount < max_rewards / 2) { // 40 / 2 = 20 次
                searchUrl = "https://www.bing.com/search?q=" + encodeURIComponent(nowtxt) + "&form=" + randomString + "&cvid=" + randomCvid; // 在Bing搜索引擎中搜索
            } else {
                searchUrl = "https://cn.bing.com/search?q=" + encodeURIComponent(nowtxt) + "&form=" + randomString + "&cvid=" + randomCvid; // 在Bing搜索引擎中搜索
            }

            // 检查是否需要长暂停，即每3次搜索后插入长暂停
            // if ((currentSearchCount + 1) % 3 === 0) {
            //     let longPauseInMinutes = Math.floor(pause_time / 60000);
            //     console.log(`\n💤 已完成 ${currentSearchCount + 1} 次搜索，进入长暂停：约 ${longPauseInMinutes} 分钟。\n`);
            //     setTimeout(function () {
            //          // 长暂停后再次检查暂停状态
            //          if (GM_getValue('isPaused', false)) {
            //              return;
            //          }
            //         GM_setValue('Cnt', currentSearchCount + 1); // 将计数器加1
            //         location.href = searchUrl;
            //     }, pause_time);
            // } else {
            //     // 短暂停后执行
            //     GM_setValue('Cnt', currentSearchCount + 1); // 将计数器加1
            //     location.href = searchUrl;
            // }
            // --- 处理长暂停逻辑 ---
            // --- 处理长暂停逻辑 ---
            let shortCount = GM_getValue('ShortSearchCounter', 0) + 1;
            const nextLongAfter = GM_getValue('NextLongPauseAfter', 3);

            if (shortCount >= nextLongAfter) {
                // 触发长暂停
                const pauseTime = Math.floor(Math.random() * 1104000) + 1524000; // 均匀分布
                console.log(`💤 已完成 ${currentSearchCount + 1} 次搜索，进入长暂停约 ${Math.floor(pauseTime / 60000)} 分钟。`);

                GM_setValue('ShortSearchCounter', 0);
                GM_setValue('NextLongPauseAfter', Math.floor(Math.random() * 3) + 2); // 重置下一次长暂停次数

                setTimeout(() => {
                    GM_setValue('Cnt', currentSearchCount + 1);
                    location.href = searchUrl;
                }, pauseTime);
            } else {
                // 短暂停后直接跳转
                GM_setValue('ShortSearchCounter', shortCount);
                // GM_setValue('Cnt', currentSearchCount + 1);
                location.href = searchUrl;
            }



        }, randomDelay);
    } else {
        // 当达到最大搜索次数时，重置状态
        if (currentSearchCount >= max_rewards) {
            console.log("🎉 所有搜索任务已完成。");
        } else {
            console.log("⚠️ 搜索词库为空，无法执行任务。");
        }
        GM_setValue('isPaused', false);
    }
}



// --- 菜单命令注册 ---
// --- 菜单命令注册 ---


let menu1 = GM_registerMenuCommand('开始 / 重置', function () {
    // 强制清除缓存日期，确保重新启动时会重新获取搜索词
    GM_setValue('LastFetchDate', '');
    GM_setValue('Cnt', 0);
    GM_setValue('isPaused', false);
    GM_setValue('MaxRewards', null); // 强制重新随机本轮 max_rewards

    console.log("任务已重置，并强制清空搜索词缓存，将重新获取。");
    // 跳转到首页触发脚本执行
    location.href = "https://www.bing.com/search?q=" + encodeURIComponent(search_words[0]);

}, 'o');

let menu2 = GM_registerMenuCommand('暂停', function () {
    GM_setValue('isPaused', true);
    console.log("任务已暂停。");
}, 'p');

let menu3 = GM_registerMenuCommand('继续', function () {
    GM_setValue('isPaused', false);
    console.log("任务已恢复，即将开始下一轮搜索。");
    // 在当前页面直接调用 exec() 来恢复任务
    exec();
}, 'c');

let menu4 = GM_registerMenuCommand('结束程序', function () {
    // 将计数器设置为一个超出最大值的数来停止自动任务
    GM_setValue('Cnt', max_rewards + 10);
    GM_setValue('isPaused', false);
    console.log("程序已强制结束。");
}, 'e');

// 新增功能：执行下一次搜索
let menu5 = GM_registerMenuCommand('下一次搜索 (立即)', function () {
    // 将暂停状态设为false，并立即执行下一次搜索，不进行延时
    GM_setValue('isPaused', false);
    exec_next_search_immediately();
}, 'n');
// 菜单命令：跳转到第 n 次搜索
let menu6 = GM_registerMenuCommand('跳转到第 n 次搜索', function () {
    if (!search_words || search_words.length === 0) {
        alert("⚠️ 搜索词库为空，请先获取搜索词或重置任务。");
        return;
    }

    let n = prompt(`请输入要跳转到的搜索次数 (1-${max_rewards})：`);
    if (n === null) return; // 用户取消

    n = parseInt(n);
    if (isNaN(n) || n < 1 || n > max_rewards) {
        alert(`❌ 输入无效，请输入 1-${max_rewards} 的整数。`);
        return;
    }

    // 更新计数器为 n-1
    GM_setValue('Cnt', n - 1);
    GM_setValue('isPaused', false); // 自动解除暂停
    console.log(`🔢 已跳转到第 ${n} 次搜索，即将执行...`);

    // 执行对应搜索
    exec_next_search_immediately();
}, 'j');

// --- 启动脚本 ---

// 执行搜索词获取，成功后调用 exec()
get_search_words()
    .then(names => {
    search_words = names;
    // >>> 打印完整搜索词数组 <<<
    console.log("搜索词列表:", names);
    // 如果当前页面已经是搜索结果页，且计数器小于最大值，则继续执行
    exec();
})
    .catch(error => {
    // 如果获取失败，使用默认词库并继续执行
    search_words = default_search_words;
    console.warn("⚠️ 热门词获取失败，使用默认词库。");
    // >>> 打印默认搜索词数组 <<<
    console.log("搜索词列表 (默认词库):", search_words);
    exec();
});