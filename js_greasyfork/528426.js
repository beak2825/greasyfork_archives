// ==UserScript==
// @name         Miss1 CSS重构
// @namespace    http://github.com/Emokui/Sukuna
// @version      1.72
// @description  Miss1简单去广
// @author       Musashi
// @match        https://miss1.net/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/528426/Miss1%20CSS%E9%87%8D%E6%9E%84.user.js
// @updateURL https://update.greasyfork.org/scripts/528426/Miss1%20CSS%E9%87%8D%E6%9E%84.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 注入 CSS 来隐藏广告图片和不需要的元素
    GM_addStyle(`
        /* 隐藏广告图片 */
        img[src*="ggtu6.xianliao.voto"],
        img[src*="im.aijciss.com"],
        img[src*="cbu01.alicdn.com"] {
            display: none !important;
        }

        /* 隐藏列表 */
        ul.link_text.list_scroll {
            display: none !important;
        }

        /* 隐藏特定的链接 */
        div.sm\\:container.mx-auto.grid.sm\\:grid-cols-2.affcodes a,
        a.link.text-nord6.group.inline-flex.items-center.text-base.leading-6.font-medium {
            display: none !important;
        }
    `);
})();