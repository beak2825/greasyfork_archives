// ==UserScript==
// @name        E-Comm Shipping Calculator
// @namespace   https://greasyfork.org
// @include     https://sellers.shopgoodwill.com/sellers/newAuctionItem-catsel.asp*
// @include     https://sellers.shopgoodwill.com/sellers/modifyItem.asp*
// @include     *nfo*enter/shipping.htm*
// @version     3.0.12
// @description Implements a shipping calculator on the current page.
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/23443/E-Comm%20Shipping%20Calculator.user.js
// @updateURL https://update.greasyfork.org/scripts/23443/E-Comm%20Shipping%20Calculator.meta.js
// ==/UserScript==

$ = window.jQuery.noConflict(true);

var url = document.URL;
if (url.indexOf('enter/shipping.html') > 0) {
    $('body').children().remove();
}

$('head').append('<link rel="stylesheet" href="https://ajax.googleapis.com/ajax/libs/jqueryui/1.11.4/themes/smoothness/jquery-ui.css"><script src="https://ajax.googleapis.com/ajax/libs/jqueryui/1.11.4/jquery-ui.min.js"></script>');

var upsDivisor = 225; //end UPS divisor



	$('body').append("<input id='gesMN_upsDivisor' value='"+upsDivisor+"' style='display:none;'>"); // is this necessary?
	$('body').append("<style>.gesMN_calcActive { border: 2px solid #000; } #gesMN_shippingCalculatorContainer td { vertical-align: top; } #gesMN_useThisButton { float: left; border: 1px solid #ccc; background-color: #b4fdb4; padding: 5px; margin-left: 3px; margin-right: 3px; }</style>");
	$('body').append('<div id="gesMN_shippingCalculatorContainer"><p class="gesMNshipCalcHeader"><b>Shipping calculator</b></p><div style="position: relative; left: 10px; max-width: 600px;"></div></div>');
	
	var calcContainer = $('#gesMN_shippingCalculatorContainer > div');
	
	calcContainer.append("<p><b>Dimensions: </b>"
		+ "<input class='gesMN_input gesMN_inputRequired gesMN_dimension' id='gesMN_dim1' size=4> "
		+ "<input class='gesMN_input gesMN_inputRequired gesMN_dimension' id='gesMN_dim2' size=4> "
		+ "<input class='gesMN_input gesMN_inputRequired gesMN_dimension' id='gesMN_dim3' size=4> <br>"
		+ "OR<br>"
		+ "<b>Paste: </b>"
		+ "<input class='gesMN_input' id='gesMN_dimPaste' size=20 tabindex=-1></p>"
	);
	
	calcContainer.append("<p><b>Item's actual weight: </b> <input class='gesMN_input gesMN_inputRequired' id='gesMN_actualWeight' size=4></p>");
	
	
	calcContainer.append("<table id='gesMN_shippingOptionsTable'></table>");
	
	$('#gesMN_shippingOptionsTable').append("<tr><td id='gesMN_shippingSliders'></td><td width=25></td><td id='gesMN_shippingOptionsOther'></td></tr>");
	
	
	$('#gesMN_shippingSliders').append("<p>Add <b id='gesMN_plusInches'>2</b> inches of padding to each side<br>"
		+ "<div id='gesMN_plusInchesSlider' style='width: 50px;'></div>"
		
	);
	
	$('#gesMN_shippingSliders').append("<p>Add <b id='gesMN_plusPounds'>2</b> pounds of packing material<br>"
		+ "<div id='gesMN_plusPoundsSlider' style='width: 50px;'></div>"
		
	);
	
	$('#gesMN_shippingOptionsOther').append("<div class='gesMN_shippingOptionsArt gesMN_shippingOptionsOther' style='display:none;'>Between cardboard? (check with shipping) <input id='gesMN_shipBetweenCardboard' type='checkbox'></div>");
	$('#gesMN_shippingOptionsOther').append("<div class='gesMN_shippingOptionsArt gesMN_shippingOptionsOther' style='display:none;'>Has glass/plexi front? <input id='gesMN_shipGlassFront' type='checkbox' CHECKED></div>");
	$('#gesMN_shippingOptionsOther').append("<div class='gesMN_shippingOptionsGeneral  gesMN_shippingOptionsOverride gesMN_shippingOptionsOther' style='display:;'>Ship in own box? <input id='gesMN_shipOwnBox' type='checkbox'></div>");
	$('#gesMN_shippingOptionsOther').append("<div class='gesMN_shippingOptionsOverride gesMN_shippingOptionsOther' style='display:none;'>Checked with: <input id='gesMN_checkedWith'></div>");
	
	
	$('#gesMN_plusInchesSlider').slider({
		'value' : 2,
		'min' : 0,
		'max' : 3,
		'step' : 1,
		'slide' : function(event, ui){
			$('#gesMN_plusInches').html(ui.value);
		},
		'change' : function(event, ui){
			if (ui.value == 0) {
				if (!confirmNoPadding()) {
					$('#gesMN_plusInchesSlider').slider('value', 1);
					$('#gesMN_plusInches').html(1);
				}
			}
			calculateShipping();
		}
	}).css({
		'width' : '200px',
	});
	
	$('#gesMN_plusPoundsSlider').slider({
		'value' : 2,
		'min' : 0,
		'max' : 10,
		'step' : 1,
		'slide' : function(event, ui){
			$('#gesMN_plusPounds').html(ui.value);
		},
		'change' : function(event, ui){
			if (ui.value == 0) {
				if (!confirmNoPadding()) {
					$('#gesMN_plusPoundsSlider').slider('value', 1);
					$('#gesMN_plusPounds').html(1);
				}
			}
			calculateShipping();
		}
	}).css({
		'width' : '200px',
	});
	
	calcContainer.append("<p><div id='gesMN_calcButtons'></div></p>");
	var calcButtons = $('#gesMN_calcButtons');
	calcButtons.append("<div>"
		+ "<div class='gesMN_calcButton gesMN_UPS gesMN_col6' id='gesMN_calcGeneral' gesMNCalcType='general' title='Use for regular items.\n\nShipped via UPS.'>General</div>"
	+ "</div>");
	calcButtons.append("<div>"
		+ "<div class='gesMN_calcButton gesMN_UPS gesMN_col2' id='gesMN_calcGuitar' gesMNCalcType='guitar' title='Use for guitars, banjos, etc.\n\nShipped via UPS in one of the designated guitar boxes.'>Guitar</div>"
		+ "<div class='gesMN_calcButton gesMN_UPS gesMN_col2' id='gesMN_calcArt' gesMNCalcType='art' title='Use for large, rectangular, narrow objects - prints, paintings, mirrors, etc.\n\nShipped via UPS in one of the designated art boxes.'>Art</div>"
		+ "<div class='gesMN_calcButton gesMN_UPS gesMN_col2' id='gesMN_amorphous' gesMNCalcType='amorphous' title='Use for items that are not one solid object, where you could conceivably reconfigure their shape - items that are like a box of sand. LEGO grab boxes, lots of figurines, yarn, etc.\n\nShipped via UPS.'>Flexible-shape</div>"
	+ "</div>");
	calcButtons.append("<div>"
		+ "<div class='gesMN_calcButton gesMN_UPS gesMN_col2' id='gesMN_calcClothing' gesMNCalcType='clothing' title='Please fold and measure that way.\n\nShipped via the post office if small/light enough, otherwise through UPS.'>Clothing</div>"
		+ "<div class='gesMN_calcButton gesMN_USPS gesMN_col2' id='gesMN_calcSmallLight' gesMNCalcType='smallLight' title='Shipped via UPS if small/light enough.'>Small and light</div>"
		+ "<div class='gesMN_calcButton gesMN_USPS gesMN_col2' id='gesMN_calcMedia' gesMNCalcType='media' title='Includes: Music, TV shows, movies, audio of all kinds, books.\n\nDoes not include: Comic books, computer software, video games, newspapers, magazines.\n\nShipped at a flat rate via the post office.'>Media</div>"
	+ "</div>");
	calcButtons.append("<div>"
		+ "<div class='gesMN_calcButton gesMN_USPS gesMN_col3' id='gesMN_calcSmallFlat' gesMNCalcType='smallFlat' title='Shipped via the post office.\n\nPLEASE BE MINDFUL OF PACKING REQUIREMENTS!'>Small flat rate</div>"
		+ "<div class='gesMN_calcButton gesMN_USPS gesMN_col3' id='gesMN_calcMedFlat' gesMNCalcType='medFlat' title='Shipped via the post office.\n\nPLEASE BE MINDFUL OF PACKING REQUIREMENTS!'>Medium flat rate</div>"
	+ "</div>");
	calcButtons.append("<div>"
		+ "<div class='gesMN_calcButton  gesMN_col3' id='gesMN_pickupOnly' gesMNCalcType='pickupOnly' colspan=2 title='Only items that we cannot or should not ship!'>Pickup only</div>"
		+ "<div class='gesMN_calcButton  gesMN_col3' id='gesMN_calcOverride' gesMNCalcType='override' colspan=2 title='For items that the shipping calculator believes are too big, but which we can actually ship.\n\nIf the shipping department has given you dimensions of the box the item will be shipped in, enter them and check &quot;Ship in own box&quot;.'>Override</div>"
		
	+ "</div>");
	calcButtons.append("<tr>"
	+ "</tr>");
	$('.gesMN_col2').css({
		'width' : '140px',
	});
	$('.gesMN_col3').css({
		'width' : '211px',
	});
	$('.gesMN_col6').attr('colspan', '6').css({
		'width' : '424px',
	});





	$('.gesMN_calcButton').each(function(){
		$(this).wrapInner('<div class="ges_MNcalcButtonInner"></div>');
	}).css({
		'display' : 'inline-block',
		'padding' : '1px',
	});
	$('.ges_MNcalcButtonInner').css({
		'margin' : '2px',
		'text-align' : 'center',
		'background-color' : '#eee',
		'border' : '1px solid #ccc',
		'padding' : '4px',
	});
	
	$('.gesMN_UPS > .ges_MNcalcButtonInner').css({
		'background-color' : '#efeae0',
	});
	$('.gesMN_USPS > .ges_MNcalcButtonInner').css({
		'background-color' : '#e6f2ff',
	});
	$('#gesMN_calcSmallFlat, #gesMN_calcMedFlat').css({
//		'background-color' : '#ffe6e6',
	})
	$('#gesMN_calcOverride > .ges_MNcalcButtonInner').css({
		'background-color' : '#ffe6e6',
	})
	$('#gesMN_calcGeneral > .ges_MNcalcButtonInner').css({
		'height' : '40px',
		'line-height' : '40px',
		'vertical-align' : 'middle',
	})
	
	calcContainer.append("<p class='gesMN_output' id='gesMN_shippingWeightContainer' style='display:none;'>Shipping weight: <font id='gesMN_shippingWeight'>18</font> lbs.</p>");
	calcContainer.append("<p class='gesMN_output gesMN_shipWarning' id='gesMN_pickupPaddingNoticeContainer' style='display:none;'>The shipping calculator thinks that we don't have a box large enough to ship this item with the padding that you have indicated it needs. If this is true, it should be <font style='color: #f00'>pickup only</font>. However, <b>it might fit into a box with less padding than you have selected</b>; alternatively, <b>if it is not one solid object, you may be able to ship it as a flexible-shape item</b>. Please check with shipping or a manager if if you are uncertain whether either of these solutions are appropriate.</p>");
	calcContainer.append("<p class='gesMN_output gesMN_shipWarning' id='gesMN_pickupWarningContainer' style='display:none;'>The shipping calculator thinks that we don't have a box large enough to ship this item. If this is true, it should be <font style='color: #f00'>pickup only</font>. However, if it is not one solid object, you may be able to ship it as a flexible-shape item. <b>Please check with shipping or a manager if you believe that this is an error!</b></p>");
	calcContainer.append("<p class='gesMN_output gesMN_shipWarning' id='gesMN_boxWarningContainer' style='display:none;'>This item is too large to fit in the box you have selected with the amount of padding you have indicated it needs.</p>");
	calcContainer.append("<p class='gesMN_output gesMN_shipWarning' id='gesMN_boxPaddingContainer' style='display:none;'>This item is too large to fit in the box you have selected with the padding that you have indicated it needs. <b>However, it might fit into a box with less padding than you have selected.</b> Please check with shipping or a manager if if you are uncertain whether that is an appropriate solution.</p>");
	calcContainer.append("<p class='gesMN_output' id='gesMN_shippingChargeContainer' style='display:none;'>Shipping charge: $<font id='gesMN_shippingCharge'>18</font></p>");
	calcContainer.append("<p id='gesMN_useButtonContainer' style='display:none;'><span class='gesMN_button' id='gesMN_useThisButton'>Apply this shipping</span><br></p>")
	
	calcContainer.append("<br><p id='gesMN_debugContainer' style='display:none;'>Debug string: <textarea id='gesMN_debugString'>{{---}}</textarea><br>Button clicked: <input id='gesMN_buttonClicked'><br>Current shipping method: <input id='gesMN_currentShippingMethod'></p>");
	calcContainer.append("<p class='gesMN_currentShippingMethod' style='display:none;'></p>");
	
	
	
	
	
	$('#gesMN_shippingWeight, #gesMN_shippingCharge').css({
		'font-size' : '22px',
	});

