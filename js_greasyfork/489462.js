// ==UserScript==
// @name         卡车之家产品列表-三级类-商品名-url专用-Latest
// @namespace    https://www.1024net.tech/
// @namespace    https://www.lovemake.love/
// @version      2024.03.29.080000
// @description  I try to take over the world!
// @author       Kay
// @match        https://product.360che.com/*
// @icon         https://aimg8.dlssyht.cn/u/1533835/ueditor/image/767/1533835/1633159205592221.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/489462/%E5%8D%A1%E8%BD%A6%E4%B9%8B%E5%AE%B6%E4%BA%A7%E5%93%81%E5%88%97%E8%A1%A8-%E4%B8%89%E7%BA%A7%E7%B1%BB-%E5%95%86%E5%93%81%E5%90%8D-url%E4%B8%93%E7%94%A8-Latest.user.js
// @updateURL https://update.greasyfork.org/scripts/489462/%E5%8D%A1%E8%BD%A6%E4%B9%8B%E5%AE%B6%E4%BA%A7%E5%93%81%E5%88%97%E8%A1%A8-%E4%B8%89%E7%BA%A7%E7%B1%BB-%E5%95%86%E5%93%81%E5%90%8D-url%E4%B8%93%E7%94%A8-Latest.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Your code here...
    function re() {
        if ($(".mb-8 .selected.paging").next().length) {
            setTimeout(() => { location.href = $(".mb-8 .selected.paging").next().attr("href"); }, 3000);
        }
    }
    if (!$("#textareax").length) {
        $("body").append("<textarea id='textareax' style='width:1px;height:1px;'></textarea><button id='buttonx1' data-clipboard-target='#textareax' style='width:64px;height:45px;position:fixed;z-index:1000;left:1100px;top:10px;'>Get</button>");
    }
    $("#buttonx1").mousedown(() => { $("#buttonx1").css({ "background-color": "#0090ff", "color": "white" }); });
    if ($(".car-list").length) {
        let a = $(".car-list .car-item").length;
        let list = "";
        for (let i = 0; i < a; i++) {
            let b = $(".filter-content:first .bg-blue").text().split(" ")[0] + "@" + $(".condition").text() + "@" + $(".nav-selected:last").text() + "@" + $(".car-list .car-item:eq(" + i + ") h2").text() + "@" + $(".car-list .car-item:eq(" + i + ") h2 a").attr("href") + "#" + $(".selected.paging").text() + "\n";
            list += b;
        }
        $("#textareax").html(list.replaceAll("\u00A0", " "));
        $(".header-search-content a").css("background-color", "#0090ff");
        re();
    }
    else {
        let a = $(".crumbs a:eq(2)").text().trim() + "@" + $(".crumbs a:eq(3)").text().trim() + "@" + $(".crumbs a:eq(4)").text().trim() + "@" + $("h1").text().trim() + "@" + location.href;
        $("#textareax").html(a.replaceAll("\u00A0", " "));
        $("#buttonx1").css({ "color": "white", "background-color": "green" });
    }
})();
/*2024.03.29.080000 - Line : 43*/
