// ==UserScript==
// @name         改百度搜索的导航栏字体为黑色
// @version      0.6
// @description  防止屏蔽广告后看不清字体
// @author       ChatGPT
// @run-at       document-start
// @match        https://www.baidu.com/*
// @match        https://m.baidu.com/*
// @grant        none
// @namespace https://greasyfork.org/users/452911
// @downloadURL https://update.greasyfork.org/scripts/463205/%E6%94%B9%E7%99%BE%E5%BA%A6%E6%90%9C%E7%B4%A2%E7%9A%84%E5%AF%BC%E8%88%AA%E6%A0%8F%E5%AD%97%E4%BD%93%E4%B8%BA%E9%BB%91%E8%89%B2.user.js
// @updateURL https://update.greasyfork.org/scripts/463205/%E6%94%B9%E7%99%BE%E5%BA%A6%E6%90%9C%E7%B4%A2%E7%9A%84%E5%AF%BC%E8%88%AA%E6%A0%8F%E5%AD%97%E4%BD%93%E4%B8%BA%E9%BB%91%E8%89%B2.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const url = window.location.href;
    if (url.indexOf("wd=") !== -1 || url.indexOf("word=") !== -1) {
        const style = document.createElement('style');
        style.innerHTML = `
            span.se-htp-main-tab-text,span.se-tab-tx.se-tab-cur.se-tab-nxt {
                color: black !important;
            }
            span.se-tab-tx, span.se-head-tabfilter-text {
                color: #666666;
            }
        `;
        document.head.appendChild(style);
    }
})();
