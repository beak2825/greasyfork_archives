// ==UserScript==
// @name         京东移动ware路径URL自动跳转为桌面URL
// @namespace    http://mozl.net
// @version      0.91
// @description  在桌面电脑上，打开移动端分享的URL，自动跳转到桌面URL
// @author       Mozl
// @include      http*://item.m.jd.com/ware/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/387042/%E4%BA%AC%E4%B8%9C%E7%A7%BB%E5%8A%A8ware%E8%B7%AF%E5%BE%84URL%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC%E4%B8%BA%E6%A1%8C%E9%9D%A2URL.user.js
// @updateURL https://update.greasyfork.org/scripts/387042/%E4%BA%AC%E4%B8%9C%E7%A7%BB%E5%8A%A8ware%E8%B7%AF%E5%BE%84URL%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC%E4%B8%BA%E6%A1%8C%E9%9D%A2URL.meta.js
// ==/UserScript==

(function() {
	'use strict';
	var result;
  	result = location.search;
    result =  result.match(/\d+/);
    result =  result[0];
	
		window.location.href='https://item.jd.com/'+result+'.html';

})();
