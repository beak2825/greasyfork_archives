// ==UserScript==
// @name         NGA 访客直接访问
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  解决“访客不能直接访问”
// @author       ISVStar
// @match        https://nga.178.com/read.php?*
// @match        https://bbs.nga.cn/read.php?*
// @match        https://ngabbs.com/read.php?*
// @match        http://nga.178.com/read.php?*
// @match        http://bbs.nga.cn/read.php?*
// @match        http://ngabbs.com/read.php?*
// @icon         https://bbs.nga.cn/favicon.ico
// @grant        none
// @require      https://code.jquery.com/jquery-3.7.1.slim.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/506703/NGA%20%E8%AE%BF%E5%AE%A2%E7%9B%B4%E6%8E%A5%E8%AE%BF%E9%97%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/506703/NGA%20%E8%AE%BF%E5%AE%A2%E7%9B%B4%E6%8E%A5%E8%AE%BF%E9%97%AE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Wait for the document to be fully loaded
    $(document).ready(function() {
        // Select the link with the specified attributes and click it
        $("a[href='javascript:void(0)'][onclick='g()']").click();
    });
})();