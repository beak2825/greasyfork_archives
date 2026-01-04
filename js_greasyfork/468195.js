// ==UserScript==
// @name         简书专注模式
// @namespace    https://gist.github.com/codethereforam/fe5b50b4e70414602d2b7a600055ae37
// @version      0.1
// @description  去除简书一切不必要的页面元素
// @author       https://github.com/codethereforam/
// @match        https://*.jianshu.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=jianshu.com
// @grant        none
// @license      GPL-3.0 License
// @downloadURL https://update.greasyfork.org/scripts/468195/%E7%AE%80%E4%B9%A6%E4%B8%93%E6%B3%A8%E6%A8%A1%E5%BC%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/468195/%E7%AE%80%E4%B9%A6%E4%B8%93%E6%B3%A8%E6%A8%A1%E5%BC%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const main = document.querySelector('[role="main"]').children[0].children[0];
    document.body.innerHTML = "";
    document.body.appendChild(main);
    document.body.style = "padding-right: 20%;padding-left: 20%;"

    // 解决图片无法加载问题
    for (const img of document.querySelectorAll("img")) {
        img.src = img.getAttribute("data-original-src");
    }
})();