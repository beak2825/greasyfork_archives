// ==UserScript==
// @name         干掉新版b站评论区的搜索 (放大镜/蓝字) 功能
// @namespace    https://greasyfork.org/zh-CN/scripts/447612-%E5%B9%B2%E6%8E%89%E6%96%B0%E7%89%88b%E7%AB%99%E8%AF%84%E8%AE%BA%E5%8C%BA%E7%9A%84%E6%90%9C%E7%B4%A2-%E6%94%BE%E5%A4%A7%E9%95%9C-%E8%93%9D%E5%AD%97-%E5%8A%9F%E8%83%BD
// @version      0.8.3
// @description  干掉新版b站评论区的评论搜索 (放大镜/蓝字) .
// @author       DuckBurnIncense
// @match        *://www.bilibili.com/video/*
// @match        *://www.bilibili.com/medialist/play/watchlater/*
// @match        *://www.bilibili.com/bangumi/play/*
// @match        *://t.bilibili.com/*
// @match        *://www.bilibili.com/list/*
// @match        *://space.bilibili.com/*
// @icon         https://www.bilibili.com/favicon.ico
// @homepage     //duckburnincense.ml/
// @supportURL   https://www.bilibili.com/video/BV1SS4y1E7xB
// @license      MIT
// @run-at       document-end
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/447612/%E5%B9%B2%E6%8E%89%E6%96%B0%E7%89%88b%E7%AB%99%E8%AF%84%E8%AE%BA%E5%8C%BA%E7%9A%84%E6%90%9C%E7%B4%A2%20%28%E6%94%BE%E5%A4%A7%E9%95%9C%E8%93%9D%E5%AD%97%29%20%E5%8A%9F%E8%83%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/447612/%E5%B9%B2%E6%8E%89%E6%96%B0%E7%89%88b%E7%AB%99%E8%AF%84%E8%AE%BA%E5%8C%BA%E7%9A%84%E6%90%9C%E7%B4%A2%20%28%E6%94%BE%E5%A4%A7%E9%95%9C%E8%93%9D%E5%AD%97%29%20%E5%8A%9F%E8%83%BD.meta.js
// ==/UserScript==

// 匿名函数防止b站通过特定变量名屏蔽脚本
(function() {
    // 是否把关键词替换为不可点击的斜体
    // 这个功能主要是给我调试脚本用的
    // 默认禁用
    const changeToItalic = GM_getValue('changeToItalic', 0);
    // 注册油猴的菜单项
    GM_registerMenuCommand((changeToItalic ? '[✔️已启用]' : '[❌已禁用]') + " 将关键词替换为斜体", function() {
        GM_setValue('changeToItalic', !changeToItalic);
        alert('修改成功, 刷新页面后生效');
    });

    // 是否适配 "Bilibili 翻页评论区" 脚本
    const fanye = GM_getValue('fanye', 0);
    GM_registerMenuCommand((fanye ? '[✔️已启用]' : '[❌已禁用]') + " 兼容脚本 \"Bilibili 翻页评论区\"", function() {
        GM_setValue('fanye', !fanye);
        alert('修改成功, 刷新页面后生效');
    });

    // 判断浏览器类型
    const browserType = (navigator.userAgent.indexOf('Chrome') != -1) ? 'Chrome' : 'Firefox'

    // 替换 a 标签的正则表达式
    const searchWordsOuterHTMLRegexr = /^(?:<a.*?>)(.*)(?:<\/a>)$/gim;

    // queries
    // a 是蓝字
    // i 是放大镜图标
    // browser 是支持的浏览器
    // fanye 是是否适配 "Bilibili 翻页评论区" 脚本
    const queries = [
        {
            a: 'a.jump-link.search-word',
            i: 'i.icon.search-word',
            browser: ['Chrome', 'Firefox'],
            fanye: false
        },
        {
            a: 'a.comment-jump-url[href*="undefined"]',
            i: 'img.jump-img:not([src*="bfs/activity-plat/static"])',
            browser: ['Chrome', 'Firefox'],
            fanye: true
        },
        {
            a: 'a.underline-link.comment-jump-url',
            i: 'i.underline.jump-img',
            browser: ['Chrome', 'Firefox'],
            fanye: false
        },
    ];

    // 因为评论区是异步加载的, 所以要定时重复执行.
    // 试过 hook ajax 请求, 但有些它直接用 jsonp 方式加载评论区, 所以不行.
    setInterval(() => {
        // 遍历 queries
        queries.forEach(query => {
            // 如果是 不支持的浏览器 或 该 query 不适配翻页 则跳过
            if (!query.browser.includes(browserType) || fanye != query.fanye) return;
            // 取出 dom 元素
            let words = document.querySelectorAll(query.a);
            let icons = document.querySelectorAll(query.i);
            // 遍历删除
            words.forEach(word => {
                // 如果需要替换为斜体则替换为斜体否则直接删除
                word.outerHTML = word.outerHTML.replace(searchWordsOuterHTMLRegexr, changeToItalic ? `<span style="font-style:italic;">$1</span>` : '$1');
            });
            icons.forEach(icon => {
                icon.remove();
            });
        });
        // b 站最近 (2024-07) 用上了 ShadowRoot 技术
        let biliComments = document.querySelector('bili-comments');
        if (biliComments && biliComments.shadowRoot) {
            biliComments.shadowRoot.querySelectorAll('bili-comment-thread-renderer').forEach((biliCommentThreadRenderer) => {
                biliCommentThreadRenderer.shadowRoot.querySelectorAll('bili-comment-renderer').forEach((biliCommentRenderer) => {
                    biliCommentRenderer.shadowRoot.querySelectorAll('bili-rich-text').forEach((biliRichText) => {
                        biliRichText.shadowRoot.querySelectorAll('a[href^="//search.bilibili.com/all?from_source=webcommentline_search"]').forEach(a => {
                            // 移除搜索图标
                            a.querySelector('img').remove();
                            // 处理蓝字
                            a.outerHTML = a.outerHTML.replace(searchWordsOuterHTMLRegexr, changeToItalic ? `<span style="font-style:italic;">$1</span>` : '$1');
                        });
                    });
                });
                biliCommentThreadRenderer.shadowRoot.querySelectorAll('bili-comment-replies-renderer').forEach((biliCommentRepliesRenderer) => {
                    biliCommentRepliesRenderer.shadowRoot.querySelectorAll('bili-comment-reply-renderer').forEach((biliCommentReplyRenderer) => {
                        biliCommentReplyRenderer.shadowRoot.querySelectorAll('bili-rich-text').forEach((biliRichText) => {
                            biliRichText.shadowRoot.querySelectorAll('a[href^="//search.bilibili.com/all?from_source=webcommentline_search"]').forEach(a => {
                                // 移除搜索图标
                                a.querySelector('img').remove();
                                // 处理蓝字
                                a.outerHTML = a.outerHTML.replace(searchWordsOuterHTMLRegexr, changeToItalic ? `<span style="font-style:italic;">$1</span>` : '$1');
                            });
                        });
                    });
                });
            });
        }
    }, 1000);
})();