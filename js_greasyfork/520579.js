// ==UserScript==
// @name         知乎关键词过滤助手
// @namespace    http://tampermonkey.net/
// @version      0.9
// @description  过滤知乎推荐中包含特定关键词的内容，支持黑白名单和模式切换
// @author       You
// @match        https://www.zhihu.com/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @license      AGPLv3
// @downloadURL https://update.greasyfork.org/scripts/520579/%E7%9F%A5%E4%B9%8E%E5%85%B3%E9%94%AE%E8%AF%8D%E8%BF%87%E6%BB%A4%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/520579/%E7%9F%A5%E4%B9%8E%E5%85%B3%E9%94%AE%E8%AF%8D%E8%BF%87%E6%BB%A4%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 默认黑名单关键词 不区分大小写
    const defaultBlacklist = ["洗地机", "GOOVIS"];
    // 默认白名单关键词 不区分大小写
    const defaultWhitelist = ["AI", "Gemini", "Anthropic"];

    // 获取已保存的黑白名单，如果没有则使用默认值, 并转换为 Set
    let blacklist = new Set(GM_getValue("blacklist", defaultBlacklist));
    let whitelist = new Set(GM_getValue("whitelist", defaultWhitelist));
    // 获取当前的过滤模式，默认为黑名单模式
    let filterMode = GM_getValue("filterMode", "blacklist");
    let whitelistRegex = null;
    let blacklistRegex = null;

    // 构建正则表达式
    function buildRegex() {
        whitelistRegex = new RegExp(Array.from(whitelist).join("|"), "i"); // "i" 表示忽略大小写
        blacklistRegex = new RegExp(Array.from(blacklist).join("|"), "i");
    }

    buildRegex(); // 初始构建

    // 过滤函数，只针对单个元素进行过滤
    function filterElement(element) {
        const textContent = element.textContent; // 缓存 textContent
        let shouldHide = false;

        if (filterMode === "blacklist") {
            // 黑名单模式：使用正则表达式匹配
            shouldHide = blacklistRegex.test(textContent);
        } else if (filterMode === "whitelist") {
            // 白名单模式：先用白名单正则匹配，再用黑名单正则排除
            shouldHide = !whitelistRegex.test(textContent);
            if (!shouldHide && blacklistRegex.test(textContent)) {
                shouldHide = true;
            }
        }

        if (shouldHide && element.style.display !== "none") {
            element.style.display = "none";
            console.log("Blacklisted: " + textContent);
        } else if (!shouldHide && element.style.display === "none") {
            element.style.display = "";
        }
    }

    // 过滤函数，用于过滤整个页面
    function filterContent() {
        const elements = document.querySelectorAll("div.TopstoryItem-isRecommend.TopstoryItem.Card");
        elements.forEach(filterElement);
    }

    // 使用 MutationObserver 监听动态加载的内容
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                // 只处理元素节点，并且是目标元素
                if (node.nodeType === Node.ELEMENT_NODE && node.matches('div.TopstoryItem-isRecommend.TopstoryItem.Card')) {
                    filterElement(node); // 对新添加的单个节点进行过滤
                }
            });
        });
    });

    const config = { childList: true, subtree: true };
    observer.observe(document.body, config);

    // 初始过滤
    filterContent();

    // 添加设置菜单
    function addMenuCommands() {
        GM_registerMenuCommand("设置黑名单", () => {
            let newBlacklist = prompt("请输入黑名单关键词，用逗号分隔", Array.from(blacklist).join(","));
            if (newBlacklist !== null) {
                // 将中文逗号替换为英文逗号
                newBlacklist = newBlacklist.replace(/，/g, ",");
                blacklist = new Set(newBlacklist.split(",").map(s => s.trim()));
                GM_setValue("blacklist", Array.from(blacklist)); // 存储时还需要转为数组
                buildRegex();
                filterContent();
            }
        });

        GM_registerMenuCommand("设置白名单", () => {
            let newWhitelist = prompt("请输入白名单关键词，用逗号分隔", Array.from(whitelist).join(","));
            if (newWhitelist !== null) {
                // 将中文逗号替换为英文逗号
                newWhitelist = newWhitelist.replace(/，/g, ",");
                whitelist = new Set(newWhitelist.split(",").map(s => s.trim()));
                GM_setValue("whitelist", Array.from(whitelist)); // 存储时还需要转为数组
                buildRegex();
                filterContent();
            }
        });

        GM_registerMenuCommand("切换到黑名单模式", () => {
            filterMode = "blacklist";
            GM_setValue("filterMode", filterMode);
            // buildRegex(); // 切换模式不需要重新构建正则
            filterContent();
        });

        GM_registerMenuCommand("切换到白名单模式", () => {
            filterMode = "whitelist";
            GM_setValue("filterMode", filterMode);
            // buildRegex(); // 切换模式不需要重新构建正则
            filterContent();
        });
    }

    addMenuCommands();
})();