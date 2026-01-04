// ==UserScript==
// @name         完整显示榜单
// @version      0.3
// @author       CDE
// @description         直接展开榜单，方便查看
// @match        https://ac.nowcoder.com/acm/contest/*
// @grant        none
// @namespace https://greasyfork.org/users/319198
// @downloadURL https://update.greasyfork.org/scripts/387667/%E5%AE%8C%E6%95%B4%E6%98%BE%E7%A4%BA%E6%A6%9C%E5%8D%95.user.js
// @updateURL https://update.greasyfork.org/scripts/387667/%E5%AE%8C%E6%95%B4%E6%98%BE%E7%A4%BA%E6%A6%9C%E5%8D%95.meta.js
// ==/UserScript==

(function() {
    'use strict';
    setInterval(function () {
    var url = window.location.href
    if (url.substring(url.indexOf("#") + 1).startsWith("rank")) {
        if(document.querySelectorAll(".none").length!==0){
            console.log("DOM");
            [].forEach.call(document.querySelectorAll("table"), function(el) { el.style.tableLayout = "fixed" });
            [].forEach.call(document.querySelectorAll(".real-time-box"), function(el) { el.style.width = "30%" });
            [].forEach.call(document.querySelectorAll(".real-time-coder"), function(el) { el.style.width = "70%" });
            [].forEach.call(document.querySelectorAll(".none"), function(el) { el.classList.remove("none");});
            [].forEach.call(document.querySelectorAll(".nk-main"), function(el) { el.style.width = "1200px"; });
            [].forEach.call(document.querySelectorAll(".js-rank"), function(el) { el.style.width = "1200px"; });
            [].forEach.call(document.querySelectorAll(".real-time-coder-main .icon-angle-right"), function(el) { el.style.display = "none"; });
            [].forEach.call(document.querySelectorAll(".rank-main"), function(el) { el.style.width = "1200px"; });
        }
    }
}, 1000);
})();