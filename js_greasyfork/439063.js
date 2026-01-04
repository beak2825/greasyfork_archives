// ==UserScript==
// @name         Venus Fix
// @namespace    http://tampermonkey.net/
// @version      0.22
// @description  Improves Venus user experience, based of Venus API and HTML datas. !It does not change serverside code!
// @author       Valentin
// @match        http://10.1.74.201/venus/*
// @grant        none
// @license     GNU
// @downloadURL https://update.greasyfork.org/scripts/439063/Venus%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/439063/Venus%20Fix.meta.js
// ==/UserScript==

(function() {
	console.log('0 Venus Fix : initializing...')

	var $ = window.jQuery;
	var logCount = 0;
    var mounya = false;

	//once HTML finished the load
	$(document).ready( function() {
		function setkeyup() {
			if ($('#barcode').length == 0) return false; //barcode not found

			//unbinding old Venus keyup event
			$('#barcode').off('keyup');

			//binding updated Venus keyup event
			$('#barcode').keyup(function(e) {
				var key = e.keyCode || e.which;

				console.log(logCount++ + ' Venus Fix : keyup fired and barcode : ' + $('#barcode').val());

				//*updated code
				if ($('#barcode').val() == '') return false;
				//updated code*/

				delay( function(){
					//*updated code
					var barcode = serializeBarcode($('#barcode').val()); //handle barcode issues
					cleanBarcodeInput();// clean HTML
					//updated code*/

					js_barcode_check(barcode); //Venus's function call
				}, 1000 );
			});

			console.log(logCount++ + ' Venus Fix : barcode keyup set');

			return true;
		}

		//clean HTML barcode
		function cleanBarcodeInput() {
			$('#barcode').val('');

			return true;
		}

		/*Know issues :
		The scan trigger keyboard inputs. Inputs have to be digits
		1 - Each character is sent 1 by 1 as key pressed event
		2 - Capslock affects the result, converting each digit to other special character
	*/
		function serializeBarcode(barcode) {
			var barcodeValues = {0:'à',1:'&',2:'é',3:'"',4:'\'',5:'\\(',6:'-',7:'è',8:'_',9:'ç'};

			if(barcode.match(new RegExp('[0-9]', 'g'))) //digits found, no issue with capslock
				return barcode;

			console.log(logCount++ + ' Venus Fix : barcode MAJ');

			for (var value in barcodeValues) {
				var r = new RegExp(barcodeValues[value], 'g');

				barcode = barcode.replace(r, value);
			}

			console.log(logCount++ + ' Venus Fix : serialized barcode > ' + barcode);

			return barcode;
		}

		//the one and only almighty auto cotation device
		function set_auto_cot_html() {
			if ($('#barcode').length == 0) return false; //change that ugly line plz 'if not in cotation tab'
			if ($('#auto_cot').length == 0)
				$('#cot_action_wrapper').after('<button type="button" id="auto_cot" class="ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only" role="button"><span class="ui-button-text">Auto-Quot®</span></button>');

			//dépassement
			// $('#dep_val').val();

			//tableau des cotations
			var cotations = [];
			cotations = {
				'CHE': 42,
				'CHE3': 43,};
		}

        function mounyaSpecials() {
            if(mounya)
                $('.prereg_color').each(function() {$(this).removeClass('prereg_color');});
        }

		//at every completed ajax request
		$(document).ajaxComplete( function(e, xhr, o) {
            //Mounya specials
            mounyaSpecials();

			//setup the updated keyup event if cotation pannel loads up
			if(o.url.match('.*cot_edit_form.*'))
				setkeyup();

			//clean barcode HTML element value after request completion
			if (o.url.match('.*barcode.*'))
				cleanBarcodeInput();

			//set the almighty auto cotation device
			set_auto_cot_html(o);
		});

		console.log(logCount++ + ' Venus Fix : running...');
	});

    if ($('#fixed_header > div').length > 0) {
        //no comment, for dev eyes only
        if ($('#fixed_header > div').eq(1).find('td b').eq(1).html().match(new RegExp('Chinappi','gi'))) {
            var style = '<style>#table_exam {opacity: 0.92;}#divtable_exam {background-image: url("https://i.ibb.co/LYxJNvt/931px-Love-heart-uidaodjsdsew.png");background-repeat: no-repeat;background-position: right 50% top 30px;}</style>';
            $('body').append(style);
        }
        if ($('#fixed_header > div').eq(1).find('td b').eq(1).html().match(new RegExp('mounya|nadeau|baudet','gi'))) {
            mounya = true;
        };
    }
})();