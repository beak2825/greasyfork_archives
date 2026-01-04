// ==UserScript==
// @name         尚香书苑-刘备文版块 帖子保留器（仅显示含关键词标题，测试版本，请谨慎使用）
// @namespace    https://greasyfork.org/zh-CN/users/1441970-南竹
// @version      1.0
// @description  只显示标题中包含特定关键词的帖子，其他帖子将被屏蔽。
// @author       南竹
// @match        https://sxsy122.com/forum-*-*
// @match        https://sxsy122.com/forum-*-*.html
// @match        https://sxsy122.com/forum.php?mod=forumdisplay&fid=*
// @match        https://sxsy122.com/forum.php?mod=forumdisplay&fid=*&page=*
// @match        https://sxsy19.com/forum-*-*
// @match        https://sxsy19.com/forum-*-*.html
// @match        https://sxsy19.com/forum.php?mod=forumdisplay&fid=*
// @match        https://sxsy19.com/forum.php?mod=forumdisplay&fid=*&page=*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/530373/%E5%B0%9A%E9%A6%99%E4%B9%A6%E8%8B%91-%E5%88%98%E5%A4%87%E6%96%87%E7%89%88%E5%9D%97%20%E5%B8%96%E5%AD%90%E4%BF%9D%E7%95%99%E5%99%A8%EF%BC%88%E4%BB%85%E6%98%BE%E7%A4%BA%E5%90%AB%E5%85%B3%E9%94%AE%E8%AF%8D%E6%A0%87%E9%A2%98%EF%BC%8C%E6%B5%8B%E8%AF%95%E7%89%88%E6%9C%AC%EF%BC%8C%E8%AF%B7%E8%B0%A8%E6%85%8E%E4%BD%BF%E7%94%A8%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/530373/%E5%B0%9A%E9%A6%99%E4%B9%A6%E8%8B%91-%E5%88%98%E5%A4%87%E6%96%87%E7%89%88%E5%9D%97%20%E5%B8%96%E5%AD%90%E4%BF%9D%E7%95%99%E5%99%A8%EF%BC%88%E4%BB%85%E6%98%BE%E7%A4%BA%E5%90%AB%E5%85%B3%E9%94%AE%E8%AF%8D%E6%A0%87%E9%A2%98%EF%BC%8C%E6%B5%8B%E8%AF%95%E7%89%88%E6%9C%AC%EF%BC%8C%E8%AF%B7%E8%B0%A8%E6%85%8E%E4%BD%BF%E7%94%A8%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('脚本 3.2 已加载');

    // 定义要保留的关键词
    var keywords = [
        '长篇', // 示例关键词
        '合集', // 示例关键词
        '待替换关键词' // 示例关键词
    ];

    // 创建一个通用的保留函数
    function retainTopics(selector) {
        try {
            var topics = document.querySelectorAll(selector);
            console.log('找到 ' + topics.length + ' 个帖子 (选择器: ' + selector + ')');
            for (var i = topics.length - 1; i >= 0; i--) {
                var a = topics[i];
                var title = a.innerText.trim() || '';
                var titleLower = title.toLowerCase();
                var keep = false;

                if (!title) {
                    console.log('Warning: Empty title for ' + a.href);
                    continue;
                }

                // 检查标题是否包含任一关键词
                for (var j = 0; j < keywords.length; j++) {
                    var keyword = keywords[j].toLowerCase();
                    if (titleLower.includes(keyword)) {
                        keep = true;
                        console.log('Retained: ' + a.href + ' [Title: ' + title + '] - Matched keyword: ' + keyword);
                        break;
                    }
                }

                // 如果标题不包含任何关键词，则移除
                if (!keep) {
                    console.log('Removed: ' + a.href + ' [Title: ' + title + '] - No keyword match');
                    var parentRow = a.closest('tr');
                    if (parentRow) {
                        parentRow.remove();
                    } else {
                        console.log('Error: Could not find parent row for ' + a.href);
                    }
                }
            }
        } catch (e) {
            console.log('retainTopics 出错: ' + e.message);
        }
    }

    // 主要选择器：帖子标题
    var mainSelector = 'a.s.xst';

    // 在页面加载完成后执行
    function runFilter() {
        retainTopics(mainSelector);
    }

    // 初始执行
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        runFilter();
    } else {
        window.addEventListener('DOMContentLoaded', runFilter);
    }

    // 观察 DOM 变化并重新执行保留逻辑
    var observer = new MutationObserver(function(mutations) {
        retainTopics(mainSelector);
    });

    // 开始观察容器
    var containers = document.querySelectorAll('.replaybox, .hottiebox, .goodtiebox, tbody');
    containers.forEach(function(container) {
        observer.observe(container, { childList: true, subtree: true });
    });
})();