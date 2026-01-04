// ==UserScript==
// @name Gmail maillist overflow fix
// @namespace http://blog.veryue.com
// @version 1.0.20180118
// @include        http://mail.google.com/*
// @include        https://mail.google.com/*
// @include        http://*.mail.google.com/*
// @include        https://*.mail.google.com/*
// @description fix the maillist column overflow problem in Gmail
// @grant          GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/37544/Gmail%20maillist%20overflow%20fix.user.js
// @updateURL https://update.greasyfork.org/scripts/37544/Gmail%20maillist%20overflow%20fix.meta.js
// ==/UserScript==

//function addGlobalStyle(css) {
//	var head, style;
//	head = document.getElementsByTagName('head')[0];
//	if (!head) { return; }
//	style = document.createElement('style');
//	style.type = 'text/css';
//	style.innerHTML = css;
//	head.appendChild(style);
//}

//addGlobalStyle('div.nH.age.apP.aZ6.apk.nn {overflow-x: hidden;}');
var css = "div.age.apk.nn {overflow-x: hidden;}";

if (typeof GM_addStyle != "undefined") {
    GM_addStyle(css);
} else if (typeof addStyle != "undefined") {
    addStyle(css);
} else {
    var heads = document.getElementsByTagName("head");
    if (heads.length > 0) {
        var node = document.createElement("style");
        node.type = "text/css";
        node.appendChild(document.createTextNode(css));
        heads[0].appendChild(node);
    }
}