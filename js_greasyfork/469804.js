// ==UserScript==
// @name         Stop wikipedia from screaming at me (Updated)
// @namespace    http://tampermonkey.net/
// @version      0.3.1
// @description  Stops wikipedia from yelling at you about donating by setting the "hide_fundraising" cookie.
// @author       karrdozo
// @match        http*://*.wikipedia.org/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=wikipedia.org
// @grant        none
// @license MIT
// @run-at document-start
// @downloadURL https://update.greasyfork.org/scripts/469804/Stop%20wikipedia%20from%20screaming%20at%20me%20%28Updated%29.user.js
// @updateURL https://update.greasyfork.org/scripts/469804/Stop%20wikipedia%20from%20screaming%20at%20me%20%28Updated%29.meta.js
// ==/UserScript==

(function() {
'use strict';

// Set a Cookie
function setCookie(cName, cValue, expDays) {
let date = new Date();
date.setTime(date.getTime() + (expDays * 24 * 60 * 60 * 1000));
const expires = "expires=" + date.toUTCString();
document.cookie = cName + "=" + cValue + "; " + expires + "; path=/";
}
setCookie("centralnotice_hide_fundraising", encodeURIComponent(JSON.stringify({"v":1,"created":Math.round((new Date()).getTime() / 1000),"reason":"donate close"})), 40 );
// {"v":1,"created":1672385956,"reason":"donate close"}

setCookie("centralnotice_hide_MaisPovosOriginriosemTeoriadaHistrianaWiki2023", encodeURIComponent(JSON.stringify({"v":1,"created":Math.round((new Date()).getTime() / 1000),"reason":"close"})), 40 );
// {"v":1,"created":1672385956,"reason":"close"}

})();