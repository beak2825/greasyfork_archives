// ==UserScript==
// @name     知乎去除隐私政策
// @version  3.0
// @author   kwin
// @match    *://*.zhihu.com/*
// @description 去除知乎隐私政策弹框，在不同意的情况下浏览完整内容（纯js实现）
// @namespace https://greasyfork.org/users/184804
// @downloadURL https://update.greasyfork.org/scripts/367714/%E7%9F%A5%E4%B9%8E%E5%8E%BB%E9%99%A4%E9%9A%90%E7%A7%81%E6%94%BF%E7%AD%96.user.js
// @updateURL https://update.greasyfork.org/scripts/367714/%E7%9F%A5%E4%B9%8E%E5%8E%BB%E9%99%A4%E9%9A%90%E7%A7%81%E6%94%BF%E7%AD%96.meta.js
// ==/UserScript==

window.onload = function(){
    for (var j = 0; j < 10; j++) {
        setTimeout(function(){
            var d = document.getElementsByClassName("Modal-wrapper")[0];
            if(d){
                d.parentNode.removeChild(d);
                document.getElementsByTagName("html")[0].style = "";
            }
        },j*100);
    }
};