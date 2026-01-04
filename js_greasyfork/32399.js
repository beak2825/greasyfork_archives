// ==UserScript==
// @name         汤不热图片地址替换工具
// @name:en      tumblr-picture-change-https-2-http
// @namespace    http://mchen.info/
// @version      0.1
// @description  替换汤不热图片地址为http开始的，避免某些代理无法打开https的情况。
// @description:en replace https 2 http
// @author       viger
// @include        *://*.tumblr.com/*
// @grant        none
// @require      https://code.jquery.com/jquery-1.11.2.min.js
// @downloadURL https://update.greasyfork.org/scripts/32399/%E6%B1%A4%E4%B8%8D%E7%83%AD%E5%9B%BE%E7%89%87%E5%9C%B0%E5%9D%80%E6%9B%BF%E6%8D%A2%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/32399/%E6%B1%A4%E4%B8%8D%E7%83%AD%E5%9B%BE%E7%89%87%E5%9C%B0%E5%9D%80%E6%9B%BF%E6%8D%A2%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var httpsReg = new RegExp("^(https)");

    var replaceImgUrl = function() {
        var url = $(this).attr("src");
        if (undefined !== url && "" !== url) {
            $(this).attr("src", url.replace(httpsReg, "http"));
        }
    };

    $(document).ready(function() {
        $("img").each(replaceImgUrl);
        $("iframe").each(function(){
            var srcUrl = $(this).attr("src");
            console.log(srcUrl);
            if (undefined !== srcUrl && "" !== srcUrl && !(/cookiex\.ngd\.yahoo\.com/.test(srcUrl)))
            {
                $(this).contents().find("img").each(replaceImgUrl);
            }
        });
        $("a[style^='background-image'],div[style^='background-image']").each(function(){
            var styleContent = $(this).attr("style");
            if (undefined !== styleContent && "" !== styleContent) {
                $(this).attr("style", styleContent.replace(/(https)/, "http"));
            }
        });
    });
})();