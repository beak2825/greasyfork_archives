// ==UserScript==
// @name         闲鱼强制PC版页面
// @namespace    https://github.com/lihaoyun6/xianyu2pc
// @version      0.3.2
// @description  访问到移动版闲鱼页面时自动转到对应的PC版页面
// @author       lihaoyun6
// @license      MIT
// @match        *://h5.m.goofish.com/*
// @run-at     	 document-start
// @grant        none
// @icon         https://img.alicdn.com/tps/i3/TB1eW1eGXXXXXXAXFXXBS8UGFXX-41-22.png
// @downloadURL https://update.greasyfork.org/scripts/39858/%E9%97%B2%E9%B1%BC%E5%BC%BA%E5%88%B6PC%E7%89%88%E9%A1%B5%E9%9D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/39858/%E9%97%B2%E9%B1%BC%E5%BC%BA%E5%88%B6PC%E7%89%88%E9%A1%B5%E9%9D%A2.meta.js
// ==/UserScript==
let xianyuMobileObj = {
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

xianyuMobileObj.init();