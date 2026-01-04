// ==UserScript==
// @name     				Allegro Infinite Scroll
// @description     Infinite Scroll for allegro.pl
// @version  				1.1
// @match          	*://allegro.pl/*
// @require 				https://unpkg.com/infinite-scroll@3/dist/infinite-scroll.pkgd.js
// @grant    				none
// @namespace https://greasyfork.org/users/428115
// @downloadURL https://update.greasyfork.org/scripts/394157/Allegro%20Infinite%20Scroll.user.js
// @updateURL https://update.greasyfork.org/scripts/394157/Allegro%20Infinite%20Scroll.meta.js
// ==/UserScript==

(function(){ 
  var infiniteScroll = new InfiniteScroll( 'div[class^="opbox-listing--"] div section section', {
    //path: 'a.m-pagination__nav--next',
    path: 'a[data-role=next-page]',
    append: 'article[data-item="true"]',
	});
})();