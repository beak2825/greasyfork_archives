// ==UserScript==
// @name         索引价值
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  索引价值,
// @author       huqz
// @match        http://discover.sm.cn/paper/IndexEvaluation/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/429351/%E7%B4%A2%E5%BC%95%E4%BB%B7%E5%80%BC.user.js
// @updateURL https://update.greasyfork.org/scripts/429351/%E7%B4%A2%E5%BC%95%E4%BB%B7%E5%80%BC.meta.js
// ==/UserScript==

(function() {
	'use strict';

	var opts = document.querySelector('.ant-radio-group').children;
	var link = document.querySelectorAll('a')[1];
	var submit = document.querySelector('.ant-btn-primary');

	document.onkeydown = function(e){
		switch (e.keyCode) {
			// 0
			case 48:
			case 96:
				opts[0].click();
				submit.click();
				break;
			// 1
			case 49:
			case 97:
				opts[1].click();
				submit.click();
				break;
				// 2
			case 50:
			case 98:
				opts[2].click();
				submit.click();
				break;
				//3
			case 51:
			case 99:
				opts[3].click();
				submit.click();
				break;
			// 5
			case 53:
			case 101:
				link.click();
				break;
				// 7
			case 55:
			case 103:
				opts[4].click();
				submit.click();
				break;
				// 8
			case 56:
			case 104:
				opts[5].click();
				submit.click();
				break;
			}
		}

	// Your code here...
})();