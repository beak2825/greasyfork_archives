// ==UserScript==
// @name         凤凰新闻去广告
// @version      0.1
// @description  凤凰新闻去列表第三项内容的广告
// @match        https://news.ifeng.com/
// @license      MIT
// @grant        none
// @namespace https://greasyfork.org/users/1384640
// @downloadURL https://update.greasyfork.org/scripts/514806/%E5%87%A4%E5%87%B0%E6%96%B0%E9%97%BB%E5%8E%BB%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/514806/%E5%87%A4%E5%87%B0%E6%96%B0%E9%97%BB%E5%8E%BB%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

window.addEventListener('load', function() {
    document.evaluate("//html//body//div//div[5]//div[1]//div[3]//ul//li[3]",document).iterateNext().remove();
});