// ==UserScript==
// @name          Visual Search Requester
// @version        0.9
// @description   Adds 4 search links and copys the upc to your clipboard  press 4 to submit the hit
// @author         Cristo
// @require     http://code.jquery.com/jquery-latest.min.js
// @include        *
// @copyright      2012+, You
// @namespace https://greasyfork.org/users/1973
// @downloadURL https://update.greasyfork.org/scripts/36611/Visual%20Search%20Requester.user.js
// @updateURL https://update.greasyfork.org/scripts/36611/Visual%20Search%20Requester.meta.js
// ==/UserScript==

$("#Answer_4").click();

if (window.location.toString().indexOf('mturk') != -1)
   var page = document.getElementById("hit-wrapper");
   var line = page.getElementsByTagName("h3")[1];
   var lineIns = line.innerHTML;
   var frontJ = lineIns.substring(0,23);
   var firstPass = lineIns.replace(frontJ,"");
   var backJ = firstPass.substring(firstPass.length - 1,firstPass.length);
   var lastPass = firstPass.replace(backJ,"");
       
   var tb = document.createElement("table");
   line.parentNode.insertBefore(tb, line.nextSibling);
   var tr0 = document.createElement("tr");
   tb.appendChild(tr0);
   var tr1 = document.createElement("tr");
   tb.appendChild(tr1);
   var tr2 = document.createElement("tr");
   tb.appendChild(tr2);
   var tr3 = document.createElement("tr");
   tb.appendChild(tr3);
   var tr4 = document.createElement("tr");
   tb.appendChild(tr4);
   
   var link = document.createElement("a");
   link.target = "_blank";
   link.href = 'http://www.google.com/search?q=' + lastPass + ' -ebay';
   link.innerHTML = "Google " + lastPass;
   tr0.appendChild(link);
   
   var link2 = document.createElement("a");
   link2.target = "_blank";
   link2.href = 'http://www.upcdatabase.com/item/' + lastPass;
   link2.innerHTML = "Upcdatabase " + lastPass;
   tr1.appendChild(link2);
   
   var link3 = document.createElement("a");
   link3.target = "_blank";
   link3.href = 'http://www.upcindex.com/' + lastPass;
   link3.innerHTML = "Upcindex " + lastPass;
   tr2.appendChild(link3);
   
   var link4 = document.createElement("a");
   link4.target = "_blank";
   link4.href = 'http://www.digit-eyes.com/cgi-bin/digiteyes.fcgi?upcCode='+lastPass+'&action=lookupUpc&go=Go%21';
   link4.innerHTML = "Digit Eye " + lastPass;
   tr3.appendChild(link4);


$(window).keyup(function(oph) { 
    if (oph.which == 13) {  $( 'input[name="/submit"]' ).eq( 0 ).click();  }
});