Array.prototype.forEach.call(document.querySelectorAll('.gesMN_calcButton'), function(el) {
    el.addEventListener('click', function(){
//        $('.gesMN_CalcButton').removeClass('gesMN_calcActive');
        Array.prototype.forEach.call(document.querySelectorAll('.gesMN_calcActive'), function(el) {
            el.classList.remove('gesMN_calcActive');
        });
		$(this).addClass('gesMN_calcActive');
		var myCalcType = $(this).attr('gesMNCalcType');
		$('#gesMN_currentShippingMethod, #gesMN_buttonClicked').val(myCalcType);
		$('.gesMN_shippingOptionsOther').hide();
		$('.gesMN_shippingOptions'+capitalizeFirstLetter(myCalcType)).show();
		$('#gesMN_useButtonContainer').hide();
		calculateShipping(); // this is a separate function because the sliders should trigger it too.
    });
});
	
	$('.gesMN_shippingOptionsOther input').keyup(function(){
		$('#gesMN_useButtonContainer').hide();
		calculateShipping();
	});
  $('.gesMN_shippingOptionsOther input').blur(function(){
		$('#gesMN_useButtonContainer').hide();
		calculateShipping();
	});
  $('.gesMN_shippingOptionsOther input').change(function(){
		$('#gesMN_useButtonContainer').hide();
		calculateShipping();
	});
	
	$('.gesMN_input').keyup(function(e){
		$('#gesMN_currentShippingMethod').val($('#gesMN_buttonClicked').val());
		if (getCurrentShippingMethod() == 'media' || $('.gesMN_inputRequired').filter(function(){
			return $(this).val().length > 0;
		}).length == 4){
			$('#gesMN_useButtonContainer').hide();
			calculateShipping();
		};
		
		if (e.keyCode == 13) {
			if ($(this).is('.gesMN_dimension')) {
				var tabTargets = {
					'gesMN_dim1' : $('#gesMN_dim2'),
					'gesMN_dim2' : $('#gesMN_dim3'),
					'gesMN_dim3' : $('#gesMN_actualWeight'),
				};
				tabTargets[$(this).attr('id')].focus();
			} else if ($(this).attr('id') == 'gesMN_actualWeight') {
				if ($('.gesMN_calcActive').length > 0) {
					$('.gesMN_calcActive').trigger('click');
				} else {
					$('#gesMN_calcGeneral').trigger('click');
				}
			}
		}
		
	});
	
	$('#gesMN_dimPaste').blur(function(){
		parsePaste();
	});


