// ==UserScript==
// @name         Remove Mask
// @namespace    https://brucekong.com/
// @version      0.1
// @description  try to remove mask
// @author       BK
// @match        https://*.inspur.com/*
// @match        http://*.inspur.com:9080/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/444809/Remove%20Mask.user.js
// @updateURL https://update.greasyfork.org/scripts/444809/Remove%20Mask.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let forEach = function (array, callback, scope) {
	  for (var i = 0; i < array.length; i++) {
		callback.call(scope, i, array[i]); // passes back stuff we need
	  }
	};

	let removeMask = function(cls) {
		let lastSessionTime = new Date().getTime();
        // 30 秒
        let sessionTimeout = 30 * 1000
		let inter = setInterval(e => {
			if (document.querySelectorAll(cls).length) {
				clearInterval(inter)
				forEach(document.querySelectorAll(cls), function (index, value) {
				  value.remove()
				});
			}else {
				// 超时处理
				var now = new Date().getTime();
				//如果超时了
				if( (now - lastSessionTime) > sessionTimeout ){
					//会话失效,清除遍历
					clearInterval(inter)
				}
			}
		}, 10)
	}

	removeMask('.mask_div')
    removeMask('.video-watermark-multiple')
})();