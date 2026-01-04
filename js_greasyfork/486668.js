// ==UserScript==
// @name         煎蛋广告删除
// @namespace    http://tampermonkey.net/
// @version      2024-02-05
// @description  屏蔽煎蛋广告栏
// @author       You
// @match        https://jandan.net/treehole
// @icon         https://www.google.com/s2/favicons?sz=64&domain=jandan.net
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/486668/%E7%85%8E%E8%9B%8B%E5%B9%BF%E5%91%8A%E5%88%A0%E9%99%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/486668/%E7%85%8E%E8%9B%8B%E5%B9%BF%E5%91%8A%E5%88%A0%E9%99%A4.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 屏蔽广告栏
    $("#sidebar").remove()
    $("#content").width("100%")
})();