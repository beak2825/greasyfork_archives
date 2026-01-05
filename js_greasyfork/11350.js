// ==UserScript==
// @name        Adventure Gamers gallery expander
// @namespace   driver8.net
// @description Expands all the thumbnails in Adventure Gamers screenshot galleries so that you don't have to visit each screenshot's page.
// @match     *://*.adventuregamers.com/screenshots/view/*
// @match     *://*.adventuregamers.com/games/view_screenshots/*
// @exclude		http://www.adventuregamers.com/screenshots/view/*/*
// @version     0.1.4
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/11350/Adventure%20Gamers%20gallery%20expander.user.js
// @updateURL https://update.greasyfork.org/scripts/11350/Adventure%20Gamers%20gallery%20expander.meta.js
// ==/UserScript==

var thumbs = document.querySelectorAll('.thumb_medium img');

for (var i = 0; i < thumbs.length; i++) {
	var curImg = thumbs[i];
	curImg.removeAttribute('width');

	// http://www.adventuregamers.com/images/screenshots/28464/screenshots_0012__small.jpg
	// http://www.adventuregamers.com/images/screenshots/28464/screenshots_0012__full.jpg
    // https://adventuregamers.com/images/screenshots/28464/screenshots_0012.jpg
	//curImg.src = curImg.src.replace(/__small\./, '__full.');
    curImg.src = curImg.src.replace(/__small\./, '.');
    curImg.dataset.src = curImg.dataset.src && curImg.dataset.src.replace(/__small\./, '.');
	var div = curImg.parentNode.parentNode;
	div.removeAttribute('style');
}

var w = window.innerWidth - 20;
var h = window.innerHeight - 20;
GM_addStyle(`div .thumb_medium { width: 100% !important; margin: 0 !important; padding: 0 !important; float: none !important; }
.fancybox img { max-width: ${w}px; max-height: ${h}px; }
div#main-content { width: 100% !important; margin: 0 !important; padding: 0 !important;}
div#inner-content { width: 100% !important; margin: 0 !important; padding: 0 !important; overflow: visible !important;}
div#middle { width: 100% !important; margin: 0 !important; padding: 0 !important;}
div.cleft { width: 100% !important; margin: 0 !important; padding: 0 !important;}
div.cleft_inn { width: 100% !important; margin: 0 !important; padding: 0 !important;}
.thumb_small img:hover, .thumb_sidebar img:hover, .thumb_medium img:hover { opacity: 1.0 !important; }
`);