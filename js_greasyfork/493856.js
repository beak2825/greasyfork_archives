// ==UserScript==
// @name         探索发现节目标题完全显示
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  探索发现网页文字显示不全，不能直观看到节目标题。用脚本改一下，让其完全显示。
// @author       barnett2010
// @match        http://tv.cctv.com/*
// @match        https://tv.cctv.com/*
// @grant        GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/493856/%E6%8E%A2%E7%B4%A2%E5%8F%91%E7%8E%B0%E8%8A%82%E7%9B%AE%E6%A0%87%E9%A2%98%E5%AE%8C%E5%85%A8%E6%98%BE%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/493856/%E6%8E%A2%E7%B4%A2%E5%8F%91%E7%8E%B0%E8%8A%82%E7%9B%AE%E6%A0%87%E9%A2%98%E5%AE%8C%E5%85%A8%E6%98%BE%E7%A4%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // CSS规则以允许文本完整显示并调整容器大小
    const style = `
        .text p.info a.full-display {
            white-space: normal !important;
            text-overflow: unset !important;
            overflow: visible !important;
            display: inline-block !important;
            width: auto !important; /* 允许宽度自适应 */
            height: auto !important; /* 允许高度自适应 */
            word-wrap: break-word; /* 允许长单词换行 */
        }
        .text p.info {
            overflow: visible !important; /* 确保父容器不会隐藏子元素溢出的内容 */
        }
    `;
    // 添加CSS规则
    GM_addStyle(style);

    // 定义一个函数来替换标题中的省略号并添加CSS类
    function replaceTitleWithFullTitle() {
        // 获取所有的<a>标签
        var links = document.querySelectorAll('.text p.info a');
        // 遍历所有的<a>标签
        links.forEach(function(link) {
            // 检查<a>标签的textContent中是否包含省略号
            if (link.textContent.includes('…')) {
                // 获取完整的title属性值
                var fullTitle = link.getAttribute('title');
                // 替换textContent中的省略号部分为完整的title
                link.textContent = fullTitle;

                // 添加一个类来覆盖默认的样式
                link.classList.add('full-display');
            }
        });
    }

    // 监听DOM变化，实时监控<a>标签的变化
    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList' || mutation.type === 'attributes') {
                replaceTitleWithFullTitle();
            }
        });
    });

    // 配置observer观察哪些变化
    var config = { childList: true, subtree: true, attributes: true };

    // 观察整个文档
    observer.observe(document.body, config);

    // 页面加载完成后立即执行一次
    window.addEventListener('load', replaceTitleWithFullTitle);
})();