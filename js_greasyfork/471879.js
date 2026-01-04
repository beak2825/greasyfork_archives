// ==UserScript==
// @name         druid连接池控制台显示sql全文
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  原来的sql是缩略的，不便于搜索，通过该插件可以显示sql全文
// @author       Jeffrey Huang
// @match        *://*/druid/sql.html*
// @match        *://*/*/druid/sql.html*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=greasyfork.org
// @grant        none
// @require      https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/471879/druid%E8%BF%9E%E6%8E%A5%E6%B1%A0%E6%8E%A7%E5%88%B6%E5%8F%B0%E6%98%BE%E7%A4%BAsql%E5%85%A8%E6%96%87.user.js
// @updateURL https://update.greasyfork.org/scripts/471879/druid%E8%BF%9E%E6%8E%A5%E6%B1%A0%E6%8E%A7%E5%88%B6%E5%8F%B0%E6%98%BE%E7%A4%BAsql%E5%85%A8%E6%96%87.meta.js
// ==/UserScript==



function showSQL() {
    $("#dataTable tbody tr").each(function () {
        var tdArr = $(this).children();
        tdArr.eq(1).find("a").text(tdArr.eq(1).find("a").attr("title"))
    });
}

(function () {
    'use strict';
    console.log("druid连接池控制台显示sql全文")
    setTimeout(function () {
        druid.sql.switchSuspendRefresh();
        showSQL();

        $("a").click(function () {
            setTimeout(function () {showSQL();}, 2000);
        });
    }, 2000);
})();