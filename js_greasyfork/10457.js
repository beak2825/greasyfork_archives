// ==UserScript==
// @name         防江苏电信HTTP广告劫持
// @namespace    http://github.com/wormful
// @description  简单粗暴的方法，检测到电信的iframe广告即刷新页面
// @version      0.2
// @author       Yilin Chen
// @include        http://*
// @require      http://cdn.staticfile.org/zepto/1.1.4/zepto.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/10457/%E9%98%B2%E6%B1%9F%E8%8B%8F%E7%94%B5%E4%BF%A1HTTP%E5%B9%BF%E5%91%8A%E5%8A%AB%E6%8C%81.user.js
// @updateURL https://update.greasyfork.org/scripts/10457/%E9%98%B2%E6%B1%9F%E8%8B%8F%E7%94%B5%E4%BF%A1HTTP%E5%B9%BF%E5%91%8A%E5%8A%AB%E6%8C%81.meta.js
// ==/UserScript==

$("body").bind("DOMSubtreeModified", function() {
    arr = $("iframe");
    for(var i = 0; i < arr.length; i++) {
        var src = $(arr[i]).attr("src");
        if(src && src.indexOf("//221") >= 0) {
            location.reload();
        }
    }
});