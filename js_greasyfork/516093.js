// ==UserScript==
// @name         Lsposed 模块仓库汉化插件
// @namespace    http://tampermonkey.net/
// @version      1.5.1
// @description  Lsposed 模块仓库汉化插件，中文化界面。
// @author       TC999
// @match        https://modules.lsposed.org/*
// @grant        none
// @license      GPL-3.0
// @icon         https://modules.lsposed.org/icons/icon-512x512.png
// @supportURL   https://github.com/TC999/module-lsposed-chinese/issues
// @downloadURL https://update.greasyfork.org/scripts/516093/Lsposed%20%E6%A8%A1%E5%9D%97%E4%BB%93%E5%BA%93%E6%B1%89%E5%8C%96%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/516093/Lsposed%20%E6%A8%A1%E5%9D%97%E4%BB%93%E5%BA%93%E6%B1%89%E5%8C%96%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 如果页面 lang 属性为 "en"，则将其更改为 "zh"
    if (document.documentElement.lang === "en") {
        document.documentElement.lang = "zh";
    }

    // 页面内容的词条替换表：左边为英文，右边为对应的中文
    const translationMap = {
        "Xposed Module Repository": "Xposed 模块仓库",

        "Search": "搜索",
        "No results found": "无结果",
        // 左侧
        "Browse": "浏览",
        "Submission": "提交",
            "Website": "网站",
            "Source": "源码",
        // 具体某个模块页面
            "Package": "包名",
            "Authors": "作者",
            "Support / Discussion URL": "支持 / 讨论地址",
            "源码 URL": "源码仓库",
            "Release Type": "类型",
            "Releases": "发行版",
                "View all releases": "查看所有发行版",
            "Downloads": "下载",
                "Show older versions": "显示旧版",
        // 提交页
            "Submit Your Xposed Module": "提交您的 Xposed 模块",
            "I'd like to": "操作：",
                "Select": "选择",
                "Submit a new package": "提交新模块",
                "Transfer package ownership": "转让模块所有权",
                "Appeal for package name/ownership": " 呼吁包名/所有权",
                "Report an issue": "提交议题",
                "Give some suggestions": "提供建议",
            "Title": "标题",
            "Description (Reason)": "描述（理由）",
                "Describe it": "描述",
            "Submit": "提交",
        // 错误页
            "try somewhere else": "未找到",
        // 你可以继续添加其他词条及其对应的翻译
    };

    // 页面标题的词条替换表
    const titleTranslationMap = {
        "Browse Modules - Xposed Module Repository": "浏览 - Xposed 模块仓库",
        "Submission - Xposed Module Repository": "提交 - Xposed 模块仓库",
        "Not Found - Xposed Module Repository": "未找到 - Xposed 模块仓库",
        "Xposed Module Repository": "Xposed 模块仓库",
        // 其他标题词条可继续添加
    };

    // 替换页面中的文本
    function replaceTextContent(node, map) {
        for (const [enText, zhText] of Object.entries(map)) {
            const regex = new RegExp(`\\b${enText}\\b(?=\\W|$)`, 'g');
            node.textContent = node.textContent.replace(regex, zhText);
        }
    }

    // 替换页面标题
    function translateTitle() {
        let title = document.title;
        for (const [enTitle, zhTitle] of Object.entries(titleTranslationMap)) {
            const regex = new RegExp(`\\b${enTitle}\\b(?=\\W|$)`, 'g');
            title = title.replace(regex, zhTitle);
        }
        // 更新页面标题
        if (document.title !== title) {
            document.title = title;
        }
    }

    // 遍历所有页面中的文本节点
    function translatePage() {
        const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
        let node;
        while (node = walker.nextNode()) {
            replaceTextContent(node, translationMap);
        }
    }

    // 监听页面内容更新（例如动态加载内容）
    const observer = new MutationObserver(translatePage);
    observer.observe(document.body, { childList: true, subtree: true });

    // 定时检查标题并翻译
    setInterval(translateTitle, 1000); // 每秒检查一次标题

    // 初始翻译页面内容和标题
    translatePage();
    translateTitle();
})();
