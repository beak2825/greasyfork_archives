// ==UserScript==
// @name         哔哩哔哩专栏去除复制限制
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  去除哔哩哔哩专栏不能复制的限制
// @author       Xleine
// @match        https://www.bilibili.com/read/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/388361/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E4%B8%93%E6%A0%8F%E5%8E%BB%E9%99%A4%E5%A4%8D%E5%88%B6%E9%99%90%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/388361/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E4%B8%93%E6%A0%8F%E5%8E%BB%E9%99%A4%E5%A4%8D%E5%88%B6%E9%99%90%E5%88%B6.meta.js
// ==/UserScript==

(function() {
    document.querySelector(".unable-reprint").classList.remove("unable-reprint")
})();