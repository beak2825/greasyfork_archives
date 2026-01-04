// ==UserScript==
// @name         Open Matching PsyPost Links in New Tab
// @namespace    http://tampermonkey-so/psypost-matching-links
// @version      1
// @description  Open PsyPost detail pages in new tabs instead of current page.
// @match        https://www.psypost.org/*
// @grant        GM_openInTab
// @downloadURL https://update.greasyfork.org/scripts/465547/Open%20Matching%20PsyPost%20Links%20in%20New%20Tab.user.js
// @updateURL https://update.greasyfork.org/scripts/465547/Open%20Matching%20PsyPost%20Links%20in%20New%20Tab.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建一个正则表达式用于匹配链接的格式
    const linkRegex = /^https:\/\/www\.psypost\.org\/\d{4}\/\d{2}\/.*$/;

    // 获取所有的链接元素
    const linkElems = document.querySelectorAll("a");

    // 遍历链接元素并为匹配的链接添加事件监听
    for (let i = 0; i < linkElems.length; i++) {
        let linkElem = linkElems[i];
        if (linkRegex.test(linkElem.href)) {
            linkElem.addEventListener("click", function(event) {
                event.preventDefault();
                var options = {active:false, insert:false}; // tweaks to open tabs in background after all other tabs (check options object below)
                GM_openInTab(linkElem.href,options);
            });
        }
    }

})();
