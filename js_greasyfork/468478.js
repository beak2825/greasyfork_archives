// ==UserScript==
// @name         查店铺已做状态
// @namespace    https://www.1024net.tech/
// @namespace    https://www.lovemake.love/
// @version      0.1
// @description  I try to take over the world!
// @author       Kay
// @match        http://testpage.qipeiyigou.com/dom/shops/*
// @match        http://*.qipeiyigou.com/mshop/?username=qipeiyigouwang&uuid=*
// @match        http://*.qipeiyigou.com/mall/shop?username=qipeiyigouwang&keyword=*
// @icon         https://aimg8.dlssyht.cn/u/1533835/ueditor/image/767/1533835/1633159205592221.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/468478/%E6%9F%A5%E5%BA%97%E9%93%BA%E5%B7%B2%E5%81%9A%E7%8A%B6%E6%80%81.user.js
// @updateURL https://update.greasyfork.org/scripts/468478/%E6%9F%A5%E5%BA%97%E9%93%BA%E5%B7%B2%E5%81%9A%E7%8A%B6%E6%80%81.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Your code here...
    const url = location.href;
    function re() { location.reload(); }
    if (url.indexOf("keyword") != -1) {
        let a = parseInt($(".product-item-in:eq(0)").attr("href").split("/")[3]);
        if (a > 14080000) { $(".title-in").css("color", "red"); }
        else { $(".title-in").css("color", "green"); }
        $("body").append("<style>.title-in[style*=red]::after{content:' - 已做'}.title-in[style*=green]::after{content:' - 未做'}</style>");
    }
    else if (url.indexOf("shop_channel") != -1) {
        if ($("input[name*=order_sort]:eq(0)").val() != 0) { $("body").append("<link rel='shortcut icon' href='https://aimg8.dlssyht.cn/u/1533835/ueditor/image/767/1533835/1692433914832838.png'>"); }
        else { setTimeout(re, 60000); }
    }
    else if (url.indexOf("shops_info") != -1) {
        if ($("#item_field_6885").val() != "") { $("body").append("<link rel='shortcut icon' href='https://aimg8.dlssyht.cn/u/1533835/ueditor/image/767/1533835/1692433914832838.png'>"); }
        else { setTimeout(re, 60000); }
    }
    else if (url.indexOf("shop_pro_class") != -1 || url.indexOf("shop_pro_attr") != -1) {
        if ($(".mytable input").length) { $("link[rel='shortcut icon']").attr("href", "https://aimg8.dlssyht.cn/u/1533835/ueditor/image/767/1533835/1692433914832838.png"); }
        else { setTimeout(re, 60000); }
    }
    else if (url.indexOf("mshop/?") != -1) {
        if ($(".n-tree-node-content__text:eq(0) a").attr("href").indexOf("class") != -1) { $("body").append("<link rel='shortcut icon' href='https://aimg8.dlssyht.cn/u/1533835/ueditor/image/767/1533835/1692433914832838.png'>"); }
        else { setTimeout(re, 60000); }
    }
})();
/*202308251200 - Line : 44*/
