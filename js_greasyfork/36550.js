// ==UserScript==
// @name         New Userscript
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @include       https://*screen=am_farm*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/36550/New%20Userscript.user.js
// @updateURL https://update.greasyfork.org/scripts/36550/New%20Userscript.meta.js
// ==/UserScript==

var atualizarPagina = 1;
var tempo = ((Math.random()+1)*800);
var x = 0;
var minhaVar = "";
var remove_atacadas = 1;
var menu = $('#am_widget_Farm a.farm_icon_a');
var altAldTempo = 1;
var jaEnviados = $(menu).parent().parent().find('img.tooltip').length+"000";
if (remove_atacadas == 0) {
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
}, ((Math.random()+1)*18000));
}
console.log("Ja existe " + jaEnviados.substring(0,(jaEnviados.length - 3)) + " aldeia com ataque.");
if (altAldTempo == "0") {
var altAldTempo = aleatorio(120000,220000);
} else {
var altAldTempo = parseInt(altAldTempo) + parseInt(aleatorio(120000,220000));
}
console.log("Resta " + altAldTempo + " milesegundos para alternar a aldeia.");
function aleatorio(superior,inferior) {
numPosibilidades = superior - inferior
aleat = Math.random() * numPosibilidades
return Math.round(parseInt(inferior) + aleat)
}
for (i = 0; i < 50; i++) {
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