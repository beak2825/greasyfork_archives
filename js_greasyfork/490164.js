// ==UserScript==
// @name         商用车网产品列表-参数-二级类-商品名-url专用-Latest
// @namespace    https://www.1024net.tech/
// @namespace    https://www.lovemake.love/
// @version      2024.03.18.080000
// @description  I try to take over the world!
// @author       Kay
// @match        http://www.chinacar.com.cn/qitaleixingqiche/*
// @icon         https://aimg8.dlssyht.cn/u/1533835/ueditor/image/767/1533835/1633159205592221.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/490164/%E5%95%86%E7%94%A8%E8%BD%A6%E7%BD%91%E4%BA%A7%E5%93%81%E5%88%97%E8%A1%A8-%E5%8F%82%E6%95%B0-%E4%BA%8C%E7%BA%A7%E7%B1%BB-%E5%95%86%E5%93%81%E5%90%8D-url%E4%B8%93%E7%94%A8-Latest.user.js
// @updateURL https://update.greasyfork.org/scripts/490164/%E5%95%86%E7%94%A8%E8%BD%A6%E7%BD%91%E4%BA%A7%E5%93%81%E5%88%97%E8%A1%A8-%E5%8F%82%E6%95%B0-%E4%BA%8C%E7%BA%A7%E7%B1%BB-%E5%95%86%E5%93%81%E5%90%8D-url%E4%B8%93%E7%94%A8-Latest.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Your code here...
    function re() {
        setTimeout(() => { if ($(".chinacar_page .current").next().length) { location.href = $(".chinacar_page .current").next().attr("href"); } }, 3000);
    }
    if (!$("#listx").length) {
        $("body").prepend("<textarea id='sb_form_q'></textarea><button id='btn1' data-clipboard-target='#sb_form_q' style='width:64px;height:45px;position:fixed;z-index:1000;left:1100px;top:10px;'>Get</button>");
    }
    //$("#btn1").mousedown(() => { $("#btn1").css({ "background-color": "#0090ff", "color": "white" }); });
    $("#btn1").mousedown(() => {
        let a = localStorage.getItem("list");
        let filename = $(".atts").text();
        let blob = new Blob([a], { type: "text/plain;charset=utf-8" });
        saveAs(blob, filename);
    });
    if ($(".pro_list_product").length) {
        let a = $(".pro_list_product_box li").length;
        let page = "#" + $(".chinacar_page .current").text();
        $(".pro_list_product_box .text_text a").text(function (n, v) {
            return $(".atts").text() + "@" + $(this).parents(".text").next(".text1").text() + "@" + v + "@" + $(this).attr("href") + page + "|@|";
        });
        let list = "";
        for (let i = 0; i < a; i++) {
            let b = $(".pro_list_product_box li:eq(" + i + ") .text_text a").text();
            list += b;
        }
        //$("#sb_form_q").html(list);
        //$(".header-search-content a").css("background-color", "#0090ff");
        if (localStorage.getItem("list") == null) {
            localStorage.setItem("list", list);
        }
        else {
            let alllist = localStorage.getItem("list");
            let addlist = alllist + list;
            localStorage.setItem("list", addlist);
        }
        re();
    }
})();
/*2024.03.18.080000 - Line : 54*/
