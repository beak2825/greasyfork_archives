// ==UserScript==
// @name         车型库参数模板获取
// @namespace    https://www.1024net.tech/
// @namespace    https://www.lovemake.love/
// @version      2024.02.28.111428
// @description  I try to take over the world!
// @author       Kay
// @match        http://admin.qipeiyigou.com/carModelAlert.php?isAlert*
// @icon         https://aimg8.dlssyht.cn/u/1533835/ueditor/image/767/1533835/1633159205592221.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/488502/%E8%BD%A6%E5%9E%8B%E5%BA%93%E5%8F%82%E6%95%B0%E6%A8%A1%E6%9D%BF%E8%8E%B7%E5%8F%96.user.js
// @updateURL https://update.greasyfork.org/scripts/488502/%E8%BD%A6%E5%9E%8B%E5%BA%93%E5%8F%82%E6%95%B0%E6%A8%A1%E6%9D%BF%E8%8E%B7%E5%8F%96.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Your code here...
    function gettemplate() {
        let a = $(".panel").length;
        let list = "";
        for (let i = 0; i < a; i++) {
            $(".panel:eq(" + i + ") .item-label").text(function (n, v) {
                let b = $(".panel:eq(" + i + ") .panel-title").text() + "@";
                return b + v.split("：")[0];
            });
        }
        let c = $(".option-list .active").text();
        $(".item-label:eq(0)").text(() => { return c; });
        for (let i = 0; i < $(".item-label").length; i++) {
            list += $(".item-label:eq(" + i + ")").text() + "\n";
        }
        list = list + $(".item-label").length.toString();
        $("body").append("<textarea id='listx' style='width:100px;height:100vh;position:fixed;top:0;right:0;'><textarea>");
        $("#listx").html(list);
    }
    $(document).keyup(function (event) {
        switch (event.keyCode) {
            case 27:
                gettemplate();
                break;
        }
    });
})();
/*2024.02.28.111428 - Line : 43*/
