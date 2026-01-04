// ==UserScript==
// @name         cool18 站字体替换器
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  当访问 www.cool18.com 时，将网页中的宋体字体替换为黑体
// @author       你的名字
// @match        *://www.cool18.com/*
// @grant        none
// @run-at       document-start
// @license      LGPLv3
// @downloadURL https://update.greasyfork.org/scripts/538974/cool18%20%E7%AB%99%E5%AD%97%E4%BD%93%E6%9B%BF%E6%8D%A2%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/538974/cool18%20%E7%AB%99%E5%AD%97%E4%BD%93%E6%9B%BF%E6%8D%A2%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建样式元素来替换字体
    const style = document.createElement('style');
    style.textContent = `
        * {
            font-family: -apple-system, BlinkMacSystemFont,
                         'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell,
                         'Microsoft YaHei', '黑体', 'Heiti SC',
                         SimHei, sans-serif !important;
        }

        /* 特别替换宋体相关的字体名称 */
        * {
            font-family: inherit !important;
        }

        /* 视觉提示 - 右上角显示插件状态 */
        .font-replaced-banner {
            position: fixed;
            top: 10px;
            right: 10px;
            background: #3498db;
            color: white;
            padding: 5px 10px;
            border-radius: 4px;
            font-size: 12px;
            z-index: 9999;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
        }
    `;

    // 插入到 head 中确保优先加载
    document.head.appendChild(style);

    // 创建视觉提示
    const banner = document.createElement('div');
    banner.className = 'font-replaced-banner';
    banner.textContent = '字体已替换：宋体 → 黑体';
    document.body.appendChild(banner);

    // 页面加载后移除提示（可选）
    setTimeout(() => {
        banner.style.transition = 'opacity 0.5s ease';
        banner.style.opacity = '0';
        setTimeout(() => banner.remove(), 500);
    }, 3000);
})();