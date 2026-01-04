// ==UserScript==
// @name         车型库分类/商品排序-自用 Workflow JS
// @namespace    https://www.1024net.tech/
// @namespace    https://www.lovemake.love/
// @version      2024.01.10.14.44.33
// @description  I try to take over the world!
// @author       Kay
// @match        http://admin.qipeiyigou.com/own_add_product*
// @icon         https://aimg8.dlssyht.cn/u/1533835/ueditor/image/767/1533835/1633159205592221.png
// @grant        none
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/478497/%E8%BD%A6%E5%9E%8B%E5%BA%93%E5%88%86%E7%B1%BB%E5%95%86%E5%93%81%E6%8E%92%E5%BA%8F-%E8%87%AA%E7%94%A8%20Workflow%20JS.user.js
// @updateURL https://update.greasyfork.org/scripts/478497/%E8%BD%A6%E5%9E%8B%E5%BA%93%E5%88%86%E7%B1%BB%E5%95%86%E5%93%81%E6%8E%92%E5%BA%8F-%E8%87%AA%E7%94%A8%20Workflow%20JS.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Your code here...
    $("th:contains(排序)").text(function (n, v) { return v + "- " + $("input[name*='sort']").length; });
    $("body").append("<div id='divx'><input id='inputx'><button id='btnx1'>全新填充</button><button id='btnx2'>已有排序</button><style id='stylex'></style></div>");
    function catssort() {
        let cats = $("#inputx").val();
        let arr = cats.split("@");
        let a = $("input[name*='class_name']").length;
        if (a == arr.length - 1) {
            for (let i = 0; i < a; i++) {
                $("input[name*='class_name']:eq(" + i + ")").val(arr[i]);
            }
            $("input[name*='sort']").css("color", "green");
        }
    }
    function catssort2() {
        let cats = $("#inputx").val();
        let arr = cats.split("@");
        let a = $("input[name*='class_name']").length;
        for (let i = 0; i < a; i++) {
            let b = $("input[name*='class_name']:eq(" + i + ")").val(arr[i]);
            //let c = a - arr.indexOf(b);
            //$("input[name*='sort']:eq(" + i + ")").val(c);
        }
        $("input[name*='sort']").css("color", "green");
    }
    $("#btnx1").click(() => { catssort(); });
    $("#btnx2").click(() => { catssort(); });
})();
/*2024.01.10.14.44.33 - Line : 45*/
