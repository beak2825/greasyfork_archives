// ==UserScript==
// @name        Google Enable Dark Mode automatically
// @include        http*://*.google.*/search*
// @include        http://*.google.*/imgres*
// @description Enables Google Search Dark Mode
// @version     1.01
// @grant       none
// @namespace https://greasyfork.org/users/1258342
// @downloadURL https://update.greasyfork.org/scripts/486788/Google%20Enable%20Dark%20Mode%20automatically.user.js
// @updateURL https://update.greasyfork.org/scripts/486788/Google%20Enable%20Dark%20Mode%20automatically.meta.js
// ==/UserScript==
var url = window.location.href;
var safe = "?pccc=1";
if(url.indexOf(safe) == -1){
  url += safe;
  window.location = url;
}