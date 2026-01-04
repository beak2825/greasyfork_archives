// ==UserScript==
// @name         去LeetCode 中文版广告
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       DrCube
// @match        *://*.leetcode.com/*
// @match        *://leetcode.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/387729/%E5%8E%BBLeetCode%20%E4%B8%AD%E6%96%87%E7%89%88%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/387729/%E5%8E%BBLeetCode%20%E4%B8%AD%E6%96%87%E7%89%88%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==


(function() {
    'use strict';

    $(".fa.fa-times-circle").click();
    $("div.cn_close_btn").click();
    //fa.fa-times-circle
    //btn.btn-link.pull-right.close-btn
    //div.cn_close_btn
})();