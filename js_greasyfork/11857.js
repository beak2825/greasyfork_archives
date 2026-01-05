// ==UserScript==
// @name 		Alex:BTSC articles : add title to Permalink
// @namespace	http://www.blackberry.com/btsc/
// @description	version 4
// @include		http://www.blackberry.com/btsc/*
// @include		http://btsc.webapps.blackberry.com/btsc/*
// @version 0.0.1.20150819230249
// @downloadURL https://update.greasyfork.org/scripts/11857/Alex%3ABTSC%20articles%20%3A%20add%20title%20to%20Permalink.user.js
// @updateURL https://update.greasyfork.org/scripts/11857/Alex%3ABTSC%20articles%20%3A%20add%20title%20to%20Permalink.meta.js
// ==/UserScript==

var T = document.createTextNode(" "+ document.evaluate( "//div[@id = 'static_home']//h1", document, null, XPathResult.ANY_TYPE, null ).iterateNext().firstChild.nodeValue);
document.evaluate( "//div[@class = 'DocInformation']//p", document, null, XPathResult.ANY_TYPE, null ).iterateNext().appendChild(T);

