// ==UserScript==
// @name         车型库三级类添加-自用 Workflow JS
// @namespace    https://www.1024net.tech/
// @namespace    https://www.lovemake.love/
// @version      2024.02.28.111428
// @description  I try to take over the world!
// @author       Kay
// @match        http://admin.qipeiyigou.com/VT/Iframe/ProductClass.php*
// @match        http://admin.qipeiyigou.com/own_add_product_sub1_class.php*
// @icon         https://aimg8.dlssyht.cn/u/1533835/ueditor/image/767/1533835/1633159205592221.png
// @grant        none
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/484496/%E8%BD%A6%E5%9E%8B%E5%BA%93%E4%B8%89%E7%BA%A7%E7%B1%BB%E6%B7%BB%E5%8A%A0-%E8%87%AA%E7%94%A8%20Workflow%20JS.user.js
// @updateURL https://update.greasyfork.org/scripts/484496/%E8%BD%A6%E5%9E%8B%E5%BA%93%E4%B8%89%E7%BA%A7%E7%B1%BB%E6%B7%BB%E5%8A%A0-%E8%87%AA%E7%94%A8%20Workflow%20JS.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Your code here...
    $(".nolistdiv").click(function () {
        let a = $("dd.active:eq(0)").text();
        localStorage.setItem("option", a);
        let b = $("dd.active:eq(0)").attr("data-value");
        localStorage.setItem("optionvalue", b);
        $(this).css("color", "green");
    });
    let c = localStorage.getItem("option");
    let d = localStorage.getItem("optionvalue");
    $(".suffix:eq(0) input:first").attr("placeholder", c);
    $(".suffix:eq(0) input:first").val(c);
    $("#big_class_id").attr("value", d);
    $("#big_class_id").trigger("change");
    $("#order_sort").css("background-color", "#eee");
    $(".btn-primary").attr("accesskey", "a");
})();
/*2024.02.28.111428 - Line : 35*/
