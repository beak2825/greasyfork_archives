// ==UserScript==
// @name         NexusHD趣味盒展开
// @namespace    NexusHD趣味盒展开
// @version      0.19
// @description  展开NexusHD首页的趣味盒视窗，方便浏览搞笑图片
// @author       Wu Xin
// @match        https://*.nexushd.org/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=nexushd.org
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/444791/NexusHD%E8%B6%A3%E5%91%B3%E7%9B%92%E5%B1%95%E5%BC%80.user.js
// @updateURL https://update.greasyfork.org/scripts/444791/NexusHD%E8%B6%A3%E5%91%B3%E7%9B%92%E5%B1%95%E5%BC%80.meta.js
// ==/UserScript==

(function() {
    var elem = document.querySelector("#outer > table > tbody > tr > td > table:nth-child(6) > tbody > tr > td > iframe");
    elem.height = 700;

})();