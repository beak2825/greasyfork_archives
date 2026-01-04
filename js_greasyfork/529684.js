// ==UserScript==
// @name         知乎优化
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  Sets custom widths and hides specified elements on Zhihu
// @author       You
// @match        https://www.zhihu.com/*
// @match        http://www.zhihu.com/*
// @match        https://zhihu.com/*
// @match        http://zhihu.com/*
// @grant        none
// @license MIT
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/529684/%E7%9F%A5%E4%B9%8E%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/529684/%E7%9F%A5%E4%B9%8E%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==
(function() {
    'use strict';
    
    // 创建样式表
    const style = document.createElement('style');
    style.textContent = `
        .Topstory-mainColumn, .Question-mainColumn {
            width: 100% !important;
        }
        
        .css-11p8nt5, .css-1kjxdzv {
            max-width: 0px !important;
            min-width: 950px !important;
        }
        
        .Question-sideColumn {
            display: none !important;
        }
        
        .css-1qyytj7 > div,
        .css-29q9fa,
        li.Tabs-item--noMeta.AppHeader-Tab.Tabs-item:nth-of-type(3),
        li.Tabs-item--noMeta.AppHeader-Tab.Tabs-item:nth-of-type(4),
        .css-18vqx7l > .fEPKGkUK5jyc4fUuT0QP.Button--plain.FEfUrdfMIKpQDJDqkjte.css-79elbk.Button {
            display: none !important;
        }
    `;
    
    // 在页面开始加载时就插入样式
    document.documentElement.appendChild(style);
})();