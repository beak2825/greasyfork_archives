// ==UserScript==
// @name        E-Comm Shipping Calculator
// @namespace   https://greasyfork.org
// @include     https://sellers.shopgoodwill.com/sellers/newAuctionItem-catsel.asp*
// @include     https://sellers.shopgoodwill.com/sellers/modifyItem.asp*
// @include     *info*center/shipping.html*
// @version     2.1.5.4
// @description Implements a shipping calculator on the current page.
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/19179/E-Comm%20Shipping%20Calculator.user.js
// @updateURL https://update.greasyfork.org/scripts/19179/E-Comm%20Shipping%20Calculator.meta.js
// ==/UserScript==

// These are editable! Format is as follows:
//
// "Button name" : price,
//
// Important notes:
// 1. Name MUST be in quotation marks.
// 2. A comma MUST follow the price, 

var url = document.URL;
if (url.indexOf('enter/shipping.html') > 0) {
    $('body').children().remove();
}



$('head').append('<link rel="stylesheet" href="https://ajax.googleapis.com/ajax/libs/jqueryui/1.11.4/themes/smoothness/jquery-ui.css"><script src="https://ajax.googleapis.com/ajax/libs/jqueryui/1.11.4/jquery-ui.min.js"></script>');
$('body').append("<div id='dummyButton' class='fakeButton'></div>");
var minimumWeight = 3; // This is the minimum weight we'll charge.
upsDivisor = 225;

var shippingMethods = {
    "Sm flat rate box" : {
        "price" : 6.80,
        "note" : "Small flat rate box",
        "method" : "USPS",
        "tooltip" : "Interior dimensions: 5x8.5x1.5 - NOTE: remember room for packing material!",
    },
    "Bubble mailer" : {
        "price" : 6.80,
        "note" : "Bubble mailer",
        "tooltip" : "Bubble mailers are padded, but consider if your item needs extra padding as well.",
        "method" : "USPS"
    },
    "Med flat rate box" : {
        "price" : 13.00,
        "note" : "Medium flat rate box",
        "method" : "USPS",
        "tooltip" : "Interior dimensions: 12x13.5x3.5 OR 11x8.5x5.5 - NOTE: remember room for packing material!"
    },
    "Media" : {
        "note" : "Media",
        "tooltip" : "Any: book; movie (VHS, DVD, Blu-Ray, laserdisc, film reel); music (record, 8-track, tape, CD) - regardless of size or weight. NOT comic books, magazines, newspapers, or video games.",
        "method" : "USPS"
    },
/*    "Lt clothing" : {
        "price" : 4.99,
        "note" : "Poly-mailer",
        "tooltip" : "Poly-mailer. Use if a clothing item is light - like a t-shirt.",
        "method" : "USPS"
    },
    "Med clothing" : {
        "price" : 6.99,
        "note" : "Poly-mailer",
        "tooltip" : "Poly-mailer. Use if a clothing item is a bit heavier - like a pair of jeans.",
        "method" : "USPS"
    },*/
    "Clothing" : {
        "note" : "Clothing",
        "tooltip" : "Clothing, excluding e.g. largeish coats",
    },
    "Sm guitar box" : {
        "note" : "6x18x44 guitar box",
        "tooltip" : "Interior dimensions: 6x18x44; shipping weight: " + Math.ceil((7*19*45)/upsDivisor),
        "weight" : Math.ceil((7*19*45)/upsDivisor),
        "method" : "UPS"
    },
    "Lg guitar box" : {
        "note" : "8x20x50 guitar box",
        "tooltip" : "Interior dimensions: 8x20x50; shipping weight: " + Math.ceil((9*21*51)/upsDivisor),
        "weight" : Math.ceil((9*21*51)/upsDivisor),
        "method" : "UPS"
    },
    "Sm print box" : {
        "note" : "5x24x30 print box",
        "tooltip" : "Interior dimensions: 5x24x30; shipping weight: " + Math.ceil((6*24*31)/upsDivisor),
        "weight" : Math.ceil((6*24*31)/upsDivisor),
        "method" : "UPS"
    },
    "Lg print box" : {
        "note" : "5x30x36 print box",
        "tooltip" : "Interior dimensions: 5x30x36; shipping weight: " + Math.ceil((6*31*37)/upsDivisor),
        "weight" : Math.ceil((6*31*37)/upsDivisor),
        "method" : "UPS"
    },
/*    "Huge print box" : {
        "note" : "5.5x36x48 print box",
        "tooltip" : "Interior dimensions: 5.5x36x48; shipping weight: " + Math.ceil((7*37*49)/upsDivisor),
        "weight" : Math.ceil((7*37*49)/upsDivisor),
        "method" : "UPS"
    },*/
/*    "8x8 long box" : {
        "note" : "8x8 long box",
        "tooltip" : "Interior dimensions: 8x8x?",
        "method" : "UPS"
    },
    "12x12 long box" : {
        "note" : "12x12 long box",
        "tooltip" : "Interior dimensions: 8x8x?",
        "method" : "UPS"
    },*/
    "Sm coat box" : {
        "note" : "9x12x12 coat box",
        "tooltip" : "Interior dimensions: 9x12x12; shipping weight: " + Math.ceil((10*13*13)/upsDivisor),
        "weight" : Math.ceil((10*13*13)/upsDivisor),
        "method" : "UPS"
    },
    "Med coat box" : {
        "note" : "6x14x18 coat box",
        "tooltip" : "Interior dimensions: 6x14x18; shipping weight: " + Math.ceil((7*15*19)/upsDivisor),
        "weight" : Math.ceil((7*15*19)/upsDivisor),
        "method" : "UPS"
    },
    "Very lg coat box" : {
        "note" : "10x14x18 coat box",
        "tooltip" : "Interior dimensions: 10x14x18; shipping weight: " + Math.ceil((11*15*19)/upsDivisor),
        "weight" : Math.ceil((11*15*19)/upsDivisor),
        "method" : "UPS"
    },
    "Standard sm UPS box" : {
       "note" : "6.25x7.25x10.25 small box",
       "tooltip" : "Interior dimensions: 6.25x7.25x10.25; shipping weight: " + Math.ceil((7*8*11)/upsDivisor),
       "weight" : Math.ceil((7*8*11)/upsDivisor),
       "method" : "UPS",
    },
    "Small&light" : {
       "price" : 2.99,
       "note" : "Game/cards",
       "tooltip" : "One or two small games (or several Gameboy games), a small stack of cards, an iPod... err on the side of checking with shipping!",
       "method" : "USPS",
    },
/*    "Sew mchn w/case" : {
       "note" : "20x14x18 box",
       "tooltip" : "Interior dimensions: 14x18x20; shipping weight: " + Math.ceil((15*19*21)/upsDivisor),
       "weight" : Math.ceil((15*19*21)/upsDivisor),
       "method" : "UPS",
    },
    "Sew mchn, no case" : {
       "note" : "10x14x18 box",
       "tooltip" : "Interior dimensions: 10x14x18; shipping weight: " + Math.ceil((11*15*19)/upsDivisor),
       "weight" : Math.ceil((11*15*19)/upsDivisor),
       "method" : "UPS",
    }*/
};




