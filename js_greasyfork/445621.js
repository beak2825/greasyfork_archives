// ==UserScript==
// @name         2ccc屏蔽关键词元素
// @namespace    http://bbs.2ccc.com/topic.asp?topicid=630046
// @version      0.1
// @description  通过元素选择来找到key 不能过滤楼主。
// @author       You
// @match        *://bbs.2ccc.com/topic.asp?topicid=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=2ccc.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/445621/2ccc%E5%B1%8F%E8%94%BD%E5%85%B3%E9%94%AE%E8%AF%8D%E5%85%83%E7%B4%A0.user.js
// @updateURL https://update.greasyfork.org/scripts/445621/2ccc%E5%B1%8F%E8%94%BD%E5%85%B3%E9%94%AE%E8%AF%8D%E5%85%83%E7%B4%A0.meta.js
// ==/UserScript==

(function() {
	'use strict';
//console.time();
    var robot_name = "(tuhemm|nihaosv|mikhop)";
	var b = document.querySelector("body > table:nth-child(7) > tbody > tr > td:nth-child(3)");
	for (var i = 0; i < b.childElementCount; i++) {
		var c = b.children[i];
		var exp = c.querySelector("tbody > tr:nth-child(1) > td:nth-child(2) > table > tbody > tr:nth-child(1) > td:nth-child(1) > a");
		if (!exp && typeof(exp) != "undefined" && exp != 0) {
			//console.log("is null");
		} else {
            let robot_name_exist = exp.innerHTML.search(robot_name) > 0;
            if (robot_name_exist)
            {
            c.style.display = "none";
			//console.log(exp.outerText);
            }
		}

	}
//console.timeEnd(); // default: 1.77197265625ms
	// Your code here...
})();