// ==UserScript==
// @name            susaninha
// @description    que saudades
// @author        susana dos rissóis
// @include       https://*screen=am_farm*
// @version        1.0
// @namespace https://greasyfork.org/users/13855
// @downloadURL https://update.greasyfork.org/scripts/11338/susaninha.user.js
// @updateURL https://update.greasyfork.org/scripts/11338/susaninha.meta.js
// ==/UserScript==
   var tempo = 1000;
   var x = 0;
   var menu = $('#am_widget_Farm a.farm_icon_b');
   var jaEnviados = $(menu).parent().parent().find('img.tooltip').length+"000";
   console.log("Ja existe " + jaEnviados.substring(0,(jaEnviados.length - 3)) + " aldeia com ataque."); 
   
   var altAldTempo = parseInt($('#am_widget_Farm a.farm_icon_c').length+"000") - parseInt(jaEnviados);
   console.log("Resta " + altAldTempo + " aldeias para Atacar.");
  
   if (altAldTempo == "0") {
 var altAldTempo = aleatorio(14000,19000); 
   } else {
 var altAldTempo = parseInt(altAldTempo) + parseInt(aleatorio(4000,14000));
   }
   console.log("Resta " + altAldTempo + " milesegundos para alternar a aldeia.");
   function aleatorio(inferior, superior) {
    numPosibilidades = superior - inferior
    aleat = Math.random() * numPosibilidades
    return Math.round(parseInt(inferior) + aleat)
   }
 
   for (i = 0; i < 80; i++) {
      $(menu).eq(i).each(function() {
         if (!($(this).parent().parent().find('img.tooltip').length)) {
  var tempoAgora = (tempo * ++x) - aleatorio(150,300);
                setTimeout(function(minhaVar) {
                   $(minhaVar).click();
              }, tempoAgora, this); 
         }
       })
   }
   function altAldeia()
   { 
      $('.arrowRight').click();
      $('.groupRight').click();
   }
   setInterval(altAldeia, altAldTempo);
   
   console.log("By Taliton R.C -> Skype: taliton.rc");