// This next section sets up our default boxes.

// It's CRITICALLY IMPORTANT that the dimensions for these boxes get listed in ascending order (e.g. 8, 17, 36).

// "Interior" is the interior dimensions of the box - how large an item can fit inside. "Exterior" is the set of dimensions used to calculate the weight.
// The reason that these are defined separately is so that we can require a varying amount of padding per dimension and per box.

var guitarBoxes = {
	"default" : {
		0 : 7,
		1 : 16,
		2 : 35
		/* The interior/exterior doesn't matter here: the default "box" is used to decide "this doesn't need to go in a special box, and should be treated like a regular item". */
	},
	"boxes" : {
		1 : {
			"interior" : {
				0 : 6,
				1 : 17,
				2 : 42,
			},
			"exterior" : {
				0 : 7,
				1 : 19,
				2 : 45
			},
			"name" : "Small guitar box",
      "corresponds" : "Sm guitar box"
		},
		2 : {
			"interior" : {
				0 : 8,
				1 : 20,
				2 : 48
			},
			"exterior" : {
				0 : 9,
				1 : 21,
				2 : 51
			},
			"name" : "Large guitar box",
      "corresponds" : "Lg guitar box"
		}
	}
};

var artBoxes = {
	"default" : {
		0 : 5,
		1 : 17,
		2 : 19
	},
	"boxes" : {
		1 : {
			"interior" : {
				0 : 3,
				1 : 23,
				2 : 23
			},
			"exterior" : {
				0 : 5,
				1 : 25,
				2 : 25
			},
			"name" : "Small print box",
      "corresponds" : "Sm print box"
		},
		2 : {
			"interior" : {
				0 : 4,
				1 : 23,
				2 : 29
			},
			"exterior" : {
				0 : 6,
				1 : 25,
				2 : 31
			},
			"name" : "Medium print box",
      "corresponds" : "Med print box"
		},
		3 : {
			"interior" : {
				0 : 4,
				1 : 29,
				2 : 35
			},
			"exterior" : {
				0 : 6,
				1 : 31,
				2 : 37
			},
			"name" : "Large print box",
      "corresponds" : "Lg print box"
		},
/*    4 : {
			"interior" : {
				0 : 4,
				1 : 33,       // are these dimensions right???
				2 : 45
			},
			"exterior" : {
				0 : 6,
				1 : 36,
				2 : 48
			},
			"name" : "Huge print box",
      "corresponds" : "Huge print box"
		},*/
	}
};

