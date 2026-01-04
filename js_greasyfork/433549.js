// ==UserScript==
// @name         通用
// @namespace    通用优化
// @version      0.1
// @description  1.密码默认显示
// @author       Inspire
// @match        *://*/*

// @resource     customCSS https://cdn.jsdelivr.net/npm/bootstrap@4.4.1/dist/css/bootstrap.min.css
// @require      https://cdn.jsdelivr.net/npm/vue
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/1.9.1/jquery.js

// @grant        GM_xmlhttpRequest
// @connect      *	

// @downloadURL https://update.greasyfork.org/scripts/433549/%E9%80%9A%E7%94%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/433549/%E9%80%9A%E7%94%A8.meta.js
// ==/UserScript==

(function() {

	// 定时器
	let Timer = function(callback, n) {
		let time = setTimeout(() => {
			clearTimeout(time)
			time = null
			callback()
			return Timer(callback, n)
		}, n)
	}

	function 显示密码() {
		let password = $('input[type="password"]')
		if (password.length > 0) {

			for (let i = 0; i < password.length; i++) {
				$(password[i]).attr("type", "text")
				// console.log(password[i])
			}
		}
	}
	Timer(显示密码, 100)




})();
