// ==UserScript==
// @name         谷歌翻译去回车
// @version      1.2
// @include      https://translate.google.cn/*
// @description  谷歌翻译去回车，另接脚本定制和小程序
// @author       单曲循环
// @grant        none
// @copyright    2017+, @单曲循环
// @联系QQ        1454781423
// @namespace https://greasyfork.org/users/106373
// @downloadURL https://update.greasyfork.org/scripts/32586/%E8%B0%B7%E6%AD%8C%E7%BF%BB%E8%AF%91%E5%8E%BB%E5%9B%9E%E8%BD%A6.user.js
// @updateURL https://update.greasyfork.org/scripts/32586/%E8%B0%B7%E6%AD%8C%E7%BF%BB%E8%AF%91%E5%8E%BB%E5%9B%9E%E8%BD%A6.meta.js
// ==/UserScript==
var txt = document.getElementById("source");
txt.setAttribute("wrap","off");
document.getElementById("gt-submit").onclick=function (){txt.innerHTML = ReplaceSeperator(txt.innerHTML);};
function ReplaceSeperator(mobiles) {
    var i;
    var result = "";
    var c;
    for (i = 0; i < mobiles.length; i++) {
        c = mobiles.substr(i, 1);
        if (c == "\n")
            result = result + " ";
        else if (c != "\r")
            result = result + c;
    }
    return result;
}