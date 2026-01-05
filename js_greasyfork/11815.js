// ==UserScript==
// @name        MTurk Alexander Rousmaniere - Find a price on a website
// @namespace   http://idlewords.net
// @description Open Amazon link for item on page
// @include     https://www.mturkcontent.com/dynamic/hit*
// @version     0.1
// @require     https://ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/11815/MTurk%20Alexander%20Rousmaniere%20-%20Find%20a%20price%20on%20a%20website.user.js
// @updateURL https://update.greasyfork.org/scripts/11815/MTurk%20Alexander%20Rousmaniere%20-%20Find%20a%20price%20on%20a%20website.meta.js
// ==/UserScript==

if ($(":contains('Find the lowest new price from a website')").length) {
	label = $("label:contains('product link')");
	link = $("label:contains('product link')").text();
	link = link.split(' ');
	link3 = link[2].replace('exec/obidos/ASIN/', 'gp/offer-listing/') + '/ref=olp_tab_new?ie=UTF8&condition=new';
	window.parent.postMessage("findprice!!!!!" + link3, "https://www.mturk.com");
	label.html(label.text().replace(link[2], '<a href="' + link3 + '">' + link3 + '</a>'));
}