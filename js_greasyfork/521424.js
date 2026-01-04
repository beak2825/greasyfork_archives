// ==UserScript==
// @name         循环搜索脚本 - 随机搜索问题
// @namespace    http://tampermonkey.net/
// @version      v0.3
// @description  随机从预定义的问题列表中选择问题进行搜索，搜索后清空内容并刷新页面
// @author       Huaimin
// @match        https://*.bing.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/521424/%E5%BE%AA%E7%8E%AF%E6%90%9C%E7%B4%A2%E8%84%9A%E6%9C%AC%20-%20%E9%9A%8F%E6%9C%BA%E6%90%9C%E7%B4%A2%E9%97%AE%E9%A2%98.user.js
// @updateURL https://update.greasyfork.org/scripts/521424/%E5%BE%AA%E7%8E%AF%E6%90%9C%E7%B4%A2%E8%84%9A%E6%9C%AC%20-%20%E9%9A%8F%E6%9C%BA%E6%90%9C%E7%B4%A2%E9%97%AE%E9%A2%98.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 通用延迟函数，带随机延迟
    function delay(min, max) {
        const randomDelay = Math.floor(Math.random() * (max - min + 1)) + min;
        return new Promise(resolve => setTimeout(resolve, randomDelay));
    }

    // 名词列表
    const nouns = [
        "编程", "人工智能", "时间管理", "数据结构", "算法",
        "团队协作", "科技产品", "创业", "创新思维", "写作能力",
        "语言学习", "自我管理", "健康生活", "投资理财", "心理建设",
        "区块链技术", "未来技术", "职业规划", "科学研究", "教育资源",
        "网络安全", "物联网", "5G技术", "大数据", "云计算",
        "机器人技术", "虚拟现实", "增强现实", "绿色能源", "全球变暖"
    ];

    // 动词列表
    const verbs = [
        "提高", "学习", "掌握", "选择", "优化",
        "规划", "利用", "探索", "分析", "改进",
        "了解", "实现", "完成", "提升", "创建",
        "设计", "实施", "执行", "观察", "适应",
        "开发", "诊断", "解决", "预防", "创新"
    ];

    // 形容词列表
    const adjectives = [
        "高效的", "实用的", "有趣的", "先进的", "快速的",
        "有效的", "创新的", "专业的", "重要的", "灵活的",
        "全面的", "可靠的", "智能的", "优质的", "经济的",
        "可持续的", "多样化的", "精确的", "动态的", "强大的",
        "友好的", "环保的", "稳定的", "易用的", "个性化的"
    ];

    // 组合问题生成器
    function generateRandomQuery() {
        const noun = nouns[Math.floor(Math.random() * nouns.length)];
        const verb = verbs[Math.floor(Math.random() * verbs.length)];
        const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];

        // 生成类似“如何提高编程能力？”的问题
        return `如何${verb}${adjective}${noun}？`;
    }

    async function executeSearch() {
        // 第一步：等待随机时间后开始执行搜索
        const waitTime = Math.floor(Math.random() * (20000 - 10000 + 1)) + 10000;  // 随机等待时间 10-20 秒
        console.log(`等待 ${waitTime / 1000} 秒...`);
        await delay(waitTime, waitTime);

        // 第二步：获取输入框和按钮
        console.log("查找输入框和搜索按钮...");
        const input = document.querySelector(".b_searchbox");
        const searchButton = document.querySelector("#sb_form_go");

        if (input && searchButton) {
            // 第三步：随机生成一个搜索问题
            const searchQuery = generateRandomQuery();
            console.log("生成的搜索关键词: " + searchQuery);

            const inputDelay = Math.floor(Math.random() * (3000 - 1000 + 1)) + 1000;  // 随机延迟 1-3 秒
            await delay(inputDelay, inputDelay);

            // 第四步：设置输入框值
            console.log("设置输入框值...");
            input.value = searchQuery;
            await delay(inputDelay, inputDelay);  // 随机延迟 1-3 秒

            // 第五步：点击搜索按钮
            console.log("点击搜索按钮...");
            searchButton.click();

            // 第六步：等待搜索结果加载完成
            const resultWaitTime = Math.floor(Math.random() * (7000 - 5000 + 1)) + 5000;  // 随机等待 5-7 秒
            console.log(`等待搜索结果加载 (${resultWaitTime / 1000} 秒)...`);
            await delay(resultWaitTime, resultWaitTime);

            // 第七步：清空输入框内容
            console.log("清空输入框内容...");
            input.value = '';

            // 第八步：刷新页面
            console.log("刷新页面...");
            location.reload();
        } else {
            console.log("输入框或搜索按钮未找到");
        }
    }

    // 执行搜索操作
    executeSearch();
})();