function setShippingMethod(method) {
	$('#gesMN_currentShippingMethod').val(method);
	return true;
}

function getCurrentShippingMethod() {
	return $('#gesMN_currentShippingMethod').val();
}

function calculateShipping() {
	var type = $('#gesMN_currentShippingMethod').val();
	$('.gesMN_shipWarning').hide();
	if (type.length < 1) {
		return;
	}
//	$('.gesMN_output').hide();
	var dimensions,
        weight,
        shippingWeight,
        myBoxes,
        charge;
	if (type == 'general') {
		if ($('#gesMN_shipOwnBox:checked').length > 0) {
			dimensions = getDimensions({'skipPadding' : true});
		} else {
			dimensions = getDimensions();
		}

		weight = getWeight();
		if (dimensions === false || weight === false) {
			finalizeShipping(false);
			return false;
		}

		if (!fitsInABox(dimensions)) {
			if ($('#gesMN_pickupPaddingNoticeContainer:visible').length < 1) {
				$('#gesMN_pickupWarningContainer').show();
			}
			$('#gesMN_useButtonContainer').hide();
			finalizeShipping('0', 'pickup');
			return false;
		} else {
			shippingWeight = calculateShippingWeight(dimensions, weight);
			finalizeShipping(shippingWeight, 'UPS');
		}
		return true;
	} else if (type == 'guitar' || type == 'art') {
		if (type == 'guitar') {
			myBoxes = guitarBoxes;
		} else {
			myBoxes = artBoxes;
		}

		dimensions = getDimensions({'skipPadding' : true});
		weight = getWeight();

		if (type == 'art') {
			if ($('#gesMN_shipBetweenCardboard:checked').length > 0) {
				if (dimensions[0] > 1) {
					alert('Too thick to ship between cardboard!');
					$('#gesMN_shipBetweenCardboard').prop('checked', false);
				} else {
					shippingWeight = calculateShippingWeight(dimensions, weight);
					finalizeShipping(shippingWeight, 'UPS');
					$('#gesMN_shipGlassFront').prop('checked', false);
					return true;
				}
			}
			if ($('#gesMN_shipGlassFront:checked').length > 0) {
				dimensions[0] += 3;
			} else {
				dimensions[0] += 2;
			}
			dimensions[1] += 2;
			dimensions[2] += 2;

		}

		if (dimensions === false || weight === false) {
			finalizeShipping(false);
			return false;
		}

		var fitsInASpecialBox = false;
		var dimWeight;

		if (fitsInThisBox(dimensions, myBoxes['default'])) {
			setShippingMethod('general');
			return calculateShipping();
		}
		$.each(myBoxes['boxes'], function(boxIndex, boxObject) {
			if (fitsInThisBox(dimensions, boxObject['interior'])) {
				if (!fitsInASpecialBox) {
					fitsInASpecialBox = true;
					shippingWeight = calculateShippingWeight(boxObject['exterior'], weight);
				}
			}
		});
		if (!fitsInASpecialBox) {
// No! If a guitar or print is too big to go in a print box, we should not assume it will be reasonable to try it as a general item.
			$('#gesMN_pickupWarningContainer').show();
			finalizeShipping(false);
			return false;
		} else {
			finalizeShipping(shippingWeight, 'UPS');
			return true;
		}
	} else if (type == 'amorphous') {
// I'm going to build in a slight markup to the volume for amorphous/box-of-sand items, on the basis that they can probably be finagled into SOMETHING, but it might be with more empty space than the ideal, smallest-volume configuration, and they may go in multiple boxes...

// First, though, this type of calculation should check to see if it can go as a general item. If it can, the markup won't be added.
		dimensions = getDimensions();
		if (fitsInABox(dimensions)) {
			setShippingMethod('general');
			return calculateShipping();
		}
		setShippingMethod('override');
		return calculateShipping();
	} else if (type == 'clothing') {
		dimensions = getDimensions({'skipPadding':true});
		weight = getWeight({'skipPackingMaterial':true});
		if (dimensions === false || weight === false) {
			finalizeShipping(false);
			return false;
		}
		shippingWeight = calculateShippingWeight(dimensions, weight);
		finalizeShipping(shippingWeight, 'UPS');
		return true;
	} else if (type == 'override') {
		dimensions = getDimensions();
		weight = getWeight();
		if (dimensions === false || weight === false) {
			finalizeShipping(false);
			return false;
		}
		shippingWeight = calculateShippingWeight(dimensions, weight);
		finalizeShipping(shippingWeight, 'UPS');
		return true;
	} else if (type == 'smallFlat') {
		dimensions = getDimensions();
		weight = getWeight();
		if (dimensions === false || weight === false) {
			finalizeShipping(false);
			return false;
		}
		if (!fitsInThisBox(dimensions, flatRates['Small flat rate']['dimensions'])) {
			if (!fitsInThisBox([$('#gesMN_dim1').val(),$('#gesMN_dim2').val(),$('#gesMN_dim3').val()], flatRates['Small flat rate']['dimensions'])) {
				$('#gesMN_boxWarningContainer').show();
			} else {
				$('#gesMN_boxPaddingContainer').show();
			}
			finalizeShipping(false);
			return false;
		} else {
			finalizeShipping(flatRates['Small flat rate']['price'], 'USPS');
			return true;
		}
	} else if (type == 'medFlat') {
		dimensions = getDimensions();
		weight = getWeight();
		if (dimensions === false || weight === false) {
			finalizeShipping(false);
			return false;
		}
		if (!fitsInThisBox(dimensions, flatRates['Medium flat rate 1']['dimensions']) && !fitsInThisBox(dimensions, flatRates['Medium flat rate 2']['dimensions'])) {
			var itemDimensionsAsEntered = [$('#gesMN_dim1').val(),$('#gesMN_dim2').val(),$('#gesMN_dim3').val()];
			if (!fitsInThisBox(itemDimensionsAsEntered, flatRates['Medium flat rate 1']['dimensions']) && !fitsInThisBox(itemDimensionsAsEntered, flatRates['Medium flat rate 2']['dimensions'])) {
				$('#gesMN_boxWarningContainer').show();
			} else {
				$('#gesMN_boxPaddingContainer').show();
			}
			finalizeShipping(false);
			return false;
		} else {
			finalizeShipping(flatRates['Medium flat rate 1']['price'], 'USPS');
			return true;
		}
	} else if (type == 'smallLight') {
//		dimensions = getDimensions();
		weight = getWeight({'skipPackingMaterial' : true});
		if (weight === false) {
			finalizeShipping(false);
			return false;
		}
		if (weight > 2) {
			setShippingMethod('general');
			return calculateShipping();
		} else if (weight <= 1) {
			charge = 6.80;
		} else if (weight <= 2) {
			charge = 8.99;
		}
		finalizeShipping(charge, 'USPS');
		return true;
	} else if (type == 'media') {
		weight = getWeight({'skipPackingMaterial' : true});
		charge = getMediaRate(weight);
		finalizeShipping(charge, 'USPS');
	} else if (type == 'pickupOnly') {
		weight = getWeight({'skipPackingMaterial' : true});
		finalizeShipping(0, 'pickup');
	} else {
		console.log(type+'???');
	}
}

