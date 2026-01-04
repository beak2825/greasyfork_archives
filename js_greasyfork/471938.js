// ==UserScript==
// @name          Taiwanese Mandrain for zh.Wikipedia
// @namespace     kvw
// @description   Force Taiwanese Mandrain for zh.Wikipedia
// @include       https://zh.wikipedia.org/wiki/*
// @include       https://zh.wikipedia.org/zh*
// @include       https://zh.m.wikipedia.org/wiki/*
// @include       https://zh.m.wikipedia.org/zh*
// @version       1.2
// @grant         none
// @run-at        document-start
// @downloadURL https://update.greasyfork.org/scripts/471938/Taiwanese%20Mandrain%20for%20zhWikipedia.user.js
// @updateURL https://update.greasyfork.org/scripts/471938/Taiwanese%20Mandrain%20for%20zhWikipedia.meta.js
// ==/UserScript==


var url = window.location.href;
var prefix;
var midSuffix;
var suffix;

url = url.replace("zh.m.wikipedia", "zh.wikipedia")

if (url.indexOf("/zh-tw/") == -1) {
	if (url.indexOf("/wiki/") == -1) {
prefix = url.substring(0, url.indexOf(".org/zh") + 4);
//		var suffix = url.substring(url.indexOf(".org/zh") + 11);
midSuffix = url.substring(url.indexOf(".org/zh") + 5);
suffix = midSuffix.substring(midSuffix.indexOf("/")+1);
		url = prefix + "/zh-tw/" + suffix;
//        window.location.replace(url);
	} else {
		prefix = url.substring(0, url.indexOf("/wiki/"));
		suffix = url.substring(url.indexOf("/wiki/") + 6);
		url = prefix + "/zh-tw/" + suffix;
//        window.location.replace(url);
	}
window.location.replace(url);
//    window.location.href = url.replace(url);
}
