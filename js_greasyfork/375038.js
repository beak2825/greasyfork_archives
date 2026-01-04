// ==UserScript==
// @name         [CSDN]免登录展开
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  应对11月底CSDN强制登录后才能查看
// @author       sam sun
// @match        *://blog.csdn.net/*/article/details/*
// @match        *://bbs.csdn.net/topics/*
// @grant        none
// @icon         https://csdnimg.cn/public/favicon.ico
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/375038/%5BCSDN%5D%E5%85%8D%E7%99%BB%E5%BD%95%E5%B1%95%E5%BC%80.user.js
// @updateURL https://update.greasyfork.org/scripts/375038/%5BCSDN%5D%E5%85%8D%E7%99%BB%E5%BD%95%E5%B1%95%E5%BC%80.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //不是为了混淆而混淆的，抄的csdn上的https://g.csdnimg.cn/check-adblock/1.1.1/check-adblock.js
    //请管理员/诸位路过的绿林好汉不要怼我
    var c, e;
    function n() {
        var c, e, t;
        console.log("Adblock is enabled"), c = "adblock", e = {
            step: "install"
        }, t = window.location.protocol + "//statistic.csdn.net/", $.get(t + c, e);
        var n;

        function o(c, e) {
            var t = document.createElement("div");
            t.innerHTML = c;
            var n = document.body.firstChild;
            document.body.insertBefore(t, n), e && "function" == typeof e && e()
        }(function(c) {
            for (var e, t, n = document.cookie.split("; "), o = 0; o < n.length; o++)
                if (n[o] && (e = n[o].split("="))[0] === c) {
                    t = e[1];
                    break
                }
            return t
        })("UserName") || o('', setInterval(function() {
            var c = 0;
            c = parseInt(c), 0 == c ? $("#check-adblock-time").text(c) :""
        }, 1e3)), o(''), $(".check_close").length && $(".check_close").on("click", function(c) {
            c.stopPropagation(), $(this).parents(".adblock").remove(), "function" == typeof window.csdn.insertcallbackBlock && window.csdn.insertcallbackBlock()
        }), (n = new Date).setDate(n.getDate() + 999999), document.cookie = "c_adb=1; expires=" + n.toGMTString() + "; domain=csdn.net; path=/", "function" == typeof window.csdn.insertcallbackBlock && window.csdn.insertcallbackBlock()
    }

    //重写id下的style属性
    var article = document.getElementById("article_content");
    article.style = "height: max; overflow: hidden;";

    //删除上层div视觉样式
    var readmore=document.getElementById("btn-readmore");
    readmore.parentNode.parentNode.removeChild(readmore.parentNode);

     //删除底部
    document.getElementsByClassName("pulllog-box")[0].remove();

    //删除弹窗
    document.getElementsByClassName("fourth_column")[0].remove();
   
})();