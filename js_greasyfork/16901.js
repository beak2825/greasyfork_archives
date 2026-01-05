// ==UserScript==
// @name CheatInterface
// @namespace Cookie
// @include orteil.dashnet.org/cookieclicker/beta/
// @version 1
// @grant none
// @description:en seiuhnfe
// @description seiuhnfe
// @downloadURL https://update.greasyfork.org/scripts/16901/CheatInterface.user.js
// @updateURL https://update.greasyfork.org/scripts/16901/CheatInterface.meta.js
// ==/UserScript==
var oldOnload = window.onload;
window.onload = function () {
oldOnload();
var script = document.createElement('script');
script.setAttribute('src', '<source link>');
document.body.appendChild(script);
}