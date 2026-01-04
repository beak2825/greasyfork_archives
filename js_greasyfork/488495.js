// ==UserScript==
// @name         汽车之家品牌-车系获取专用-Latest
// @namespace    https://www.1024net.tech/
// @namespace    https://www.lovemake.love/
// @version      2024.03.16.080000
// @description  I try to take over the world!
// @author       Kay
// @match        https://car.autohome.com.cn/*
// @icon         https://aimg8.dlssyht.cn/u/1533835/ueditor/image/767/1533835/1633159205592221.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/488495/%E6%B1%BD%E8%BD%A6%E4%B9%8B%E5%AE%B6%E5%93%81%E7%89%8C-%E8%BD%A6%E7%B3%BB%E8%8E%B7%E5%8F%96%E4%B8%93%E7%94%A8-Latest.user.js
// @updateURL https://update.greasyfork.org/scripts/488495/%E6%B1%BD%E8%BD%A6%E4%B9%8B%E5%AE%B6%E5%93%81%E7%89%8C-%E8%BD%A6%E7%B3%BB%E8%8E%B7%E5%8F%96%E4%B8%93%E7%94%A8-Latest.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Your code here...
    //$("#cartree dl a").removeAttr("href");
    //$("#cartree dl dt").remove();
    $("#cartree h3 em,#cartree dd em").text(function (n, v) {
        if ($(this).text().indexOf("停售") != -1) { return "(停售)"; }
        else { return ""; }
    });
    $("#cartree a").attr("style", "user-select:text");
    function getinfo(selector) {
        let a = $(selector).length;
        let list = "";
        for (let i = 0; i < a; i++) {
            let b = $.trim($(selector + ":eq(" + i + ")").text()) + "\n";
            list += b;
        }
        if (!$("#listx").length) {
            $("body").append("<textarea id='listx' style='width:100px;height:100vh;position:fixed;top:0;right:0;z-index:11002'><textarea>");
        }
        $("#listx").html(list);
    }
    function go() {
        let letter = "";
        if ($("#cartree .current").is(":first-child")) {
            letter = "<h1>" + $("#cartree .current").parent().prev().text() + "</h1>";
        }
        let li = $("#cartree .current").prop("outerHTML");
        let already = localStorage.getItem("allist");
        if (already == null) { localStorage.setItem("allist", ""); }
        let all = localStorage.getItem("allist") + letter + li;
        localStorage.setItem("allist", all);
        if ($("#cartree .current").next().length) {
            location.href = $("#cartree .current+li h3 a").attr("href");
        }
        else {
            location.href = $("#cartree .current").parent().next().next().find("li:eq(0) h3 a").attr("href");
        }
    }
    $(document).keyup(function (event) {
        switch (event.keyCode) {
            case 27:
                //getinfo(".cartree h3");
                go();
                break;
        }
    });
})();
/*2024.03.16.080000 - Line : 62*/
