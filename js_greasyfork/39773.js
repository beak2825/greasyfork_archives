// ==UserScript==
// @name         Vol.moe新标签页打开链接
// @namespace    zhihaofans
// @version      0.0.3
// @description  Vol.moe打开漫画页面链接时用新标签形式打开
// @author       zhihaofans
// @match        http://vol.moe/
// @match        http://vol.moe/list/*
// @match        https://vol.moe/
// @match        https://vol.moe/list/*
// @require      https://cdn.bootcss.com/jquery/3.2.1/jquery.min.js
// @grant        Apache-2.0
// @note         开源地址:https://github.com/zhihaofans/JavaScript-awesome/blob/master/greasyfork/volmoe.newpage.user.js
// @note         Greasyfork地址:https://greasyfork.org/zh-CN/scripts/39773
// @downloadURL https://update.greasyfork.org/scripts/39773/Volmoe%E6%96%B0%E6%A0%87%E7%AD%BE%E9%A1%B5%E6%89%93%E5%BC%80%E9%93%BE%E6%8E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/39773/Volmoe%E6%96%B0%E6%A0%87%E7%AD%BE%E9%A1%B5%E6%89%93%E5%BC%80%E9%93%BE%E6%8E%A5.meta.js
// ==/UserScript==
String.prototype.startWith = function (str) {
    var reg = new RegExp("^" + str);
    return reg.test(this);
};
String.prototype.endWith = function (str) {
    var reg = new RegExp(str + "$");
    return reg.test(this);
};
(function () {
    jQuery.noConflict();
    jQuery(document).ready(function () {
        var links = jQuery("tr.listbg > td > a");
        for (var a = 0; a < links.length; a++) {
            var thisLink = jQuery(links[a]);
            if(thisLink.attr("href").indexOf("http://")>=0){
                thisLink.attr("href",thisLink.attr("href").replace("http://","https://"));
            }
            if (thisLink.attr("href").startWith("https://vol.moe/comic/") && thisLink.attr("href").endWith(".htm")) {
                thisLink.attr("target", "_black");
            }
        }
    });
})();
