// ==UserScript==
// @name         阻止网站对F12开发者功能的限制
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  防止被搞掉F12功能
// @author       fxalll
// @match        *://*/*
// @grant        none
// @license      MIT

// @downloadURL https://update.greasyfork.org/scripts/523258/%E9%98%BB%E6%AD%A2%E7%BD%91%E7%AB%99%E5%AF%B9F12%E5%BC%80%E5%8F%91%E8%80%85%E5%8A%9F%E8%83%BD%E7%9A%84%E9%99%90%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/523258/%E9%98%BB%E6%AD%A2%E7%BD%91%E7%AB%99%E5%AF%B9F12%E5%BC%80%E5%8F%91%E8%80%85%E5%8A%9F%E8%83%BD%E7%9A%84%E9%99%90%E5%88%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.onload = function () {
        // 清理所有的定时器
		let endTid = setTimeout(function () {});
		for (let i = 0; i <= endTid; i++) {
			clearTimeout(i);
			clearInterval(i);
		}
}
})();