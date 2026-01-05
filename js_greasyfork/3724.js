// ==UserScript==
// @name           clear_Tieba_in_localStorage
// @description    定时清除贴吧留在localStorage中的垃圾
// @include        http://tieba.baidu.com/*
// @author         congxz6688
// @icon           http://tb.himg.baidu.com/sys/portraitn/item/4e2ed7f8bbb3d4f2c2d2bb21
// @version        2014.7.29.2
// @grant          none
// @namespace      https://greasyfork.org/users/39
// @downloadURL https://update.greasyfork.org/scripts/3724/clear_Tieba_in_localStorage.user.js
// @updateURL https://update.greasyfork.org/scripts/3724/clear_Tieba_in_localStorage.meta.js
// ==/UserScript==

var lastRun = localStorage.lastClearLS ? localStorage.lastClearLS : 0;
var nt = new Date();
var nowTime = nt.getTime();
if (nowTime - lastRun > 604800000) { //这里的604800000是7天的毫秒数，表示脚本运行的间隔，用户可自己修改
	for (i = localStorage.length - 1; i > -1; i--) {
		if (localStorage.key(i).indexOf("draft") == 0) {
			localStorage.removeItem(localStorage.key(i));
		}
	}
	localStorage.lastClearLS = nt.getTime();
}
