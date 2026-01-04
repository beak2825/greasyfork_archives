// ==UserScript==
// @name         Gitee显示原始Git链接
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://gitee.com/*/*
// @icon         https://www.google.com/s2/favicons?domain=gitee.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/422914/Gitee%E6%98%BE%E7%A4%BA%E5%8E%9F%E5%A7%8BGit%E9%93%BE%E6%8E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/422914/Gitee%E6%98%BE%E7%A4%BA%E5%8E%9F%E5%A7%8BGit%E9%93%BE%E6%8E%A5.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var a_1 = document.getElementsByClassName("sync-project-btn");

    var a_2 = document.createElement("a");
    a_2.setAttribute("href",a_1[0].title.replace("点击从 ","").replace(" 强制同步。",""));
    a_2.setAttribute("style","margin-left:10px;font-size: 16px;");
    a_2.innerHTML='点我打开原始Git';

    var parent_span = document.getElementsByClassName("project-badges");
    parent_span[0].appendChild(a_2);
})();