// ==UserScript==
// @name         Test Get Walmart ItemId
// @namespace    http://tampermonkey.net/
// @version      1.01
// @description  当访问Walmart产品时，通过 'CTRL + i' 快捷键触发，获取当前链接的所有ItemID。
// @author       WangQian
// @match        https://www.walmart.com/ip/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/524495/Test%20Get%20Walmart%20ItemId.user.js
// @updateURL https://update.greasyfork.org/scripts/524495/Test%20Get%20Walmart%20ItemId.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 监听键盘事件
    document.addEventListener('keydown', function(event) {
        // 检测是否按下了 'CTRL + i'
        if (event.ctrlKey && event.key === 'i') {
           event.preventDefault();
           window.focus();

           const idPattern = /https:\/\/www\.walmart\.com\/ip\/.*\/(\d+)$/;
           const itemIds = Array.from(document.querySelectorAll('a[link-identifier]')).map(a => a.href).filter(href => href !== null).map(url => {
               const match = url.match(idPattern);
               return match ? match[1] : null;
           }).filter((item, index, arr) => item !== null && arr.indexOf(item) === index);

            // 设置到剪贴板
             navigator.clipboard.writeText(itemIds).then(() => {
                    alert("当前链接ItemId已设置到剪贴板，使用Ctrl + V 粘贴获取");
                }, err => {
                    alert('获取失败，' + err);
                });
        }
    });
})();