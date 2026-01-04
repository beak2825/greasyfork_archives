// ==UserScript==
// @name 4399实名用户破解
// @namespace http://tampermonkey.net/
// @version 1.1
// @description 绕过4399的实名认证
// @author You
// @match http://www.4399.com/*
// @icon https://www.googie.com/s2/favicons?domain=4399.com
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/439303/4399%E5%AE%9E%E5%90%8D%E7%94%A8%E6%88%B7%E7%A0%B4%E8%A7%A3.user.js
// @updateURL https://update.greasyfork.org/scripts/439303/4399%E5%AE%9E%E5%90%8D%E7%94%A8%E6%88%B7%E7%A0%B4%E8%A7%A3.meta.js
// ==/UserScript==

(function(){
	'use strict';
	window.onload = function(){
	document.querySelector("#Anti_open").remove();
	document.querySelector("#Anti_mask").remove();
	document.querySelector("#pusher").remove();
	}
})();