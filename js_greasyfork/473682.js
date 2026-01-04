// ==UserScript==
// @name         淘宝手机页面跳转到PC页面
// @version      0.2
// @description  访问到移动版淘宝页面时自动转到对应的PC版页面
// @author       私人使用不抄袭不公开
// @license      MIT
// @match        *.m.taobao.com/*
// @run-at     	 document-start
// @grant        none
// @icon         https://www.taobao.com/favicon.ico
// @namespace https://greasyfork.org/users/96657
// @downloadURL https://update.greasyfork.org/scripts/473682/%E6%B7%98%E5%AE%9D%E6%89%8B%E6%9C%BA%E9%A1%B5%E9%9D%A2%E8%B7%B3%E8%BD%AC%E5%88%B0PC%E9%A1%B5%E9%9D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/473682/%E6%B7%98%E5%AE%9D%E6%89%8B%E6%9C%BA%E9%A1%B5%E9%9D%A2%E8%B7%B3%E8%BD%AC%E5%88%B0PC%E9%A1%B5%E9%9D%A2.meta.js
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