// ==UserScript==
// @name         Ivelt
// @version      1.0
// @description testing
// @author       NP
// @match        *.ivelt.com/*
// @exclude      *.ivelt.com/forum/ucp.php?i=pm*
// @grant        none
// @require http://code.jquery.com/jquery-3.4.1.min.js
// @namespace https://greasyfork.org/users/831438
// @downloadURL https://update.greasyfork.org/scripts/434891/Ivelt.user.js
// @updateURL https://update.greasyfork.org/scripts/434891/Ivelt.meta.js
// ==/UserScript==
function removere(){
   var url =  window.location.href;

   if (url.includes("viewtopic.php")){
      var title = document.getElementsByClassName("topic-title");
      document.getElementById('subject').value = title[0].innerText;
   }
   else if (url.includes("posting.php")){
      var title2 = document.getElementsByClassName("posting-title");
      document.getElementById('subject').value = title2[0].innerText;
   };
}
removere()