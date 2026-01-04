// ==UserScript==
// @name         csdn博客去广告
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  try to take over the world!
// @author       tang1jun
// @match        https://blog.csdn.net/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/416907/csdn%E5%8D%9A%E5%AE%A2%E5%8E%BB%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/416907/csdn%E5%8D%9A%E5%AE%A2%E5%8E%BB%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function() {
	'use strict';

	function delad() {
		var ad = document.getElementsByClassName('programmer1Box');
		console.info('lyj 去广告', ad)

		if (ad[0] != undefined) {
			ad[0].remove();
			console.info("lyj 去广告 OK!")
		}

		var sidebar = document.getElementsByClassName("csdn-side-toolbar");
		console.info("lyj 去sidebar", sidebar);
		
		if (sidebar[0] != undefined) {
			sidebar[0].remove();
			console.info("lyj 去sidebar OK!")
		}

	}
	// 执行去广告
	delad();


})();