var generalBoxes = [
	{
		"interior" : [
			8,
			8.75,
			11.25
		],
		"name" : "11.25x8.75x8",
		"cut" : "1",
	},
	{
		"interior" : [
			9,
			12,
			12
		],
		"name" : "12x12x9",
		"cut" : "0",
	},
	{
		"interior" : [
			5,
			18,
			24
		],
		"name" : "24x5x18",
		"cut" : "1",
	},
	{
		"interior" : [
			10,
			14,
			18
		],
		"name" : "18x14x10",
		"cut" : "0",
	},
	{
		"interior" : [
			5,
			24,
			24
		],
		"name" : "24x5x24",
		"cut" : "2",
	},
	{
		"interior" : [
			8,
			8,
			60
		],
		"name" : "8x8x48",
		"cut" : "2",
	},
	{
		"interior" : [
			5,
			24,
			30
		],
		"name" : "30x5x24",
		"cut" : "1",
	},
	{
		"interior" : [
			14,
			16,
			20
		],
		"name" : "20x16x14",
		"cut" : "0",
	},
	{
		"interior" : [
			6,
			18,
			48
		],
		"name" : "18x6x45",
		"cut" : "2",
	},
	{
		"interior" : [
			14,
			18,
			20
		],
		"name" : "20x14x18",
		"cut" : "1",
	},
	{
		"interior" : [
			12,
			12,
			36
		],
		"name" : "36x12x12",
		"cut" : "1",
	},
	{
		"interior" : [
			5,
			30,
			36
		],
		"name" : "36x5x30",
		"cut" : "1",
	},
	{
		"interior" : [
			12,
			12,
			60
		],
		"name" : "12x12x40",
		"cut" : "2",
	},
	{
		"interior" : [
			8,
			20,
			50
		],
		"name" : "20x8x50",
		"cut" : "2",
	},
	{
		"interior" : [
			5.5,
			36,
			40
		],
		"name" : "36x5.5x40",
		"cut" : "2",
	},
	{
		"interior" : [
			10,
			12,
			22
		],
		"name" : "22x12x10",
		"cut" : "0",
	},
];

$.each(generalBoxes, function(){
	this.exterior = [
		Math.ceil(this.interior[0]+1),
		Math.ceil(this.interior[1]+1),
		Math.ceil(this.interior[2]+1),
	]
});

$('body').append('<input id="myUPSBox" type="hidden">');

var uspsBoxes = {
	"smallFlat1" : {
	/* Because these are billed at a flat rate, they also don't need two separate sets of dimensions. All we need to know is if the item will fit. */
		0 : 1.25,
		1 : 4.75,
		2 : 8.25,
		"name" : "small ($6.80) flat rate box",
    "corresponds" : "Sm flat rate box",
    "price" : "6.80",
	},
/*	"medFlat1" : {                             // The shipping calculator is no longer going to suggest
		0 : 3.25,                                  // medium flat-rate boxes, as UPS seems to universally be
		1 : 11.75,                                 // cheaper.
		2 : 13.25,
		"name" : "medium ($13.00) flat rate box",
    "corresponds" : "Med flat rate box",
    "price" : "13.00",
	},
	"medFlat2" : {
		0 : 5.25,
		1 : 8.25,
		2 : 10.75,
		"name" : "medium ($13.00) flat rate box",
    "corresponds" : "Med flat rate box",
    "price" : "13.00",
	},*/
};

$("body").prepend("<input id='upsDivisor' type='hidden' value='"+upsDivisor+"'>");
var shippingOptions = "";
var buttonCount = 0;
$.each( shippingMethods, function( key, value ) {
       shippingOptions = shippingOptions + "<div name='" + key + "'  id='" + key + "' class='shipCharge shipType fakeButton'>" + key + "</div>";
       if (key == 'Clothing' || key == 'Med coat box') {
           shippingOptions = shippingOptions + "<br><br>";
       }
       buttonCount++;
}); 
             
