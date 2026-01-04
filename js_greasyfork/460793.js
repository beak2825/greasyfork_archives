// ==UserScript==
// @name         全局细滚动条
// @namespace    https://greasyfork.org/zh-CN/scripts/460793
// @version      1.0.7
// @description  将所有网页的滚动条样式改为细滚动条。
// @author       nosora
// @match        *://*/*
// @license      MIT
// @run-at       document-start
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/460793/%E5%85%A8%E5%B1%80%E7%BB%86%E6%BB%9A%E5%8A%A8%E6%9D%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/460793/%E5%85%A8%E5%B1%80%E7%BB%86%E6%BB%9A%E5%8A%A8%E6%9D%A1.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var setting = {
        'enable': !navigator.platform.toLowerCase().includes('mac'),
        'width': '3px',
        'color': '#aaa',
        'color_hover': '#999',
        'background_color': 'rgb(244, 244, 244)',
        'background_color_hover': 'rgb(244, 244, 244)',
        'radius': '2px',
        'transition': '10s'
    }

    // 所有网站通用 CSS
    var commonCSS = `
        ::-webkit-scrollbar { width: 6px; height: 6px; border-radius: 1.5px; }
        ::-webkit-scrollbar-track { background-color: #f5f5f500; }
        ::-webkit-scrollbar-thumb { background-color: #bbbbbb90; border-radius: 1.5px; }
    `;

    // YouTube 专用 CSS
    var youtubeCSS = `
        html.Meet_you_elegant_scrollbar,
        html.Meet_you_elegant_scrollbar * {
            scrollbar-color: ${setting.color} ${setting.background_color};
            scrollbar-width: thin;
        }
        /* 滚动条滑块 */
        ::-webkit-scrollbar-thumb {
            height: ${setting.width} !important;
            width: ${setting.width} !important;
            background-color: ${setting.color} !important;
            border-radius: ${setting.radius} !important;
            transition: ${setting.transition} !important;
        }
        ::-webkit-scrollbar-thumb:hover {
            background-color: ${setting.color_hover} !important;
        }

        /* 滚动条背景 */
        ::-webkit-scrollbar,
        ::-webkit-scrollbar-track {
            height: ${setting.width};
            width: ${setting.width};
            background-color: ${setting.background_color} !important;
            transition: ${setting.transition} !important;
        }
        ::-webkit-scrollbar:hover,
        ::-webkit-scrollbar-track:hover {
            background-color: ${setting.background_color_hover} !important;
        }

        /* 横纵滑条交汇处 */
        ::-webkit-resizer,
        ::-webkit-scrollbar-corner {
            background-color: ${setting.background_color} !important;
        }
    `;

    // 将通用 CSS 应用于所有网站（YouTube 除外）
    if (!window.location.hostname.includes('youtube.com')) {
        var style = document.createElement('style');
        style.type = 'text/css';
        style.appendChild(document.createTextNode(commonCSS));
        document.getElementsByTagName('head')[0].appendChild(style);
    }

    // 应用 YouTube 专用 CSS
    if (window.location.hostname.includes('youtube.com') && setting.enable) {
        document.documentElement.classList.toggle('Meet_you_elegant_scrollbar', true);
        GM_addStyle(youtubeCSS);
    }
})();
