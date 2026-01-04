// ==UserScript==
// @name         安卓登录刷新
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  添加一个按钮以刷新指定的iframe
// @match        http://172.18.2.45/
// @match        http://172.18.2.45/home.aspx
// @match        http://220.170.199.46:8081/
// @match        http://220.170.199.46:8081/home.aspx
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/517359/%E5%AE%89%E5%8D%93%E7%99%BB%E5%BD%95%E5%88%B7%E6%96%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/517359/%E5%AE%89%E5%8D%93%E7%99%BB%E5%BD%95%E5%88%B7%E6%96%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建按钮元素
    const button = document.createElement('button');
    button.innerText = '刷新';
    button.style.position = 'fixed';
    button.style.top = '70px';
    button.style.left = '10px';
    button.style.zIndex = '1000';

    // 添加按钮点击事件，刷新 iframe
    button.addEventListener('click', () => {
        const iframe = document.getElementById('frm_login');
        if (iframe) {
            iframe.contentWindow.location.reload();
        } else {
            alert('未找到 iframe 元素');
        }
    });

    // 将按钮添加到页面
    document.body.appendChild(button);
})();
