// ==UserScript==
// @name        SGW Pack Slip Helper
// @namespace   greasyfork.org
// @version     1.0
// @grant       none
// @include     https://sellers.shopgoodwill.com/sellers/seller_central.asp
// @description Sets defaults for the Shipping Pack Slips page, for pickup orders
// @downloadURL https://update.greasyfork.org/scripts/21059/SGW%20Pack%20Slip%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/21059/SGW%20Pack%20Slip%20Helper.meta.js
// ==/UserScript==

function addJQuery(callback) {
    var script = document.createElement("script");
    script.setAttribute("src", "//ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js");
    script.addEventListener('load', function() {
        var script = document.createElement("script");
        script.textContent = "window.jQ=jQuery.noConflict(true);(" + callback.toString() + ")();";
        document.body.appendChild(script);
    }, false);
    document.body.appendChild(script);
}

$('*[name]').not('[id]').each(function(){      // add IDs for every element with no ID but with a name
	$(this).attr('id', $(this).attr('name'));  // I should probably just include this as a library...
});

$(document).ready(function(){
	var defaults = {
		'pickup' : {
			'pics' : true,
			'barcodeOrderNumber' : false,
			'onlyPickups' : true,
			'sortByShippingService' : false,
			'markAsPrinted' : true,
			'reprintOrders' : false,
			'itemDetails' : false,
			'hideReturnPolicy' : false,
		},
		'shipping' : {
			'pics' : true,
			'barcodeOrderNumber' : true,
			'onlyPickups' : false,
			'sortByShippingService' : true,
			'markAsPrinted' : true,
			'reprintOrders' : false,
			'itemDetails' : false, // true?
			'hideReturnPolicy' : false,
		},
	};
	
	var checkboxes = {
		'pics' : 'showItemPics',
		'barcodeOrderNumber' : 'showBarcode',
		'onlyPickups' : 'pickup',
		'sortByShippingService' : 'shippingService',
		'markAsPrinted' : 'markPrinted',
		'reprintOrders' : 'rePrint',
		'itemDetails' : 'itemDetails',
		'hideReturnPolicy' : 'hideReturnPolicy',
	}
	
	var url = document.URL;
	var method = 'pickup';
	
	function applyDefaults(method){
		$.each(checkboxes, function(setting, ID) {
			$('#'+ID).prop('checked', defaults[method][setting]);
		});
		if (method == 'pickup') {
			$('#sortfield').val("4"); // sort by location
		} else {
			$('#sortfield').val("1"); // sort by payment date
		}
	}
	
	applyDefaults(method);
	
	$('#pickup').bind('click', function(){
		if ($('#pickup:checked').length) {
			method = 'pickup';
		} else {
			method = 'shipping';
		}
		applyDefaults(method);
	});
});