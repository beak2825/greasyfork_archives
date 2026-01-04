// ==UserScript==
// @name         百度主页自动展开
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  已登录百度时，主页的关注列表自动展开
// @author       zyz
// @include      https://www.baidu.com
// @include      https://www.baidu.com/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/387076/%E7%99%BE%E5%BA%A6%E4%B8%BB%E9%A1%B5%E8%87%AA%E5%8A%A8%E5%B1%95%E5%BC%80.user.js
// @updateURL https://update.greasyfork.org/scripts/387076/%E7%99%BE%E5%BA%A6%E4%B8%BB%E9%A1%B5%E8%87%AA%E5%8A%A8%E5%B1%95%E5%BC%80.meta.js
// ==/UserScript==

(function() {
    'use strict';

	setTimeout(function () {
		$('div.rect').trigger('click');
	}, 100);
})();