// ==UserScript==
// @name        Google - Direct Link (johanb)
// @include     https://www.google.tld/search*
//  @include     https://www.google.co.za/search*
//  @include     https://www.google.com/search*
// @run-at      document-end
// @author      johanb
// @version     1.6
// @require     http://code.jquery.com/jquery-3.1.1.min.js
// @grant       none
// @description Google direct link for avoiding laggy '/url?' link.
// @namespace https://greasyfork.org/users/126569
// @downloadURL https://update.greasyfork.org/scripts/407193/Google%20-%20Direct%20Link%20%28johanb%29.user.js
// @updateURL https://update.greasyfork.org/scripts/407193/Google%20-%20Direct%20Link%20%28johanb%29.meta.js
// ==/UserScript==

// [desctiption details]
// This script will replace link google search results.
//
//https://www.google.co.jp/url?sa=t&rct=j&q=&esrc=s&source=web&cd=1&cad=rja&uact=8&ved=0ahUKEwjzmeD83cnQAhVBPpQKHQtkC6wQFggbMAA&url=http%3A%2F%2Fwww.nyc.gov%2F&usg=AFQjCNGtbMsqtosAyddPnaeiyyG142mO3A&bvm=bv.139782543,d.dGo
// to
//http://www.nyc.gov/
//
// for avoiding laggy '/url?' link.

this.$ = this.jQuery = jQuery.noConflict(true);
//console.log("google_direct_link start");

function replacelink(target) {
	var str = $(target).attr("href");
	//console.log("str="+str);
	if ( str === null || str === undefined ) {
		return;
	}
	var result = str.match( /&url=([^&]+)&/ );
	if ( result !== null && result !== undefined ) {
		var direct = result[1];
		if ( direct !== null && direct !== undefined ) {
			var decoded = decodeURIComponent( direct );
			$(target).attr("href", decoded);

		}
	}
}

function main() {
	$("a").each( function() {
		replacelink(this);
	});
}


var observer = new MutationObserver(function(mutations) {
    observer.disconnect();
    main();
    observer.observe( document, config);
});

var config = { attributes: true, childList: true, characterData: true, subtree:true };

observer.observe( document, config);

