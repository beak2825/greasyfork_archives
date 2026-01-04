// ==UserScript==
// @name         NGA左边缘调整
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  0.1
// @author       You
// @match        https://bbs.nga.cn/thread.php*
// @icon         https://bbs.nga.cn/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/511314/NGA%E5%B7%A6%E8%BE%B9%E7%BC%98%E8%B0%83%E6%95%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/511314/NGA%E5%B7%A6%E8%BE%B9%E7%BC%98%E8%B0%83%E6%95%B4.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var a_1 = document.getElementsByClassName(" haveCustomBackground");
    a_1[0].setAttribute("style","margin-left: 500px;");  // 没做调整界面，500这个值自己改
})();