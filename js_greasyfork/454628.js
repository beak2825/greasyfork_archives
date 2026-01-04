// ==UserScript==
// @name         Viventor Agreements Script
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Download agreements from Viventor
// @author       @Juanvi78
// @match        https://www.viventor.com/profile/investments/myInvestments
// @grant        none
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/454628/Viventor%20Agreements%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/454628/Viventor%20Agreements%20Script.meta.js
// ==/UserScript==

(function() {
'use strict';
 var $ = window.jQuery, pag=0;
 dwnl();
 function dwnl(){
     if ($(".fa-file-pdf-o").length) {
         $(".fa-file-pdf-o").click();
         if (++pag<$(".module-pagination--page").last().text()) {
             $(".module-pagination--next")[0].click()
             setTimeout(dwnl,10000);
         }
     } else setTimeout(dwnl,1000);
 }
})();