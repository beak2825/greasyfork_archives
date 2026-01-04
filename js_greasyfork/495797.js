// ==UserScript==
// @name         哔哩哔哩屏蔽up主动态广告
// @namespace    https://greasyfork.org/zh-CN/users/314234-yong-hu-ming
// @version      1.0.2
// @description  哔哩哔哩屏蔽动态广告
// @author       Yong_Hu_Ming
// @match        *://*.bilibili.com/*
// @match        *://*.bilibili.com
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @run-at       document-start
// @license      WTFPL
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/495797/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E5%B1%8F%E8%94%BDup%E4%B8%BB%E5%8A%A8%E6%80%81%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/495797/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E5%B1%8F%E8%94%BDup%E4%B8%BB%E5%8A%A8%E6%80%81%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const css = `div.bili-dyn-list__item:has(div.bili-dyn-card-goods) {
    display: none !important;
}`
    GM_addStyle(css);
})();