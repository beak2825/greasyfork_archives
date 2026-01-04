// ==UserScript==
// @name         The Atlantic
// @namespace    http://tampermonkey.net/
// @version      0.33
// @description  Beyond paywall
// @author       Martin Larsen
// @match        https://www.theatlantic.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=theatlantic.com
// @require      https://code.jquery.com/jquery-3.5.1.min.js
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/478085/The%20Atlantic.user.js
// @updateURL https://update.greasyfork.org/scripts/478085/The%20Atlantic.meta.js
// ==/UserScript==

/* globals $ waitForKeyElements*/

(function() {
   'use strict';

   if(document.location.hash  != "#ok") {
      clearCookies();
      document.location.hash = "ok";
      document.location.reload();
   }
   else {
      setTimeout(function(){
         document.querySelector(".ArticleBody_divider__GpNxD").previousElementSibling.remove();
         document.querySelectorAll(".qc-cmp2-summary-buttons button")[1].click();
      }, 3000);

   }

GM_addStyle(`
    .container.desktop.expanded { display: none }
  `)
})();

function clearCookies() {
    var cookies = document.cookie.split("; ");
    for (var c = 0; c < cookies.length; c++) {
        var d = window.location.hostname.split(".");
        while (d.length > 0) {
            var cookieBase = encodeURIComponent(cookies[c].split(";")[0].split("=")[0]) + '=; expires=Thu, 01-Jan-1970 00:00:01 GMT; domain=' + d.join('.') + ' ;path=';
            var p = location.pathname.split('/');
            document.cookie = cookieBase + '/';
            while (p.length > 0) {
                document.cookie = cookieBase + p.join('/');
                p.pop();
            };
            d.shift();
        }
    }
}
