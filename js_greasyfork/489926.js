// ==UserScript==
// @name         添加品牌-三级类专用-Latest
// @namespace    https://www.1024net.tech/
// @namespace    https://www.lovemake.love/
// @version      2024.03.16.080000
// @description  I try to take over the world!
// @author       Kay
// @match        http://admin.qipeiyigou.com/VT/Iframe/ProductClass.php*
// @match        http://admin.qipeiyigou.com/own_add_product_sub_class.php*
// @match        http://admin.qipeiyigou.com/own_add_product_sub1_class.php*
// @icon         https://aimg8.dlssyht.cn/u/1533835/ueditor/image/767/1533835/1633159205592221.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/489926/%E6%B7%BB%E5%8A%A0%E5%93%81%E7%89%8C-%E4%B8%89%E7%BA%A7%E7%B1%BB%E4%B8%93%E7%94%A8-Latest.user.js
// @updateURL https://update.greasyfork.org/scripts/489926/%E6%B7%BB%E5%8A%A0%E5%93%81%E7%89%8C-%E4%B8%89%E7%BA%A7%E7%B1%BB%E4%B8%93%E7%94%A8-Latest.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Your code here...
    const url = location.href;
    //大类
    if (url.indexOf("class_dis=1") != -1) {
        $("label:contains(分类名称)").click(() => {
            localStorage.setItem("catnamelist", $("#name").val());
            localStorage.setItem("startnum", $("#order_sort").val());
            location.reload();
        });
        let get = localStorage.getItem("catnamelist");
        let num = localStorage.getItem("startnum");
        if (get.indexOf("@") != -1) {
            let a = get.split("@")[0];
            $("#name").val(a);
            $("#order_sort").val(num);
            let b = a + "@";
            let c = get.replace(b, "");
            localStorage.setItem("catnamelist", c);
            localStorage.setItem("startnum", Number(num) + 1);
            setTimeout(() => { $(".btn-primary:last").click(); }, 1000);
        }
        else {
            localStorage.clear();
            $("#name").val("已完成！");
        }
    }
    //小类
    else if (url.indexOf("own_add_product_sub_class.php") != -1) {
        $("h4").click(() => {
            let a = $(".suffix input:last").val();
            localStorage.setItem("bigid", a);
            $("h4").css("color", "#2bf");
        });
    }
    else if (url.indexOf("class_dis=2") != -1) {
        $("#order_sort").val(1);
        $("label:contains(分类名称)").click(() => {
            localStorage.setItem("catnamelist", $("#name").val());
            localStorage.setItem("startnum", $("#order_sort").val());
            location.reload();
        });
        let get = localStorage.getItem("catnamelist");
        let bigid = localStorage.getItem("bigid");
        let num = localStorage.getItem("startnum");
        if (get.indexOf("@") != -1) {
            let a = get.split("@")[0];
            $("#parentid").val(bigid);
            $(".suffix input:first").val($("dd[data-value=" + bigid + "]").attr("title"));
            $("#name").val(a);
            $("#order_sort").val(num);
            let b = a + "@";
            let c = get.replace(b, "");
            localStorage.setItem("catnamelist", c);
            localStorage.setItem("startnum", Number(num) + 1);
            setTimeout(() => { $(".btn-primary:last").click(); }, 1000);
        }
        else {
            localStorage.clear();
            $("#name").val("已完成！");
        }
    }
    //三级类
    else if (url.indexOf("own_add_product_sub1_class.php") != -1) {
        $("h4").click(() => {
            let a = $("#select_parent_id").val();
            let b = $("#sub_id").val();
            localStorage.setItem("bigid", a);
            localStorage.setItem("subid", b);
            $("h4").css("color", "#2bf");
        });
    }
    else if (url.indexOf("class_dis=3") != -1) {
        $("#order_sort").val(1);
        $("label:contains(分类名称)").click(() => {
            localStorage.setItem("catnamelist", $("#name").val());
            localStorage.setItem("startnum", $("#order_sort").val());
            location.reload();
        });
        let get = localStorage.getItem("catnamelist");
        let bigid = localStorage.getItem("bigid");
        let subid = localStorage.getItem("subid");
        let num = localStorage.getItem("startnum");
        if (get.indexOf("@") != -1) {
            let a = get.split("@")[0];
            $("#big_class_id").val(bigid);
            $("#big_class_id").prev().val($("dd[data-value=" + bigid + "]").attr("title"));
            $("#parentid").val(subid);
            $("#parentid").prev().val($("dd[data-value=" + subid + "]").attr("title"));
            $("#name").val(a);
            $("#order_sort").val(num);
            let b = a + "@";
            let c = get.replace(b, "");
            localStorage.setItem("catnamelist", c);
            localStorage.setItem("startnum", Number(num) + 1);
            setTimeout(() => { $(".btn-primary:last").click(); }, 1000);
        }
        else {
            localStorage.clear();
            $("#name").val("已完成！");
        }
    }
    //品牌
    else if (url.indexOf("class_dis=4") != -1) {
        $("label:contains(品牌名称)").click(() => {
            localStorage.setItem("brandnamelist", $("#name").val());
            localStorage.setItem("startnum", $("#order_sort").val());
            location.reload();
        });
        let get = localStorage.getItem("brandnamelist");
        let num = localStorage.getItem("startnum");
        if (get.indexOf("@") != -1) {
            let a = get.split("@")[0];
            $("#name").val(a);
            $("#order_sort").val(num);
            let b = a + "@";
            let c = get.replace(b, "");
            localStorage.setItem("brandnamelist", c);
            localStorage.setItem("startnum", Number(num) + 1);
            setTimeout(() => { $(".btn-primary:last").click(); }, 1000);
        }
        else {
            localStorage.clear();
            $("#name").val("已完成！");
        }
    }
})();
/*2024.03.16.080000 - Line : 144*/
