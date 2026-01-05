// ==UserScript==
// @name       虾米 HTML5 音量
// @namespace  
// @version    0.1
// @description  给虾米 HTML5 版添加 音量 调节
// @match      http://www.xiami.com/radio/*
// @copyright  2012+, G yc
// @downloadURL https://update.greasyfork.org/scripts/2435/%E8%99%BE%E7%B1%B3%20HTML5%20%E9%9F%B3%E9%87%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/2435/%E8%99%BE%E7%B1%B3%20HTML5%20%E9%9F%B3%E9%87%8F.meta.js
// ==/UserScript==

var div = document.getElementById("radioHTML5");
var input = document.createElement("input");
input.id = "volume";
input.type = "range";
input.min = "0";
input.max = "10";
input.value = "5";
input.onchange = function () {
    document.getElementById("audio").volume = document.getElementById("volume").value / 10;
};
div.appendChild(input);
