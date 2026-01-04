// ==UserScript==
// @name         商品-三级类-品牌排序专用-Latest
// @namespace    https://www.1024net.tech/
// @namespace    https://www.lovemake.love/
// @version      2024.04.23.080000
// @description  I try to take over the world!
// @author       Kay
// @match        http://admin.qipeiyigou.com/own_product_list.php*
// @match        http://admin.qipeiyigou.com/own_add_product_sub1_class.php*
// @exclude      http://admin.qipeiyigou.com/action/own_pro_action.php
// @icon         https://aimg8.dlssyht.cn/u/1533835/ueditor/image/767/1533835/1633159205592221.png
// @grant        none
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/489934/%E5%95%86%E5%93%81-%E4%B8%89%E7%BA%A7%E7%B1%BB-%E5%93%81%E7%89%8C%E6%8E%92%E5%BA%8F%E4%B8%93%E7%94%A8-Latest.user.js
// @updateURL https://update.greasyfork.org/scripts/489934/%E5%95%86%E5%93%81-%E4%B8%89%E7%BA%A7%E7%B1%BB-%E5%93%81%E7%89%8C%E6%8E%92%E5%BA%8F%E4%B8%93%E7%94%A8-Latest.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Your code here...
    let per_page_num = $("input[name*='sort']").length;
    //商品编号
    $("tr[id*=tr_] .left+td").click(function () {
        let pronum = $(this).text();
        localStorage.setItem("pronum", pronum);
        $(this).css("color", "green");
    });
    //排序
    $("th:contains('排序')").click(function () {
        let a = $("input[name*='sort[']").length;
        let b = prompt("请输入起始值或增量：", "1");
        //全升序，输入起始值：1a
        if (b.indexOf("a") != -1) {
            for (let i = 0; i < a; i++) {
                if ($("input[name*='sort[']:eq(" + i + ")").val() != "-1") {
                    $("input[name*='sort[']:eq(" + i + ")").val(function (n, v) { return parseInt(b) + i; });
                }
                else { break; }
            }
        }
        //全降序，输入起始值：10z
        else if (b.indexOf("z") != -1) {
            for (let i = 0; i < a; i++) {
                if ($("input[name*='sort[']:eq(" + i + ")").val() != "-1") {
                    $("input[name*='sort[']:eq(" + i + ")").val(function (n, v) { return parseInt(b) - i; });
                }
                else { break; }
            }
        }
        //增量，输入增量值
        else {
            for (let i = 0; i < a; i++) {
                if ($("input[name*='sort[']:eq(" + i + ")").val() != "-1") {
                    $("input[name*='sort[']:eq(" + i + ")").val(function (n, v) { return parseInt(v) + parseInt(b); });
                }
                else { break; }
            }
        }
        $("input[name*='sort']").css("color", "green");
    });
    //自定义排序
    $("th:contains(排序)").text(function (n, v) { return v + "- " + $("input[name*='sort']").length; });
    $("body").append("<div id='divx'><input id='inputx'><button id='buttonx1'>全新填充</button><button id='buttonx2'>现有排序</button></div>");
    function sort0() {
        let list = $("#inputx").val();
        let arr = list.split("@");
        let a = $("input[name*='sort']").length;
        if (a == arr.length - 1) {
            if ($("input[name*='class_name']").length) {
                for (let i = 0; i < a; i++) {
                    $("input[name*='class_name']:eq(" + i + ")").val(arr[i]);
                }
            }
            else if ($("input[name*='manu_name']").length) {
                for (let i = 0; i < a; i++) {
                    $("input[name*='manu_name']:eq(" + i + ")").val(arr[i]);
                }
            }
            else if ($("input[name*='name[']").length) {
                for (let i = 0; i < a; i++) {
                    $("input[name*='name[']:eq(" + i + ")").val(arr[i]);
                }
            }
            $("input[name*='sort']").css("color", "green");
        }
        else { alert(arr.length - 1); }
    }
    function sort1() {
        let list = $("#inputx").val();
        if (list.indexOf("@") != -1) {
            localStorage.setItem("list", list);
        }
        let get = localStorage.getItem("list");
        let arr = get.split("@");
        let a = $("input[name*='sort']").length;
        if ($("input[name*='class_name']").length) {
            for (let i = 0; i < a; i++) {
                let a = $("input[name*='class_name']:eq(" + i + ")").val().trim();
                let b = arr.indexOf(a) + 1;
                $("input[name*='sort']:eq(" + i + ")").val(b);
            }
        }
        else if ($("input[name*='manu_name']").length) {
            for (let i = 0; i < a; i++) {
                let a = $("input[name*='manu_name']:eq(" + i + ")").val().trim();
                let b = arr.indexOf(a) + 1;
                $("input[name*='sort']:eq(" + i + ")").val(b);
            }
        }
        else {
            for (let i = 0; i < a; i++) {
                let a = $("tr[id*='tr_']:eq(" + i + ") .protitle").text().trim();
                let b = arr.indexOf(a) + 1;
                $("input[name*='sort']:eq(" + i + ")").val(b);
            }
        }
        $("input[name*='sort']").css("color", "green");
    }
    function sort2() {
        if (localStorage.getItem("start_num") != null) {
            localStorage.clear();
            alert("已清除本地存储！");
        }
        else {
            localStorage.clear();
            let start_num = $("#inputx").val();
            localStorage.setItem("start_num", start_num);
            alert("已添加本地存储！");
        }
    }
    $("#buttonx2").click(() => { sort2(); });
    let get_start_num = localStorage.getItem("start_num");
    if (get_start_num.indexOf("@") == -1) {
        $("th:contains(操作)").click(() => {
            location.href = localStorage.getItem("next_page");
        });
        let max_num = parseInt(localStorage.getItem("start_num"));
        let current_page = $(".page-number b").text();
        let page_first_num = max_num - (parseInt(current_page) - 1) * per_page_num;
        let sort_len = $("input[name*='sort']").length;
        for (let i = 0; i < sort_len; i++) {
            $("input[name*='sort']:eq(" + i + ")").val(page_first_num - i);
        }
        $(".checkbox-element:last").click();
        $("input[name*='sort']").css("color", "green");
        let next_page = $(".page-number a:last").attr("href");
        if ($(".page-number b").text() != "1") {
            localStorage.setItem("next_page", next_page);
        }
        //setTimeout(() => { $("div:contains(保存修改)").click(); }, 2000);
    }
    else if (get_start_num.indexOf("@") != -1) {
        $("th:contains(操作)").click(() => {
            location.href = localStorage.getItem("next_page");
        });
        let arr = get_start_num.replaceAll("@ ", "@").split("@");
        let a = $("input[name*='sort']").length;
        if ($("input[name*='class_name']").length) {
            for (let i = 0; i < a; i++) {
                let a = $("input[name*='class_name']:eq(" + i + ")").val().trim();
                let b = arr.indexOf(a) + 1;
                $("input[name*='sort']:eq(" + i + ")").val(b);
            }
        }
        else if ($("input[name*='manu_name']").length) {
            for (let i = 0; i < a; i++) {
                let a = $("input[name*='manu_name']:eq(" + i + ")").val().trim();
                let b = arr.indexOf(a) + 1;
                $("input[name*='sort']:eq(" + i + ")").val(b);
            }
        }
        else {
            for (let i = 0; i < a; i++) {
                let a = $("tr[id*='tr_']:eq(" + i + ") .protitle").text().trim();
                let b = arr.indexOf(a) + 1;
                $("input[name*='sort']:eq(" + i + ")").val(b);
            }
        }
        $(".checkbox-element:last").click();
        $("input[name*='sort']").css("color", "green");
        let next_page = $(".page-number a:last").attr("href");
        if ($(".page-number b").text() != "1") {
            localStorage.setItem("next_page", next_page);
        }
    }
    //$("#buttonx1").click(() => { sort0(); });
})();
/*2024.04.23.080000 - Line : 187*/