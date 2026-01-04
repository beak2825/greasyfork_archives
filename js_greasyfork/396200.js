// ==UserScript==
// @name          Droid Arabic Naskh for Google, Facebook, twitter...
// @namespace     DroidArabicNaskh
// @description	  Droid Arabic Naskh for Google, Facebook, twitter, wikipedia...
// @author        adil
// @include       https://www.bbc.com/*
// @include       https://www.google.com/search*
// @include       https://www.dw.com/*
// @include       https://maktoob.yahoo.com/*
// @include       https://arabicpost.net/*
// @include       https://www.google.com/#*
// @include       http://mail.google.com/*
// @include       https://mail.google.com/*
// @include       http://*.mail.google.com/*
// @include       https://translate.google.com/*
// @include       https://mawdoo3.com/*
// @include       https://*.reuters.com/*
// @include       https://kooora.com*
// @include       https://*.kooora.com/*
// @include       http://news.google.com/*
// @include       https://news.google.com/*
// @include       http://*.news.google.com/*
// @include       https://*.news.google.com/*
// @include       https://*.wikipedia.org/*
// @include       https://twitter.com/*
// @include       http://facebook.com/*
// @include       https://facebook.com/*
// @include       http://*.facebook.com/*
// @include       https://*.facebook.com/*
// @include       https://feedly.com/*
// @include       https://www.startimes.com/*
// @include       https://reddit.com/*
// @include       https://studies.aljazeera.net/*
// @include       https://*.reddit.com/*
// @run-at        document-start
// @version       10
// @grant         GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/396200/Droid%20Arabic%20Naskh%20for%20Google%2C%20Facebook%2C%20twitter.user.js
// @updateURL https://update.greasyfork.org/scripts/396200/Droid%20Arabic%20Naskh%20for%20Google%2C%20Facebook%2C%20twitter.meta.js
// ==/UserScript==
(function() {var css = "* {}";
GM_addStyle ('.r-1ye8kvj {width: 750px !important; max-width: 920px !important;}');
GM_addStyle ('.r-cgjvx2 {display: none !important;}');
GM_addStyle ('.r-13qz1uu, .r-a1ub67 {max-height: 670px; !important;}');
GM_addStyle ('.r-1qhn6m8 {padding-left: 0px !important;}');
GM_addStyle ('.r-1hycxz {width: 250px !important;}');
GM_addStyle ('.pzfvarvs {max-width: 200px !important;}');
GM_addStyle ('.ji3y4fs9, .qtcz87ob, .taafd4c5, .h3ox8jsk, .q7g9yagz.q7g9yagz, .tukc5711.tukc5711 {width:704px !important;}');
GM_addStyle ('._6cuq {bottom: -28px;}');
GM_addStyle ('.gile2uim {flex-basis: 600px !important;}');
 GM_addStyle (' .lpgh02oy {max-width: 100px !important;}');
GM_addStyle ('.gderk4og, .tn7ubyq0, .bsq9mrxq.bsq9mrxq {width:1100px !important; max-width: 1100px !important;}');
GM_addStyle ('.qmfd67dx {max-width: 800px !important;}');
GM_addStyle ('.oh7imozk {width: 780px !important;}');
GM_addStyle ('.ecyo15nh {width: 1200px !important;}');
GM_addStyle ('.r9c01rrb {max-height: calc(3em * (20/17) * 2) !important;}');
GM_addStyle ('@media {max-width: 620px !important;}');
GM_addStyle (' .entry__title {font-size: 19px !important;padding-right: 0 !important;}');
GM_addStyle (' .entry__meta-column {margin-right: 0 !important;width: 80px !important;text-align: right !important;}');
GM_addStyle (' .engagement-container {display: none !important;}');
GM_addStyle (' .mw-body-content p, .r-1vmecro, #facebook ._-kb div, .article, .mw-body-content h3, .mw-body-content h4, #content h2, .fx .entry .entry__title, .entryBody {font-family: Droid Arabic Naskh, sans-serif !important; line-height: 28px !important; font-size:18px !important; }');

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


