// ==UserScript==
// @name         torobdirect
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Torob results to your shop :D (just for fun)
// @author       You
// @match        https://torob.com/p/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torob.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/448844/torobdirect.user.js
// @updateURL https://update.greasyfork.org/scripts/448844/torobdirect.meta.js
// ==/UserScript==


window.addEventListener('load', function () {
var anchors = document.getElementsByTagName("a");
var anchors2 = document.title;
var reg1 = "خرید و قیمت "
var reg2 = " | ترب"
var newStr1 = anchors2.replace(reg1, "");
var newStr2 = newStr1.replace(reg2, "");
var newStr3 = newStr2.replace(/ /g, "+");


for (var i = 0; i < anchors.length; i++) {
    anchors[i].href = "https://kasbekhodkar.ir/?s=" + newStr3 + "&post_type=product&dgwt_wcas=1"
}
})