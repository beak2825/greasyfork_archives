// ==UserScript==
// @name         好医生刷课_北京
// @namespace    https://greasyfork.org/zh-CN/scripts/547423-%E5%A5%BD%E5%8C%BB%E7%94%9F%E5%88%B7%E8%AF%BE-%E5%8C%97%E4%BA%AC
// @version      0.1
// @description  直接将进度条拉满，进入考试
// @author       kite
// @match        https://bjsqypx.haoyisheng.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/547423/%E5%A5%BD%E5%8C%BB%E7%94%9F%E5%88%B7%E8%AF%BE_%E5%8C%97%E4%BA%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/547423/%E5%A5%BD%E5%8C%BB%E7%94%9F%E5%88%B7%E8%AF%BE_%E5%8C%97%E4%BA%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建按钮元素
    const btn = document.createElement('button');
    btn.textContent = '一键结束';
    btn.style.position = 'fixed';
    btn.style.bottom = '20px';
    btn.style.right = '20px';
    btn.style.zIndex = '9999';
    btn.style.padding = '10px 15px';
    btn.style.backgroundColor = '#4CAF50';
    btn.style.color = 'white';
    btn.style.border = 'none';
    btn.style.borderRadius = '5px';
    btn.style.cursor = 'pointer';
    btn.style.boxShadow = '0 2px 5px rgba(0,0,0,0.3)';

    // 添加悬停效果
    btn.addEventListener('mouseover', () => {
        btn.style.backgroundColor = '#45a049';
    });
    btn.addEventListener('mouseout', () => {
        btn.style.backgroundColor = '#4CAF50';
    });

    // 按钮点击事件
    btn.addEventListener('click', () => {
        window.cc_js_Player.jumpToTime(parseInt(9999));
        setTimeout(() => {
            window.cc_js_Player.jumpToTime(parseInt(8000));
        }, 1000);
    });

    // 将按钮添加到页面
    document.body.appendChild(btn);
    // Your code here...
})();