// ==UserScript==
// @name         及象教育获取视频
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  及象教育获取视频链接
// @author       You
// @include    *www.jixiangedus.com*
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/453267/%E5%8F%8A%E8%B1%A1%E6%95%99%E8%82%B2%E8%8E%B7%E5%8F%96%E8%A7%86%E9%A2%91.user.js
// @updateURL https://update.greasyfork.org/scripts/453267/%E5%8F%8A%E8%B1%A1%E6%95%99%E8%82%B2%E8%8E%B7%E5%8F%96%E8%A7%86%E9%A2%91.meta.js
// ==/UserScript==

var time = 0;
var father = document.getElementById("app");
var divs = document.createElement("div");
divs.id = 'mybutton';
divs.style.position = 'fixed';
divs.style.left = '150px';
divs.style.top = '100px';
divs.style.width = '72px';
divs.style.height = '72px';
divs.style.zIndex = '99999';
divs.style.backgroundImage = "url('data:image/png;base64,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')";
divs.onclick = function () {
    var x=document.getElementById("_sunlplayer100").src;
    alert(x);

};
document.body.appendChild(divs);