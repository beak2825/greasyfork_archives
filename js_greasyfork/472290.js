// ==UserScript==
// @name        dirtywarez.com > Misc UI Tweaks
// @namespace    http://dirtywarez.com/
// @match       https://forum.dirtywarez.com/threads/*
// @version      1.0
// @author       Jeremy Boutin
// @license      MIT
// @require      	https://code.jquery.com/jquery-1.9.1.min.js
// @description  Tweaking misc. UI in the Steam Point Shop
// @grant        GM_addStyle
// @grant        GM.getValue
// @grant        GM_log
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/472290/dirtywarezcom%20%3E%20Misc%20UI%20Tweaks.user.js
// @updateURL https://update.greasyfork.org/scripts/472290/dirtywarezcom%20%3E%20Misc%20UI%20Tweaks.meta.js
// ==/UserScript==

GM_addStyle (`
	.bbCodeBlock-content {
		max-height: fit-content !important;
	}
`);

$.noConflict();

jQuery(window).on('load popstate', function(event) {
	setTimeout(function(){
  	 jQuery('pre[class="bbCodeCode"] code').each(function() {
		const rglinks = jQuery(this).html();
		console.log(jQuery(this).html());
	  	let rglinksupdated = rglinks.replace(/rg.to/g,'rapidgator.net');
		rglinksupdated = rglinks.replace(/.html/g,'');
		jQuery(this).html(rglinksupdated)

	 });
	}, 350);
});