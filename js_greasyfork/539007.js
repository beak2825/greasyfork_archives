// ==UserScript==
// @name         知乎手机端桌面版优化
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  优化手机Edge浏览器上桌面版知乎的使用体验
// @author       XUJINKAI
// @license      MIT
// @icon         https://static.zhihu.com/heifetz/assets/apple-touch-icon-152.81060cab.png
// @match        https://www.zhihu.com/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/539007/%E7%9F%A5%E4%B9%8E%E6%89%8B%E6%9C%BA%E7%AB%AF%E6%A1%8C%E9%9D%A2%E7%89%88%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/539007/%E7%9F%A5%E4%B9%8E%E6%89%8B%E6%9C%BA%E7%AB%AF%E6%A1%8C%E9%9D%A2%E7%89%88%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ==================== 配置区域 ====================
    const CONFIG = {
        // 是否启用调试模式
        debugMode: false
    };

    // ==================== 工具函数 ====================
    const Utils = {
        log: function(message) {
            if (CONFIG.debugMode) {
                console.log('[知乎优化] ' + message);
            }
        },

        injectCSS: function(css) {
            const style = document.createElement('style');
            style.textContent = css;
            document.head.appendChild(style);
            this.log('注入CSS样式');
        },
    };

    // ==================== 样式定义 ====================
    const StyleGenerator = function() {
        return `
/* 移除侧边栏 */
.Topstory-container > div:nth-child(2),
[data-za-detail-view-path-module="RightSideBar"] {
    display: none !important;
}

/* 主内容占满 */
.Topstory-container,
.Question-mainColumn {
    width: unset !important;
    padding: 0;
}

.Topstory-mainColumn {
    width: 100% !important;
}

/* 优化导航栏 */
.AppHeader {
    min-width: unset !important;
    overflow-x: scroll !important;
}

.AppHeader-inner {
    min-width: unset;
    height: 3rem;
}

.AppHeader-Tab,
.AppHeader-userInfo>div:nth-child(3) {
    display: none;
}

/* ========== 字号优化 ========== */
body {
    font-size: 1.3em;
    line-height: 1.9em;
}

.ContentItem-title {
    font-size: 1.8em;
    line-height: 2;
    margin-bottom: 24px;
    margin-top: 24px;
}

.RichContent {
    font-size: 36px;
}

.RichContent.is-collapsed .RichContent-inner {
    max-height: 188px;
}

.ContentItem-action,
.ContentItem-actions button {
    font-size: 32px;
}

.TopstoryTabs a {
    font-size: 32px !important;
    line-height: 1.5em;
}

.Comments-container p,
.Comments-container div,
.CommentContent
.CommentContent p,
.CommentContent div {
    font-size: 32px !important;
    line-height: 1.5em;
}

/* ========== 评论弹窗 ========== */
.css-1aq8hf9 {
    width: auto !important;
    margin-left: 10px !important;
    margin-right: 6rem !important;
}

.Button[aria-label="关闭"] {
    right: -40px;
    top: 60px;
}
`;
    }
    // ==================== 初始化 ====================
    const Initializer = {
        init: function() {
            Utils.log('开始初始化知乎优化脚本');

            // 生成并注入优化样式
            const optimizedCSS = StyleGenerator();
            Utils.injectCSS(optimizedCSS);

            Utils.log('知乎优化脚本初始化完成');
        },

        // 等待页面加载
        waitForPageLoad: function() {
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => {
                    this.init();
                });
            } else {
                this.init();
            }
        }
    };

    // ==================== 脚本启动 ====================
    Initializer.waitForPageLoad();

})();