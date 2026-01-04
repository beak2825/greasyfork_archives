// ==UserScript==
// @name         超级淡然的石家庄铁道大学
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  原神启动大学
// @author       You
// @match        https://cas.stdu.edu.cn/cas/**
// @icon         https://www.google.com/s2/favicons?sz=64&domain=usts.edu.cn
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/473858/%E8%B6%85%E7%BA%A7%E6%B7%A1%E7%84%B6%E7%9A%84%E7%9F%B3%E5%AE%B6%E5%BA%84%E9%93%81%E9%81%93%E5%A4%A7%E5%AD%A6.user.js
// @updateURL https://update.greasyfork.org/scripts/473858/%E8%B6%85%E7%BA%A7%E6%B7%A1%E7%84%B6%E7%9A%84%E7%9F%B3%E5%AE%B6%E5%BA%84%E9%93%81%E9%81%93%E5%A4%A7%E5%AD%A6.meta.js
// ==/UserScript==

(()=>{
(() => {
    console.log('Hello World')
    // 创建一个弹窗元素
    var popup = document.createElement('div');
    popup.style.position = 'fixed';
    popup.style.top = '50%';
    popup.style.left = '50%';
    popup.style.transform = 'translate(-50%, -50%)';
    popup.style.padding = '20px';
    popup.style.background = 'white';
    popup.style.border = '2px solid #333';
    popup.style.zIndex = '9999';
    popup.innerHTML = '<h1>原神启动</h1><p>欢迎来到原神世界！</p>';

    // 将弹窗添加到页面中
    document.body.appendChild(popup);
})
})