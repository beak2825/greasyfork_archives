// ==UserScript==
// @name         淘宝强制PC版页面
// @namespace    https://github.com/lihaoyun6/taobao2pc
// @version      0.1.2
// @description  访问到移动版淘宝页面时自动转到对应的PC版页面
// @author       lihaoyun6
// @license      MIT
// @match        *://h5.m.taobao.com/*
// @run-at     	 document-start
// @grant        none
// @icon         https://www.taobao.com/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/40547/%E6%B7%98%E5%AE%9D%E5%BC%BA%E5%88%B6PC%E7%89%88%E9%A1%B5%E9%9D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/40547/%E6%B7%98%E5%AE%9D%E5%BC%BA%E5%88%B6PC%E7%89%88%E9%A1%B5%E9%9D%A2.meta.js
// ==/UserScript==
let taobaoMobileObj = {
	init () {
		let curr_href = location.href;
        let cat_arr = /id=(\d+)&/.exec(curr_href);
        if (cat_arr == null) {
			console.log('log: detail info id not found.');
			return;
		}
		let id = cat_arr[1];
		location.href = 'https://item.taobao.com/item.htm?id=' + id; // done !
	}
};
taobaoMobileObj.init();