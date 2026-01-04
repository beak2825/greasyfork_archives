// ==UserScript==
// @name         集美大学万马奔腾自动答题
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  无需配置安装即可使用
// @author       You
// @match        https://www.qingsuyun.com/h5/p/*
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @connect      *
// @license      MIT
// @require      http://code.jquery.com/jquery-3.x-git.min.js
/* globals jQuery, $, waitForKeyElements */

// @downloadURL https://update.greasyfork.org/scripts/443722/%E9%9B%86%E7%BE%8E%E5%A4%A7%E5%AD%A6%E4%B8%87%E9%A9%AC%E5%A5%94%E8%85%BE%E8%87%AA%E5%8A%A8%E7%AD%94%E9%A2%98.user.js
// @updateURL https://update.greasyfork.org/scripts/443722/%E9%9B%86%E7%BE%8E%E5%A4%A7%E5%AD%A6%E4%B8%87%E9%A9%AC%E5%A5%94%E8%85%BE%E8%87%AA%E5%8A%A8%E7%AD%94%E9%A2%98.meta.js
// ==/UserScript==

(function() {
	'use strict'
	// setTimeout
	function sleep(delay) {
		var start = (new Date()).getTime();
		while ((new Date()).getTime() - start < delay) {
			continue;
		}
	}

	function te() {
		var items = {
			title: "nnnnnn"
		};
		GM_xmlhttpRequest({
				method: 'POST',
				url: "http://wmbt.spidm.xyz/getAnswer",
				dataType: "json",
				data: JSON.stringify(items),
				contentType: "application/json",
				timeout: 3000,
				onload: function(xhr) {
					

				},
				ontimeout: function() {
					//setting.loop && setting.div.children('div:eq(0)').html(setting.over + '服务器超时，正在重试...');
				}
			});
		var title = document.getElementsByClassName("display-latex rich-text")[0].innerText; //获取题目
		console.log(title);
		var item = {
			title: title
		};
		var Button = document.getElementsByClassName("el-button el-button--success el-button--medium")
		var a = document.getElementsByClassName("el-radio__original"); //单选题
		if (a.length > 0) {
			GM_xmlhttpRequest({
				method: 'POST',
				url: "http://wmbt.spidm.xyz/getAnswer",
				dataType: "json",
				data: JSON.stringify(item),
				contentType: "application/json",
				timeout: 3000,
				onload: function(xhr) {
					var answer = xhr.responseText
					console.log(answer);
					var flag = false;
					var ischecked = false;
					for (var i = 0; i < a.length; i++) {
						if (a[i].checked) ischecked = true;
					}


					if (ischecked == false) {
						for (var i = 0; i < a.length; i++) {
							console.log(answer);
							if (a[i].value == answer) {
								console.log("选择即可");
								a[i].click();
								flag = true;
							}
						}
						if (flag == true) {} else {
							a[0].click();
						}
					} else {
						Button[2].click();
					}


				},
				ontimeout: function() {
					//setting.loop && setting.div.children('div:eq(0)').html(setting.over + '服务器超时，正在重试...');
				}
			});
		}
		var b = document.getElementsByClassName("el-checkbox__original");
		if (b.length > 0) {
			GM_xmlhttpRequest({
				method: 'POST',
				url: "http://wmbt.spidm.xyz/getAnswer",
				dataType: "json",
				data: JSON.stringify(item),
				contentType: "application/json",
				timeout: 3000,
				onload: function(xhr) {
					var answer = xhr.responseText;
					console.log(answer);
					var flag = false;

					var c = document.getElementsByClassName("el-checkbox__original");
					for (var i = 0; i < 5; i++) {
						for (var j = 0; j < c.length; j++) {
							if (c[j].checked == false && answer.indexOf(c[j].value) >= 0) {
								c[j].click();
								flag = true;
							}
						}
					}

					if (flag == true) {
						if (Button.length == 4) {
							//Button[2].click();
						}
					} else {
						if (answer == "no found") {
							b[0].click();
						}
						if (Button.length == 4) {

							Button[2].click();
						}
					}
				},
				ontimeout: function() {
					//setting.loop && setting.div.children('div:eq(0)').html(setting.over + '服务器超时，正在重试...');
				}
			});
		}
	}
	setInterval(te, 1000)
})();
