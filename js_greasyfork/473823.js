// ==UserScript==
// @name Steam创意工坊Mod下载
// @name:zh-TW Steam工作坊模組下載
// @namespace https://b23.tv/RB6EQJ8
// @version 0.3
// @description 添加一个按钮用于根据Mod原链接跳转到steamworkshop.download并搜索网站相应Mod下载
// @description:zh-TW 增添一个按鈕用來根據模組原連接跳轉到steamworkshop.download並搜索網站对應模組下載  
// @author HSSkyBoy
// @license CC-BY-NC-ND 4.0
// @match *//steamcommunity.com/*
// @march *//s.team/*
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/473823/Steam%E5%88%9B%E6%84%8F%E5%B7%A5%E5%9D%8AMod%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/473823/Steam%E5%88%9B%E6%84%8F%E5%B7%A5%E5%9D%8AMod%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';
	var id = new RegExp("[0-9]{2,15}").exec(document.URL);
	var baseURL='http://steamworkshop.download/download/view/'+id;
	//var baseURL='http://catalogue.smods.ru/?s='+id;

    var element = document.getElementById("ShareItemBtn");
    var button = document.createElement('span');
    button.setAttribute('class', 'general_btn share tooltip');
	button.setAttribute('data-tooltip-text', '尝试解析Mod文件下载链接');
    button.innerHTML = '<span>尝试下载</span>';
    button.addEventListener("click",function(){
		window.open(baseURL);
	},false);
    element.parentNode.appendChild(button);
})();
