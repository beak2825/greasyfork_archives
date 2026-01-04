// ==UserScript==
// @name BTB
// @description Baidu To Bing Pro From lZiMUl
// @author lZiMUl
// @namespace https://b23.tv/vUMYbj
// @version 1.0.1
// @icon http://i1.hdslb.com/bfs/face/513d893377f81848032a79c74b5cd2c385ff5853.jpg
// @license Apache-2.0
// @include http*://baidu.com/*
// @include http*://www.baidu.com/*
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/435948/BTB.user.js
// @updateURL https://update.greasyfork.org/scripts/435948/BTB.meta.js
// ==/UserScript==

(global => {
	class ToBing {
		constructor(query) {
			window.location.href = `https://cn.bing.com/search?q=${query}`;
		}
	};

	const query = new URL(window.location).searchParams.get('word');

	if (query) {
		new ToBing(query);
	} else {
		document.getElementById('su').addEventListener('click', () => {
			const { value } = document.getElementById('kw');
			new ToBing(value);
		});
	};
})();