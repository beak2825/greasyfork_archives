// ==UserScript==
// @name         一亩三分地 Anti-Adblock-Detector
// @namespace    http://tampermonkey.net/
// @version      0.0.2
// @description  在开启Adblock 插件后，浏览网站会出现烦人的弹窗，这个插件会抑制弹窗出现
// @author       harryhare
// @license      GPL 3.0
// @icon         https://raw.githubusercontent.com/harryhare/userscript/master/index.png
// @match        https://www.1point3acres.com/**
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/421363/%E4%B8%80%E4%BA%A9%E4%B8%89%E5%88%86%E5%9C%B0%20Anti-Adblock-Detector.user.js
// @updateURL https://update.greasyfork.org/scripts/421363/%E4%B8%80%E4%BA%A9%E4%B8%89%E5%88%86%E5%9C%B0%20Anti-Adblock-Detector.meta.js
// ==/UserScript==


var callback = function (records) {
	records.map(function (record) {
		if (record.addedNodes.length != 0) {
			// console.log('Mutation type: ' + record.type);
			// console.log('Mutation target: ');
			// console.log(record.target);
			// console.log(record.addedNodes);
			for(var i=0;i<record.addedNodes.length;i++){
				var node=record.addedNodes[i];
				if(node.className=="fc-ab-root"){
					// 直接删掉页面会卡住
					// node.parentElement.removeChild(node);
					// 模仿点击关闭
					document.querySelector("button.fc-close").click();
				}
			}
		}
	});
};

(function () {
	'use strict';

	var mo = new MutationObserver(callback);

	var option = {
		'childList': true,
		'subtree': false,
	};

	mo.observe(document.body, option);

})();