function calculateShippingWeight(dimensions, weight) {
	if (typeof dimensions == 'undefined' || Array.isArray(dimensions) !== true || dimensions.length != 3) {
		alert('Dimension error!');
		return false;
	} else if (typeof weight == 'undefined' || weight.length < 1) {
		alert('Weight error!');
		return false;
	}
// We're adding .25 to all the dimensions ONLY for general, override, and box-of-sand items IF "own box" is not checked - these need to account for the width of the box itself
	var addBoxWidthToThese = ['general', 'override', 'amorphous', 'smallLight', 'clothing'];
	if (addBoxWidthToThese.indexOf($('#gesMN_buttonClicked').val()) >= 0 && $('#gesMN_shipOwnBox:checked').length < 1) {
		$.each(dimensions, function(dimIndex, dimValue) {
			dimensions[dimIndex] += .25;
		});
	}
	var volume = (dimensions[0]*dimensions[1]*dimensions[2]);
// We're also adding a slight markup to the volume for amorphous/box-of-sand items, on the basis that they can probably be finagled into SOMETHING, but it might be with more empty space than the ideal, smallest-volume configuration, and they may go in multiple boxes...
	if ($('#gesMN_buttonClicked').val() == 'amorphous') {
		volume *= 1.1; // + 10%
	}
	var dimWeight = volume/upsDivisor;
	return Math.ceil(Math.max(dimWeight, weight));
}

