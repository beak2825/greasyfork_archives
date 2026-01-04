// ==UserScript==
// @name        Better Tipp10
// @description Erweitert Tipp10 um nützliche Features: Prozentanzeige
// @version	    1
// @namespace   https://online.tipp10.com/de/training/
// @match 	    https://online.tipp10.com/de/training/
// @require     https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/377416/Better%20Tipp10.user.js
// @updateURL https://update.greasyfork.org/scripts/377416/Better%20Tipp10.meta.js
// ==/UserScript==

//Prozentanzeige
$(document).one('DOMNodeInserted', '#chars', function() {
  $('#chars').on('DOMSubtreeModified', function() {
  	var chars = parseInt($('#chars').text().replace('Zeichen: ',''));
  	var errors = parseInt($('#errors').text().replace('Fehler: ',''));
    $('#fingers').text('Prozent: ' + (errors/chars*100).toFixed(2));
  });
});