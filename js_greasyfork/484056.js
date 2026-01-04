// ==UserScript==
// @name         抖音收藏夹内容复制
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  用来将抖音收藏夹中视频的id name复制到剪切板中
// @author       Cyrus
// @match        https://www.douyin.com/*
// @icon         https://www.google.com/s2/favicons?domain=douyin.com
// @grant        none
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/484056/%E6%8A%96%E9%9F%B3%E6%94%B6%E8%97%8F%E5%A4%B9%E5%86%85%E5%AE%B9%E5%A4%8D%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/484056/%E6%8A%96%E9%9F%B3%E6%94%B6%E8%97%8F%E5%A4%B9%E5%86%85%E5%AE%B9%E5%A4%8D%E5%88%B6.meta.js
// ==/UserScript==

(function () {
    'use strict';

    document.body.addEventListener('keydown', function (e) {
        if (e.shiftKey && e.code == 'KeyS') {
            e.preventDefault();

            let output = '';
            document.querySelectorAll('.h0CXDpkg').forEach(x => {
                const href = x.href;
                const alt = x.querySelector('img') ? x.querySelector('img').alt : '';
                output += `${href} ${alt}\n`;
            });

            // 使用现代的 navigator.clipboard API
            navigator.clipboard.writeText(output).then(() => {
                alert('内容已复制到剪切板');
            }).catch(err => {
                alert('复制到剪切板失败:', err);
            });
        }
    });
})();