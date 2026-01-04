// ==UserScript==
// @name          Отображение комментариев на joyreactor.cc
// @namespace     http://userstyles.org
// @description	  Секция комментариев более аккуратна и понятна - линиями указана ветвь диалога.
// @author        leere
// @homepage      https://userstyles.org/styles/146938
// @include       http://joyreactor.cc/*
// @include       https://joyreactor.cc/*
// @include       http://*.joyreactor.cc/*
// @include       https://*.joyreactor.cc/*
// @run-at        document-start
// @version       0.20170821080556
// @downloadURL https://update.greasyfork.org/scripts/33652/%D0%9E%D1%82%D0%BE%D0%B1%D1%80%D0%B0%D0%B6%D0%B5%D0%BD%D0%B8%D0%B5%20%D0%BA%D0%BE%D0%BC%D0%BC%D0%B5%D0%BD%D1%82%D0%B0%D1%80%D0%B8%D0%B5%D0%B2%20%D0%BD%D0%B0%20joyreactorcc.user.js
// @updateURL https://update.greasyfork.org/scripts/33652/%D0%9E%D1%82%D0%BE%D0%B1%D1%80%D0%B0%D0%B6%D0%B5%D0%BD%D0%B8%D0%B5%20%D0%BA%D0%BE%D0%BC%D0%BC%D0%B5%D0%BD%D1%82%D0%B0%D1%80%D0%B8%D0%B5%D0%B2%20%D0%BD%D0%B0%20joyreactorcc.meta.js
// ==/UserScript==
(function() {var css = [
	".comment_list {",
	"    border-left: solid 4px #000000 !important;",
	"    background: transparent;",
	"}",
	".comment {",
	"    box-shadow: 0 0px 1px rgba(0, 0, 0, 0.5);",
	"    background-color: #fff;",
	"    border-radius: 0px;",
	"}",
	"#pageinner {background: #f7f7f7 !important}",
	"",
	"a.next, a.prev,#navlist a:hover, input {border-radius: 25pt;color:#000}",
	"#navlist a:hover {background:#e6e6e6;text-decoration: none!important;}",
	"    ",
	"a.top_logo:before {content: \"\\21B5\";position: fixed; left: 10px; font-size: 24pt; opacity: 0.5}",
	"",
	"* {transition: .3s!important",
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