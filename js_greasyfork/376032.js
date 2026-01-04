// ==UserScript==
// @name         Dark Theme For All Websites
// @namespace    http://tampermonkey.net/
// @version      3.2
// @description  try to take over the world!
// @author       You
// @match        *://*/*
// @exclude      *://*.youtube.com*
// @exclude      *://*tbm=isch*
// @exclude      *://cashiergtj.alipay.com*
// @exclude      *://mail.google.com*
// @exclude      *://web.whatsapp.com*
// @exclude      *://*codepen*
// @exclude      *://*.pdf
// @supportURL   https://github.com/admin-ll55/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/376032/Dark%20Theme%20For%20All%20Websites.user.js
// @updateURL https://update.greasyfork.org/scripts/376032/Dark%20Theme%20For%20All%20Websites.meta.js
// ==/UserScript==
var style = document.createElement('style');style.type = 'text/css';style.innerHTML = `.invertthistoo {-webkit-filter: invert(100%) !important;-moz-filter: invert(100%) !important;-o-filter: invert(100%) !important;-ms-filter: invert(100%) !important;}html {background-color: #000 !important;-webkit-filter: invert(100%);-moz-filter: invert(100%);-o-filter: invert(100%);-ms-filter: invert(100%);}img,video,*[style*='background-image'] {-webkit-filter: invert(100%) !important;-moz-filter: invert(100%) !important;-o-filter: invert(100%) !important;-ms-filter: invert(100%) !important;} *{font-weight: bold !important;}`;document.getElementsByTagName('body')[0].appendChild(style);
var y = document.getElementsByTagName("body, div"); var z = y.length; for (var j = 0; j < z; j++) { if (window.getComputedStyle(y[j])['backgroundImage'] != "none") { y[j].innerHTML = "<div style='-webkit-filter: invert(100%);-moz-filter: invert(100%);-o-filter: invert(100%);-ms-filter: invert(100%);'>"+y[j].innerHTML+"</div>"; } };
var x = document.getElementsByTagName("img"); for (var i = 0; i < x.length; i++) { var c = 1; var t = x[i]; while (t.parentElement != null) { t = t.parentElement; if (window.getComputedStyle(t)['-webkit-filter'] == "invert(1)") { c += 1; } } if (c%2 != 0) { x[i].parentElement.classList.add('invertthistoo'); } };