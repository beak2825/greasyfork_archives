// ==UserScript==
// @name           虎嗅强制PC版页面
// @version        0.1
// @namespace      
// @author         anonymous
// @description    访问到移动版虎嗅页面时自动转到对应的PC页面
// @include        *//m.huxiu.com*
// @run-at         document-start

// @downloadURL https://update.greasyfork.org/scripts/408045/%E8%99%8E%E5%97%85%E5%BC%BA%E5%88%B6PC%E7%89%88%E9%A1%B5%E9%9D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/408045/%E8%99%8E%E5%97%85%E5%BC%BA%E5%88%B6PC%E7%89%88%E9%A1%B5%E9%9D%A2.meta.js
// ==/UserScript==

let HXMobileObj = {
	init () {
		let curr_href = location.href;
        let cat_arr = curr_href.replace(/m.huxiu.com/g, "huxiu.com");
		location.href = cat_arr; // done !
	}
};

HXMobileObj.init();