// ==UserScript==
// @name         自定义链接参数DEMO
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  问卷星自定义链接参数DEMO
// @author       WJX
// @match        https://www.baidu.com/
// @icon         https://icons.duckduckgo.com/ip2/baidu.com.ico
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/439050/%E8%87%AA%E5%AE%9A%E4%B9%89%E9%93%BE%E6%8E%A5%E5%8F%82%E6%95%B0DEMO.user.js
// @updateURL https://update.greasyfork.org/scripts/439050/%E8%87%AA%E5%AE%9A%E4%B9%89%E9%93%BE%E6%8E%A5%E5%8F%82%E6%95%B0DEMO.meta.js
// ==/UserScript==

(function() {
    $(function(){
        var zdybtn = $("<a href='javascript:;' id='zdybtn' style='position:fixed;right:20px;top:200px;display:inline-block;padding:0 10px;background:#0095ff;color:#fff;font-size:14px;height:34px;line-height:34px;'>参与问卷调查</a>");
        zdybtn.click(function(){
            var idtext = $("#s-top-username .user-name").html().trim();
            var link = "https://www.wjx.cn/vj/m3Fsgr8.aspx?sojumpparm="+idtext;
            window.location.href = link;
        })
        zdybtn.appendTo($("body"));

    })
})();