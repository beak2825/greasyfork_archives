// ==UserScript==
// @name                 	字体替换：XHei Intel
// @name:en-EN     	  Fonts Replacer: XHei Intel
// @namespace       	   https://gist.github.com/897601689/14ed64dadef9deb36953b3d78f7c79fc
// @version              	1.2
// @author              	xiaoyu
// @description       	     将字体替换为 XHei Intel。
// @description:en-EN   Replace fonts with XHei Intel.
// @match                	*://*/*
// @run-at              	 document-body
// @grant                	 GM_addStyle
// @grant                	 GM_registerMenuCommand
// @grant                	 GM_unregisterMenuCommand
// @license             	MIT
// @downloadURL https://update.greasyfork.org/scripts/483974/%E5%AD%97%E4%BD%93%E6%9B%BF%E6%8D%A2%EF%BC%9AXHei%20Intel.user.js
// @updateURL https://update.greasyfork.org/scripts/483974/%E5%AD%97%E4%BD%93%E6%9B%BF%E6%8D%A2%EF%BC%9AXHei%20Intel.meta.js
// ==/UserScript==

GM_addStyle(`
@font-face {
    font-family: "XHei Intel";
    src: local("XHei Intel");
    unicode-range: U+200C, U+200D, U+FE0E, U+FE0F, U+2190-21FF, U+27F?, U+2900-297F, U+2B??, U+23??, U+25A0-27BF, U+32??, U+1F???
}

:not(i, span[class ^= fa], #_):not([class *= icon], [class *= icon] span, #_) {
	font-family: "XHei Intel", system-ui
}
: is([lang$ = HK], [lang$ = MO]):not(i, span[class ^= fa], #_):not([class *= icon], [class *= icon] span, #_) {
	font-family: "XHei Intel", system-ui
}
: is([lang$ = TW], [lang$ = hant]):not(i, span[class ^= fa], #_):not([class *= icon], [class *= icon] span, #_) {
	font-family: "XHei Intel", system-ui
}
: lang(ja):not(i, span[class ^= fa], #_):not([class *= icon], [class *= icon] span, #_) {
	font-family: "XHei Intel", system-ui
}
: lang(ko):not(i, span[class ^= fa], #_):not([class *= icon], [class *= icon] span, #_) {
	font-family: "XHei Intel", system-ui
}
: root: is(pre, code, samp, kbd,
	var, [class *= code], #_):not([class *= icon], #_) {
	font-family: "XHei Intel", monospace
}
: root: is(pre, code, samp, kbd,
	var, [class *= code], #_):not([class *= icon], #_) span {
	font-family: "XHei Intel", monospace
}
`);