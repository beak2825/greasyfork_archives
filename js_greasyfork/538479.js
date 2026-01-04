// ==UserScript==
// @name        Google Force SafeSearch
// @description Force SafeSearch for Google
// @namespace   TakumiBC
// @include        http*://*.google.*/search*
// @include        http://*.google.*/imgres*
// @version     1.0.1
// @grant       none
// @license GNU GPLv2
// @downloadURL https://update.greasyfork.org/scripts/538479/Google%20Force%20SafeSearch.user.js
// @updateURL https://update.greasyfork.org/scripts/538479/Google%20Force%20SafeSearch.meta.js
// ==/UserScript==
var url = window.location.href;
var safe = "&safe=on";
if(url.indexOf(safe) == -1){
  url += safe;
  window.location = url;
}