// ==UserScript==
// @name        CIEMNIEJSZE WILNO
// @namespace   kurwoooooo
// @include     https://shadow.wilchan.org/*
// @version     1
// @grant       none
// @require https://code.jquery.com/jquery-3.2.1.min.js
// @description ostatni gasi światło
// @downloadURL https://update.greasyfork.org/scripts/34300/CIEMNIEJSZE%20WILNO.user.js
// @updateURL https://update.greasyfork.org/scripts/34300/CIEMNIEJSZE%20WILNO.meta.js
// ==/UserScript==


$(document).ready(function przyciemniacz() { 
var image = $(".file a img");
  var d = new Date(); 
  var h =  d.getHours(); //aktualna godzina
//tu se godziny ustaw, w sensie zmień 21 i/lub 5 na co chcesz
  var night = 21;
  var day = 5;
//a tutaj w sumie możesz pozmieniać opacity w zakresie 0.0 - 1.0, defaultowo 0.4
  $(image).hover(function(){
		$(this).css("transition", "0s linear");
	});
    
    if (h >= night || h < day) { 
		$(image).css( "opacity", 0.4) 
		$(image).mouseenter(function(){ 
			$(this).css("opacity", 1) 
		}); 
		$(image).mouseleave(function(){ 
			$(this).css( "opacity", 0.4) 
		}); 
    } 
    else  { 
		$(image).css( "opacity", 1 ) 
    } 
}); 