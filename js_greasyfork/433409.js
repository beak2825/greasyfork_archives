// ==UserScript==
// @name         DC_Neuvopack_Alert
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Emit a sound when your neuvopack is full
// @author       Nasty
// @match        https://www.dreadcast.net/Main
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_listValues
// @license DON'T BE A DICK PUBLIC LICENSE ; https://dbad-license.org/
// @downloadURL https://update.greasyfork.org/scripts/433409/DC_Neuvopack_Alert.user.js
// @updateURL https://update.greasyfork.org/scripts/433409/DC_Neuvopack_Alert.meta.js
// ==/UserScript==

$('body').append('<audio id="DC_Neuvopack_Full_Alert" src="https://bacon-network.net/dreadcast/neuvopack_full.wav" type="audio/waw"></audio><audio id="DC_Neuvopack_AlmostFull_Alert" src="https://bacon-network.net/dreadcast/neuvopack_almost_full.wav" type="audio/waw"></audio>');
$("#DC_Neuvopack_Full_Alert").prop('volume', '1');
$("#DC_Neuvopack_AlmostFull_Alert").prop('volume', '1');




let howMuchCristalsArray = new Array()
let neuvopackIsAlmostFull = 1500
let neuvopackIsFull = 2000

$(document).ready( function() {
    function neuvo_alert() {

        let howMuchCristals = $('#annexe_inventaire_ext [class*="contenance_appareil"]').text();

		if(0 == howMuchCristals.length)
			return;

			if(2000 >= howMuchCristals) {
				neuvopack_filling = 'full';
				color_my_neuvopack('red');
			}
            else if(neuvopackIsAlmostFull <= howMuchCristals) {
				neuvopack_filling = 'high'
				color_my_neuvopack('yellow');
			}
			else
				color_my_neuvopack('none');

			let neuvopackContent = howMuchCristals;

			if(-1 == $.inArray(neuvopackContent, Object.keys(howMuchCristalsArray)))
            howMuchCristalsArray[neuvopackContent] = {previous_howMuchCristals : -1, alert : neuvopack_filling};

			if(howMuchCristals != howMuchCristalsArray[neuvopackContent].previous_howMuchCristals)
            howMuchCristalsArray[neuvopackContent].alert = neuvopack_filling;

			howMuchCristalsArray[neuvopackContent].previous_howMuchCristals = howMuchCristals;


		let alert = 'none'
		for(let key in howMuchCristalsArray) {
			if('full' != alert) {
				if('full' == howMuchCristalsArray[key].alert)
					alert = 'full';
				if ('high' == howMuchCristalsArray[key].alert)
					alert = 'high';
			}

			howMuchCristalsArray[key].alert = 'none';
		}

		if('none' == alert)
			return;

		var neuvoalertsong = ('full' == alert)	? neuvoalertsong = $('#DC_Neuvopack_Full_Alert')[0]
										: neuvoalertsong = $('#DC_Neuvopack_AlmostFull_Alert')[0];

		neuvoalertsong.load();
		neuvoalertsong.play();
	}

function color_my_neuvopack(color) {
    let rgba = 'rgba(0,0,0,0)';
    if('red' == color)
        rgba = 'rgba(255,0,0,0.5)';
    if('yellow' == color)
        rgba = 'rgba(255,125,0,0.5)';

        $('#annexe_inventaire_ext [class*="objet_type_Neuvopack"]').css({'backgroundColor' : rgba});
}

$(document).ajaxComplete( function(a,b,c) {
    if(/Check/.test(c.url)) {
        neuvo_alert();
    }
});
});