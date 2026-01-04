// ==UserScript==
// @name         百度新闻视频评论关键词屏蔽
// @namespace    https://github.com/zuiyuewentian/ClearBaiduAd
// @version      1.0
// @description  屏蔽百度新闻视频评论中包含"大病"、"生病"、"治疗"、"求助"、"好心"等关键词的评论
// @author       zuiyuewentian
// @match        https://mbd.baidu.com/newspage/data/*
// @grant        none
// @license      Apache-2.0
// @downloadURL https://update.greasyfork.org/scripts/542067/%E7%99%BE%E5%BA%A6%E6%96%B0%E9%97%BB%E8%A7%86%E9%A2%91%E8%AF%84%E8%AE%BA%E5%85%B3%E9%94%AE%E8%AF%8D%E5%B1%8F%E8%94%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/542067/%E7%99%BE%E5%BA%A6%E6%96%B0%E9%97%BB%E8%A7%86%E9%A2%91%E8%AF%84%E8%AE%BA%E5%85%B3%E9%94%AE%E8%AF%8D%E5%B1%8F%E8%94%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 定义需要屏蔽的关键词
    const keywords = ['大病', '生病', '治疗', '求助', '好心'];

    // 检查文本是否包含关键词
    function containsKeyword(text) {
        if (!text) return false;
        return keywords.some(keyword => text.includes(keyword));
    }

    // 处理评论的函数
    function processComments() {
        // 获取所有评论项
        const commentItems = document.querySelectorAll('.xcp-item');

        commentItems.forEach(item => {
            // 获取用户名
            const usernameElement = item.querySelector('.user-bar-uname');
            const username = usernameElement ? usernameElement.textContent.trim() : '';

            // 获取评论内容
            const contentElement = item.querySelector('.x-interact-rich-text');
            let content = '';

            if (contentElement) {
                // 获取所有文本内容
                const textElements = contentElement.querySelectorAll('.type-text');
                content = Array.from(textElements).map(el => el.textContent).join('');
            }

            // 如果用户名或内容包含关键词，则隐藏该评论
            if (containsKeyword(username) || containsKeyword(content)) {
                item.style.display = 'none';
                console.log('已屏蔽评论:', { username, content });
            }
        });
    }

    // 页面加载完成后执行
    window.addEventListener('load', function() {
        // 初始处理
        setTimeout(processComments, 2000); // 延迟2秒确保评论加载完成

        // 监听DOM变化，处理动态加载的评论
        const observer = new MutationObserver(function(mutations) {
            let shouldProcess = false;

            mutations.forEach(function(mutation) {
                if (mutation.addedNodes.length > 0) {
                    // 检查新增的节点中是否包含评论
                    for (let node of mutation.addedNodes) {
                        if (node.nodeType === 1) { // 元素节点
                            if (node.classList && node.classList.contains('xcp-item')) {
                                shouldProcess = true;
                                break;
                            }
                            // 检查子节点中是否包含评论
                            if (node.querySelector && node.querySelector('.xcp-item')) {
                                shouldProcess = true;
                                break;
                            }
                        }
                    }
                }
            });

            if (shouldProcess) {
                setTimeout(processComments, 500); // 延迟处理，确保内容渲染完成
            }
        });

        // 开始监听
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });

    // 定期处理，防止遗漏
    setInterval(processComments, 5000);
})();