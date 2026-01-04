// ==UserScript==
// @name         自动标注动画与漫画
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  不同颜色显示动画与漫画的标题
// @author       xiaohuange
// @match        http*://www.llss.*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/39021/%E8%87%AA%E5%8A%A8%E6%A0%87%E6%B3%A8%E5%8A%A8%E7%94%BB%E4%B8%8E%E6%BC%AB%E7%94%BB.user.js
// @updateURL https://update.greasyfork.org/scripts/39021/%E8%87%AA%E5%8A%A8%E6%A0%87%E6%B3%A8%E5%8A%A8%E7%94%BB%E4%B8%8E%E6%BC%AB%E7%94%BB.meta.js
// ==/UserScript==
window.onload=function () {
	var animation="动画";
	var cartoon="漫画";
	var list=document.querySelectAll('article').querySelectAll('footer').querySelector('a');
	for (var i = list.length - 1; i >= 0; i--) {
		if (list[i].innerHTML==animation) {
			list[i].setAttribute("style","color:#00F");
		}else if (list[i].innerHTML==cartoon) {
			list[i].setAttribute("style","color:#F00");
		}
	}
};