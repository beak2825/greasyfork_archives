// ==UserScript==
// @name         卡车之家品牌大全页品牌-二级类专用-Latest
// @namespace    https://www.1024net.tech/
// @namespace    https://www.lovemake.love/
// @version      2024.03.16.080000
// @description  I try to take over the world!
// @author       Kay
// @match        https://product.360che.com/*
// @icon         https://aimg8.dlssyht.cn/u/1533835/ueditor/image/767/1533835/1633159205592221.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/488496/%E5%8D%A1%E8%BD%A6%E4%B9%8B%E5%AE%B6%E5%93%81%E7%89%8C%E5%A4%A7%E5%85%A8%E9%A1%B5%E5%93%81%E7%89%8C-%E4%BA%8C%E7%BA%A7%E7%B1%BB%E4%B8%93%E7%94%A8-Latest.user.js
// @updateURL https://update.greasyfork.org/scripts/488496/%E5%8D%A1%E8%BD%A6%E4%B9%8B%E5%AE%B6%E5%93%81%E7%89%8C%E5%A4%A7%E5%85%A8%E9%A1%B5%E5%93%81%E7%89%8C-%E4%BA%8C%E7%BA%A7%E7%B1%BB%E4%B8%93%E7%94%A8-Latest.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Your code here...
    function getinfo(selector) {
        if (!$("#listx").length) {
            $("body").append("<textarea id='listx' style='width:100px;height:100vh;position:fixed;top:0;right:0;z-index:11002'><textarea>");
        }
        let n = prompt("获取品牌输入0，获取商品名输入1", "1");
        let list = "";
        if (n == "0") {
            let a = $(selector).length;
            for (let i = 0; i < a; i++) {
                let b = $.trim($(selector + ":eq(" + i + ")").text()) + "\n";
                list += b;
            }
        }
        else if (n == "1") {
            let a = $(".sel-act").text() + "-";
            let b = $(".xll_center2_a1_y2").length;
            for (let i = 0; i < b; i++) {
                $(".xll_center2_a1_y2:eq(" + i + ") a:first").text(function (n, v) { return a + $.trim($(".xll_center2_a1_y2:eq(" + i + ")").parent(".xll_center2_a1_y").find(".xll_center2_a1_y1").text()) + "-" + v });
            }
            for (let i = 0; i < b; i++) {
                let b = $(".xll_center2_a1_y2:eq(" + i + ") a:first").text().replace(/\s+/g, " ") + "\n";
                list += b;
            }
        }
        $("#listx").html(list);
    }
    $(document).keyup(function (event) {
        switch (event.keyCode) {
            case 27:
                getinfo(".xll_center2_a1_z");
                break;
        }
    });
})();
/*2024.03.16.080000 - Line : 51*/