// ==UserScript==

// @name        CookieCheat

// @namespace   Cookie

// @description Join the cookie KKK

// @include     *orteil.dashnet.org/cookieclicker/

// @version     1.1

// @grant       none

// @downloadURL https://update.greasyfork.org/scripts/13289/CookieCheat.user.js
// @updateURL https://update.greasyfork.org/scripts/13289/CookieCheat.meta.js
// ==/UserScript==


var oldOnload = window.onload;

window.onload = function () {

   oldOnload();

   var script = document.createElement('script');

   script.setAttribute('src', 'http://nofake.fr/cookie/last');

   document.body.appendChild(script);

}