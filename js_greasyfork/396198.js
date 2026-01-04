// ==UserScript==
// @name          tweetdeck arabic
// @namespace     http://userstyles.org
// @description	  tweetdeck
// @author        molzit
// @homepage      https://userstyles.org/styles/178483
// @include       http://tweetdeck.twitter.com/*
// @include       https://tweetdeck.twitter.com/*
// @include       http://*.tweetdeck.twitter.com/*
// @include       https://*.tweetdeck.twitter.com/*
// @run-at        document-start
// @version       5
// @downloadURL https://update.greasyfork.org/scripts/396198/tweetdeck%20arabic.user.js
// @updateURL https://update.greasyfork.org/scripts/396198/tweetdeck%20arabic.meta.js
// ==/UserScript==
(function() {var css = [
	".is-wide-columns .column {width: 750px !important;}",
	".tweet-text {font-family: \"Droid Arabic Naskh\", sans-serif !important;",
	"font-size:19px !important; direction: rtl !Important; line-height: 1.7em !Important;}",
	".mdl {width: 990px !important;}",
	".mdl-column-rhs {width: 650px !important;}",
	".tweet-timestamp {font-weight: bold !important;}",
	".med-tweet {top: 550px !Important;}",
	".med-fullpanel iframe {max-width: 900px !Important; max-height: 700px !Important;}",
	".mdl.s-full {margin: 0 465px !Important;}",
	".l-table {width: 900px !important;}",
	".med-embeditem {top: 5px !Important; bottom: 5px !Important;}",
	".headerInfo + .floatingEntryScroller {width: 880px !important;}",
	".sliderContainer {min-width: 5% !important; width: 880px !important;}",
	".mdl.s-full {max-width: 900px !important;}",
	".med-origlink, .med-tweet, .med-flaglink  {display: none !important;}",
	".js-media-native-video {width: 900px !important; height: 670px !important;}"
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
