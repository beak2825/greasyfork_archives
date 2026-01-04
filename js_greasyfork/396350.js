// ==UserScript==
// @name         AutoFarm CCCCCCCC
// @namespace    http://brtwscripts.com
// @version      0.1
// @description  Soh pros folgados kkk
// @author       --------
// @include      https://*screen=am_farm*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/396350/AutoFarm%20CCCCCCCC.user.js
// @updateURL https://update.greasyfork.org/scripts/396350/AutoFarm%20CCCCCCCC.meta.js
// ==/UserScript==

var atualizarPagina = 1;
var tempo = 350;
var x = 0;
var minhaVar = "";
var remove_atacadas = 0;
var menu = $('#am_widget_Farm a.farm_icon_c');
var altAldTempo = 1;

var jaEnviados = $(menu).parent().parent().find('img.tooltip').length+"000";

if (remove_atacadas == 1) {
$('img').each(function() {
var tempStr = $(this).attr('src');
if (tempStr.indexOf('attack') != -1) {
$(this).addClass('tooltip') 
}
});
} 
if(atualizarPagina == 1) {
setInterval(
function() {
window.location.reload();
}, 91222); 
}

console.log("Ja existe " + jaEnviados.substring(0,(jaEnviados.length - 3)) + " aldeia com ataque."); 


if (altAldTempo == "1") {
var altAldTempo = aleatorio(38233,28233);
} else {
var altAldTempo = parseInt(altAldTempo) + parseInt(aleatorio(28233,35356));
}
console.log("Resta " + altAldTempo + " milesegundos para alternar a aldeia.");

function aleatorio(superior,inferior) {
numPosibilidades = superior - inferior
aleat = Math.random() * numPosibilidades
return Math.round(parseInt(inferior) + aleat)
}



for (i = 0; i < 100; i++) {
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

console.log("Changed by the best br Speeed Player ever");