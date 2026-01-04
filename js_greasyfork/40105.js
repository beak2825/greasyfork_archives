// ==UserScript==
// @name               adfreetv.ch uncloak
// @namespace          https://greasyfork.org/en/users/10118-drhouse
// @version            1.0
// @description        Breaks iframes from adfreetv.ch links and directly loads the host site avoiding anti-abuse scripts.
// @run-at             document-start
// @include            https://adfreetv.ch/watch*
// @require            http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @author             drhouse
// @icon               https://adfreetv.ch/images/favicon-32.png
// @downloadURL https://update.greasyfork.org/scripts/40105/adfreetvch%20uncloak.user.js
// @updateURL https://update.greasyfork.org/scripts/40105/adfreetvch%20uncloak.meta.js
// ==/UserScript==

$(document).ready(function () {

	var url = window.location.search;
	location.replace('https://adfreetv.ch/watch2.php' + url);

	if(window.location.href.indexOf("watch2") > -1 ) {
		var real = $('body > a').attr('href');
		location.replace(real);
	}

});
