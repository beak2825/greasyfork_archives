// ==UserScript==
// @name         input表单全选
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  启用后你的网页上的所有input表单都会全选,很方便
// @author       dc
// @match        http://tf-swufe.careersky.cn/jixun/Character/Character
//这个网址要改的自己改
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/403740/input%E8%A1%A8%E5%8D%95%E5%85%A8%E9%80%89.user.js
// @updateURL https://update.greasyfork.org/scripts/403740/input%E8%A1%A8%E5%8D%95%E5%85%A8%E9%80%89.meta.js
// ==/UserScript==

window.onload = function() {
	var all_input = document.querySelectorAll("input");
	var all_input_len = all_input.length;
	var i;
	for(i = 0; i < all_input_len; i++) {
		all_input[i].click();
	}
};
