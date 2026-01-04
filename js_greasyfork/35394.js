// ==UserScript==
// @name AutoFarm C
// @description https://www.youtube.com/channel/UCeYF2UWfIvI9isXCRknliiA
// @author DanielBR
// @Email danielchaves17p@gmail.com
// @include https://*screen=am_farm*
// @version 1.0
// @namespace https://greasyfork.org/users/159045
// @downloadURL https://update.greasyfork.org/scripts/35394/AutoFarm%20C.user.js
// @updateURL https://update.greasyfork.org/scripts/35394/AutoFarm%20C.meta.js
// ==/UserScript==

var atualizarPagina = 1;
var tempo = 500;
var x = 0;
var minhaVar = "";
var remove_atacadas = 1;
var menu = $('#am_widget_Farm a.farm_icon_c');
var altAldTempo = 1;
var linhaRel = $('#plunder_list tbody tr').length;

if (((linhaRel - 1) == $('#plunder_list tbody tr a.farm_icon_a.farm_icon_a').length) || !linhaRel){
    $('a#village_switch_right .arrowRight').click();
}

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
        }, 200000);
}

console.log("Ja existe " + jaEnviados.substring(0,(jaEnviados.length - 3)) + " aldeia com ataque.");


if (altAldTempo == "1") {
    var altAldTempo = aleatorio(1000,2000);
} else {
    var altAldTempo = parseInt(altAldTempo) + parseInt(aleatorio(82353,35356));
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
            var tempoAgora = (tempo * ++x) - aleatorio(250,500);
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

