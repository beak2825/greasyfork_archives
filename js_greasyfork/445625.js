// ==UserScript==
// @name         2ccc屏蔽关键词元素_1_帖子列表回复
// @namespace    http://bbs.2ccc.com/topic.asp?topicid=630046
// @version      0.1
// @description  通过元素选择来找到key.
// @author       You
// @match        *://bbs.2ccc.com/
// @match        *://bbs.2ccc.com/?pageno=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=2ccc.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/445625/2ccc%E5%B1%8F%E8%94%BD%E5%85%B3%E9%94%AE%E8%AF%8D%E5%85%83%E7%B4%A0_1_%E5%B8%96%E5%AD%90%E5%88%97%E8%A1%A8%E5%9B%9E%E5%A4%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/445625/2ccc%E5%B1%8F%E8%94%BD%E5%85%B3%E9%94%AE%E8%AF%8D%E5%85%83%E7%B4%A0_1_%E5%B8%96%E5%AD%90%E5%88%97%E8%A1%A8%E5%9B%9E%E5%A4%8D.meta.js
// ==/UserScript==

(function() {
	'use strict';
	var robot_name = "(tuhemm|nihaosv|mikhop)";

	var findtable = document.querySelector("body > table:nth-child(6) > tbody > tr > td:nth-child(3)"); //列出所有 帖子
	for (var i = 0; i < findtable.childElementCount; i++) {
		if (findtable.children[i].className == 'child') {
			var findtable2 = findtable.children[i].querySelector("table > tbody"); //所有的回复tr
			for (var j = 0; j < findtable2.childElementCount; j++) {
				let robot_name_exist = findtable2.children[j].innerHTML.search(robot_name) > 0;
				if (robot_name_exist) {
					findtable2.children[j].style.display = "none";
				}

			}
		}



	}

	// Your code here...
})();