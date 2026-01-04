// ==UserScript==
// @name         ES6入门（阮一峰）-方便阅读小标题
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  将正文的小节标题固定到右侧
// @author       imzhi <yxz_blue@126.com>
// @match        https://es6.ruanyifeng.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ruanyifeng.com
// @grant        GM_addStyle
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/439847/ES6%E5%85%A5%E9%97%A8%EF%BC%88%E9%98%AE%E4%B8%80%E5%B3%B0%EF%BC%89-%E6%96%B9%E4%BE%BF%E9%98%85%E8%AF%BB%E5%B0%8F%E6%A0%87%E9%A2%98.user.js
// @updateURL https://update.greasyfork.org/scripts/439847/ES6%E5%85%A5%E9%97%A8%EF%BC%88%E9%98%AE%E4%B8%80%E5%B3%B0%EF%BC%89-%E6%96%B9%E4%BE%BF%E9%98%85%E8%AF%BB%E5%B0%8F%E6%A0%87%E9%A2%98.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const css = `
@charset utf-8;
#content-toc {
    position: fixed;
    right: 20px;
    padding-right: 20px;
}
`;
    GM_addStyle(css);
})();