// ==UserScript==
// @name         Moemarket infinite scroll
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  Infinite scrolling for moemarket.com
// @author       Kayla355
// @match        https://www.moemarket.com/*
// @grant        none
// @require 	 https://unpkg.com/infinite-scroll@3.0.5/dist/infinite-scroll.pkgd.min.js
// @downloadURL https://update.greasyfork.org/scripts/372805/Moemarket%20infinite%20scroll.user.js
// @updateURL https://update.greasyfork.org/scripts/372805/Moemarket%20infinite%20scroll.meta.js
// ==/UserScript==

(function() {
    'use strict';

	if(!document.querySelector('.products-grid')) return;

    var infScroll = new InfiniteScroll( '.products-grid', {
		path: function() {
			var element = {
				current: document.querySelector('.pages .current'),
				next: document.querySelector('.i-next'),
			};
			var lastPage = element.next ? parseInt(element.next.parentNode.previousElementSibling.firstChild.innerText):null;
			var currentPage = element.current ? parseInt(element.current.innerText):0;

			// If we started on a different page than page 1.
			if(currentPage > this.pageIndex) this.pageIndex = currentPage;
			var newPage = this.pageIndex + 1;

			if(lastPage >= newPage) return document.querySelector('.i-next').href.replace(/.*\//, '').replace(/p=[0-9]+/, 'p='+newPage);
		},
		append: '.products-grid .item',
		history: false,
	});
})();