var generalBoxes = [{
		"interior": [
			8,
			8.75,
			11.25
		],
		"name": "11.25x8.75x8",
		"cut": "1"
	},
	{
		"interior": [
			9,
			12,
			12
		],
		"name": "12x12x9",
		"cut": "0"
	},
	{
		"interior": [
			5,
			18,
			24
		],
		"name": "24x5x18",
		"cut": "1"
	},
	{
		"interior": [
			10,
			14,
			18
		],
		"name": "18x14x10",
		"cut": "0"
	},
	{
		"interior": [
			5,
			24,
			24
		],
		"name": "24x5x24",
		"cut": "2"
	},
	{
		"interior": [
			8,
			8,
			60
		],
		"name": "8x8x48",
		"cut": "2"
	},
	{
		"interior": [
			5,
			24,
			30
		],
		"name": "30x5x24",
		"cut": "1"
	},
	{
		"interior": [
			14,
			16,
			20
		],
		"name": "20x16x14",
		"cut": "0"
	},
	{
		"interior": [
			6,
			18,
			48
		],
		"name": "18x6x45",
		"cut": "2"
	},
	{
		"interior": [
			14,
			18,
			20
		],
		"name": "20x14x18",
		"cut": "1"
	},
	{
		"interior": [
			12,
			12,
			36
		],
		"name": "36x12x12",
		"cut": "1"
	},
	{
		"interior": [
			5,
			30,
			36
		],
		"name": "36x5x30",
		"cut": "1"
	},
	{
		"interior": [
			12,
			12,
			60
		],
		"name": "12x12x40",
		"cut": "2"
	},
	{
		"interior": [
			8,
			20,
			50
		],
		"name": "20x8x50",
		"cut": "2"
	},
	{
		"interior": [
			5.5,
			36,
			40
		],
		"name": "36x5.5x40",
		"cut": "2"
	},
	{
		"interior": [
			10,
			12,
			22
		],
		"name": "22x12x10",
		"cut": "0"
	}
];

