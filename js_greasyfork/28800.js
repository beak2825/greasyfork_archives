// ==UserScript==
// @name                  177manga download
// @name:zh-CN            177漫画下载
// @namespace             https://greasyfork.org/
// @version               0.1
// @create                2017-04-08
// @description           批量复制下载命令到剪贴板
// @description:zh-CN     批量复制下载命令到剪贴板
// @author                k_k_kls
// @match                 http://www.177pic.info/html/*.html
// @match                 http://www.177piczz.info/html/*.html
// @run-at                document-end
// @grant                 GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/28800/177manga%20download.user.js
// @updateURL https://update.greasyfork.org/scripts/28800/177manga%20download.meta.js
// ==/UserScript==

var btn = $(".i1");
btn.text("复制下载命令到剪贴板");
btn[0].style.cssText = "cursor: pointer;";
btn.mouseover(function() {
    btn.css("color", "#FF6100");
});
btn.mouseout(function() {
    btn.css("color", "#999");
});
//将分类链接替换为按钮
btn[0].addEventListener("click",
function() {
    var title = $("h1").text();
    //获取漫画名
    var a = $("div.wp-pagenavi a");
    //获取其他页链接
    var href = [window.location.href];
    for (var k = 0; k < a.length - 1; k++) {
        href[k + 1] = (a.eq(k).attr("href"));
    }
    //将所有页链接存为数组href
    $.ajaxSetup({
        async: false
    });
    //关闭异步
    var doc = [];
    for (var l = 0; l < href.length; l++) {
        $.get(href[l],
        function(data) {
            doc[l] = new DOMParser().parseFromString(data, "text/html");
        });
    }
    //将所有页源码存为数组doc
    var result = "md \"C:\\Users\\k_k_k\\Downloads\\" + title + "\"\r\n" + "cd \"C:\\Users\\k_k_k\\Downloads\\" + title + "\"\r\n";
    //将生成、转到下载目录的命令存储在字符串result里
    for (var i = 0,
    n = 0; i < doc.length; i++, n = n + img.length) {
        img = doc[i].querySelectorAll("img");
        for (var j = 0; j < img.length; j++) {
            result = result + "wget64 -c -O " + "\"" + [n + j] + ".jpg\" " + img[j].src + "\r\n";
        }
    }
    //将下载并改名的命令依次存储在字符串result里
    result = result + "exit" + "\r\n";
    //将关闭cmd窗口的命令存储在字符串result里
    GM_setClipboard(result);
    //复制结果到剪贴板
    alert("下载命令已经在剪贴板中了");
},
false);