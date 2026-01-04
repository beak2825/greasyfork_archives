// ==UserScript==
// @name        Reddit Infinite Scrolling ♾️
// @version     1.3
// @namespace   old.reddit.com
// @description Adds infinite scrolling to subreddits and to comments.
// @license     MIT
// @include     https://*.reddit.com/*
// @icon        https://www.redditstatic.com/desktop2x/img/favicon/android-icon-192x192.png
// @grant       unsafeWindow
// @grant       GM_addStyle
// @require     http://code.jquery.com/jquery-2.1.4.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/jscroll/2.4.1/jquery.jscroll.min.js
// @downloadURL https://update.greasyfork.org/scripts/469763/Reddit%20Infinite%20Scrolling%20%E2%99%BE%EF%B8%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/469763/Reddit%20Infinite%20Scrolling%20%E2%99%BE%EF%B8%8F.meta.js
// ==/UserScript==

GM_addStyle(`
/* hide Reddit CSS default buttons */
.nav-buttons {display:none !important}

.jscroll-loading {font-size: large !important; font-weight: bold !important; color: white !important; text-align: center; background: red !important;padding:3px; border-radius:20px;display: flex;justify-content: center;align-items: center}
`);
// Jscroll code
$('#siteTable').jscroll({
	nextSelector: 'span.nextprev a:last',
	contentSelector: '#siteTable .thing, .nav-buttons',
	callback: function() {
		$('.nav-buttons').remove();
	}
});

//if current URL contains the string 'comments', then click the 'more comments' button when scrolling at the end of the page
if (/(.*comments.*)/.test(document.location)) {
	$(window).scroll(function() {
		if ($(window).scrollTop() + $(window).height() > $(document).height() - 100) {
			// console.log('bottom!');
			var element = unsafeWindow.document.getElementsByClassName('morecomments');
			var last = element.length;
			element[last - 1].firstChild.click();
		}
	});
}