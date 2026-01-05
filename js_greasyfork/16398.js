// ==UserScript==
// @name         Eric Vanim-Botting
// @namespace    https://greasyfork.org/en/users/27845
// @version      0.2
// @description  Checks Yes by default. F for No. S to submit.
// @author       Pablo Escobar
// @include      https://*.mturk.com/*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/16398/Eric%20Vanim-Botting.user.js
// @updateURL https://update.greasyfork.org/scripts/16398/Eric%20Vanim-Botting.meta.js
// ==/UserScript==

$('input[value="Selection_MQ--"]').click();

$(window).keyup(function(oph) {
   if (oph.which == 70) {  $('input[value="Selection_MA--"]').eq( 0 ).click();  }
});

$(window).keyup(function(oph) { 
   if (oph.which == 83) {  $( 'input[name="/submit"]' ).eq( 0 ).click();  }
});