// ==UserScript==
// @name         Foolproof
// @namespace    https://www.1024net.tech/
// @namespace    https://www.lovemake.love/
// @version      2025.01.10.080000
// @description  I try to take over the world!
// @author       Kay
// @match        http://testpage.qipeiyigou.com/dom/sc_product.php*
// @icon         https://aimg8.dlssyht.cn/u/1533835/ueditor/image/767/1533835/1633159205592221.png
// @grant        GM_xmlhttpRequest
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/518311/Foolproof.user.js
// @updateURL https://update.greasyfork.org/scripts/518311/Foolproof.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Your code here...
    /*————————————————————函数定义区 Start————————————————————*/
    function get_proname() {
        document.getElementByClassName("btn-primary").onclick = function () { };
        let pro_id = parseInt(url.split("&id=")[1]);
        let channel_id = parseInt(url.split("&ch_id=")[1]);
        GM_xmlhttpRequest({
            method: "GET",
            url: "http://testpage.qipeiyigou.com/dom/sc_product.php?ch_id=" + channel_id + "&id=" + pro_id,
            headers: {
                "Content-Type": "text/html;charset=gbk",
            },
            onload: function (response) {
                let a = response.responseText;
                let check_name = a.split('id="proname"')[1].split('size="30"')[0].split('"')[1];//获取产品名，已转移栏目此值为空
                if (trim(check_name) == "") {
                    alert("栏目错误！");
                }
                else {
                    document.getElementByClassName("btn-primary").onclick = check_form;
                    $("#submit_msg a").click();
                }
            }
        });
    }
    /*
    function clear_a_cursor(selector) {
        let now = new Date();
        let timestamp = String(now.getFullYear()) + String((now.getMonth() + 1)).padStart(2, '0') + String(now.getDate()).padStart(2, '0') + "-" + String(now.getHours()).padStart(2, '0') + String(now.getMinutes()).padStart(2, '0') + String(now.getSeconds()).padStart(2, '0');
        let a = $(selector).contents().find("a").length;
        for (let i = 0; i < a; i++) {
            let b = $(selector).contents().find("a:eq(" + i + ")").prop("outerHTML");
            let c = '<span class="replace-a-' + timestamp + '"';
            let d = b.replace(/^<a/g, c).replace(/<\/a>$/g, "</span>");
            $(selector).contents().find("a:eq(" + i + ")").before(d);
        }
        $(selector).contents().find("a").remove();
        $(selector).contents().find("span[class^=replace-a-]").removeAttr("href").removeAttr("_href");
        $(selector).contents().find("*[style*=cursor]").css("cursor", "");
    }
    */
    function clear_a_cursor(selector) {
        const now = new Date();
        const timestamp = `${now.getFullYear()}${(now.getMonth() + 1).toString().padStart(2, '0')}${now.getDate().toString().padStart(2, '0')}-${now.getHours().toString().padStart(2, '0')}${now.getMinutes().toString().padStart(2, '0')}${now.getSeconds().toString().padStart(2, '0')}`;
        const $container = $(selector).contents();
        const $links = $container.find("a");
        $links.each((index, link) => {
            const $link = $(link);
            const outerHtml = $link.prop("outerHTML");
            const newSpan = outerHtml.replace(/^<a/, `<span class="replace-a-${timestamp}"`).replace(/<\/a>$/, '</span>');
            $link.before(newSpan);
        });
        $links.remove();
        $container.find(`span[class^=replace-a-]`).removeAttr("href").removeAttr("_href");
        $container.find("*[style*='cursor']").css("cursor", "");
    }
    /*————————————————————函数定义区 End————————————————————*/
    /*————————————————————主体代码区 Start————————————————————*/
    const url = location.href;
    $("#submit_msg").mousedown(() => {
        // clear_a_cursor("#ueditor_0");
        // clear_a_cursor("#ueditor_1");
        if ($("#submit_msg a").text().indexOf("修改") != -1) {
            $("#submit_msg a").text("提交中...");
            get_proname();
        }
    });
    /*————————————————————主体代码区 End————————————————————*/
})();
/*2025.01.10.080000 - Line : 86*/
