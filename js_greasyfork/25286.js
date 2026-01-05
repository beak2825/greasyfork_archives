// ==UserScript==
// @name        Google Disable SafeSearch automatically
// @description Disable Google SafeSearch automatically
// @namespace   Mikhoul
// @include        http*://*.google.*/search*
// @include        http://*.google.*/imgres*
// @exclude        http*://contacts.google.com 
// @version     1.02
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/25286/Google%20Disable%20SafeSearch%20automatically.user.js
// @updateURL https://update.greasyfork.org/scripts/25286/Google%20Disable%20SafeSearch%20automatically.meta.js
// ==/UserScript==
var url = window.location.href;
var safe = "&safe=off";
if(url.indexOf(safe) == -1){
  url += safe;
  window.location = url;
}