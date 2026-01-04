// ==UserScript==
// @name         宜搭
// @namespace    yida-plugin2-yiye
// @version      0.0.1
// @author       页一
// @description  宜搭侧边栏加宽
// @license      MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=aliwork.com
// @match        https://*.aliwork.com/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/466020/%E5%AE%9C%E6%90%AD.user.js
// @updateURL https://update.greasyfork.org/scripts/466020/%E5%AE%9C%E6%90%AD.meta.js
// ==/UserScript==
(function () {
    GM_addStyle(`.next-shell-navigation.next-shell-mini.next-shell-aside{width: 280px !important;} .next-shell-navigation.next-shell-mini.next-shell-aside > div > ul > div{width: 100% !important;}`);
})();