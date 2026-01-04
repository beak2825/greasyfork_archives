// ==UserScript==
// @name         AutoFarm A
// @namespace    http://brtwscripts.com
// @version      0.1
// @description  Soh pros folgados kkk
// @author       Biaza
// @include      https://*screen=am_farm*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/375025/AutoFarm%20A.user.js
// @updateURL https://update.greasyfork.org/scripts/375025/AutoFarm%20A.meta.js
// ==/UserScript==


var refresh = 0;
var remove = 0;
var tempo = 1000;
var x = 0;
var minhaVar = "";
var menu = $('#am_widget_Farm a.farm_icon_a');
var jaEnviados = $(menu).parent().parent().find('img.tooltip').length+"000";

if(refresh == 1) {
setInterval(function() { window.location.reload(); }, 6000)
}

if(remove == 1) {
$('img').each(function() { var tempStr = $(this).attr('src'); if (tempStr.indexOf('attack') != -1) { $(this).addClass('tooltip') } });
}

var altAldTempo = parseInt($('#am_widget_Farm a.farm_icon_c').length+"000") - parseInt(jaEnviados);

if(altAldTempo == "0") {
var altAldTempo = aleatorio(30000, 50000);
} else {
var altAldTempo = parseInt(altAldTempo) + parseInt(aleatorio(30000, 50000));
}

function aleatorio(inferior, superior) {
numPosibilidades = superior - inferior
aleat = Math.random() * numPosibilidades
return Math.round(parseInt(inferior) + aleat)
}

for(i = 0; i < 100; i++) {
$(menu).eq(i).each(function() {
 if (!($(this).parent().parent().find('img.tooltip').length)) {
  var tempoAgora = (tempo * ++x) - aleatorio(1500,3000);
  setTimeout(function(minhaVar) { $(minhaVar).click(); }, tempoAgora, this);
 }
})
}

function altAldeia() {
$('.arrowRight').click();
$('.groupRight').click();
}

setInterval(altAldeia, 5000);