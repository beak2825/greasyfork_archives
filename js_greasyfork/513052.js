// ==UserScript==
// @name         another Nyaa hide 0 seeders
// @namespace    
// @version      1.0
// @description  Hide torrent with 0 seeders
// @include      https://nyaa.si/*
// @include      https://sukebei.nyaa.si/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/513052/another%20Nyaa%20hide%200%20seeders.user.js
// @updateURL https://update.greasyfork.org/scripts/513052/another%20Nyaa%20hide%200%20seeders.meta.js
// ==/UserScript==


(function() {
    'use strict';

    // 获取所有的 tr 元素
    const rows = document.querySelectorAll('tr.default');

    rows.forEach(row => {
        // 获取倒数第三个 td 的值
        const thirdLastTd = row.querySelectorAll('td')[row.querySelectorAll('td').length - 3];

        // 检查该值是否为 0
        if (thirdLastTd && thirdLastTd.textContent.trim() === '0') {
            // 设置该 tr 的 display 为 none
            row.style.display = 'none';
        }
    });
})();
