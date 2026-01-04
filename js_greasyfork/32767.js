// ==UserScript==
// @name         Lang-8
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  try to take over the world!
// @author       You
// @include      lang-8.com
// @grant        none
// @require      http://code.jquery.com/jquery-1.12.4.min.js
// @downloadURL https://update.greasyfork.org/scripts/32767/Lang-8.user.js
// @updateURL https://update.greasyfork.org/scripts/32767/Lang-8.meta.js
// ==/UserScript==

$(document).ready(function(){
      $("div.boxjournal:not(div.boxjournal:has(a[data-content*='\\<li\\ class\\=\\'speaking\\'\\>English\\<\\/li\\>']))").hide();
});