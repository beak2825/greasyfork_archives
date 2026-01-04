// ==UserScript==
// @name         电影天堂网站广告屏蔽
// @namespace    小啦啦哈
// @version      0.1
// @description  屏蔽电影天堂网站的广告
// @author       小啦啦哈
// @match        https://www.dygod.net/*
// @grant        unsafeWindow
// @grant        GM_addStyle
// @run-at       document.end
// @downloadURL https://update.greasyfork.org/scripts/425388/%E7%94%B5%E5%BD%B1%E5%A4%A9%E5%A0%82%E7%BD%91%E7%AB%99%E5%B9%BF%E5%91%8A%E5%B1%8F%E8%94%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/425388/%E7%94%B5%E5%BD%B1%E5%A4%A9%E5%A0%82%E7%BD%91%E7%AB%99%E5%B9%BF%E5%91%8A%E5%B1%8F%E8%94%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    GM_addStyle("#HMRichBox,a[href='http://jg.wensixuetang.com/stf/visitor.html?id=146&s=3445&c=176797'],a[href='http://jg.wensixuetang.com/stf/visitor.html?id=146&s=3445&c=176797'],.jjjjasdasd,a[onclick='countClickfixed()']{display:none !important}")
})();