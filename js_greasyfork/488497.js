// ==UserScript==
// @name         通用获取模板
// @namespace    https://www.1024net.tech/
// @namespace    https://www.lovemake.love/
// @version      2024.04.16.080000
// @description  I try to take over the world!
// @author       Kay
// @match        *://*/*
// @icon         https://aimg8.dlssyht.cn/u/1533835/ueditor/image/767/1533835/1633159205592221.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/488497/%E9%80%9A%E7%94%A8%E8%8E%B7%E5%8F%96%E6%A8%A1%E6%9D%BF.user.js
// @updateURL https://update.greasyfork.org/scripts/488497/%E9%80%9A%E7%94%A8%E8%8E%B7%E5%8F%96%E6%A8%A1%E6%9D%BF.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Your code here...
    function getinfo(selector) {
        let a = $(selector).length;
        let list = "";
        for (let i = 0; i < a; i++) {
            let b = $(selector + ":eq(" + i + ")").text().trim() + "\n";
            list += b;
        }
        $("body").append("<textarea id='listx' style='width:100px;height:100vh;position:fixed;top:0;right:0;z-index:11002'><textarea>");
        $("#listx").html(list);
    }
    $(document).keyup(function (event) {
        switch (event.keyCode) {
            case 27:
                getinfo(selector);
                //getinfo("input[name*='manu_name']");//车型库品牌
                //getinfo(".oneClassTinner");//大类
                //getinfo(".twoClassTinner");//小类
                //getinfo(".threeClassTinner");//三级类
                break;
        }
    });
})();
/*车型库页面三级类获取
$(".oneClassT code").click();
$(".twoClassT code").click();
let a = $(".oneClassT").length;
for (i = 0; i < a; i++) {
    $(".oneClassT:eq(" + i + ") + .oneClassC .twoClassT").text(function (n, v) {
        return $(".oneClassT:eq(" + i + ")").text().trim() + "@" + v.trim();
    })
}
let b = $(".twoClassT").length;
for (i = 0; i < b; i++) {
    $(".twoClassT:eq(" + i + ") + .twoClassC a").text(function (n, v) {
        return $(".twoClassT:eq(" + i + ")").text().trim() + "@" + v.trim();
    })
}
*/
/*车型库页面大类获取, 带url, 添加大类用, 配合py
let a = $(".oneClassT").length;
for (i = 0; i < a; i++) {
    $(".oneClassT:eq(" + i + ") a").text(function (n, v) {
        return v.trim() + "@" + $(this).attr("href").split("products/")[1];
    })
}
*/
/*车型库页面二级类获取, 带url, 添加三级类用, 配合py
let a = $(".oneClassT").length;
for (i = 0; i < a; i++) {
    $(".oneClassT:eq(" + i + ") + .oneClassC .twoClassT a").text(function (n, v) {
        return $(".oneClassT:eq(" + i + ")").text().trim() + "@" + v.trim() + "@" + $(this).attr("href").split("products/")[1];
    })
}
*/
/*2024.04.16.080000 - Line : 71*/