$('.shipType').css('font-size','4');
if (url.indexOf('enter/shipping.html') <= 0) {
  $("body").append("<div class='shippingOptions' style='position:relative; bottom:20px; margin-top:30px; margin-bottom: 10px; font-size:14px'></div><br><br>");
} else {
  $('body').prepend('<br><br>');
}

$("body").prepend("<div id='boxDefinitions' style='display:none;'></div>");
$("#boxDefinitions").data(shippingMethods);

shippingOptions = shippingOptions + "<br><br><span class='shipType fakeButton' id='UPS'><b>UPS</b></span>";
shippingOptions = shippingOptions + "<span class='shipType fakeButton' id='pickupOnly' name='pickupOnly'><b>Pickup Only</b></span>";

$(".shippingOptions").html(shippingOptions);

calcButtonList = {
    "general" : "General",
    "guitar" : "Guitar",
    "art" : "Frame/print",
//    "long" : "Long item"
}

var myCalcButtons = "";

$.each(calcButtonList, function(index, value) {
   myCalcButtons += "<span class='calcButton fakeButton' id='calc-" + index + "' calctype='" + index + "'>" + value + "</span>";
});

$('body').append("<div style='margin-top: -20px; margin-bottom: 10px; padding: 4px; border: 1px solid #AAA; width:400px;' id='shipCalcContainer'>"
      + "<b>Shipping calculator</b><br><br>"
      + "<div style='padding:2px;'><b>Dimensions:</b> <input id='dim1' class='shipCalcInput' size=5 style='position:relative; left:2px;'> <input id='dim2' class='shipCalcInput' size=5> <input id='dim3' class='shipCalcInput' size=5></div>"
      + "<div style='padding:2px;'><b>Real weight:</b> <input id='actualWeight'  class='shipCalcInput' size=5></div>"
	    + "<div style='padding:2px; margin-top:8px;'><b>Add</b> <span type='text' readonly id='addInches' size=2 style='border:0; font-size:120%;'>2</span> <span id='inches'>inches</span> to each side<div id='inchesSlider'></div></div>"
	    + "<div style='padding:2px; margin-bottom:8px;'><b>Add</b> <span type='text' readonly id='addPounds' size=2 style='border:0; font-size:120%;'>2</span> <span id='pounds'>pounds</span> of packing material<div id='poundsSlider'></div></div>"
      + "<div style='padding:2px;' id='ownBoxContainer'><b id='ownBoxText'>Ship in own (current) box?</b> <input type='checkbox' id='ownBox' class='shipCalcInput' ></div>"
      + "<div style='padding:4px; margin-top:3px;'>"
           + "<table>"
             + "<tr>"
               + "<td>"
                 + "<b>Calculate:</b> "
               + "</td>"
               + "<td>"
                 + "<span class='calcButton fakeButton' id='calc-general' calctype='general'>General</span>"
                 + "<span class='calcButton fakeButton' id='calc-guitar' calctype='guitar'>Guitar</span>"
                 + "<span class='calcButton fakeButton' id='calc-art' calctype='art'>Frame/print</span>"
                 + "<!--span class='calcButton fakeButton' id='calc-long' calctype='long'>Long item</span-->"
               + "</td>"
             + "</tr>"
             + "<tr>"
               + "<td>"
               + "</td>"
               + "<td>"
                 + "<span class='fakeButton' id='calc-media' calctype='media'>Media</span>"
                 + "<span class='fakeButton' id='calc-clothing' calctype='clothing'>Clothing</span>"
								 + "<span class='calcButton fakeButton' id='calc-override' calctype='override'>Override</span>"
               + "</td>"
           + "</table>"
      + "</div>"
      + "<div style='padding:2px; margin-top:5px; margin-bottom:15px; display: none;' id='printGlassContainer'><b>Glass/plexiglass/etc. front?</b> <input type='checkbox' id='printGlass' class='shipCalcInput' ></div>"
      + "<div style='padding:2px; margin-top:10px; display:none;' id='myDimWeight'>Shipping weight: <span id='shipCalcShippingWeight' style='font-size:24px; font-weight: bold;'></span> </div>"
      + "<div style='padding:2px; display:none;' id='myPickupDiv'>Shipping weight: <s><span id='pickupShippingWeight' style='color:#f00;'></span></s><br><span style='color: #f00; font-weight: bold; font-size: 20px;'>This item should probably be pickup only.</span><br> Please check with a manager if you think it should be shipped. </div>"
      + "<div style='padding:2px; display:none; color:#00f;' id='uspsDiv'>This item <strong><em>may</em></strong> fit into a $<span id='uspsSuggPrice'></span> flat-rate box. <strong style='color:#f00;'><em>Please use discretion!</em></strong><br></div>"
    + "</div>"
);
$('#printGlass').prop('checked', true);

