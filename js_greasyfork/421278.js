// ==UserScript==
// @name         添加eruda控制台
// @namespace    https://ziyuand.cn
// @version      0.4
// @description  移动端添加eruda控制台
// @author       SHERWIN
// @match        *://*/*
// @match        *://*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/421278/%E6%B7%BB%E5%8A%A0eruda%E6%8E%A7%E5%88%B6%E5%8F%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/421278/%E6%B7%BB%E5%8A%A0eruda%E6%8E%A7%E5%88%B6%E5%8F%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';

function opinion(){
			if((navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i))) {
                	//console.log('移动端加载eruda')
				javascript:(function () { var script = document.createElement('script'); script.src="//cdn.jsdelivr.net/npm/eruda"; document.body.appendChild(script); script.onload = function () { eruda.init() } })();

			}else {
				//console.log('pc端不加载')
			}
		}
		opinion();

    // Your code here...
})();