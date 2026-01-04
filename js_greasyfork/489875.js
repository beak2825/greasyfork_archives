// ==UserScript==
// @name         添加商品专用-Latest
// @namespace    https://www.1024net.tech/
// @namespace    https://www.lovemake.love/
// @version      2024.03.16.080000
// @description  I try to take over the world!
// @author       Kay
// @match        http://admin.qipeiyigou.com/own_add_product.php*
// @match        http://admin.qipeiyigou.com/action/own_pro_action.php*
// @icon         https://aimg8.dlssyht.cn/u/1533835/ueditor/image/767/1533835/1633159205592221.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/489875/%E6%B7%BB%E5%8A%A0%E5%95%86%E5%93%81%E4%B8%93%E7%94%A8-Latest.user.js
// @updateURL https://update.greasyfork.org/scripts/489875/%E6%B7%BB%E5%8A%A0%E5%95%86%E5%93%81%E4%B8%93%E7%94%A8-Latest.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Your code here...
    const url = location.href;
    if (url.indexOf("own_add_product.php") != -1) {
        $("label:contains(商品名称)").click(() => {
            localStorage.setItem("pronamelist", $("#proname").val());
            localStorage.setItem("goto", location.href);
            location.reload();
        });
        let get = localStorage.getItem("pronamelist");
        function fillin() {
            if (get.indexOf("@") != -1) {
                if ($("#pro_ategory_show_1").length) {
                    let a = get.split("@")[0];
                    $("#proname").val(a);
                    let b = a + "@";
                    let c = get.replace(b, "");
                    localStorage.setItem("pronamelist", c);
                    clearInterval(timer);
                    setTimeout(() => { $(".btn-primary:last").click(); }, 1000);
                }
            }
            else {
                clearInterval(timer);
                localStorage.clear();
                $("#proname").val("已完成！");
            }
        }
        let timer = setInterval(fillin, 200);
    }
    else if (url.indexOf("own_pro_action.php") != -1) {
        setTimeout(() => { if ($("body").text().indexOf("添加成功") != -1) { location.href = localStorage.getItem("goto"); } }, 300);
    }
})();
/*2024.03.16.080000 - Line : 50*/
