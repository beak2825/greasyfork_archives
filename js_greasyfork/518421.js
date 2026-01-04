// ==UserScript==
// @name         快捷导航栏
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  添加常用网站导航
// @author       YourName
// @match        https://*/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/518421/%E5%BF%AB%E6%8D%B7%E5%AF%BC%E8%88%AA%E6%A0%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/518421/%E5%BF%AB%E6%8D%B7%E5%AF%BC%E8%88%AA%E6%A0%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    // 创建导航栏
    const nav = document.createElement('div');
    nav.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        background: #333;
        padding: 10px;
        z-index: 9999;
    `;
    
    // 添加链接
    const links = [
        { name: '百度', url: 'https://www.baidu.com' },
        { name: '知乎', url: 'https://www.zhihu.com' },
        { name: 'GitHub', url: 'https://github.com' }
    ];
    
    links.forEach(link => {
        const a = document.createElement('a');
        a.href = link.url;
        a.textContent = link.name;
        a.style.cssText = `
            color: white;
            margin: 0 10px;
            text-decoration: none;
        `;
        nav.appendChild(a);
    });
    
    document.body.prepend(nav);
    // 为了不遮挡内容，给body添加上边距
    document.body.style.marginTop = '40px';
})();