// ==UserScript==
// @name         解除网易云仅扫码登录限制
// @namespace    https://github.com/nondanee
// @version      0.1.1
// @description  开放其他登录模式选择
// @author       nondanee
// @match        *://music.163.com/*
// @icon         https://s1.music.126.net/style/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/428493/%E8%A7%A3%E9%99%A4%E7%BD%91%E6%98%93%E4%BA%91%E4%BB%85%E6%89%AB%E7%A0%81%E7%99%BB%E5%BD%95%E9%99%90%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/428493/%E8%A7%A3%E9%99%A4%E7%BD%91%E6%98%93%E4%BA%91%E4%BB%85%E6%89%AB%E7%A0%81%E7%99%BB%E5%BD%95%E9%99%90%E5%88%B6.meta.js
// ==/UserScript==

(function () {
	'use strict';
	var _open = XMLHttpRequest.prototype.open;
	window.XMLHttpRequest.prototype.open = function (_, url) {
		var _onreadystatechange = this.onreadystatechange, _this = this;
		_this.onreadystatechange = function () {
			if (
				_this.readyState === 4
				&& _this.status === 200
				&& url.indexOf('/user/login/type/switch') !== -1
			) {
				try {
					var data = JSON.parse(_this.responseText);
					data.data.allow = true;
					var value = JSON.stringify(data);
					Object.defineProperty(_this, 'responseText', { value: value });
				} catch (_) {}
			}
			if (_onreadystatechange) _onreadystatechange.call(_this);
		}
		return _open.apply(_this, arguments);
	}
})();