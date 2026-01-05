// ==UserScript==
// @name                zhihu link fix
// @name:zh-CN          知乎跳转链接修复
// @name:zh-TW          知乎跳轉鏈接修復
// @namespace           zhihaofans
// @version             0.2
// @description         Change the jump link to the original link.
// @description:zh-CN   将跳转链接改为原链接。
// @description:zh-TW   將跳轉鏈接改爲原鏈接。
// @author              zhihaofans
// @require             https://cdn.bootcss.com/jquery/3.2.1/jquery.min.js
// @match               https://*.zhihu.com/*
// @downloadURL https://update.greasyfork.org/scripts/30236/zhihu%20link%20fix.user.js
// @updateURL https://update.greasyfork.org/scripts/30236/zhihu%20link%20fix.meta.js
// ==/UserScript==

(function () {
    console.log("zhihu link fix:Start");
    $(document).ready(function () {
        var l_n = $("a").length;
        for (var a = 0; a < l_n; a++) {
            if ($("a").eq(a).attr("href").startsWith("https://link.zhihu.com/?target=")) {
                console.log($("a").eq(a).attr("href"));
                console.log($("a").eq(a).attr("href").startsWith("https://link.zhihu.com/?target="));
                var new_link = decodeURIComponent($("a").eq(a).attr("href").replace("https://link.zhihu.com/?target=", ""));
                $("a").eq(a).attr("href", new_link);
                console.log(new_link);
                console.log("======");
            }
        }
        console.log("zhihu link fix:End");
    });
})();