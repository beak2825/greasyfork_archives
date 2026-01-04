// ==UserScript==
// @name         浏览器密码自动填充2
// @namespace    http://tampermonkey.net/auto_fill_password
// @version      0.3
// @description  浏览器密码自动填充，不包含任何网络请求，纯本地，请放心食用
// @icon         https://www.google.com/s2/favicons?sz=64&domain=greasyfork.org
// @author       none
// @match        *://*/*
// @grant        none
// @license 	 MIT
// @downloadURL https://update.greasyfork.org/scripts/492326/%E6%B5%8F%E8%A7%88%E5%99%A8%E5%AF%86%E7%A0%81%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%85%852.user.js
// @updateURL https://update.greasyfork.org/scripts/492326/%E6%B5%8F%E8%A7%88%E5%99%A8%E5%AF%86%E7%A0%81%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%85%852.meta.js
// ==/UserScript==

(function() {
	var ask = true;
	var counter = 0;
	
	function main() {
		if (!document.querySelector("input[type=password]")) {
			if (counter > 10)
				return;
			counter++;
			setTimeout(main, 100);
			return;
		}
		
		var allInput = document.querySelectorAll("input");
		var allShownInput = [];
		var name;
		var pass;
		for (var i = 0; i < allInput.length; i++) {
			if (allInput[i].offsetWidth != 0) {
				if (allInput[i].hasAttribute("type")) {
					if ((allInput[i].getAttribute("type") == "password") 
						|| (allInput[i].getAttribute("type") == "text")) {
						allShownInput.push(allInput[i]);
					}
				} else {
					allShownInput.push(allInput[i]);
				}
			}
		}
		for (i = 1; i < allShownInput.length; i++) {
			if (allShownInput[i].type == "password") {
				pass = allShownInput[i];
				name = allShownInput[i - 1];
			}
		}
		if ((!pass) || (!name)) {
			if (counter > 20)
				return;
			counter++;
			setTimeout(main, 200);
			return;
		}
		
		if (ask) {
			if (!localStorage.recordPassword) {
				if (confirm("是否需要记住本站密码？")) {
					localStorage.setItem("recordPassword", "true");
					localStorage.recordPassword = "true";
				} else {
					localStorage.setItem("recordPassword", "false");
					return;
				}
			}
			if (localStorage.recordPassword == "false") {
				return;
			}
		}
		
		if (!localStorage.atf_name) {
			localStorage.setItem("atf_name", "");
			localStorage.setItem("atf_pass", "");
		}
		name.value = localStorage.atf_name;
		pass.value = localStorage.atf_pass;
		name.addEventListener("input", function () {
			localStorage.atf_name = name.value;
		});
		pass.addEventListener("input", function () {
			localStorage.atf_pass = pass.value;
		});
		
		setTimeout(function () {
			if ((name.value != localStorage.atf_name) || (pass.value != localStorage.atf_pass)) {
				name.value = localStorage.atf_name;
				pass.value = localStorage.atf_pass;
			}
		}, 500);
	}
	
	main();
})();
