// ==UserScript==
// @name         Likea_en_diferido (reload110)
// @namespace    https://greasyfork.org/es/users/243179-kchamat
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        http://hardworld.xyz/mi/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/383662/Likea_en_diferido%20%28reload110%29.user.js
// @updateURL https://update.greasyfork.org/scripts/383662/Likea_en_diferido%20%28reload110%29.meta.js
// ==/UserScript==

(function() {
    'use strict';
$(".likeli").parent('.vctip').wrap('<a href=# class="cajita"></a>');
$(".cajita").prepend("<input type='checkbox' name='agenda' value='1' class='agenda'>");

    $( ".agenda" ).click(function() {
$( this ).nextAll(".vctip:first").css( "margin-bottom","7" );
$( this ).nextAll(".vctip:first").children(".likeli").addClass("agendau");
});
//likea de a uno cada 25 seg (7seg-5min desde la carga)
 var ichu=0
for (ichu = 0; ichu < 15 ; ichu++) {
   setTimeout(function() {
      if ($(".likeli.agendau:first").length ) {
      $( ".likeli.agendau:first" ).click();
      new Audio('https://www.soundjay.com/button/sounds/button-30.mp3').play();
      }
   }, 7000+ichu*25500);
}
 //oculta la mascara y el mensaje de advertencia
    function ocultar(objeto){
var styles = objeto+'{display:none; margin-top:7000px; height=0px; }';
var styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = styles;
document.head.appendChild(styleSheet)
}
setTimeout(function() {
ocultar("div#mydialog");
ocultar("div#mask");
ocultar("div#loading");
}, 500);

})(jQuery);
