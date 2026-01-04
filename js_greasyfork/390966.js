// ==UserScript==
// @name        新标签打开豆瓣鹅组
// @author      wangsf
// @description 链接强制在新建标签中打开 Open a URL in background new tab at site:douban.com
// @version     0.1.0
// @match       https://www.douban.com/*
// @run-at      document-start
// @grant       GM_openInTab
// @namespace https://greasyfork.org/users/14137
// @downloadURL https://update.greasyfork.org/scripts/390966/%E6%96%B0%E6%A0%87%E7%AD%BE%E6%89%93%E5%BC%80%E8%B1%86%E7%93%A3%E9%B9%85%E7%BB%84.user.js
// @updateURL https://update.greasyfork.org/scripts/390966/%E6%96%B0%E6%A0%87%E7%AD%BE%E6%89%93%E5%BC%80%E8%B1%86%E7%93%A3%E9%B9%85%E7%BB%84.meta.js
// ==/UserScript==

(function (win) {
    win.addEventListener('click', function (e) {
        if (e.target.href && e.target.tagName === 'A' && e.which === 1) {
            e.preventDefault();
            GM_openInTab(e.target.href, true);
        }
    }, true);
})(window);