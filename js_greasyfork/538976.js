// ==UserScript==
// @name         NGA帖子宽度优化
// @namespace    http://tampermonkey.net/
// @version      0.1
// @license MIT
// @description  即时调整NGA帖子宽度，无刷新闪烁
// @author       StarRain
// @match        http*://bbs.nga.cn/thread.php*
// @match        http*://bbs.nga.cn/read.php*
// @match        http*://nga.178.com/thread.php*
// @match        http*://nga.178.com/read.php*
// @run-at       document-start
// @icon         https://www.google.com/s2/favicons?domain=nga.cn
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @grant        GM_addElement
// @resource     customCSS https://gist.githubusercontent.com/maypu/raw/nga-width-fix.css
// @downloadURL https://update.greasyfork.org/scripts/538976/NGA%E5%B8%96%E5%AD%90%E5%AE%BD%E5%BA%A6%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/538976/NGA%E5%B8%96%E5%AD%90%E5%AE%BD%E5%BA%A6%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 1. 在document-start阶段立即注入CSS
    const customCSS = `
        /* 主容器样式 */
        #topicrows, #m_posts, #m_pbtntop, #m_pbtnbtm {
            width: 1000px !important;
            margin-left: auto !important;
            margin-right: auto !important;
            max-width: 100% !important;
            box-sizing: border-box !important;
            display: block !important;
        }

        /* 防止布局抖动 */
        body {
            visibility: hidden !important;
        }
        body.nga-width-applied {
            visibility: visible !important;
        }

        /* 内容区域适配 */
        .postcontent, .postcontent * {
            max-width: 100% !important;
            box-sizing: border-box !important;
        }

        /* 图片和表格处理 */
        .postcontent img, .postcontent table {
            max-width: 950px !important;
            height: auto !important;
        }
    `;

    // 尽早注入样式
    GM_addStyle(customCSS);

    // 2. 添加DOMContentLoaded监听确保完全应用
    document.addEventListener('DOMContentLoaded', function() {
        // 标记body表示样式已应用
        document.body.classList.add('nga-width-applied');

        // 双保险：直接设置元素样式
        const targetElements = [
            "topicrows",    // 帖子列表
            "m_posts",      // 帖子详情
            "m_pbtntop",    // 顶部页码按钮
            "m_pbtnbtm"     // 底部页码按钮
        ];

        targetElements.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.style.width = "1000px";
                element.style.marginLeft = "auto";
                element.style.marginRight = "auto";
            }
        });

        // 处理动态内容
        new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === 1 && targetElements.includes(node.id)) {
                        node.style.width = "1000px";
                        node.style.marginLeft = "auto";
                        node.style.marginRight = "auto";
                    }
                });
            });
        }).observe(document.body, {
            childList: true,
            subtree: true
        });
    });

    // 3. 额外的保护：在加载过程中检查元素
    const checkInterval = setInterval(() => {
        if (document.body) {
            // 立即应用body标记
            document.body.classList.add('nga-width-applied');
            clearInterval(checkInterval);
        }
    }, 10);
})();