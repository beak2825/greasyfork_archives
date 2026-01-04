// ==UserScript==
// @name        google_hide_results2
// @namespace   http://catherine.v0cyc1pp.com/google_hide_results2.user.js
// @include     https://www.google.co.jp/search*
// @include     https://www.google.com/search*
// @author      greg10
// @run-at      document-start
// @license     GPL 3.0
// @version     2.0
// @grant       none
// @description Hide results on Google search results.
// @downloadURL https://update.greasyfork.org/scripts/378587/google_hide_results2.user.js
// @updateURL https://update.greasyfork.org/scripts/378587/google_hide_results2.meta.js
// ==/UserScript==


//================================
// Configurations
//   - specify texts you don't want to see.
var g_list = [
"malicious-site.com",
"/youdontwantsee*",
];
//================================



function main() {
	//$("h3 > a").each(function() {
	document.querySelectorAll("div.g").forEach(function(elem){
		//var str = $(this).attr("href");
		var str = elem.innerText;
		//console.log("str="+str);

		for ( var i = 0; i < g_list.length; ++i) {
			var ngword = g_list[i];
			if ( ngword == "" ) continue;

			ngword = ngword.replace(/^\s+|\s+$/g, "");
			var encoded_str = encodeURI( ngword );

			var obj = new RegExp( ngword, "i");
			var ret1 = str.search( RegExp( ngword, "i") );
			var ret2 = str.search( RegExp( encoded_str, "i") );
			//var index = str.indexOf( ngword );
			if ( ret1 != -1 || ret2 != -1) {
				//$(this).parent("h3").parent("div").parent("div").hide();
				elem.style.display = "none";
			}
		}
	});
}

var observer = new MutationObserver(function(mutations) {
    observer.disconnect();
    main();
    observer.observe( document, config);
});

//var config = { attributes: true, childList: true, characterData: true, subtree:true }
var config = { childList: true, characterData: true, subtree:true };

observer.observe( document, config);