var mediaRates = {
	3 : 3.99, // when itemWeight <= thisWeight, thisRate is charged
	6 : 5.99,
	10 : 7.99,
	13 : 8.99,
	15 : 9.99,
	19 : 11.99,
	25 : 15.99,
	27 : 16.99,
	31 : 18.99,
	33 : 19.99,
	35 : 20.99,
	37 : 21.99,
	39 : 22.99,
	41 : 23.99,
	43 : 24.99,
	45 : 25.99,
	47 : 26.99,
	49 : 27.99,
	51 : 28.99,
	53 : 29.99,
	55 : 30.99,
	57 : 31.99,
	59 : 32.99,
	61 : 33.99,
	63 : 34.99,
	65 : 35.99,
	67 : 36.99,
	68 : 37.99,
	69 : 38.99,
	70 : 38.99,
}

function getMediaRate(weight) {
	var myCharge = 0
	var maxBoxWeight = 50;
	if (weight <= maxBoxWeight) {
		$.each(mediaRates, function(thisWeight, thisCharge) {
			if (weight <= thisWeight && myCharge < 1) {
				myCharge = thisCharge;
			}
		});
	} else {
		var numBoxes = 1;
		while (Math.ceil(weight/numBoxes) > maxBoxWeight) {
			numBoxes++;
		}
		myCharge = getMediaRate(Math.ceil(weight/numBoxes))*numBoxes;
		myCharge *= 1+((numBoxes-1) * .05);
		myCharge = Math.ceil(myCharge)-.01; // this represents a change. It's a little cheaper above 50, up to a point. It gets more expensive later on - by 210 pounds, it's about $10 (<10%) more expensive. But that's assuming the stuff is going to be shipped in 5 boxes.
	}
	return myCharge;
}

var flatRates = {
	'Small flat rate' : {
		'price' : 6.80,
		'tooltip' : 'Interior dimensions: 5x8.5x1.5 - NOTE: remember room for packing material!',
		'dimensions' : [
			5, 
			8.5, 
			1.5,
		],
	},
	'Medium flat rate 1' : {
		'price' : 13.00,
		'tooltip' : 'Interior dimensions: 11x8.5x5.5 - NOTE: remember room for packing material!',
		'dimensions' : [
			1,
			8.5,
			5.5,
		],
	},
	'Medium flat rate 2' : {
		'price' : 13.00,
		'tooltip' : 'Interior dimensions: 12x13.5x3.5 - NOTE: remember room for packing material!',
		'dimensions' : [
			12,
			13.5,
			3.5,
		],
	},
}

var guitarBoxes = {
	"default": [
		7,
		16,
		35
	],
	"boxes": [{
			"interior": [
				6,
				17,
				42
			],
			"exterior": [
				7,
				19,
				45
			],
			"name": "Small guitar box",
			"corresponds": "Sm guitar box"
		},
		{
			"interior": [
				8,
				20,
				48
			],
			"exterior": [
				9,
				21,
				51
			],
			"name": "Large guitar box",
			"corresponds": "Lg guitar box"
		}
	]
};

