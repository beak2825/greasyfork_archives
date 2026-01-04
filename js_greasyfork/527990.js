// ==UserScript==
// @name         AGE动漫 CSS重构
// @icon         https://acgwy.cc/wp-content/uploads/2023/01/1c5a0-www.agemys.net.png
// @namespace    https://github.com/Emokui
// @version      1.32
// @description  移除广告、优化显示内容
// @author       𝙁𝙖𝙩𝙖𝙡𝙚𝙫𝙚𝙡
// @match        https://www.agedm.org/*
// @match        https://web.agespa-01.com:8443/*
// @grant        GM_addStyle
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/527990/AGE%E5%8A%A8%E6%BC%AB%20CSS%E9%87%8D%E6%9E%84.user.js
// @updateURL https://update.greasyfork.org/scripts/527990/AGE%E5%8A%A8%E6%BC%AB%20CSS%E9%87%8D%E6%9E%84.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 注入 CSS 来隐藏广告和不需要的元素
    GM_addStyle(`
        /* 隐藏通知和广告相关的元素 */
        div.global_notice_box,
        div.global_notice_wrapper,
        a.nav-download-link[href="https://www.agedm.app?ref=www.agedm.org"],
        div.container.xcontainer.py-2,
        div.text_list_box.links,
        div.foot_content_wrapper.pb-3,
        div.van-cell__title,
        div.bd.van-hairline--bottom {
            display: none !important;
        }

        /* 隐藏包含广告的图片 */
        img[src*="xcdn.rltdxt.com"],
        img[src*="g52j7.com"],
        img[src*="p3.toutiaoimg.com"],
        img[src*="p1.bdxiguaimg.com/origin/1386b0000fc487ec8b2ec"] {
            display: none !important;
        }
    `);
})();