// ==UserScript==
// @name        华医网直接进考试
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  自动提取课程ID并生成跳转按钮
// @author       YourName
// @match        https://cme28.91huayi.com/*
// @match        https://*.cme28.91huayi.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/531408/%E5%8D%8E%E5%8C%BB%E7%BD%91%E7%9B%B4%E6%8E%A5%E8%BF%9B%E8%80%83%E8%AF%95.user.js
// @updateURL https://update.greasyfork.org/scripts/531408/%E5%8D%8E%E5%8C%BB%E7%BD%91%E7%9B%B4%E6%8E%A5%E8%BF%9B%E8%80%83%E8%AF%95.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 初始化按钮容器样式
    const container = document.createElement('div');
    container.style.cssText = `
        position: fixed;
        right: 20px;
        top: 50%;
        transform: translateY(-50%);
        background: rgba(255,255,255,0.9);
        padding: 15px;
        border-radius: 8px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.2);
        z-index: 99999;
        max-height: 90vh;
        overflow-y: auto;
    `;

    // 查找所有课程ID
    const regex = /\.\.\/course_ware\/course_ware\.aspx\?cwid=([^"]+)/g;
    const matches = [...document.body.innerHTML.matchAll(regex)];
    const uniqueCwids = [...new Set(matches.map(m => m[1]))];

    if (uniqueCwids.length === 0) return;

    // 生成按钮列表
    uniqueCwids.forEach((cwid, index) => {
        const btn = document.createElement('button');
        btn.innerHTML = `${index + 1}. 课程${index + 1}`;
        btn.style.cssText = `
            display: block;
            width: 120px;
            margin: 8px 0;
            padding: 10px;
            background: #4CAF50;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            transition: 0.3s;
        `;

        // 按钮交互效果
        btn.onmouseover = () => btn.style.opacity = '0.8';
        btn.onmouseout = () => btn.style.opacity = '1';
        btn.onclick = () => window.open(`https://cme28.91huayi.com/pages/exam.aspx?cwid=${cwid}`, '_blank');

        container.appendChild(btn);
    });

    // 添加标题和分隔线
    const title = document.createElement('h3');
    title.textContent = '课程导航';
    title.style.cssText = 'margin:0 0 10px 0; color:#333;';
    container.insertBefore(title, container.firstChild);

    document.body.appendChild(container);

    // 响应式适配
    window.addEventListener('resize', () => {
        container.style.right = window.innerWidth < 768 ? '10px' : '20px';
    });
})();