// ==UserScript==
// @name         后台店铺取消置顶
// @namespace    https://www.1024net.tech/
// @namespace    https://www.lovemake.love/
// @version      2024.07.27.080000
// @description  I try to take over the world!
// @author       Kay
// @match        *://*/*
// @icon         https://aimg8.dlssyht.cn/u/1533835/ueditor/image/767/1533835/1633159205592221.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/501908/%E5%90%8E%E5%8F%B0%E5%BA%97%E9%93%BA%E5%8F%96%E6%B6%88%E7%BD%AE%E9%A1%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/501908/%E5%90%8E%E5%8F%B0%E5%BA%97%E9%93%BA%E5%8F%96%E6%B6%88%E7%BD%AE%E9%A1%B6.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Your code here...
    window.confirm = function () { return true; };
    function open() {
        for (let i = 0; i < 10; i++) {
            let a = "http://admin.qipeiyigou.com/shops/shops_list.php?page=" + (i + 1);
            window.open(a);
        }
    }
    function a() {
        if (location.href.indexOf("shops_list.php?page=") != -1) {
            $(".ev_xuanze input[type='checkbox']").attr("checked", true);
            $("#all_checkbox").attr("checked", true);
            $("input[value=取消置顶]").click();
            setTimeout(() => { window.close(); }, 300);
        }
    }
    a();
    $(document).keyup(function (event) {
        switch (event.keyCode) {
            case 27:
                open();
                break;
        }
    });
})();
/*2024.07.27.080000 - Line : 41*/
