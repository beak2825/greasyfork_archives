// ==UserScript==
// @name         站酷网作品原图查看
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  站酷网图片辅助下载工具
// @author       You
// @match        *://www.zcool.com.cn/*
// @grant        GM_openInTab
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/533718/%E7%AB%99%E9%85%B7%E7%BD%91%E4%BD%9C%E5%93%81%E5%8E%9F%E5%9B%BE%E6%9F%A5%E7%9C%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/533718/%E7%AB%99%E9%85%B7%E7%BD%91%E4%BD%9C%E5%93%81%E5%8E%9F%E5%9B%BE%E6%9F%A5%E7%9C%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 方式1：为所有图片添加右键保存功能
    document.addEventListener('contextmenu', function(e) {
        if (e.target.tagName === 'IMG') {
            e.stopPropagation();
        }
    }, true);

    // 方式2：创建图片查看器按钮
    function addDownloadButtons() {
        const images = document.querySelectorAll('img.photoImage');
        images.forEach(img => {
            if(!img.parentNode.querySelector('.zcool-helper-btn')) {
                const btn = document.createElement('button');
                btn.className = 'zcool-helper-btn';
                btn.textContent = '查看原图';
                btn.style.position = 'absolute';
                btn.style.zIndex = '9999';
                btn.style.background = '#ff4e00';
                btn.style.color = 'white';
                btn.style.padding = '2px 5px';
                btn.style.borderRadius = '3px';
                btn.style.border = 'none';
                btn.style.cursor = 'pointer';

                btn.onclick = function() {
                    const src = img.src.replace(/\/\/(.*?)\.zcool/, '//$1.zcool');
                    GM_openInTab(src, {active: true});
                };

                img.parentNode.style.position = 'relative';
                img.parentNode.appendChild(btn);
            }
        });
    }

    // 监听动态加载内容
    const observer = new MutationObserver(addDownloadButtons);
    observer.observe(document.body, {childList: true, subtree: true});

    // 初始执行
    addDownloadButtons();
})();