// ==UserScript==
// @name         知乎直达 Block Bottom Navigation Bar
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  在手机版搜索页面屏蔽知乎智答底部导航栏，在其他页面展示
// @icon         https://pica.zhimg.com/v2-79e835d86b026c7c499de99d49906814.png
// @author       qianjunlang
// @match        *://zhida.zhihu.com/*
// @grant        none
// @license      MIT
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/528417/%E7%9F%A5%E4%B9%8E%E7%9B%B4%E8%BE%BE%20Block%20Bottom%20Navigation%20Bar.user.js
// @updateURL https://update.greasyfork.org/scripts/528417/%E7%9F%A5%E4%B9%8E%E7%9B%B4%E8%BE%BE%20Block%20Bottom%20Navigation%20Bar.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建并添加CSS样式
    function addCustomStyle() {
        // 检查是否已经添加了样式
        if (document.getElementById('block-bottom-nav-style')) {
            return;
        }

        const style = document.createElement('style');
        style.id = 'block-bottom-nav-style';
        style.textContent = `

            #fullScreen > div:nth-child(1) > div > div:nth-child(2) > div:nth-child(1) > div > div.css-175oi2r.r-1loqt21.r-1otgn73 > svg path
            {
                fill: #F7971D !important;
            }
            #fullScreen > div:nth-child(1) > div > div:nth-child(2) > div:nth-child(1) > div > div:nth-child(2) > div.css-175oi2r.r-1loqt21.r-1otgn73 > div,
            #fullScreen > div:nth-child(1) > div > div:nth-child(2) > div:nth-child(1) > div > div:nth-child(2) > div:nth-child(2) > div > div > div > div
            {
                opacity: 0.5 !important;
            }

            /* 只在body带有特定class时隐藏底部导航栏 */
            body.hide-nav-bar div.css-175oi2r[style*="height: 58px"][style*="box-shadow: rgba(88, 92, 103, 0.08) 0px 0px 24px"]
            {
                display: none !important;
                visibility: hidden !important;
                opacity: 0 !important;
                pointer-events: none !important;
                height: 0 !important;
            }
            /* 顶部导航栏样式 - 在搜索页面缩小高度 */
            body.hide-nav-bar div.css-175oi2r[style*="box-shadow: rgba(88, 92, 103, 0.08) 0px 1px 0px"][style*="height: 52px"] {
                height: 28px !important;
                border-bottom: 1px solid rgba(88, 92, 103, 0.2);
            }
            body.hide-nav-bar #fullScreen > div:nth-child(1) > div > div:nth-child(2) > div:nth-child(1) > div > div.css-175oi2r.r-1loqt21.r-1otgn73 > div {
              transform: scale(0.8); /* 缩小到80%，您可以调整这个值 */
              transform-origin: center; /* 控制缩放的起点 */
            }

            /*deepseek button*/
            body.hide-nav-bar #fullScreen > div:nth-child(1) > div > div:nth-child(2) > div:nth-child(3) > div.css-175oi2r.r-150rngu.r-18u37iz.r-16y2uox.r-1wbh5a2.r-lltvgl.r-buy8e9.r-agouwx {
                justify-content: flex-end !important;
                position: relative;
                height: 20px;
            }
            body.hide-nav-bar #fullScreen > div:nth-child(1) > div > div:nth-child(2) > div:nth-child(3) > div.css-175oi2r.r-150rngu.r-18u37iz.r-16y2uox.r-1wbh5a2.r-lltvgl.r-buy8e9.r-agouwx > div {

                gap: 0px !important;
                margin-bottom: 3px !important;
                transform: scale(0.8);
                transform-origin: bottom right;
                z-index: 1000;
            }
            body.hide-nav-bar #fullScreen > div:nth-child(1) > div > div:nth-child(2) > div:nth-child(2) > div.css-175oi2r.r-1loqt21.r-1otgn73{
                display:none;
            }



        `;
        document.head.appendChild(style);
    }

    // 检查当前URL是否匹配条件
    function checkUrlAndApply() {
        // 确保样式已添加
        addCustomStyle();

        if (
            window.location.pathname.includes('/search/') ||
            window.location.pathname.endsWith('/history')
        ) {
            document.body.classList.add('hide-nav-bar');

        } else {
            document.body.classList.remove('hide-nav-bar');
        }
    }

    // 监听URL变化（处理SPA应用）
    function setupUrlChangeListener() {
        // 使用history API监听
        const originalPushState = history.pushState;
        const originalReplaceState = history.replaceState;

        history.pushState = function() {
            originalPushState.apply(this, arguments);
            checkUrlAndApply();
        };

        history.replaceState = function() {
            originalReplaceState.apply(this, arguments);
            checkUrlAndApply();
        };

        // 监听popstate事件（后退/前进按钮）
        window.addEventListener('popstate', checkUrlAndApply);

        // 监听hashchange事件
        window.addEventListener('hashchange', checkUrlAndApply);
    }

    function initialize() {
        // 等待body元素加载完成
        if (!document.body) {
            window.addEventListener('DOMContentLoaded', () => {
                // 立即检查当前URL
                checkUrlAndApply();

                // 设置URL变化监听
                setupUrlChangeListener();
            });
        } else {
            // 立即检查当前URL
            checkUrlAndApply();

            // 设置URL变化监听
            setupUrlChangeListener();
        }
    }

    // DOM完全加载后执行
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }
    // 页面完全加载后再次检查
    window.addEventListener('load', checkUrlAndApply);

})();