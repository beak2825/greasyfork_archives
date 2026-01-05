// ==UserScript==
// @name         慕课网自动预览
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        http://www.imooc.com/*
// @grant        none
// @require      https://cdn.staticfile.org/jquery/1.8.3/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/25509/%E6%85%95%E8%AF%BE%E7%BD%91%E8%87%AA%E5%8A%A8%E9%A2%84%E8%A7%88.user.js
// @updateURL https://update.greasyfork.org/scripts/25509/%E6%85%95%E8%AF%BE%E7%BD%91%E8%87%AA%E5%8A%A8%E9%A2%84%E8%A7%88.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $(function () {
    setTimeout(function () {
    $("#aotoruncheck").click();
    $("#J_Commit").click();
    }, 2000);
});

    // Your code here...
})();