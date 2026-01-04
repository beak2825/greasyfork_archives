// ==UserScript==
// @name          web.de - Login only v0.78 mod
// @namespace     http://userstyles.org
// @description	  Blendet alles von der web.de-Startseite aus und zeigt nur noch den Login an.
// @author        gotU / modded by r_Evolution
// @homepage      https://userstyles.org/styles/171491/
// @include       http://web.de/fm
// @include       https://web.de/fm
// @include       http://web.de/fm?status=login-failed
// @include       https://web.de/fm?status=login-failed
// @include       http://web.de/
// @include       https://web.de/
// @include       http://www.web.de/fm
// @include       https://www.web.de/fm
// @include       http://www.web.de/fm?status=login-failed
// @include       https://www.web.de/fm?status=login-failed
// @include       http://www.web.de/
// @include       https://www.web.de/
// @run-at        document-start
// @version       0.20190709
// @downloadURL https://update.greasyfork.org/scripts/382451/webde%20-%20Login%20only%20v078%20mod.user.js
// @updateURL https://update.greasyfork.org/scripts/382451/webde%20-%20Login%20only%20v078%20mod.meta.js
// ==/UserScript==
(function() {var css = [
	"@namespace url(http://www.w3.org/1999/xhtml);",
	"A[href=\"https://produkte.web.de/freemail-webmail/?mc=hp@fm.produkte@freemail\"],",
	"A[href=\"https://spenden.web.de\"],",
	"#footer,",
	"#footer-sep-line,",
	"#header,",
	"#helplinks,",
	"#loginsearch-ad,",
	"#mainnav,",
	"#omsFirst,",
	"#promoline,",
	"#rectangle-fallbackContent,",
	"#sepResp0,",
	"#sepResp1,",
	"#sepResp2,",
	".ad,",
	".boxContentModuleContent .promo,",
	".hasIcon.icon-club,",
	".hasIcon.icon-demail,",
	".hasIcon.icon-domain,",
	".hasIcon.icon-search,",
	".module-group,",
	".netID-container,",
	".news-spotlight.order,",
	".r1,",
	".service.icons.order,",
	".service.top-search.order,",
	".service.top-article.order,",
	".service.horoscope.order,",
	".service.millionenklick.order,",
	".service.finanzen.order,",
	".service.icons.order,",
	".service.top-article,",
	".statistics,",
	".teaser.news.multi-news,",
	".teaser.news.multi-news.hero,",
	".teaser.news.multi-news.order,",
	".teaser.news.multi-news.order,",
	".topnews,",
	".wrapper-center,",
	".wrapper-themed",
	"{",
	"display:none !important;",
	"}",
	"",
	".wrapper-center.first",
	"{",
	"display:block !important;",
	"width:53em !important;",
	"}",
	"",
	"#loginsearch",
	"{",
	"margin-top:3em !important;",
	"width:53em !important;",
	"}",
	"",
	"#content",
	"{",
	"margin:auto !important;",
	"}",
	"",
	"body, body::before",
	"{",
	"border-top:0 !important;",
	"border-bottom:0 !important;",
	"min-width:auto !important;",
	"}"
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