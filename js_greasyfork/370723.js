// ==UserScript==
// @name         New Userscript
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match      https://www.ywjd520.com/money
// @grant        none
// @require    http://code.jquery.com/jquery-1.11.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/370723/New%20Userscript.user.js
// @updateURL https://update.greasyfork.org/scripts/370723/New%20Userscript.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var timer ;
    timer = setInterval (function (){
      var url = window.location.href ;
      if(document.querySelector(".table tbody tr").length!=0 && document.querySelector(".table tbody tr").className!='no-records-found'){
          var button = document.querySelector(".btn-xs")[0];
          button.click();
          clearInterval(timer);
      } else if( url.indexOf("userbuy/vcode/")>0){
          document.querySelector("input[type='text']")[0].focus();
          clearInterval(timer);
      }else {
          history.go(0);
      }
    },800)
    // Your code here...
})();