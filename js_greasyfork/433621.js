// ==UserScript==
// @name          cf隐藏中国某个省的旗帜
// @name:en       hider of the flag of a certain province of China in Codeforces
// @name:zh-TW    cf隐藏中国某个省的旗帜
// @namespace     http://userstyles.org
// @description   隐藏cf中国某个省的旗帜
// @description:en hiding the flag of a certain province of China in Codeforces
// @description:zh-TW 隐藏cf中国某个省的旗帜
// @author        TerryWang
// @homepage      https://www.luogu.com.cn/user/146416
// @include       http://codeforces.com/*
// @include       https://codeforces.com/*
// @include       http://*.codeforces.com/*
// @include       https://*.codeforces.com/*
// @include       http://codeforces.ml/*
// @include       https://codeforces.ml/*
// @include       http://*.codeforces.ml/*
// @include       https://*.codeforces.ml/*
// @include       http://codeforces.org/*
// @include       https://codeforces.org/*
// @include       http://*.codeforces.org/*
// @include       https://*.codeforces.org/*
// @include       http://codeforc.es/*
// @include       https://codeforc.es/*
// @include       http://*.codeforc.es/*
// @include       https://*.codeforc.es/*
// @run-at        document-start
// @version       0.0.0.1.1
// @downloadURL https://update.greasyfork.org/scripts/433621/cf%E9%9A%90%E8%97%8F%E4%B8%AD%E5%9B%BD%E6%9F%90%E4%B8%AA%E7%9C%81%E7%9A%84%E6%97%97%E5%B8%9C.user.js
// @updateURL https://update.greasyfork.org/scripts/433621/cf%E9%9A%90%E8%97%8F%E4%B8%AD%E5%9B%BD%E6%9F%90%E4%B8%AA%E7%9C%81%E7%9A%84%E6%97%97%E5%B8%9C.meta.js
// ==/UserScript==
(function() {var css = [
	"	img[src*=\"tw.png\"] { opacity: .0; filter: hue-rotate(.3turn); }"
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
