// ==UserScript==
// @name         京东强制PC版页面
// @namespace    https://github.com/lihaoyun6/jd2pc
// @version      0.1.3
// @description  访问到移动版京东页面时自动转到对应的PC版页面
// @author       lihaoyun6
// @license      MIT
// @match        *://item.m.jd.com/*
// @run-at     	 document-start
// @grant        none
// @icon         https://www.jd.com/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/39933/%E4%BA%AC%E4%B8%9C%E5%BC%BA%E5%88%B6PC%E7%89%88%E9%A1%B5%E9%9D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/39933/%E4%BA%AC%E4%B8%9C%E5%BC%BA%E5%88%B6PC%E7%89%88%E9%A1%B5%E9%9D%A2.meta.js
// ==/UserScript==
let JDMobileObj = {
	init () {
		let curr_href = location.href;
        let cat_arr = curr_href.replace(/item.m.jd.com\/product/g, "item.jd.com");
		location.href = cat_arr; // done !
	}
};

JDMobileObj.init();