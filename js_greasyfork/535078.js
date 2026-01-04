// ==UserScript==
// @name         Bahamut Old Search 2025
// @namespace    https://home.gamer.com.tw/sonyandy123
// @author       YUKI.N
// @version      0.5.6
// @description  巴哈舊版搜尋
// @grant        none
// @include      https://forum.gamer.com.tw/*
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/535078/Bahamut%20Old%20Search%202025.user.js
// @updateURL https://update.greasyfork.org/scripts/535078/Bahamut%20Old%20Search%202025.meta.js
// ==/UserScript==

(function() {
	let $ = jQuery;
	let docURL = new URL(window.location.href);
	let params = docURL.searchParams;
	if (docURL.pathname.includes('search.php')) {
		let redirectURL = 'https://forum.gamer.com.tw/B.php?';
		for (let pair of params.entries()) {
			try {
				let paraKey = pair[0];
				let paraValue = pair[1];
				if (paraKey == 'q' && paraValue.length == 1) {
					paraValue = `\\${paraValue}`;
				}
				redirectURL += `&${paraKey}=${paraValue}`;
			} catch (error) {
				console.error(error);
			}
		}
		window.location.replace(`${redirectURL}&qt=1`);
	} else if (docURL.pathname.includes('B.php')) {
		let searchByTitle = false;
		let redirectURL = 'https://forum.gamer.com.tw/Bo.php?';
		for (let pair of params.entries()) {
			try {
				let paraKey = pair[0];
				let paraValue = pair[1];
				if (paraKey == 'qt') {
					if (paraValue == 1) {
						searchByTitle = true;
					}
					continue;
				}
				redirectURL += `&${paraKey}=${paraValue}`;
			} catch (error) {
				console.error(error);
			}
		}
		if (searchByTitle) {
			let filterDiv = $('div.b-header_filter > div');
			filterDiv.append('<button type="button" class="b-list__filter__feature">作者</button>');
			filterDiv.children().last().on('click', function() {
				location.href = `${redirectURL}&qt=6&sort=1`;
			});
			filterDiv.append(' ');
			filterDiv.append('<button type="button" class="b-list__filter__feature">M文</button>');
			filterDiv.children().last().on('click', function() {
				location.href = `${redirectURL}&qt=7`;
			});
		}
	}
})();