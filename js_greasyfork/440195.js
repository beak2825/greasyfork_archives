// ==UserScript==
// @name         Remove Douban Tracker
// @name:zh-CN   移除豆瓣个人信息跟踪
// @namespace    https://github.com/Ryauou/Tampermonkey-scripts
// @version      0.1.2
// @description  移除豆瓣页面内隐藏的个人信息跟踪标识，防止发豆瓣截图被精准溯源水表。
// @author       Konnyaku
// @match        https://*.douban.com/*
// @icon         https://www.douban.com/favicon.ico
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/440195/Remove%20Douban%20Tracker.user.js
// @updateURL https://update.greasyfork.org/scripts/440195/Remove%20Douban%20Tracker.meta.js
// ==/UserScript==

(function() {
    $("div[class=track]").remove();
})();
