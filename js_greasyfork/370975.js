// ==UserScript==
// @name         脚本之家去广告
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  脚本之家去广告.
// @author       lidonghui
// @match        *://www.jb51.net/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/370975/%E8%84%9A%E6%9C%AC%E4%B9%8B%E5%AE%B6%E5%8E%BB%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/370975/%E8%84%9A%E6%9C%AC%E4%B9%8B%E5%AE%B6%E5%8E%BB%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function () {
    'use strict';
    // 去头部logo旁边的广告
    function clearAD() {
        $(".logom").hide();
        $(".logor").hide();
        $(".mainlr").hide();
        $(".blank5").hide();
        $("#txtlink").hide();
        $(".topimg").hide();
        $(".main-right").hide();
        $("#con_all").hide();
        $("#main .main-left").css("width", "100%");

        $("iframe").map(function () {
            $(this).hide();
        });

        $(".google-auto-placed").map(function () {
            $(this).hide();
        });
    }

    // 启动定时器
    setInterval(function () {
        clearAD();
    }, 1000);

})();