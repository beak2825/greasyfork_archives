// ==UserScript==
// @name         替換所有噗浪表符成大野智拍手笑
// @version      0.2
// @description  每5秒將河道上所有表符換成大野智拍手笑，當你很想念韓國阿姨的時候可以用
// @match        https://www.plurk.com/*
// @require      https://code.jquery.com/jquery-3.5.1.slim.js
// @namespace    https://greasyfork.org/
// @downloadURL https://update.greasyfork.org/scripts/420115/%E6%9B%BF%E6%8F%9B%E6%89%80%E6%9C%89%E5%99%97%E6%B5%AA%E8%A1%A8%E7%AC%A6%E6%88%90%E5%A4%A7%E9%87%8E%E6%99%BA%E6%8B%8D%E6%89%8B%E7%AC%91.user.js
// @updateURL https://update.greasyfork.org/scripts/420115/%E6%9B%BF%E6%8F%9B%E6%89%80%E6%9C%89%E5%99%97%E6%B5%AA%E8%A1%A8%E7%AC%A6%E6%88%90%E5%A4%A7%E9%87%8E%E6%99%BA%E6%8B%8D%E6%89%8B%E7%AC%91.meta.js
// ==/UserScript==

// Your code here...

'use strict';

$(document).ready(replace_with_ohno);

function replace_with_ohno(){
	setInterval( () => {
		$(".emoticon_my").attr("src", "https://emos.plurk.com/8e67570973b3ff9a77888a773d974fec_w48_h48.gif");
	}, 5000);
}