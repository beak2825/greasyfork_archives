// ==UserScript==
// @name         移除LeetCode付费题目
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  移除LeetCode付费题目, 使不显示在列表中
// @author       sumuzhe
// @match        *://leetcode-cn.com/problemset/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/387351/%E7%A7%BB%E9%99%A4LeetCode%E4%BB%98%E8%B4%B9%E9%A2%98%E7%9B%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/387351/%E7%A7%BB%E9%99%A4LeetCode%E4%BB%98%E8%B4%B9%E9%A2%98%E7%9B%AE.meta.js
// ==/UserScript==

(function() {
    'use strict';
    main();
})();

function main() {
    setInterval(remove, 3000);
}

function remove() {
    console.log("remove function start");
    var ps = $(".reactable-data");
    if (ps.length <= 0) {
        return;
    }
    var trs = ps.find("tr");
    for (var i = 0; i < trs.length; i++) {
        var tr = $(trs.get(i));
        if (tr.is(":hidden")) {
            continue;
        }
        var lockDiv = $(tr.find("td").get(0)).find("div").children("i");
        if (lockDiv.length === 1) {
            tr.hide();
        }
    }
    console.log("remove function end");
}