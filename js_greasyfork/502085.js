// ==UserScript==
// @name         豆瓣演员相册页面悬浮查看图片
// @namespace    http://tampermonkey.net/
// @version      2024-07-29 v1
// @description  豆瓣的演员相册页面，查看图片会跳转到一个新的标签页，非常繁琐，本脚本可以悬浮查看图片，无需跳转新标签页
// @author       范近中
// @match        https://www.douban.com/personage/*/photos/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=douban.com
// @license      none
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/502085/%E8%B1%86%E7%93%A3%E6%BC%94%E5%91%98%E7%9B%B8%E5%86%8C%E9%A1%B5%E9%9D%A2%E6%82%AC%E6%B5%AE%E6%9F%A5%E7%9C%8B%E5%9B%BE%E7%89%87.user.js
// @updateURL https://update.greasyfork.org/scripts/502085/%E8%B1%86%E7%93%A3%E6%BC%94%E5%91%98%E7%9B%B8%E5%86%8C%E9%A1%B5%E9%9D%A2%E6%82%AC%E6%B5%AE%E6%9F%A5%E7%9C%8B%E5%9B%BE%E7%89%87.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.querySelector('.pics').querySelectorAll('a').forEach(v1 => {
        v1.addEventListener('click', e => {
            e.preventDefault();

            const dialog = document.createElement('dialog');
            dialog.style = `
            width: 90vw;
            height: 90vh;
            display: flex;
            flex-direction: column;
            `
            const iframe = document.createElement('iframe');
            iframe.src = v1.href;
            iframe.style = `
             width: 100%;
             height: 100%;
             border: 0;
            `
            const closeBtn = document.createElement('button');
            closeBtn.textContent = '关闭';
            closeBtn.style = `
             margin-bottom: 10px;
            `

            dialog.appendChild(closeBtn);
            dialog.appendChild(iframe);
            document.body.appendChild(dialog);

            dialog.showModal();

            closeBtn.addEventListener('click', () => {
                dialog.close();
                document.body.removeChild(dialog);
            });
        });
    });

})();