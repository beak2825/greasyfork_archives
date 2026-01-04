// ==UserScript==
// @name         科大国创工时加班查看系统显示问题
// @namespace    http://tampermonkey.net/
// @version      2024-06-01
// @description  解决科大国创工时加班系统 查看时左侧菜单显示不出来,不再要切换ie模式了
// @author       You
// @match        http://192.168.50.203/web/Comm/SunStar-Index.aspx
// @icon         https://www.google.com/s2/favicons?sz=64&domain=50.203
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/496691/%E7%A7%91%E5%A4%A7%E5%9B%BD%E5%88%9B%E5%B7%A5%E6%97%B6%E5%8A%A0%E7%8F%AD%E6%9F%A5%E7%9C%8B%E7%B3%BB%E7%BB%9F%E6%98%BE%E7%A4%BA%E9%97%AE%E9%A2%98.user.js
// @updateURL https://update.greasyfork.org/scripts/496691/%E7%A7%91%E5%A4%A7%E5%9B%BD%E5%88%9B%E5%B7%A5%E6%97%B6%E5%8A%A0%E7%8F%AD%E6%9F%A5%E7%9C%8B%E7%B3%BB%E7%BB%9F%E6%98%BE%E7%A4%BA%E9%97%AE%E9%A2%98.meta.js
// ==/UserScript==

(function() {
    'use strict';

	setTimeout(setCssFun,3000);

})();

function setCssFun(){

	var iframe = document.getElementById('fleft');
	var iframeDocument = iframe.contentWindow.document;

    var menuLayer = iframeDocument.getElementById('menuLayer');
	menuLayer.style.position = 'static';
    menuLayer.style.paddingLeft = '35px';

	var table = iframeDocument.getElementById('PQ00');
	var rows = table.getElementsByTagName('tr');

	for (var i = 0; i < rows.length; i++) {
		rows[i].style.display = '';
	}

	/*

	// 将 id 为 menuLayer 的元素的 position 属性设置为 'static'
	var menuLayer = document.getElementById('menuLayer');
	menuLayer.style.position = 'static';

    // 设置表格下所有 <tr> 元素的 display 属性为 'inline'
	var table = document.getElementById('PQ00');
	var rows = table.getElementsByTagName('tr');
	for (var i = 0; i < rows.length; i++) {
	  rows[i].style.display = 'inline';
	}

    */
}
