// ==UserScript==
// @name         iconfont免登陆下载图标
// @namespace    https://greasyfork.org/en/users/87569-gxvv
// @version      0.1.1
// @description  iconfont 免登陆下载图标
// @author       gxvv
// @match        http://iconfont.cn/*
// @run-at       document-end
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/29608/iconfont%E5%85%8D%E7%99%BB%E9%99%86%E4%B8%8B%E8%BD%BD%E5%9B%BE%E6%A0%87.user.js
// @updateURL https://update.greasyfork.org/scripts/29608/iconfont%E5%85%8D%E7%99%BB%E9%99%86%E4%B8%8B%E8%BD%BD%E5%9B%BE%E6%A0%87.meta.js
// ==/UserScript==

(function(seajs, define) {
	'use strict';
	define('app/login', ['magix', 'jquery', 'app/exts/helper'], function(require) {
		var magix = require('magix'),
			$ = require('jquery'),
			helper = require('app/exts/helper');
		$('body').on('click', '[data-login]:not([mx-click^=downloadIcon])', function() {
			if(!magix.config().isLogin){
				helper.showLogin();
				return false;
			}
		});
	});
})(unsafeWindow.seajs, unsafeWindow.define);