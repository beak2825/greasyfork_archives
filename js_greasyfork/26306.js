// ==UserScript==
// @name        yahoomailjp_url_security2
// @namespace   http://catherine.v0cyc1pp.com/yahoomailjp_url_security2.user.js
// @include     http://*.mail.yahoo.co.jp/*
// @include     https://*.mail.yahoo.co.jp/*
// @version     1.0
// @author      greg10
// @license     GPL 3.0
// @require     http://code.jquery.com/jquery-3.1.1.min.js
// @grant       none
// @description YahooJPメールでURLリンクと表示URLが異なる場合にフィッシング詐欺の可能性があるため色を警告色に変更します。
// @downloadURL https://update.greasyfork.org/scripts/26306/yahoomailjp_url_security2.user.js
// @updateURL https://update.greasyfork.org/scripts/26306/yahoomailjp_url_security2.meta.js
// ==/UserScript==


function main(){
	$(".msg-body").find("a").each( function() {
		var strtext = $(this).text();
		var strhref = $(this).attr('href');
		if ( strtext.indexOf(".") !== -1 ) {
			if ( strhref.indexOf(strtext) === -1 ) {
				$(this).attr("style", "color: black; background-color:red;");
			}
		}
	});

}

main();


var observer = new MutationObserver(function(mutations) {
    observer.disconnect();
    main();
    observer.observe( document, config);
});

var config = { attributes: true, childList: true, characterData: true, subtree:true };

observer.observe( document, config);