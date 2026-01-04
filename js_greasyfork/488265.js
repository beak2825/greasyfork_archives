// ==UserScript==
// @name         Remove Javbus Banner Ad
// @namespace    Violentmonkey Scripts
// @version      0.2
// @description  Remove the banner ad at the top of javbus.com and make copy instead of open scheme
// @author       TAB
// @match        *://*.javbus.com/*
// @license      GNU GPLv3
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/488265/Remove%20Javbus%20Banner%20Ad.user.js
// @updateURL https://update.greasyfork.org/scripts/488265/Remove%20Javbus%20Banner%20Ad.meta.js
// ==/UserScript==

function copyMagnet(){
      // 获取所有包含指定 onclick 事件的 <td> 元素
    var tdElements = document.querySelectorAll('td[onclick^="window.open(\'magnet"]');

    // 遍历每个 <td> 元素
    tdElements.forEach(function(td) {
        // 获取 magnet 链接
        var magnetLink = td.getAttribute('onclick').match(/'([^']+)'/)[1];

        // 移除原有点击事件
        td.removeAttribute('onclick');

        // 添加新的点击事件，复制 magnet 链接到剪贴板
        td.addEventListener('click', function() {
            GM_setClipboard(magnetLink);
            console.log('Magnet link copied to clipboard:', magnetLink);
        });
    });
}


(function() {
    'use strict';


  // 创建一个 MutationObserver 实例，监听页面内容的变化
    var observer = new MutationObserver(function(mutationsList) {
        // 当页面内容发生变化时执行以下操作
        mutationsList.forEach(function(mutation) {
            // 检查变化是否与 AJAX 请求有关
            if (mutation.type === 'childList') {
                // 在这里可以执行你想要的操作，例如修改页面内容、添加新元素等
                console.log('Page content changed after AJAX request');

                copyMagnet();

                var banner = document.querySelector('.ad-box');
                if (banner) {
                  banner.remove();
                }
            }
        });
    });

    // 启动 MutationObserver 监听页面内容的变化
    observer.observe(document.body, { childList: true, subtree: true });


})();
