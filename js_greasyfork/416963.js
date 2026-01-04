// ==UserScript==
// @name         删除垃圾代码
// @version      0.1
// @description  删除discuz文本水印插件带来的乱码
// @author       Karlcx
// @backup       Filo
// @include      http://*
// @include      https://*
// @grant        none
// @namespace https://greasyfork.org/users/299057
// @downloadURL https://update.greasyfork.org/scripts/416963/%E5%88%A0%E9%99%A4%E5%9E%83%E5%9C%BE%E4%BB%A3%E7%A0%81.user.js
// @updateURL https://update.greasyfork.org/scripts/416963/%E5%88%A0%E9%99%A4%E5%9E%83%E5%9C%BE%E4%BB%A3%E7%A0%81.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var x = document.getElementsByClassName("jammer");
    for (var i=0;i<x.length-1;i++)
{
    x[i].innerHTML="";
}
})();