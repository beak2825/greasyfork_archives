// ==UserScript==
// @name         禅道面板
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  任务宽度
// @description  try to take over the world!
// @author       You
// @match        http://pm.sxydcyy.com/*
// @match        http://pm.leecs.cn/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/497862/%E7%A6%85%E9%81%93%E9%9D%A2%E6%9D%BF.user.js
// @updateURL https://update.greasyfork.org/scripts/497862/%E7%A6%85%E9%81%93%E9%9D%A2%E6%9D%BF.meta.js
// ==/UserScript==
window.onload = function(){
	const elements = document.querySelectorAll("#kanban3 > div > div.kanban-header > div > div");
	const elements1 = document.querySelectorAll("#kanban3 > div > div.kanban-lane > div.kanban-cols.kanban-lane-cols > div");
	// 定义需要移除的索引（从0开始计数）
	const indicesToRemove = [1, 3, 4];

	indicesToRemove.forEach(index => {
		if (elements[index]) {
			elements[index].remove();
		}
	});
	indicesToRemove.forEach(index => {
		if (elements1[index]) {
			elements1[index].remove();
		}
	});
  document.querySelector("#main > div").style.setProperty("max-width", "100%", "important");
  document.querySelector("#kanban3 > div").style.setProperty("width", "100%", "important");

}
