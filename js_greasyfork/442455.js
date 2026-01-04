//
// Written by Glenn Wiking
// Script Version: 1.0
//
//
// ==UserScript==
// @name        Basic Bitch Prank
// @namespace   A1
// @description Does something that isn't all that funny
// @version     1.0
// @icon        https://shuttle-storage.s3.amazonaws.com/demolav/Afbeeldingen/Prank.jpg

// @include     *
// @require			https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js 
// @require			https://cdn.jsdelivr.net/npm/js-cookie@2/src/js.cookie.min.js
// @require			https://cdnjs.cloudflare.com/ajax/libs/mark.js/8.11.1/jquery.mark.es6.js

// @downloadURL https://update.greasyfork.org/scripts/442455/Basic%20Bitch%20Prank.user.js
// @updateURL https://update.greasyfork.org/scripts/442455/Basic%20Bitch%20Prank.meta.js
// ==/UserScript==

let update = setInterval( step, 1250);
let perc = 0;
$("body").attr("step", perc);
function step() {
  perc = (parseFloat( $("body:not(.admin)").attr("step") ) + 0.01).toFixed(2);
  if ( perc == 1 ) {
  	clearInterval( update );
  } else {
    $("body:not(.admin)").attr("step", perc);
    $("body:not(.admin)").css({"filter":"grayscale("+ perc +")"});
    //console.log(perc);
  }
}
$(window).on("blur", function() { clearInterval( update ); /*console.log( "Left" )*/ });
$(window).on("focus", function() { clearInterval( update );  update = setInterval( step, 1000); /*console.log( "Returned" )*/ });