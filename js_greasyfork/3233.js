// ==UserScript==
// @name        BorjaScript
// @namespace   http://spain-estudios.com/
// @include     http://spain-estudios.com/?survey=job
// @include     http://www.spain-estudios.com/?survey=job
// @version     1.1
// @grant       none
// @description Spain-estudios script por Borja
// @downloadURL https://update.greasyfork.org/scripts/3233/BorjaScript.user.js
// @updateURL https://update.greasyfork.org/scripts/3233/BorjaScript.meta.js
// ==/UserScript==

var surv = $('.surv').html();
var surv_num = surv.replace(/\D+/g, '');

var num_name = surv_num;
if(num_name == '410') { num_name = '4'; } //Bug con la pregunta 4

var timerVar = setInterval(function () {
    Script();
}, 1000);

function Script() {
    var done = 0;
    
    if ($('[name="q' + num_name + '"]').length > 0) {
	    
	    //usar con precaucion
	    //$("#TimerButton").prop('value', 'Responder');
	    //$("#TimerButton").prop('disabled', false);


        if ($('[name="q' + num_name + '"]').is(':checked')) {
            //hay una opcion selecionado
            if ($('#TimerButton').prop('value') == 'Responder') {
                $('#TimerButton').click();
                done = 1;
            }
        } else {
            //si no hay una opcion selecionada
            var value = 1 + Math.floor(Math.random() * 3);
            $('[value^=\'' + value + '\']').prop('checked', true)
            if ($('#TimerButton').prop('value') == 'Responder') {
                $('#TimerButton').click();
                done = 1;
            }
        }
        if (done == 1) {
          	setTimeout(function () { }, 7000);
        }
    }
}