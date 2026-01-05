// ==UserScript==
// @name        百度網盤自定義密碼
// @namespace   Ahuangzai
// @description 可以在發布時修改產生的密碼，僅限4位數
// @include     http://pan.baidu.com/*
// @include     https://pan.baidu.com/*
// @version     1.0
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/21465/%E7%99%BE%E5%BA%A6%E7%B6%B2%E7%9B%A4%E8%87%AA%E5%AE%9A%E7%BE%A9%E5%AF%86%E7%A2%BC.user.js
// @updateURL https://update.greasyfork.org/scripts/21465/%E7%99%BE%E5%BA%A6%E7%B6%B2%E7%9B%A4%E8%87%AA%E5%AE%9A%E7%BE%A9%E5%AF%86%E7%A2%BC.meta.js
// ==/UserScript==
var myHandle;

function myFunction() {
	var script = require(["function-widget-1:share/util/service/createLinkShare.js"]);
	script.prototype.makePrivatePassword = function() { return prompt("請輸入自定義密碼", ""); };
	if (script != undefined)
		clearInterval(myHandle);
}

myHandle = setInterval(myFunction, 1000);