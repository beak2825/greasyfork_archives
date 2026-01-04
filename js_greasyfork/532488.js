// ==UserScript==
// @name         PandaLive 19+ Filter
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  只显示 PandaLive 网站上的 19+ 直播
// @author       skktck
// @match        https://www.pandalive.co.kr/*
// @match        https://pandalive.co.kr/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/532488/PandaLive%2019%2B%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/532488/PandaLive%2019%2B%20Filter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 主函数，用于过滤直播
    function filterLiveStreams() {
        console.log("PandaLive 19+ 过滤器已启动");

        // 找到所有直播卡片的父容器元素 (li)
        const liveCardContainers = document.querySelectorAll('li[data-sentry-component="BroadcastUserItem"], .card, .live-card, [class*="card"]');

        liveCardContainers.forEach(container => {
            // 检查卡片是否包含19+图标 (寻找包含 ico_19.png 的图片元素)
            const has19Plus = container.querySelector('img[src*="ico_19.png"]');

            if (!has19Plus) {
                // 如果不是19+直播，完全隐藏该卡片容器
                container.style.display = 'none';
            } else {
                // 确保19+直播是可见的
                container.style.display = '';
            }
        });
    }

    // 处理登录按钮点击问题
    function fixLoginButton() {
        // 监听所有可能的登录按钮点击
        document.addEventListener('click', function(event) {
            // 检查是否点击了登录按钮
            if (event.target &&
                (event.target.textContent === '로그인' ||
                 (event.target.closest('button') && event.target.closest('button').textContent === '로그인') ||
                 (event.target.closest('a') && event.target.closest('a').textContent === '로그인'))) {

                console.log("检测到登录按钮点击");

                // 确保登录模态框存在
                setTimeout(() => {
                    const loginModal = document.querySelector('[data-modal="LoginRegisterMenuItem"]');
                    if (loginModal && loginModal.style.display === 'none') {
                        loginModal.style.display = 'block';
                        console.log("已强制显示登录模态框");
                    }

                    // 查找并尝试激活登录标签
                    const loginTab = document.querySelector('[role="tab"][aria-controls*="login"]');
                    if (loginTab) {
                        loginTab.click();
                        console.log("已点击登录标签");
                    }
                }, 300);
            }
        }, true);
    }

    // 创建一个观察器来处理动态加载的内容
    function createObserver() {
        // 观察整个文档变化
        const observer = new MutationObserver((mutations) => {
            let shouldFilter = false;

            // 检查是否有相关变化
            mutations.forEach(mutation => {
                if (mutation.addedNodes.length > 0 ||
                    (mutation.type === 'attributes' && mutation.target.tagName === 'IMG') ||
                    (mutation.type === 'childList')) {
                    shouldFilter = true;
                }
            });

            // 如果有相关变化，执行过滤
            if (shouldFilter) {
                filterLiveStreams();
            }
        });

        // 配置观察器选项
        const config = {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['src', 'class', 'style']
        };

        // 开始观察
        observer.observe(document.body, config);

        return observer;
    }

    // 添加控制按钮，可以临时开关过滤功能
    function addControlButton() {
        const button = document.createElement('button');
        button.textContent = '19+ 过滤: 开启';
        button.style.position = 'fixed';
        button.style.top = '10px';
        button.style.left = '10px'; // 修改为左上角
        button.style.zIndex = '9999';
        button.style.padding = '5px 10px';
        button.style.backgroundColor = '#ff4757';
        button.style.color = 'white';
        button.style.border = 'none';
        button.style.borderRadius = '5px';
        button.style.cursor = 'pointer';
        button.style.fontSize = '14px'; // 调整字体大小
        button.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)'; // 添加阴影效果增强可见性

        let filterEnabled = true;

        button.addEventListener('click', () => {
            filterEnabled = !filterEnabled;
            button.textContent = filterEnabled ? '19+ 过滤: 开启' : '19+ 过滤: 关闭';
            button.style.backgroundColor = filterEnabled ? '#ff4757' : '#7f8fa6';

            // 获取所有卡片容器元素并恢复/过滤它们
            const allContainers = document.querySelectorAll('li[data-sentry-component="BroadcastUserItem"], .card, .live-card, [class*="card"]');
            allContainers.forEach(container => {
                if (filterEnabled) {
                    // 过滤模式
                    const has19Plus = container.querySelector('img[src*="ico_19.png"]');
                    container.style.display = has19Plus ? '' : 'none';
                } else {
                    // 显示所有
                    container.style.display = '';
                }
            });
        });

        document.body.appendChild(button);
    }

    // 初始化函数
    function init() {
        // 添加CSS样式确保隐藏的元素不占用空间
        const style = document.createElement('style');
        style.textContent = `
            li[data-sentry-component="BroadcastUserItem"][style*="display: none"],
            .card[style*="display: none"],
            .live-card[style*="display: none"],
            [class*="card"][style*="display: none"] {
                margin: 0 !important;
                padding: 0 !important;
                height: 0 !important;
                width: 0 !important;
                overflow: hidden !important;
            }

            /* 确保登录模态框正常显示 */
            [data-modal="LoginRegisterMenuItem"] {
                z-index: 10000 !important;
            }
        `;
        document.head.appendChild(style);

        // 修复登录按钮
        fixLoginButton();

        // 首次加载时执行过滤
        setTimeout(filterLiveStreams, 1000);

        // 创建观察器处理动态内容
        const observer = createObserver();

        // 添加控制按钮
        addControlButton();

        // 每2秒再次检查一次，以防有些内容没有被观察器捕获
        setInterval(filterLiveStreams, 2000);
    }

    // 页面加载完成后启动脚本
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();