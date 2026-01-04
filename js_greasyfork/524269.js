// ==UserScript==
// @name         绿站工作区自动重试
// @namespace    http://tampermonkey.net/
// @version      2024-05-02
// @description  绿站工作区定时自动重试，以及打开web书本页在后台时自动开始下载
// @author       zonde306
// @match        https://books.fishhawk.top/*
// @match        https://books1.fishhawk.top/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=fishhawk.top
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/524269/%E7%BB%BF%E7%AB%99%E5%B7%A5%E4%BD%9C%E5%8C%BA%E8%87%AA%E5%8A%A8%E9%87%8D%E8%AF%95.user.js
// @updateURL https://update.greasyfork.org/scripts/524269/%E7%BB%BF%E7%AB%99%E5%B7%A5%E4%BD%9C%E5%8C%BA%E8%87%AA%E5%8A%A8%E9%87%8D%E8%AF%95.meta.js
// ==/UserScript==

(function() {
    'use strict';
	window.setInterval(()=>{
		let button = document.evaluate("//*[contains(text(),'重试未完成任务')]", document.body).iterateNext();
		if (button) {
			button.click();
			let iterator = document.evaluate("//*[contains(text(),'启动')]", document.body);
			while((button = iterator.iterateNext()) != null) {
				button.click();
			}
			/*
			iterator = document.evaluate("//time/../../..//a", document.body);
			while((button = iterator.iterateNext()) != null) {
				let dl = localStorage.getItem(button.href);
				if (dl) {
					console.log(`${button.href} assign to ${dl}`);
					button.href = dl;
				}
			}
			*/
		}
	}, 10000);

	if(window.location.href.includes("/novel/")) {
		var novel_inv_id = 0;
		var hiddenProperty = 'hidden' in document ? 'hidden' : 'webkitHidden' in document ? 'webkitHidden' : 'mozHidden' in document ? 'mozHidden' :  null;
		novel_inv_id = window.setInterval(()=>{
			let a = document.evaluate("//*[contains(text(),'下载机翻')]/..", document.body).iterateNext();
			if (a) {
				// localStorage.setItem(window.location.href, a.href);
				window.clearInterval(novel_inv_id);
				console.log(`${window.location.href} download is ${a.href} current hidden is ${document[hiddenProperty]}`);
				if(document[hiddenProperty] && document.referrer && (document.referrer.includes("/favorite/") || document.referrer.includes("/workspace/sakura"))) {
					let total_bar = document.evaluate("//*[contains(text(),'总计')][contains(text(),'Sakura')]", document.body).iterateNext();
					if (total_bar) {
						let total = parseInt(total_bar.innerText.match(/总计\s*(\d+)/)[1]);
						let sakura = parseInt(total_bar.innerText.match(/Sakura\s*(\d+)/i)[1]);
						let baidu = parseInt(total_bar.innerText.match(/百度\s*(\d+)/)[1]);
						let youdao = parseInt(total_bar.innerText.match(/有道\s*(\d+)/)[1]);
						let gpt = parseInt(total_bar.innerText.match(/GPT\s*(\d+)/i)[1]);
						if (sakura >= total && sakura >= baidu && sakura >= youdao && sakura >= gpt) {
							a.click();
						}
					}
				}
			}
		}, 3000);
		/*
		document.addEventListener(hiddenProperty.replace(/hidden/i, 'visibilitychange'), (window.onfocus = () => {
			if(document[hiddenProperty]) {
				window.clearInterval(novel_inv_id);
				console.log("stop auto download");
			}
		}));
		*/
	}
})();