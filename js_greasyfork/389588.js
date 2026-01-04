// ==UserScript==
// @name         Steam Mod Workshop Download Button（Steam创意工坊添加mod下载按钮）
// @namespace    http://zhangbohun.github.io/
// @version      0.2
// @description  Search and download mod via steamworkshop.download,support does not allow download mods（跳转到steamworkshop.download网站搜索相应mod下载条目，支持限制外部下载的mod）
// @author       zhangbohun
// @match        https://steamcommunity.com/sharedfiles/filedetails/*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/389588/Steam%20Mod%20Workshop%20Download%20Button%EF%BC%88Steam%E5%88%9B%E6%84%8F%E5%B7%A5%E5%9D%8A%E6%B7%BB%E5%8A%A0mod%E4%B8%8B%E8%BD%BD%E6%8C%89%E9%92%AE%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/389588/Steam%20Mod%20Workshop%20Download%20Button%EF%BC%88Steam%E5%88%9B%E6%84%8F%E5%B7%A5%E5%9D%8A%E6%B7%BB%E5%8A%A0mod%E4%B8%8B%E8%BD%BD%E6%8C%89%E9%92%AE%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';
	var id = new RegExp("[0-9]{2,15}").exec(document.URL);
	var baseURL='http://steamworkshop.download/download/view/'+id;
	//var baseURL='http://catalogue.smods.ru/?s='+id;

    var element = document.getElementById("AddToCollectionBtn");
    var button = document.createElement('span');
    button.setAttribute('class', 'general_btn share tooltip');
	button.setAttribute('data-tooltip-text', 'search mod via skymods');
    button.innerHTML = '<span>Download</span>';
    button.addEventListener("click",function(){
		window.open(baseURL);
	},false);
    element.parentNode.appendChild(button);
})();