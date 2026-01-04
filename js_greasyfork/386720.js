// ==UserScript==
// @name         Twitter remove t.co
// @namespace    https://greasyfork.org/zh-CN/users/193133-pana
// @homepage     https://sailboatweb.com
// @version      1.0.0
// @description  将 Twitter 中所有 t.co 转为真实链接，仅适用于新 UI
// @author       pana
// @include      http*://*twitter.com/*
// @require      https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/386720/Twitter%20remove%20tco.user.js
// @updateURL https://update.greasyfork.org/scripts/386720/Twitter%20remove%20tco.meta.js
// ==/UserScript==

(function() {
	'use strict';

	function init() {
		let a_tags = $('a[href^="https://t.co/"]');
		$.each(a_tags, function(index, item) {
			let real_url;
			if (a_tags.eq(index).attr('data-expanded-url') !== undefined) {
				real_url = a_tags.eq(index).attr('data-expanded-url')
			} else if (item.title !== '') {
				real_url = item.title
			} else if ((a_tags.eq(index).find('div').length === 0) && (item.innerText !== "") && (item.innerText.indexOf('…') === -1)) {
				if (/^https?:\/\//i.test(item.innerText)) {
					real_url = item.innerText
				} else {
					real_url = 'http://' + item.innerText
				}
			} else {
				real_url = item.href
			}
			item.href = real_url
		})
	}
	init();
	let observer = new MutationObserver(function() {
		init()
	});
	let listenerContainer = document.body;
	let option = {
		'childList': true,
		'characterData': true,
		'subtree': true,
	};
	observer.observe(listenerContainer, option)
})();