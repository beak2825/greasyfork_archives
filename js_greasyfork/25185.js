// ==UserScript==
// @name        google_direct_link
// @namespace   http://catherine.v0cyc1pp.com/google_direct_link.user.js
// @match       https://www.google.tld/search*
// @match       https://www.google.com/?*
// @run-at      document-end
// @author      greg10
// @license     GPL 3.0
// @version     2.2
// @grant       none
// @description Google direct link for avoiding laggy '/url?' link.
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/25185/google_direct_link.user.js
// @updateURL https://update.greasyfork.org/scripts/25185/google_direct_link.meta.js
// ==/UserScript==

// [desctiption details]
// This script will replace links on google search results.
// from
// https://www.google.co.jp/url?sa=t&rct=j&q=&esrc=s&source=web&cd=1&cad=rja&uact=8&ved=0ahUKEwjzmeD83cnQAhVBPpQKHQtkC6wQFggbMAA&url=http%3A%2F%2Fwww.nyc.gov%2F&usg=AFQjCNGtbMsqtosAyddPnaeiyyG142mO3A&bvm=bv.139782543,d.dGo
// to
//http://www.nyc.gov/
//
// for avoiding laggy '/url?' link.


function replacelink(elem) {
	var str = elem.getAttribute("href");
	//console.log("str="+str);
	if ( str == null || str == undefined ) {
		return;
	}
	var result = str.match( /&url=([^&]+)&/ );
	if ( result == null || result == undefined ) {
		return;
	}
	var direct = result[1];
	if ( direct == null || direct == undefined ) {
		return;
	}

	var decoded = decodeURIComponent( direct );
	elem.setAttribute("href", decoded);
	elem.setAttribute("ping", str);

}

function main() {
	document.querySelectorAll('a').forEach( function(elem) {
		replacelink(elem);
	});
}


var observer = new MutationObserver(function(mutations) {
    observer.disconnect();
    main();
    observer.observe( document, config);
});

var config = { attributes: true, childList: true, characterData: true, subtree:true };

observer.observe( document, config);