if (url.indexOf('enter/shipping.html') <= 0) {
  makeButton().addClass('upsButton useButton').text('Use this (UPS)').appendTo($('#myDimWeight'));
  makeButton().addClass('uspsButton useButton').text('Use this (Post Office)').css({'color' : '#000', 'margin-top' : '5px'}).appendTo($('#uspsDiv'));
  makeButton().addClass('pickupOnlyButton useButton').text('Use this (Pickup Only)').appendTo($('#myPickupDiv'));
}

$("body").append("<div id='myBoxes' style='display:none;'></div>");
$("#myBoxes").data('guitarBoxes', guitarBoxes);
$("#myBoxes").data('artBoxes', artBoxes);
$("#myBoxes").data('uspsBoxes', uspsBoxes);
$("#myBoxes").data('generalBoxes', generalBoxes);

$('body').append('<input type="hidden" id="currentShipCalcType">');
$('body').append('<input type="hidden" id="currentShippingNote">');

var bindingTimeouts = window.setTimeout(function(){ // if this isn't on a timeout, it doesn't work right.
  var calcOverride = false;
	function setInches(value) {
		$('#addInches').html(value);
		if (value == 1) {
			$('#inches').html('inch');
		} else {
			$('#inches').html('inches');
		}
		calculateShipping();
	}
	
	$('#inchesSlider').slider({
    'value' : 2,
    'min' : 0,
    'max' : 3,
    'step' : 1,
    'slide' : function(event, ui){
      setInches(ui.value);
    },
		'change' : function(event, ui){
			if (ui.value == 0) {
				if (!confirm("Are you SURE this item doesn't need ANY packing material?")) {
					$('#inchesSlider').slider('value', 1);
					setInches(1);
				}
			}
		}
  }).css({
    'width' : '200px',
  });
  $('#poundsSlider').slider({
    'value' : 2,
    'min' : 1,
    'max' : 20,
    'step' : 1,
    'slide' : function(event, ui){
       $('#addPounds').html(ui.value);
      if (ui.value == 1) {
        $('#pounds').html('pound');
      } else {
        $('#pounds').html('pounds');
      }
      calculateShipping();
    }
  }).css({
    'width' : '200px',
  });
  $('.ui-slider').css({
    'transform':'scale(.9,.9)',
  });

  function weightPrompt() {
    if (url.indexOf('enter/shipping.html') > 0) {
      return;
    } else {
      while ($('#actualWeight').val().length < 1) {
        var actualWeight = prompt('Item\'s actual weight?');
        actualWeight = actualWeight.replace(/[^\d.-]/g,'');
        $('#actualWeight').val(actualWeight);
        $('#calc-'+$('#currentShipCalcType').val()).trigger("click");
      }
    }
  }
	
  function fixNumber(val) {
    if (val.length > 0) {
      val = val.replace(/[^\d.-]/g,'');
      return Math.ceil(val);
    } else {
      return 0;
    }
  }
	
  function getDimensions(){
    getDims = ['dim1', 'dim2', 'dim3'];
    var dimList = [];
    $.each(getDims, function(i, dim){
      val = $('#'+dim).val();
      dimList.push(fixNumber(val));
    });
    dimList.sort(function(a, b){return a-b});
    return dimList;
  }
	
  function checkAgainstUSPS(dimList) {
    var uspsBoxes = $('#myBoxes').data('uspsBoxes');
    var uspsBox = {};
    $.each(uspsBoxes, function(index, boxArray) {
//      if ($.isEmptyObject(uspsBox) && (dimList[0] < boxArray[0] && dimList[1] < boxArray[1] && dimList[2] < boxArray[2])) {
      if ($.isEmptyObject(uspsBox) && checkFit(dimList, boxArray)) {
        $.each(boxArray, function(key, val){
          uspsBox[key] = val;
        });
      }
    });
    $('#uspsDiv').hide();
    if (!$.isEmptyObject(uspsBox)){
      $('#uspsDiv').show();
//      $('#uspsButton').text('Use this ')
//      console.dir(uspsBox);
      $('#uspsSuggPrice').html(uspsBox['price']);
      $('#uspsDiv, .uspsButton').attr('title', 'Box interior dimensions: ' + uspsBox[0] + '" by ' + uspsBox[1] + '" by ' + uspsBox[2] + '"');
      
    }
    return;
  }
	
  function shippingWeight(dimList, type) {
    var volume = 1;
    var pickup = false;
    var dimWeight = 0;
    var myShipType = $('#currentShipCalcType').val();
    $.each(dimList, function(i, dim){
      volume *= dim;
    });
    dimWeight = volume/fixNumber($('#upsDivisor').val());
    dimWeight = Math.ceil(dimWeight);
    var actualWeight = fixNumber($('#actualWeight').val()) + fixNumber($('#addPounds').html());
    if ($('#ownBox:checked:visible').length > 0) {
      pickup = false;
    } else {
      if (actualWeight > 150) {
        pickup = true; // TODO: THIS SHOULD NOT BE HERE
      } else if (volume > 6000 && type != 'long') { // TODO: Determine if this is a reasonable volume threshold
//        pickup = true;
      }
    }
    var shippingWeight = Math.max(dimWeight, actualWeight);
    return {'shippingWeight' : shippingWeight, 'pickup' : pickup};
  }
	
  function checkFit(itemDims, boxArray) {
    boxDims = [boxArray[0], boxArray[1], boxArray[2]];
    if (itemDims.length != boxDims.length) {
      return false;
    } else {
      var fit = true;
      $.each(itemDims, function(dimIndex, dimValue){
//        console.log(Math.ceil(dimValue) + " ? " + Math.ceil(boxDims[dimIndex]));
        if (Math.ceil(dimValue) > Math.ceil(boxDims[dimIndex])) {
          fit = false;
        }
      });
//			console.log(itemDims[0] + 'x' + itemDims[1] + 'x' + itemDims[2] + ' fits ' + boxArray[0] + 'x' + boxArray[1] + 'x' + boxArray[2] + ': ' + fit);
      return fit;
    }
  }
	
  function chooseBox(dimList, boxes) {
    console.log('choosing box');
		console.dir(boxes);
		console.dir(dimList);
    var boxWeight = 9999;
    var boxName = '';
		var calcType = $('#currentShipCalcType').val();
		var myBoxDims = [];
		var cutString = '';
		var boxNoteString = '';
		var boxDimensions = [];
    $.each(boxes, function(boxIndex, boxArray){
      if (checkFit(dimList, boxArray['interior']) !== false) {
				myCutDim = boxArray['cut'];
//				boxNoteString = boxArray['exterior'][0] + 'x' + boxArray['exterior'][1] + 'x' + boxArray['exterior'][2];
				boxNoteString = boxArray['name'];
			  if (calcType == 'general' || calcOverride == true) {
//					if (boxArray['exterior'][myCutDim] != dimList[myCutDim]) {
						boxArray['exterior'][myCutDim] = dimList[myCutDim];
						boxNoteString += ', ext cut ' + (boxArray['exterior'][0]) + 'x' + (boxArray['exterior'][1]) + 'x' + (boxArray['exterior'][2]);
					  boxDimensions = [boxArray['exterior'][0], boxArray['exterior'][1], boxArray['exterior'][2]];
//					}
					
//					console.log('cut' + boxArray['cut'] + '(' + boxArray['exterior'][myCutDim] + ') to ' + dimList[myCutDim]);
			  } else {
					boxDimensions = [boxArray['exterior'][0], boxArray['exterior'][1], boxArray['exterior'][2]];
				}
        var thisBoxShipping = shippingWeight(boxArray['exterior']);
        if (thisBoxShipping['shippingWeight'] < boxWeight) {
          boxWeight = thisBoxShipping['shippingWeight'];
          boxName = boxArray['name'];
					$.each(boxArray['exterior'], function(i, v){
						myBoxDims.push(v);
					});
        }
      } else {
//         console.log('DOES NOT FIT:');
//				 console.dir(boxArray['interior']);
      }
    });

    if (boxName.length) {
//			boxNoteString = boxName + cutString;
			if ($('#calc-long').css('background-color') == 'rgb(187, 187, 187)') {
				boxNoteString = boxName;
			}
			var returnObject = {
				'weight' : boxWeight, 'name' : boxName, 'boxNoteString' : boxNoteString, 'boxDimensions' : boxDimensions,
			};
			setSGWDims(boxDimensions);
			console.dir(returnObject);
      return returnObject; // TODO: Return cut down size!
    } else {

      return false;
    }
  }
	
	function setSGWDims(dimList){
		$('#itemShipLength').val(dimList[0]);
		$('#itemShipWidth').val(dimList[1]);
		$('#itemShipHeight').val(dimList[2]);
	}
	
  function calculateShipping() {
    var shipType = $('#currentShipCalcType').val();
//    console.log('calculateShipping():' + shipType);
    var dimList = getDimensions();
    var realDims = getDimensions(); // TODO: plug dimensions into SGW fields
    var pickup = false;
    var long = '';
    if ($('#dim1').val().length && $('#dim2').val().length && $('#dim3').val().length && shipType.length > 0) {
			// here is the calculate shipping function
        weightPrompt();
        $('#myDimWeight').hide();
        $('#myPickupDiv').hide();
        $('#uspsDiv').hide();
      if (shipType == 'art' && $('#ownBox:checked').length > 0) {
        dimList[0] = 1;
        dimList[1] += 3;
        dimList[2] += 3;
        shipping = shippingWeight(dimList);
        $('#myDimWeight').show();
        $('#shipCalcShippingWeight').html(shipping['shippingWeight'])
        $('.upsButton').text('Use this (UPS)');        
      } else if (shipType == 'guitar' || shipType == 'art') {
        
        var boxesName = shipType + 'Boxes';
        var myBoxes = $('#myBoxes').data(boxesName);
        if (checkFit(dimList, myBoxes['default']) !== false) {
          shipType = 'general'; // If an item is small enough, we won't even try to put it in a guitar box.
        } else {
					if (shipType == 'art' && $('#printGlass:checked').length > 0) {
						dimList[0] += 1;
						dimList[1] += 3;
						dimList[2] += 3;
					}
          var box = chooseBox(dimList, myBoxes['boxes']);
          if (box !== false) {
            $('#myDimWeight').show();
            $('#shipCalcShippingWeight').html(box['weight'])
            $('.upsButton').text('Use this (' + box['name'] + ')');
          } else {
            pickup = true;
          }
        }
      } else if (shipType == 'long') {
        if ($('#ownBox:checked').length > 0) {
          var addInches = 0;
        } else {
          var addInches = 2 * fixNumber($('#addInches').html());
        }
        
        if (dimList[0] <= 12 && dimList[1] <= 12) {
          if (dimList[0] <= 8 && dimList[1] <= 8) {
            dimList[0] = 8;      // So what's happening here is, if the item (plus padding) is
            dimList[1] = 8;      // <= 12"x12"xX", its dimensions are going to become 8x8 or 12x12
          } else {               // Then, we set long to true, which will prevent MORE inches from
            dimList[0] = 12;     // being added later.
            dimList[1] = 12;     // whether it's too big or not, we then treat it as a general item.
          }
          long = 'long';
        }
        shipType = 'general';
      }
			
			console.dir(box);
			
      // This is not an else so that things that can't fit into, or are too small for, the above box types
      // can fall through to general shipping.
			if ($('#ownBox:checked').length > 0 && shipType == 'general') {
				addInches = 1;
				$('#myDimWeight').show();
				$.each(dimList, function(i, dim) {
          dimList[i] += addInches;
        });
				var shipping = shippingWeight(dimList);
				$('#shipCalcShippingWeight').html(shipping['shippingWeight']);
				$('#myDimWeight').show();
			} else if (shipType == 'general') {
        checkAgainstUSPS(dimList);
				if ($('#itemTitle').length  > 0 && $('#s1').length) {
				  var myTitle = $('#itemTitle').val().toLowerCase();
				  var myCategory = $('#s1').val().toLowerCase();
				} else {
					var myTitle = '';
				  var myCategory = '';
				}
        if (long == 'long') {
          var addInches = 0;
				} else if (myTitle.indexOf('sewing machine') >= 0 || myCategory.indexOf('sewing machine') >= 0) {
				  // BAD! The shipping calculator shouldn't have site-specific stuff!
//					console.log('butts');
					var addInches = 0;
        } else {
          var addInches = 2 * fixNumber($('#addInches').html());
        }
        $.each(dimList, function(i, dim) {
            dimList[i] += addInches;
        });
        if (realDims[2] > 60) {
          pickup = true;
        }
				var myBoxes = $("#myBoxes").data('generalBoxes');
				calcOverride = true;
				// butts butts butts
				var box = chooseBox(dimList, myBoxes);
//				console.log('box:');
//				console.dir(box);
				if (box !== false) {
					//            $('#myDimWeight').html('Shipping weight: <span id="shipCalcShippingWeight">' + box['weight'] + "</span> ");
					$('#myDimWeight').show();
					$('#shipCalcShippingWeight').html(box['weight']);
					$('#currentShippingNote').val(box['boxNoteString']);
//					$('.upsButton').text('Use this (' + box['name'] + ')');
//					$('.upsButton').after(box['boxNoteString']+"<br>");
//				  $('.upsButton').text('Use this (UPS)');
					console.log(box['boxNoteString']);
				} else {
					pickup = true;
					$('#currentShippingNote').val('');
				}

        if ($('#ownBox:checked:visible').length > 0) {
          pickup = false;
        }
        
        if (pickup === true) {
          $('#myPickupDiv').show();
          $('#pickupShippingWeight').html($('#shipCalcShippingWeight').html());
        } else {
          $('#myDimWeight').show();
          $('.upsButton').text('Use this (UPS)');   
        }
      }
			if (shipType == 'override') {
				  var addInches = 2 * fixNumber($('#addInches').html());
					$.each(dimList, function(i, dim) {
						dimList[i] += addInches;
					});
					var shipping = shippingWeight(dimList);
				  $('#shipCalcShippingWeight').html(shipping['shippingWeight']);
				  $('#myDimWeight').show();
          $('.upsButton').text('Use this (UPS)');
				  $('.useButton').css({'background-color' : '#f00', 'border-color' : '#b00'});
				  $('#calc-override').css({'background-color' : '#f00', 'border-color' : '#d00'});
			} else {
				$('#calc-override').css({'background-color' : '#eee', 'border-color' : 'rgb(204, 204, 204)'});
//				$('.upsButton').css();
				$('.useButton').css({'background-color' : '#cce0ff', 'border-color' : '#80b3ff'});
			}
      if ($('#ownBox:checked:visible').length > 0) {
          pickup = false;
        }
      if (pickup === true) {
//        console.log('PICKUP!!');
        $('#myDimWeight').hide();
        $('#myPickupDiv').show();
        $('#pickupShippingWeight').html('9999');
      }
    } else {
//      console.log($('#dim1').val() + " " + $('#dim2').val() + " " + $('#dim3').val() + " " + shipType);
    }
		
  }
	
  function toggleOwnBoxDisable() {
    $('#ownBox').removeProp('disabled');
    if ($('#currentShipCalcType').val()=='art') {
      dimList = getDimensions();
      if (dimList[0] > 1) {
        $('#ownBox').removeProp('checked');
        $('#ownBox').prop('disabled', true);
      }
    }
  }
  $('.shipCalcInput').bind('keyup', function(){
    calculateShipping();
    toggleOwnBoxDisable();
  });
  $('#ownBox, #printGlass').bind('change', function(){
    calculateShipping();
  });
  $('.calcButton').bind('click', function(){
    $('.fakeButton').css('background-color', '#EEE');
    $(this).css('background-color', '#BBB');
    $('#printGlassContainer').hide();
    shipType = this.id.substr(5);
    if (shipType == 'guitar' || shipType == 'override') {
      $('#ownBoxContainer').hide();
    } else {
      $('#ownBoxContainer').show();
      if (shipType == 'art') {
        $('#ownBoxText').html('Ship between cardboard? (Check with shipping) ');
        $('#printGlassContainer').show();
      } else{ 
        if (shipType == 'long') {
          $('#ownBoxText').html('Skip packing material (e.g. rugs) ');
        } else {
          $('#ownBoxText').html("Ship in own (current) box? ");
        }
      }
    }

    $('#currentShipCalcType').val(shipType);
    toggleOwnBoxDisable();
    calculateShipping();
  });
}, 1000);



// because cloning this will keep the CSS.

$.each( shippingMethods, function( key, value ) {
    if (value['tooltip']) {
        $(".shipType:contains('" + key + "')").attr('title', value['tooltip']);
    }
});

$('.fakeButton').css({
  'border' : '1px solid #CCC',
  'background-color' : '#EEE',
  'padding' : '3px',
  'margin-left' : '3px',
  'margin-right' : '3px',
  'display' : 'inline-block',
});

$('.useButton').css('background-color', '#e9f7fb');

$('#dummyButton').hide();

function makeButton() {
  return $('#dummyButton').clone().removeAttr('id').css('display','inline-block');
}

// End