// ==UserScript==
// @name CheatInterface
// @namespace Cookie
// @include https://trixter9994.github.io/Cookie-Clicker-Source-Code/
// @version 1
// @description Cookie clicker cheast
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/466224/CheatInterface.user.js
// @updateURL https://update.greasyfork.org/scripts/466224/CheatInterface.meta.js
// ==/UserScript==
var oldOnload = window.onload;
window.onload = function () {
oldOnload();
var script = document.createElement('script');
script.setAttribute('src', 'Game.OpenSesame();');
document.body.appendChild(script);
}