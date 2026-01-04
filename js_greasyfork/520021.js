// ==UserScript==
// @name         YouTube Theater Clean
// @name:zh-CN      YouTube 剧院模式清爽界面
// @namespace    https://violentmonkey.github.io/
// @version      1.0.0
// @description  Hide all UI elements except chat in YouTube theater mode
// @description:zh-CN  在 YouTube 剧院模式下隐藏除聊天室外的其他界面元素
// @author       zeer
// @match        https://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// @license      MIT
// @compatible   chrome
// @compatible   firefox
// @compatible   edge
// @run-at       document-end
// @connect      youtube.com
// @connect      googleapis.com
// @encoding     utf-8
// @noframes     
// @downloadURL https://update.greasyfork.org/scripts/520021/YouTube%20Theater%20Clean.user.js
// @updateURL https://update.greasyfork.org/scripts/520021/YouTube%20Theater%20Clean.meta.js
// ==/UserScript==

(function() {
    'use strict';  // 启用严格模式，防止一些常见的 JavaScript 错误

    // 检查当前页面是否为视频页面
    // YouTube 视频页面的 URL 路径中包含 '/watch'
    function isVideoPage() {
        return window.location.pathname.includes('/watch');
    }

    // 清理函数：移除之前添加的样式
    // 防止样式重复和冲突
    function cleanup() {
        const existingStyle = document.getElementById('yt-theater-clean-style');
        if (existingStyle) {
            existingStyle.remove();
        }
    }

    // 初始化函数：添加自定义样式
    function init() {
        // 如果不是视频页面，直接返回
        if (!isVideoPage()) return;

        try {
            cleanup();  // 先清理已存在的样式

            // 创建 style 元素
            const style = document.createElement('style');
            style.id = 'yt-theater-clean-style';  // 添加唯一标识符
            
            // 定义 CSS 样式规则
            style.textContent = `
                /* 调整剧院模式下视频播放器的上边距 */
                ytd-watch-flexy[theater]:not([fullscreen]) {
                    margin-top: 62px !important;
                }

                /* 隐藏视频下方的内容区域 */
                ytd-watch-flexy[theater] #below {
                    display: none !important;
                }

                /* 移除播放器外层容器的上边距 */
                ytd-watch-flexy[theater] #player-container-outer {
                    margin-top: 0 !important;
                }

                /* 调整主要内容区域的布局 */
                ytd-watch-flexy[theater] #columns {
                    display: flex !important;
                    max-width: none !important;
                }

                /* 隐藏不需要的界面元素 */
                ytd-watch-flexy[theater] #meta,                    /* 视频元数据 */
                ytd-watch-flexy[theater] #info-contents,          /* 视频信息内容 */
                ytd-watch-flexy[theater] #related,                /* 相关视频 */
                ytd-watch-flexy[theater] ytd-merch-shelf-renderer, /* 商品架 */
                ytd-watch-flexy[theater] ytd-video-secondary-info-renderer { /* 视频次要信息 */
                    display: none !important;
                }
            `;

            // 将样式添加到页面头部
            document.head.appendChild(style);
        } catch (error) {
            console.error('YouTube 剧院模式清爽界面初始化失败:', error);
        }
    }

    // 监听 URL 变化
    // 因为 YouTube 是单页面应用，页面切换不会重新加载
    let lastUrl = location.href;  // 记录当前 URL
    
    // 创建 MutationObserver 实例监听 DOM 变化
    new MutationObserver(() => {
        const url = location.href;
        if (url !== lastUrl) {    // 如果 URL 发生变化
            lastUrl = url;         // 更新记录的 URL
            init();                // 重新初始化样式
        }
    }).observe(document, {         // 开始观察整个文档
        subtree: true,            // 监听所有子节点
        childList: true           // 监听节点的添加或删除
    });

    // 页面首次加载时初始化
    init();
})();