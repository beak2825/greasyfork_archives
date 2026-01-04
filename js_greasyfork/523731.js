// ==UserScript==
// @name         妖火吃肉回复过滤
// @namespace    https://www.yaohuo.me/bbs/userinfo.aspx?touserid=20740
// @version      1.0.0
// @description  屏蔽妖火论坛派肉贴中的吃肉回复楼层
// @author       SiXi
// @icon         https://yaohuo.me/css/favicon.ico
// @match        https://www.yaohuo.me/bbs-*.html
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/523731/%E5%A6%96%E7%81%AB%E5%90%83%E8%82%89%E5%9B%9E%E5%A4%8D%E8%BF%87%E6%BB%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/523731/%E5%A6%96%E7%81%AB%E5%90%83%E8%82%89%E5%9B%9E%E5%A4%8D%E8%BF%87%E6%BB%A4.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 定义屏蔽关键词
    const blockKeywords = ["吃", "7了", "肉", "恰", "口乞", "chi"];

    // 检查当前页面是否是肉贴
    function isLijinPost() {
        return document.querySelector('span.lijin') !== null;
    }

    // 屏蔽包含屏蔽关键词的楼层
    function filterReplies() {
        // 获取所有楼层
        const posts = document.querySelectorAll('.forum-post');

        posts.forEach(post => {
            // 判断是否为吃肉回复楼层
            const rewardInfo = post.querySelector('.admin-actions .reward-info');
            if (rewardInfo) {
                // 获取楼层正文内容
                const content = post.querySelector('.post-content .retext');
                if (content) {
                    const text = content.textContent.trim();
                    // 如果正文包含任何屏蔽关键词，屏蔽该楼层
                    if (blockKeywords.some(keyword => text.includes(keyword))) {
                        post.style.display = 'none'; // 隐藏该楼层
                    }
                }
            }
        });
    }

    // 监听页面AJAX加载新回复内容动态
    function observeDynamicContent() {
        const targetNode = document.getElementById('YH_show_tip');
        if (targetNode) {
            // 使用MutationObserver来监听AJAX加载的内容
            const observer = new MutationObserver((mutationsList, observer) => {
                mutationsList.forEach(mutation => {
                    if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                        filterReplies(); // 新内容加载后筛选
                    }
                });
            });
            observer.observe(targetNode, { childList: true });
        }
    }

    // 初始加载时检查页面并过滤内容
    if (isLijinPost()) {
        filterReplies(); // 过滤肉贴吃肉回复
    }

    // 监听AJAX加载的下一页内容
    observeDynamicContent();
})();