var artBoxes = {
	"default" : [
		5,
		17,
		19
	],
	"boxes" : [
		{
		"interior" : [
				4,
				24,
				24
			],
			"exterior" : [
				5,
				25,
				25
			],
			"name" : "Small print box",
      "corresponds" : "Sm print box"
		},
		{
		"interior" : [
				5,
				24,
				30
			],
			"exterior" : [
				6,
				25,
				31
			],
			"name" : "Medium print box",
      "corresponds" : "Med print box"
		},
		{
			"interior" : [
				5,
				30,
				36
			],
			"exterior" : [
				6,
				31,
				37
			],
			"name" : "Large print box",
      "corresponds" : "Lg print box"
		}
	]
};

function confirmNoPadding() {
	return confirm("Are you SURE this item doesn't need ANY packing material?");
}

function getDimensions(options) {
	forceNumeric([$('#gesMN_dim1'),$('#gesMN_dim2'),$('#gesMN_dim3')]);
	var valid = true;
	var dimensions = [];
	if (typeof options != 'undefined' && Object.keys(options).length > 0 && typeof options['skipPadding'] != 'undefined' && options['skipPadding'] === true) {
		var padding = 0;
	} else {
		var padding = (2 * castToFloat($('#gesMN_plusInches').html()));
	}
	
	$('.gesMN_dimension').each(function(){
		if ($(this).val().length < 1) {
			$(this).css('background-color', '#ffe6e6');
			valid = false;
		} else {
			$(this).css('background-color', '');
			dimensions.push(castToFloat($(this).val()) + padding);
		}
	});
	if (!valid) {
		alert('Please enter the missing dimension(s).');
		return false;
	} else {
		dimensions.sort(function(a, b) {
			return a - b;
		});
		return dimensions;
	}
	
}

function getWeight(options) {
	if (typeof options != 'undefined' && Object.keys(options).length > 0 && typeof options['skipPackingMaterial'] != 'undefined' && options['skipPackingMaterial'] === true) {
		var packingMaterial = 0;
	} else {
		var packingMaterial = castToFloat($('#gesMN_plusPounds').html());
	}
	forceNumeric($('#gesMN_actualWeight'));
	var actualWeight = $('#gesMN_actualWeight').val();
	while (actualWeight.length < 1) {
		actualWeight = makeNumeric(prompt("Please enter the item's actual weight."));
	}
	$('#gesMN_actualWeight').val(actualWeight);
	actualWeight = castToFloat(actualWeight)+packingMaterial;
	return actualWeight;
}

function makeNumeric(value) {
	if (value.length < 1) {
		return '';
	} else {
//		return value.replace(/[^\d\.]/g, '').replace(/\.$/g, '');
		return value.replace(/[^\d\.]/g, '');
	}
}

function forceNumeric(input) {
	if (typeof input == 'undefined' || input.length < 1) {
		return false;
	} else {
		if (Array.isArray(input)) {
			$.each(input, function(index, item) {
				forceNumeric(item);
			});
		} else {
			input.val(makeNumeric(input.val()));
		}
		return true;
	}
}

function castToFloat(value) {
	return parseFloat(parseFloat(value).toFixed(2)); // This is redundant because sometimes toFixed()ing a parseFloat()ed input value returns, bizarrely, a string. You parseFloat() it AGAIN, and get a number out...
}

function fitsInThisBox(itemDimensions, boxDimensions) {
	boxDimensions.sort(function(a, b) {
		return a - b;
	});
	var validity = true;
	$.each(itemDimensions, function(dimIndex, dimValue) {
		if(dimValue > boxDimensions[dimIndex]) {
			validity = false;
		}
	});
	return validity;
}

