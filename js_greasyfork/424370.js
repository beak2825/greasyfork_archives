// ==UserScript==
// @name         百度文库界面简化
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  百度文库简化界面到只有内容！代码非常简单！
// @author       You
// @match        *://wenku.baidu.com/view/*
// @grant        none
// @require      https://code.jquery.com/jquery-3.3.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/424370/%E7%99%BE%E5%BA%A6%E6%96%87%E5%BA%93%E7%95%8C%E9%9D%A2%E7%AE%80%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/424370/%E7%99%BE%E5%BA%A6%E6%96%87%E5%BA%93%E7%95%8C%E9%9D%A2%E7%AE%80%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    $(".fold-page-text").click();
    $("#reader-container").parents();
    $("body>div").not("#app").hide();
    $("#app>div").not(".content-wrapper").hide();
    $(".content-wrapper>div").not(".left-wrapper.zoom-scale").hide();
    $(".left-wrapper.zoom-scale>div").not(".reader-wrap").hide();
    $(".reader-wrap>div").not("div:first").hide();
    $(".reader-wrap>div:first>div").not("#reader-container").hide();
})();