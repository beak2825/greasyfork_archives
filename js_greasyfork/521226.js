// ==UserScript==
// @name         南+ 自动跳转主站桌面版
// @description  自动跳转至主站桌面版
// @namespace    https://greasyfork.org/zh-CN/users/948411
// @version      1.3
// @author       Moe
// @license      MIT
// @match        https://*.south-plus.net/*
// @match        https://*.east-plus.net/*
// @match        https://*.spring-plus.net/*
// @match        https://*.summer-plus.net/*
// @match        https://*.snow-plus.net/*
// @match        https://*.white-plus.net/*
// @match        https://*.south-plus.org/*
// @match        https://south-plus.net/*
// @match        https://east-plus.net/*
// @match        https://spring-plus.net/*
// @match        https://summer-plus.net/*
// @match        https://snow-plus.net/*
// @match        https://white-plus.net/*
// @match        https://south-plus.org/*
// @icon         https://www.south-plus.net/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/521226/%E5%8D%97%2B%20%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC%E4%B8%BB%E7%AB%99%E6%A1%8C%E9%9D%A2%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/521226/%E5%8D%97%2B%20%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC%E4%B8%BB%E7%AB%99%E6%A1%8C%E9%9D%A2%E7%89%88.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const url = new URL(window.location.href);
    if (url.pathname == '/simple/index.php') {
        const paramPattern = /^t([0-9]+)(?:_([0-9]+))?(?:\.html)+$/;
        const param = url.searchParams.keys().next().value;

        const matchResult = param.match(paramPattern);
        const threadId = matchResult[1];
        const page = matchResult[2];

        if (threadId != null) {
            if (page != null && page >= 1) {
                window.location.replace(`https://www.south-plus.net/read.php?tid-${threadId}-fpage-0-toread--page-${page}.html`);
            } else {
                window.location.replace(`https://www.south-plus.net/read.php?tid-${threadId}.html`);
            }
        }
    } else if (url.host != 'www.south-plus.net') {
        url.host = 'www.south-plus.net';
        window.location.replace(url);
    }
})();
