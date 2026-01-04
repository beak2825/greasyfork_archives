// ==UserScript==
// @name         悬浮按钮 - 复制URL
// @namespace   http://www.wuzhij.us.kg/
// @version      1.0
// @description  在指定网站页面上显示一个悬浮复制按钮，点击按钮复制当前网页的URL地址到剪切板。在const sites=的列表中添加需要显示的网站[删除这段就是显示在所有网站上]。
// @author       wuzhij
// @match        *://*/*
// @icon         http://www.wuzhij.us.kg/wz/copyurl.svg
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @license      GPL License
// @downloadURL https://update.greasyfork.org/scripts/515731/%E6%82%AC%E6%B5%AE%E6%8C%89%E9%92%AE%20-%20%E5%A4%8D%E5%88%B6URL.user.js
// @updateURL https://update.greasyfork.org/scripts/515731/%E6%82%AC%E6%B5%AE%E6%8C%89%E9%92%AE%20-%20%E5%A4%8D%E5%88%B6URL.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const sites = [
        'example.com',
        'another-site.com',
        '自定义网站'
    ];

    function createButton() {
        const button = document.createElement('button');
        button.innerText = '复制URL';
        button.style.position = 'fixed';
        button.style.bottom = '20px';
        button.style.right = '20px';
        button.style.padding = '10px 20px';
        button.style.border = 'none';
        button.style.backgroundColor = '#ff0000';
        button.style.color = 'white';
        button.style.borderRadius = '5px';
        button.style.cursor = 'pointer';
        button.addEventListener('click', () => {
            navigator.clipboard.writeText(window.location.href).then(() => {
                const message = document.createElement('div');
                message.innerText = '已复制到剪切板';
                message.style.position = 'fixed';
                message.style.bottom = '70px';
                message.style.right = '20px';
                message.style.padding = '10px 20px';
                message.style.backgroundColor = 'green';
                message.style.color = 'white';
                message.style.borderRadius = '5px';
                document.body.appendChild(message);
                setTimeout(() => {
                    document.body.removeChild(message);
                }, 1000);
            }).catch(err => {
                console.error('复制失败:', err);
            });
        });
        document.body.appendChild(button);
    }

    function checkSite() {
        const currentHost = window.location.hostname;
        if (sites.some(site => currentHost.includes(site))) {
            createButton();
        }
    }

    checkSite();
})();