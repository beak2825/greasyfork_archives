// ==UserScript==
// @name         earnhoney
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        http://www.earnhoney.com/en/videos/video/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/32909/earnhoney.user.js
// @updateURL https://update.greasyfork.org/scripts/32909/earnhoney.meta.js
// ==/UserScript==

setInterval(function(){ 


var resultat = $('#quartile1').attr('class')
var resultat2 = $('#quartile2').attr('class')
var resultat3 = $('#quartile3').attr('class')



if ( resultat == "viewability-quartile vq-viewed-logged" ) {location.reload();}
else if ( resultat2 == "viewability-quartile vq-viewed-logged" ) {location.reload();}
else if ( resultat3 == "viewability-quartile vq-viewed-logged" ) {location.reload();}


 else if ( resultat == "viewability-quartile vq-not-viewed-logged" ) {  alert("J'ai besoin de toi pour valider ! ");  }

    
}, 5000);