function fitsInABox(itemDimensions) {
	var validity = false;
	$.each(generalBoxes, function(boxIndex, boxObject) {
		if (fitsInThisBox(itemDimensions, boxObject['interior']) && validity === false) {
			validity = true;
		}
	});
	if (validity === true) {
		return true;
	}
	// If that doesn't work, next we check if the item would fit without any packing material at all.

	$.each(itemDimensions, function(dimIndex, dimValue) {
		itemDimensions[dimIndex] -= castToFloat($('#gesMN_plusInches').html());
	});
	
	$.each(generalBoxes, function(boxIndex, boxObject) {
		if (fitsInThisBox(itemDimensions, boxObject['interior'])) {
			$('#gesMN_pickupPaddingNoticeContainer').show();
		}
	});
	
	return false;
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function finalizeShipping(amount, method) {
	var previousShipping = $('.gesMN_output:visible').html();
	$('.gesMN_output').not('.gesMN_shipWarning').hide();
	if (method == false) {
		
	} else if (method == 'UPS') {
		$('#gesMN_shippingWeightContainer').show();
		$('#gesMN_shippingWeight').html(amount);
	} else if (method == 'USPS') {
		$('#gesMN_shippingChargeContainer').show();
		$('#gesMN_shippingCharge').html(amount);
	} else if (method == 'pickup') {
		$('#gesMN_currentShippingMethod').val('pickup');
	}
	if ($('#gesMN_boxWarningContainer:visible').length < 1 && $('#gesMN_boxPaddingContainer:visible').length < 1) {
	  // We don't show the "Apply this shipping" button in cases where the user is trying to put something in a flat-rate box that is too big for it. They need to switch to a different shipping option by themselves.
		if ($('.gesMN_output:visible').length > 0 || method == 'pickup') {
			$('#gesMN_useButtonContainer').show(); 
		}
	}

	if ($('#gesMN_pickupWarningContainer:visible').length > 0 || $('#gesMN_pickupPaddingNoticeContainer:visible').length > 0) {
		if ($('#gesMN_useThisButton').text().indexOf('pickup') < 0) {
			$('#gesMN_useThisButton').text($('#gesMN_useThisButton').text()+ ' (pickup)');
			$('#gesMN_useThisButton').css({'background-color' : '#eee'});
		}
	} else {
		$('#gesMN_useThisButton').text($('#gesMN_useThisButton').text().replace(' (pickup)', ''));
		$('#gesMN_useThisButton').css({'background-color' : '#b4fdb4'});
		
	}
	var newShipping = $('.gesMN_output:visible').html();
	if (previousShipping != newShipping && $('#gesMN_checkMark:visible').length > 0) {
		$('#gesMN_checkMark').html('&#10008;').css('color', '#f00');
	}
	buildTag();
	return true;
}

function parsePaste() {
	var re = new RegExp(/[\d.]+/g);
  if (pasteDims = $('#gesMN_dimPaste').val().match(re)) {
		$.each(pasteDims, function(dimIndex, dimValue){
			$('#gesMN_dim'+(dimIndex+1)).val(dimValue);
		});
		$('#gesMN_dimPaste').val('');
		forceNumeric([$('#gesMN_dim1'),$('#gesMN_dim2'),$('#gesMN_dim3')]);
	}
}

function buildTag() {
	var myButton = $('#gesMN_buttonClicked').val();
	var myMethod = $('#gesMN_currentShippingMethod').val();
	var buttons = {
		'general' : 'gen',
		'guitar' : 'guit',
		'art' : 'art',
		'amorphous' : 'flex',
		'clothing' : 'clth',
		'smallLight' : 's&l',
		'media' : 'media',
		'smallFlat' : 'smFlt',
		'medFlat' : 'medFlt',
		'pickupOnly' : 'pickup',
		'override' : 'OR',
	}
	var myDims = $('#gesMN_dim1').val() + 'x' + $('#gesMN_dim2').val() + 'x' + $('#gesMN_dim3').val();
	var myWeight = $('#gesMN_actualWeight').val();
	var myPlusInches = $('#gesMN_plusInches').html();
	var myPlusPounds = $('#gesMN_plusPounds').html();
	var myOwnBox = $('#gesMN_shipOwnBox:visible:checked').length > 0;
	var myCardboard = $('#gesMN_shipBetweenCardboard:visible:checked').length > 0;
	var myGlass = !myCardboard && $('#gesMN_shipGlassFront:visible').length > 0 && !($('#gesMN_shipGlassFront:visible:checked').length > 0);
	var myCheckedWith = $('#gesMN_checkedWith').val();
	
	var myTag = '{{'
		+ buttons[myButton]
	if (myButton == 'pickupOnly') {
		myTag += '}}';
		$('#gesMN_debugString').val(myTag);
		return true;
	}
	myTag += ':['
		+ myWeight
		+ ']#'
	if (myButton != 'media') {
		myTag += ' (+'
			+ myPlusPounds
			+ ')';
	}
	
	if (!(myButton == 's&l' && myDims.length == 3) && !(myButton == 'media')) {
		myTag += '['
			+ myDims
			+ ']"(+'
			+ myPlusInches
			+ ')';
	}
	if (myOwnBox || myGlass || myCardboard) {
		myTag += ';';
		if (myOwnBox) {
			myTag += 'ownBox';
		} else if (myGlass) {
			myTag += 'noFrontGlass'
		} else {
			myTag += 'btwCbd'
		}
	}
	myTag += '=>';
	var uspsMethods = ['smallLight', 'media', 'smallFlat', 'medFlat'];
	if (myMethod == 'pickup') {
		myTag+= 'pickup';
	} else if(uspsMethods.indexOf(myMethod) >= 0) {
		myTag+= '$'+$('#gesMN_shippingCharge').html();
	} else {
		myTag+= $('#gesMN_shippingWeight').html()+'#';
	}
	if (myButton == 'override') {
		myTag+= '||check:';
		if (myCheckedWith.length > 0) {
			myTag += myCheckedWith;
		} else {
			myTag += '---';
		}
	}
	myTag += '}}';
	// a tag reader can look for => to discern format
	$('#gesMN_debugString').val(myTag);
	return true;
}

// End