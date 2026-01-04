// ==UserScript==
// @name        animexin.xyz english language selector
// @namespace   animexin.xyz english language selector
// @description:en This script selects the English Language on https://animexin.xyz/
// @match       *://animexin.xyz/*/
// @match       *://animexinax.com/*/
// @match       *://animexin.vip/*/
// @require     https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js
// @grant       none
// @version     1.3
// @author      henrik9999
// @run-at      document-idle
// @description This script selects the English Language on https://animexin.xyz/
// @downloadURL https://update.greasyfork.org/scripts/394670/animexinxyz%20english%20language%20selector.user.js
// @updateURL https://update.greasyfork.org/scripts/394670/animexinxyz%20english%20language%20selector.meta.js
// ==/UserScript==

$(document).ready(function() {
  if(document.getElementsByClassName('video-content')[0].innerHTML) {
    $("div.mobius > select.mirror").val($('div.mobius > select.mirror > option:contains("English")').val()).change();
  }
});