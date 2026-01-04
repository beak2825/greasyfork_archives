// ==UserScript==
// @name        移除知乎、简书、freebuf标题
// @namespace   phant0ms.me
// @version      0.6.2
// @description  移除去掉知乎标题、简书标题、freebuf标题、在未登录时自动关闭知乎专栏的登录弹窗|方便划水！
// @author       phant0ms
// @include      *.zhihu.com/question/*
// @include      *zhuanlan.zhihu.com/p/*
// @include       *.freebuf.com/*
// @include       *.jianshu.com/*
// @grant        none
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/418927/%E7%A7%BB%E9%99%A4%E7%9F%A5%E4%B9%8E%E3%80%81%E7%AE%80%E4%B9%A6%E3%80%81freebuf%E6%A0%87%E9%A2%98.user.js
// @updateURL https://update.greasyfork.org/scripts/418927/%E7%A7%BB%E9%99%A4%E7%9F%A5%E4%B9%8E%E3%80%81%E7%AE%80%E4%B9%A6%E3%80%81freebuf%E6%A0%87%E9%A2%98.meta.js
// ==/UserScript==
(function () {
	'use strict';
	window.onload = function () {
		var url = window.location.href;
		if (url.search("zhihu.com/question") > -1) {
			//知乎标题移除
			// var title = document.querySelector(".PageHeader");
			var title = document.querySelector("#root > div > div:nth-child(2) > header");
			if (title) {
				title.remove();
				console.log("title removed success");
			} else {
				console.log("not found zhihu titile");
			}
			//移除登录提示框
			var loginDiv = document.querySelector("body > div:nth-child(26)");
			if (loginDiv) {
				loginDiv.remove();
			}
			//点击关闭按钮，如果有
			var closeBtn = document.querySelector("button.Button.Modal-closeButton.Button--plain");
			if (closeBtn) {
				closeBtn.click();
				console.log("click close button")
			} else {
				console.log("not found close button in zhuanlan")
			}

		}

		else if (url.search("zhuanlan.zhihu.com") > -1) {
			//专栏页面下在未登录的情况下自动点击关闭登录弹窗
			closeBtn = document.querySelector("button.Button.Modal-closeButton.Button--plain");
			if (closeBtn) {
				closeBtn.click();
				console.log("click close button")
			} else {
				console.log("not found close button in zhuanlan")
			}
		}

		else if (url.search("freebuf.com") > -1) {
			//freebuf标题移除
			var freebuf = document.querySelector("#artical-detail-page > div.page-header");
			if (freebuf) {
				freebuf.remove();
				console.log("title removed success");
			} else {
				console.log("not found freebuf title");
			}
		} else if (url.search("jianshu.com") > -1) {
			//简书
			var jianshu = document.querySelector('._1CSgtu');
			if (jianshu) {
				jianshu.remove();
				console.log("title removed success");
			} else {
				console.log("not found jianshu title");
			}
		}

	}

})();