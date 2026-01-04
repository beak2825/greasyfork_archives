// ==UserScript==
// @name         页面截图
// @namespace    http://tampermonkey.net/page/snapshot
// @version      0.1
// @description  使用html2canvas进行页面截图
// @author       none
// @require		 https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js	
// @match        https://greasyfork.org/zh-CN/script_versions/new
// @icon         https://www.google.com/s2/favicons?sz=64&domain=greasyfork.org
// @grant        GM_registerMenuCommand
// @match        *://*/*
//
// @downloadURL https://update.greasyfork.org/scripts/495832/%E9%A1%B5%E9%9D%A2%E6%88%AA%E5%9B%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/495832/%E9%A1%B5%E9%9D%A2%E6%88%AA%E5%9B%BE.meta.js
// ==/UserScript==

(function () {
	'use strict';
	
	// Your code here...
	GM_registerMenuCommand("一键截图", function () {
		html2canvas(document.body, {
		  useCORS: true,
		  scrollY: -window.scrollY
		  // 其他配置项
		}).then(function(canvas) {
		  // 将canvas转换为DataURL格式
		  const dataURL = canvas.toDataURL('image/png');
		  // 创建a标签并模拟点击下载
		  const link = document.createElement('a');
		  link.href = dataURL;
		  link.download = 'screenshot.png';
		  document.body.appendChild(link);
		  link.click();
		  document.body.removeChild(link);
		});
	}, {
		domain : "tools",
		icon : ""
	});
})();