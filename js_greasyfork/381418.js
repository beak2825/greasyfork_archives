// ==UserScript==
// @name          Trello Wider Cards 2
// @namespace     http://userstyles.org
// @description	  Makes active trello card much wider giving more information available which is especially useful on ultra wide monitors. Based on work by liamwooding https://userstyles.org/styles/84412/trello-wider-cards
// @author        Anton
// @include       http://trello.com/*
// @include       https://trello.com/*
// @include       http://*.trello.com/*
// @include       https://*.trello.com/*
// @run-at        document-start
// @version       0.20180329114113
// @downloadURL https://update.greasyfork.org/scripts/381418/Trello%20Wider%20Cards%202.user.js
// @updateURL https://update.greasyfork.org/scripts/381418/Trello%20Wider%20Cards%202.meta.js
// ==/UserScript==
(function() {var css = [
	".window {width: 80%;}",
	".window-main-col {width: 68%;padding: 0 1% 1% 2%;}",
	".window-sidebar {width: 25%;}",
	".small-window .window-sidebar {position: static;}"
].join("\n");
if (typeof GM_addStyle != "undefined") {
	GM_addStyle(css);
} else if (typeof PRO_addStyle != "undefined") {
	PRO_addStyle(css);
} else if (typeof addStyle != "undefined") {
	addStyle(css);
} else {
	var node = document.createElement("style");
	node.type = "text/css";
	node.appendChild(document.createTextNode(css));
	var heads = document.getElementsByTagName("head");
	if (heads.length > 0) {
		heads[0].appendChild(node);
	} else {
		// no head yet, stick it whereever
		document.documentElement.appendChild(node);
	}
}
})();
