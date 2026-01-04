// ==UserScript==
// @name         nwbbs 旧链接修正
// @namespace    https://bbs.newwise.com/
// @version      1.0.2
// @description  自动修正 nwbbs 的旧链接，并添加访问按钮。
// @author       ReiiNoki
// @match        *://bbs.newwise.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/528549/nwbbs%20%E6%97%A7%E9%93%BE%E6%8E%A5%E4%BF%AE%E6%AD%A3.user.js
// @updateURL https://update.greasyfork.org/scripts/528549/nwbbs%20%E6%97%A7%E9%93%BE%E6%8E%A5%E4%BF%AE%E6%AD%A3.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 获取所有链接
    let links = document.querySelectorAll("a[href]");

    links.forEach(link => {
        let oldUrl = link.href;
        let match = oldUrl.match(/viewthread\.php\?tid=(\d+)/);

        if (match) {
            let tid = match[1];
            let newUrl = `https://bbs.newwise.com/forum.php?mod=viewthread&tid=${tid}`;

            // 直接修改链接
            link.href = newUrl;
            link.style.color = "red"; // 可选，修改颜色提醒用户
        }
    });
})();
