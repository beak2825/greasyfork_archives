// ==UserScript==
// @name        link_open_newtab
// @namespace   http://catherine.v0cyc1pp.com/link_open_newtab.user.js
// @include     https://srad.jp*
// @include     https://isthereanydeal.com*
// @include     https://ja.wikipedia.org/*
// @include     https://en.wikipedia.org/*
// @include     https://www.reddit.com/*
// @author      greg10
// @run-at      document-start
// @license     GPL 3.0
// @version     1.3
// @require     http://code.jquery.com/jquery-3.1.1.min.js
// @grant       none
// @description Open link in a new tab.
// @downloadURL https://update.greasyfork.org/scripts/25508/link_open_newtab.user.js
// @updateURL https://update.greasyfork.org/scripts/25508/link_open_newtab.meta.js
// ==/UserScript==


this.$ = this.jQuery = jQuery.noConflict(true);



//console.log("link_open_newtab start");

function main() {
	var hostname = location.hostname;
	$("a").each( function() {
		//console.log("this.text=" + $(this).text() );
		var href = $(this).attr("href");
		if ( href === null || href === undefined || href === "" ) {
			return;
		}

/*
		// スキームが付いてないリンク「href="/index.hmlt"など」は内部リンク
		if ( href.indexOf( "http" ) == -1 && href.indexOf( "ftp" ) == -1 ) {
			return;
		}
*/
		if ( href.indexOf( "//" ) === -1 ) {
			return;
		}

		if ( href.indexOf( hostname ) !== -1 ) {
			return;
		}

		$(this).attr("target", "_blank");
	});
}

main();

var observer = new MutationObserver(function(mutations) {
    observer.disconnect();
    main();
    observer.observe( document, config);
});

var config = { attributes: false, childList: true, characterData: false, subtree:true };

observer.observe( document, config);
