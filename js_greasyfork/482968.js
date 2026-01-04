// ==UserScript==
// @name         汽车易购网后台 - JS
// @namespace    https://www.1024net.tech/
// @namespace    https://www.lovemake.love/
// @version      2024.01.01.15.05.55
// @description  I try to take over the world!
// @author       Kay
// @match        http://*.qipeiyigou.com/*
// @icon         https://aimg8.dlssyht.cn/u/1533835/ueditor/image/767/1533835/1633159205592221.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/482968/%E6%B1%BD%E8%BD%A6%E6%98%93%E8%B4%AD%E7%BD%91%E5%90%8E%E5%8F%B0%20-%20JS.user.js
// @updateURL https://update.greasyfork.org/scripts/482968/%E6%B1%BD%E8%BD%A6%E6%98%93%E8%B4%AD%E7%BD%91%E5%90%8E%E5%8F%B0%20-%20JS.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Your code here...
    function skipad(id1, id2) {
        var timeid = setInterval(() => {
            if ($(id1).length) {
                $(".alert-close-btn i").text("跳过");
                $(id1).css({ "width": "1920px", "left": "0" });
                $(".alert-close-btn").before("<span id='timex' style='font-size:18px;float:right;top:23px;right:120px;position:absolute;z-index:200;color:white;'>5秒后关闭</span>");
                var a = 4;
                var b = setInterval(() => {
                    var c = a + "秒后关闭";
                    $("#timex").text(c);
                    if (a == 0) {
                        clearInterval(b);
                        $(id1 + "," + id2).css("display", "none");
                    }
                    a--;
                }, 1000);
                $(id1).click(function () {
                    $(id1 + "," + id2).css("display", "none");
                });
                clearInterval(timeid);
            }
        }, 100);
    }
    skipad("#evMo_bAB25", "#alertBg_bAB25");
})();
/*2024.01.01.15.05.55 - Line : 42*/
