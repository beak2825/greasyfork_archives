// ==UserScript==
// @name        eBay Fixer - DEPRECATED
// @namespace   greasyfork.org
// @version     1.0.0.3
// @grant       none
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.6.2/jquery.min.js
// @include     http*ebay.com*
// @grant       none
// @require     https://greasyfork.org/scripts/10208-gm-api-script/code/GM%20API%20script.js?version=54964
// @description Adds simple filters to menus on shopgoodwill
// @downloadURL https://update.greasyfork.org/scripts/18219/eBay%20Fixer%20-%20DEPRECATED.user.js
// @updateURL https://update.greasyfork.org/scripts/18219/eBay%20Fixer%20-%20DEPRECATED.meta.js
// ==/UserScript==
this.$ = this.jQuery = jQuery.noConflict(true);

// EDITABLE DEFAULT VALUES!

var auctionStartEndTime = "06"; // 8PM central
var auctionDefaultDuration = "Days_3"; // 3 days
/* Note: it might be doable to start auctions the following day... */
var auctionStartPrice = "5.95";
var handlingFee = "2.00";
var upsDivisor = 225;

// EDITABLE SHIPPING BOX VALUES

$('head').append("<script id='ges_boxDefs'>"
  + 'var upsDivisor = ' + upsDivisor + ';'
  + 'var shippingMethods = {'
      + '"Sm flat rate box" : {'
      + '  "price" : 6.80,'
      + '  "note" : "Small flat rate box",'
      + '  "method" : "USPS",'
      + '  "tooltip" : "Interior dimensions: 5x8.5x1.5 - NOTE: remember room for packing material!",'
    + ' },'
      + '"Bubble mailer" : {'
      + '  "price" : 6.80,'
      + '  "note" : "Bubble mailer",'
      + '  "tooltip" : "Bubble mailers are padded, but consider if your item needs extra padding as well.",'
      + '  "method" : "USPS",'
    + ' },'
      + '"Med flat rate box" : {'
      + '  "price" : 13.00,'
      + '  "note" : "Medium flat rate box",'
      + '  "method" : "USPS",'
      + '  "tooltip" : "Interior dimensions: 12x13.5x3.5 OR 11x8.5x5.5 - NOTE: remember room for packing material!"'
    + ' },'
    + '"Media" : {'
      + '  "note" : "Media",'
      + '  "tooltip" : "Any: book; movie (VHS, DVD, Blu-Ray, laserdisc, film reel); music (record, 8-track, tape, CD) - regardless of size or weight. NOT comic books, magazines, newspapers, or video games.",'
      + '  "method" : "USPS"'
    + ' },'
    + '"Lt clothing" : {'
      + '  "price" : 4.99,'
      + '  "note" : "Poly-mailer",'
      + '  "tooltip" : "Poly-mailer. Use if a clothing item is light - like a t-shirt.",'
      + '  "method" : "USPS",'
    + ' },'
    + '"Med clothing" : {'
      + '  "price" : 6.99,'
      + '  "note" : "Poly-mailer",'
      + '  "tooltip" : "Poly-mailer. Use if a clothing item is a bit heavier - like a pair of jeans.",'
      + '  "method" : "USPS",'
    + ' },'
    + '"Sm guitar box" : {'
      + '  "note" : "6x18x44 guitar box",'
      + '  "tooltip" : "Interior dimensions: 6x18x44; shipping weight: " + Math.ceil((7*19*45)/upsDivisor),'
      + '  "weight" : Math.ceil((7*19*45)/upsDivisor),'
      + '  "method" : "UPS"'
    + ' },'
    + '"Lg guitar box" : {'
      + '  "note" : "8x20x50 guitar box",'
      + '  "tooltip" : "Interior dimensions: 8x20x50; shipping weight: " + Math.ceil((9*21*51)/upsDivisor),'
      + '  "weight" : Math.ceil((9*21*51)/upsDivisor),'
      + '  "method" : "UPS"'
    + ' },'
    + '"Sm print box" : {'
      + '  "note" : "5x24x30 print box",'
      + '  "tooltip" : "Interior dimensions: 5x24x30; shipping weight: " + Math.ceil((6*24*31)/upsDivisor),'
      + '  "weight" : Math.ceil((6*24*31)/upsDivisor),'
      + '  "method" : "UPS"'
    + ' },'
      + '"Lg print box" : {'
      + '  "note" : "5x30x36 print box",'
      + '  "tooltip" : "Interior dimensions: 5x30x36; shipping weight: " + Math.ceil((6*31*37)/upsDivisor),'
      + '  "weight" : Math.ceil((6*31*37)/upsDivisor),'
      + '  "method" : "UPS"'
    + ' },'
    /*    + '"Huge print box" : {' // This wasn't working out for us.
      + '  "note" : "5.5x36x48 print box",'
      + '  "tooltip" : "Interior dimensions: 5.5x36x48; shipping weight: " + Math.ceil((7*37*49)/upsDivisor),'
      + '  "weight" : Math.ceil((7*37*49)/upsDivisor),'
      + '  "method" : "UPS"'
    + ' },'*/
    /*    + '"8x8 long box" : {'
      + '  "note" : "8x8 long box",'
      + '  "tooltip" : "Interior dimensions: 8x8x?",'
      + '  "method" : "UPS"'
    + ' },'
    + '"12x12 long box" : {'
      + '  "note" : "12x12 long box",'
      + '  "tooltip" : "Interior dimensions: 8x8x?",'
      + '  "method" : "UPS"'
    + ' },'*/
    + '"Sm coat box" : {'
      + '  "note" : "9x12x12 coat box",'
      + '  "tooltip" : "Interior dimensions: 9x12x12; shipping weight: " + Math.ceil((10*13*13)/upsDivisor),'
      + '  "weight" : Math.ceil((10*13*13)/upsDivisor),'
      + '  "method" : "UPS"'
    + ' },'
      + '"Med coat box" : {'
      + '  "note" : "6x14x18 coat box",'
      + '  "tooltip" : "Interior dimensions: 6x14x18; shipping weight: " + Math.ceil((7*15*19)/upsDivisor),'
      + '  "weight" : Math.ceil((7*15*19)/upsDivisor),'
      + '  "method" : "UPS"'
    + ' },'
    + '"Very lg coat box" : {'
      + '  "note" : "10x14x18 coat box",'
      + '  "tooltip" : "Interior dimensions: 10x14x18; shipping weight: " + Math.ceil((11*15*19)/upsDivisor),'
      + '  "weight" : Math.ceil((11*15*19)/upsDivisor),'
      + '  "method" : "UPS"'
    + ' },'
    + '"Standard sm UPS box" : {'
      + ' "note" : "6.25x7.25x10.25 small box",'
      + ' "tooltip" : "Interior dimensions: 6.25x7.25x10.25; shipping weight: " + Math.ceil((7*8*11)/upsDivisor),'
      + ' "weight" : Math.ceil((7*8*11)/upsDivisor),'
      + ' "method" : "UPS",'
    + ' },'
    /*    + '"Sew mchn w/case" : {'
      + ' "note" : "20x14x18 box",'
      + ' "tooltip" : "Interior dimensions: 14x18x20; shipping weight: " + Math.ceil((15*19*21)/upsDivisor),'
      + ' "weight" : Math.ceil((15*19*21)/upsDivisor),'
      + ' "method" : "UPS",'
    + ' },'
    + '"Sew mchn,' no case" : {'
      + ' "note" : "10x14x18 box",'
      + ' "tooltip" : "Interior dimensions: 10x14x18; shipping weight: " + Math.ceil((11*15*19)/upsDivisor),'
      + ' "weight" : Math.ceil((11*15*19)/upsDivisor),'
      + ' "method" : "UPS",'
    }*/
  + '};'

  + 'var minimumWeight = 3;' // This is the minimum weight we'll charge.


  // This next section sets up our default boxes.

  // It's CRITICALLY IMPORTANT that the dimensions for these boxes get listed in ascending order (e.g. 8,' 17,' 36).

  // "Interior" is the interior dimensions of the box - how large an item can fit inside. "Exterior" is the set of dimensions used to calculate the weight.
  // The reason that these are defined separately is so that we can require a varying amount of padding per dimension and per box.

  + 'var guitarBoxes = {'
    + '"default" : {'
      + '0 : 8,'
      + '1 : 17,'
      + '2 : 36'
    /* The interior/exterior doesn't matter here: the default "box" is used to decide "this doesn't need to go in a special box,' and should be treated like a regular item". */
    + '},'
    + '"boxes" : {'
      + '1 : {'
        + '"interior" : {'
          + '0 : 6,'
          + '1 : 17,'
          + '2 : 42,'
        + '},'
        + '"exterior" : {'
          + '0 : 7,'
          + '1 : 19,'
          + '2 : 45'
        + '},'
        + '"name" : "Small guitar box",'
        + '"corresponds" : "Sm guitar box"'
      + '},'
      + '2 : {'
        + '"interior" : {'
          + '0 : 8,'
          + '1 : 20,'
          + '2 : 48'
        + '},'
        + '"exterior" : {'
          + '0 : 9,'
          + '1 : 21,'
          + '2 : 51'
        + '},'
        + '"name" : "Large guitar box",'
        + '"corresponds" : "Lg guitar box"'
      + '}'
    + '}'
  + '};'

  + 'var artBoxes = {'
    + '"default" : {'
      + '0 : 6,'
      + '1 : 18,'
      + '2 : 20'
    + '},'
    + '"boxes" : {'
      + '1 : {'
          + '"interior" : {'
          + '0 : 3,'
          + '1 : 20,'
          + '2 : 20'
        + '},'
          + '"exterior" : {'
          + '0 : 6,'
          + '1 : 25,'
          + '2 : 25'
        + '}'
      + '},'
      + '2 : {'
        + '"interior" : {'
          + '0 : 3,'
          + '1 : 20,'
          + '2 : 26'
        + '},'
        + '"exterior" : {'
          + '0 : 6,'
          + '1 : 25,'
          + '2 : 31'
        + '},'
        + '"name" : "Small print box",'
        + '"corresponds" : "Sm print box"'
      + '},'
      + '3 : {'
        + '"interior" : {'
          + '0 : 3,'
          + '1 : 26,'
          + '2 : 32'
        + '},'
        + '"exterior" : {'
          + '0 : 6,'
          + '1 : 31,'
          + '2 : 37'
        + '},'
        + '"name" : "Large print box",'
        + '"corresponds" : "Lg print box"'
        + '},'
      /*    4 : {'
      + '"interior" : {'
      + '0 : 3.5,'
      + '1 : 36,'
      + '2 : 48
      + '},'
      + '"exterior" : {'
      + '0 : 7,'
      + '1 : 37,'
      + '2 : 49
      + '},'
      + '"name" : "Huge print box",'
      + '"corresponds" : "Huge print box"
      + '},'*/
    + '}'
  + '};'

  + 'var uspsBoxes = {'
    + '"smallFlat1" : {'
    /* Because these are billed at a flat rate,' they also don't need two separate sets of dimensions. All we need to know is if the item will fit. */
      + '0 : 1.25,'
      + '1 : 4.75,'
      + '2 : 8.25,'
      + '"name" : "small ($6.80) flat rate box",'
      + '"corresponds" : "Sm flat rate box"'
    + '},'
    + '"medFlat1" : {'
      + '0 : 3.25,'
      + '1 : 11.75,'
      + '2 : 13.25,'
      + '"name" : "medium ($13.00) flat rate box",'
      + '"corresponds" : "Med flat rate box"'
    + '},'
    + '"medFlat2" : {'
      + '0 : 5.25,'
      + '1 : 8.25,'
      + '2 : 10.75,'
      + '"name" : "medium ($13.00) flat rate box",'
      + '"corresponds" : "Med flat rate box"'
    + '},'
  + '};'
+"</script>");

// END EDITABLE VALUES

$('head').append("<script id='ges_scripts' type='text/javascript'>"
    + "function compareBoxType(item, boxType) {"
        + "returnArray = {"
            + "'dimWeight' : '',"
            + "'boxName' : '',"
            + "'isInBox' : 'no',"
            + "'corresponds' : 'no',"
            + "'dimensions' : []"
        + "};"
        + "$.each(boxType['boxes'], function(index, value) {"
            + "if (returnArray['isInBox'] == 'no') {"
                + "if (item[0] <= value['interior'][0] && item[1] <= value['interior'][1] && item[2] <= value['interior'][2]) {"
                    + "returnArray['dimWeight'] = (value['exterior'][0] * value['exterior'][1] * value['exterior'][2]) / Number($('#upsDivisor').html());"
                    + "$.each(value['exterior'], function(index, value) { returnArray.dimensions[index] = value });"
                    + "returnArray['isInBox'] = 'yes';"
                    + "if(value['name']){returnArray['boxName'] = value['name'];}"
                    + "if(value['corresponds']){returnArray['corresponds'] = value['corresponds'];}"
                + "}"
            + "}"
        + "});"
        + "return returnArray;"
    + "}"
  + "</script>");

// Username stuff
var userName = JSON.parse(GM_getValue("userName", "")); // Get the stored username, if any
$('#editpane_skuNumber').val(userName + ": ");
$('.crnew-hd:first').after("<div id='userName' style='position:relative; left:235px; top:-36px;'>User: <input id='ges_userName' value='" + userName + "'></div>");
$('#ges_userName').bind("focusout", function(){ // On username field change, update the saved username
  thisName = $('#ges_userName').val(); // there's got to be a good way to make this NOT happen if there's no change - but screw it
  myNewName = JSON.stringify(thisName);
  GM_setValue("userName", myNewName);
});

$('h2:contains("Shipping details")').after("<br><div id='ges_shipCalc'></div>");

// Reorder some things to flow better and to be more like SGW; remove others that are extraneous
$('#editpaneSect_Category').after($('#editpaneSect_Description')).after($('#editpaneSect_Photo'));
$('#editpaneSect_ConditionDescription').hide();
$('#editpane_reservePrice').hide();
/* Note: at present, we're letting buyers remain anonymous. */
$('h2:contains("Private listing")').parent().hide();
/* TODO: Set up logic such that if the auction is changed to BIN, Quantity is shown, but otherwise it's hidden (right now it's staying shown) */
$('#editpaneSect_CHARITY').hide();
$('#paypalEmail').parent().hide();
$('#pymt_lnk').parent().hide();
$('#l_paymentInstructions').parent().hide();
$('#editpane_saleTax').hide();
/* TODO: Set up a show button for return options! */
$('#editpaneSect_Return').hide();
$('h2:contains("International shipping")').parent().hide();
$('h2:contains("Exclude shipping locations")').parent().hide();
$('h2:contains("Item location")').parent().hide();
//$('h2:contains("Shipping details")').parent().hide();
$('#rev_fees').parent().parent().hide();
$('span:contains("If your item sells,")').parent().hide();
$('.indivDomesDisc-wrap').hide();

// Change some default values
$('#format').val("ChineseAuction"); // First, default to auction-style
$('#format option[selected="selected"]').removeProp('selected'); // Note: "Chinese Auction" is evidently what eBay calls, you know, auctions. Looking at Wikipedia, this is VERY different from what a Chinese auction actually is - that's more like a raffle.
$('#format option[value="ChineseAuction"]').prop('selected', 'selected');

$('#schldLstng_1').click(); // Then change the listing to be scheduled, ending at the default start/end time defined above
$('#startTime').val(auctionStartEndTime);
$('#startTime option[selected="selected"]').removeProp('selected');
$('#startTime option[value="' + auctionStartEndTime + '"]').prop('selected', 'selected');
$('#stTimeAMPM').val('PM');
$('#startTime option[selected="selected"]').removeProp('selected');
$('#startTime option[value="PM"]').prop('selected', 'selected');

$('#duration').val(auctionDefaultDuration); // Then change the duration 
$('#duration option[selected="selected"]').removeProp('selected');
$('#duration option[value="' + auctionDefaultDuration + '"]').prop('selected', 'selected');

$('#startPrice').val(auctionStartPrice); // Set the start price to the default

$('#v4-30').attr('checked', 'checked'); // Then make sure the charity stuff is good
$('#v4-31').val("100"); 
$('#v4-31 option[selected="selected"]').removeProp('selected');
$('#v4-31 option[value="100"]').prop('selected', 'selected');
$('#charityId_1').attr('checked', 'checked');


// Shipping calculator

$('head').append("<style>"
  + ".ges_button {"
     + "border: 1px solid #CCC;"
     + "background-color: #EEE;"
     + "padding: 3px;"
  + "}"
+ "</style>");

var button1 = "<span style='border: 1px solid #CCCCCC; background-color:#EEEEEE; padding: 3px;'";
var button2 = "</span>&nbsp;";

calcButtonList = {
    "general" : "General",
    "guitar" : "Guitar",
    "art" : "Frame/print",
//    "lot" : "Cub box",
    "long" : "Rug/long"
}

var myCalcButtons = "";

$.each(calcButtonList, function(index, value) {
   myCalcButtons = myCalcButtons
      + ""
      + button1
      + " class='calcType'"
      + " id='" + index + "'"
      + ">"
      + value
      + button2;
});

$('#ges_shipCalc').append("<div style='position:relative; top: -20px;' id='shipCalcContainer'>"
    + "<input type='hidden' id='ges_calcType' value='general'>"
    + "<div style='padding: 4px; border: 1px solid #AAA; width:400px;'>"
    + "<b>Shipping calculator</b><br><br>"
    + "<div style='padding:2px; position: relative; top: 4px;'>"
    + "<b>Type:</b>&nbsp;&nbsp;" + myCalcButtons + "</div>"
    + "<div style='padding:2px; position: relative; top: 8px;'><b>Dimensions:</b> <input id='ges_dim1' class='ges_shipCalcInput' size=5 style='position:relative; left:2px;'> <input id='ges_dim2' class='ges_shipCalcInput'  size=5> <input id='ges_dim3' class='ges_shipCalcInput'  size=5></div>"
    + "<div style='padding:2px; position: relative; top: 8px;'><b>Real weight:</b> <input id='ges_actualWeight' class='ges_shipCalcInput'  size=5></div>"
    + "<div style='padding:2px; position: relative; top: 8px;'><b id='ownBoxText'>Ship in own (current) box?</b> <input type='checkbox' id='ownBox'></div>"
    + "<span class='ges_button' id='ges_updateCalc' style='position: relative; top: 15px;'>Calculate</span>"
    + "<div style='padding:2px; position: relative; top: 14px;' id='myDimWeight'></div>"
    + "<div style='padding:8px; position: relative;' id='ges_shipCalcNote'></div>"
    + "</div></div>");

$('.calcType').bind("click", function(){
  $('.calcType').css('background-color', '#EEEEEE');
  $(this).css('background-color', '#AAAAAA');
  myCalcType = this.id;
  if(myCalcType =='art') {
	  $('#ownBoxText').html('Ship between cardboard (check with shipping)? ');
  } else {
	  $('#ownBoxText').html('Ship in own (current) box? ');
  }
  $('#ges_calcType').val(myCalcType);
  $('#ges_updateCalc').trigger("click");
});




$('.ges_shipCalcInput').bind("focusout", function(){
  $('#ges_updateCalc').trigger("click");
});


$('#ges_updateCalc').bind("click", function(){
  var pickup = 0;
	var bigGuitar = 0;
	var boxName = '';
	var calcType = $('#ges_calcType').val();
	var ownBox = $('#ownBox:checked').val(); 
	if (calcType == 'lot') {
		$('#ges_dim1').val('18').attr('disabled', 'true');
		$('#ges_dim2').val('24').attr('disabled', 'true');
	} else {
		if ($('#ges_dim1').val() == '--') {
			$('#ges_dim1').val('').attr('disabled', false);
			$('#ges_dim2').val('').attr('disabled', false);
		}
	}
	if ($('#ges_dim1').val().length && $('#ges_dim2').val().length && $('#ges_dim3').val().length) {
		baseDimensions = [Number($('#ges_dim1').val().replace(/[\D]/g, '')) + 0, Number($('#ges_dim2').val().replace(/[\D]/g, '')) + 0, Number($('#ges_dim3').val().replace(/[\D]/g, '')) + 0];
		baseDimensions.sort(function(a, b){return a-b});
		var list = [];
    
		$.each(baseDimensions, function(index, value){list[index] = value;});
		if (calcType == 'general') {
			if(ownBox == 'on') {
				$.each(list, function(index, value) { list[index] = value + 1; });
			} else {
				$.each(list, function(index, value) { list[index] = value + 4; });
			}
		} else if (calcType == 'guitar') {
			// do nothing: guitars don't get extra inches
		} else if (calcType == 'lot') {
			baseDimensions[0] = 18;
			baseDimensions[1] = 24;
			baseDimensions[2] = Number($('#ges_dim3').val().replace(/[\D]/g, ''));
			$.each(baseDimensions, function(index, value){list[index] = value;});
			list[2] = list[2] + 4;
			calcType = 'general'; // Make sure this is right! Operating under the assumption that lots are basically treated as generals.
		} else if (calcType == 'long') {
			list[0] = baseDimensions[0];
			list[1] = baseDimensions[1];
			list[2] = baseDimensions[2] + 4;
		}
		list.sort(function(a, b){return a-b});
//    console.log("list:");
//    console.dir(list);
		dimWeight = '';
		boxName = '';
		
    
    if(calcType =='guitar') {
			if (list[1] <= guitarBoxes['default'][1] && list[2] <= guitarBoxes['default'][2]) {
				// Which is to say, if the guitar is smaller than the threshold to use a regular box, in  both primary dimensions
				calcType = 'general';
				$.each(list, function(index, value) { list[index] = value + 4; });
			} else {
				results = compareBoxType(list, guitarBoxes);
				if (results['isInBox'] == 'no') {
					calcType = 'general';
					$.each(list, function(index, value) { list[index] = value + 4; });
					bigGuitar = 'yes';
				} else {
					dimWeight = results['dimWeight'];
					boxName = results['boxName'];
					corresponds = results['corresponds'];
					$.each(results['dimensions'], function(index, value) { list[index] = value; });
				}
			}
		} else if(calcType =='art') {
			if (ownBox == 'on'){
				if (baseDimensions[0] > 1) {
					alert('This item is too thick to be shipped between cardboard.');
					$.each(list, function(index, value) { list[index] = value + 4; });
					$('input#ownBox').attr('checked', false);
					ownBox = 'off';
				} else {
					list[0] = 2;
					list[1] = (list[1] + 3);
					list[2] = (list[2] + 3); 
					calcType = 'general';
				}
			}
			if (ownBox != 'on') {
				if (list[1] <= artBoxes['default'][1] && list[2] <= artBoxes['default'][2]) {
					calcType = 'general';
					$.each(list, function(index, value) { list[index] = value + 4; });
				} else {
					results = compareBoxType(list, artBoxes);
					if (results['isInBox'] == 'no') {
							calcType = 'general';
						$.each(list, function(index, value) { list[index] = value + 4; });
						pickup = 'yes';
					} else {
						dimWeight = results['dimWeight'];
						boxName = results['boxName'];
						corresponds = results['corresponds'];
						$.each(results['dimensions'], function(index, value) { list[index] = value; });
					}
				}
			}
		} else if(calcType =='long') {
			if (list[1] > 12) {
				pickup = 'yes';
				calcType = 'general';
			} else if (list[1] > 8) {
				list[0] = 13;
				list[1] = 13;
				calcType = 'general';
			//                   corresponds = '12x12 long box';
			} else {
				list[0] = 9;
				list[1] = 9;
			//                    corresponds = '8x8 long box';
				calcType = 'general';
			}
		}
    realWeight = Number($('#ges_actualWeight').val());
		if(!dimWeight) {
			volume = Number(list[0]) * Number(list[1]) * Number(list[2]);
			dimWeight = Number(volume) / upsDivisor;
		}
		var sgwDimList = ['itemLength', 'itemWidth', 'itemHeight'];
		$.each(list, function(index, value) {
//			$('#' + sgwDimList[index]).val(value);
		});
		dimWeight = Math.ceil(Math.max(dimWeight, (realWeight+2), 3));
		note = '';
    
		if (calcType == 'general') {
			var inUSPSBox = 'no';
			$.each(uspsBoxes, function( key, value ) {
				if (inUSPSBox == 'no') {
					if (list[0]-4 <= value[0] && list[1]-3 <= value[1] && list[2]-3 <= value[2]) {
						note = '<br><b><font color=\"blue\">This item <i><u><font size=4.5>may</font></u></i> fit in a ' + value['name'] + '.</font> <font size=5.5 color=\"red\" style=\"font-weight:bold;\">Use discretion.</font></b>';
            corresponds1 = value['corresponds'].replace(/ /g, "_");
            note = note + '<span style=\"position:relative; left: 20px; top:5px; border: 1px solid #CCCCCC; background-color:#EEEEEE; padding: 3px; z-index:99;\" class=\"' + corresponds1 + '\" id=\"useUSPS\">Use this (Post Office)</span><br><br>';
						inUSPSBox = 'yes';
					} else {
					}
				}
			});
		}
    
    
    if (boxName.length) {
			note = '<br><b><font size=5.5 color=\"blue\">' + boxName + '</font></b>';
		} else if (pickup.length || bigGuitar.length) {
			note = '<span style=\"position:relative; top:15px;\"><b><font color=\"red\">This item should most likely be pickup only.</font></b> Double-check with a manager.<br><br></span>';
			dimWeight = '<s>' + dimWeight + '</s>';
		} else if (!note.length){
			note ='';
		}
		if (typeof(corresponds) == 'undefined') {
			var corresponds = ''; 
		} else if (corresponds.length < 3) { 
			corresponds = ''; 
		}
		dimWeightNote = '<b>Dimensional weight:</b> <span id=\"dimWeightValue\" style=\"position: relative; left: 5px; font-size: 150%;\">';
		dimWeightNote = dimWeightNote + dimWeight;
		dimWeightNote = dimWeightNote + '</span>';
    corresponds2 = corresponds.replace(/ /g, "_");
		if (!pickup.length && !bigGuitar.length) { 
			dimWeightNote = dimWeightNote + '<br><span style=\"position:relative; left: 140px; top:8px; border: 1px solid #CCCCCC; background-color:#EEEEEE; padding: 3px; z-index:99;\" id=\"useUPS\" class=\"' + corresponds2 + '\" onclick=\"\">Use this (UPS)</span><br><br>';
		} else {
			dimWeightNote = dimWeightNote + '<br><span style=\"position:relative; left: 140px; top:8px; border: 1px solid #CCCCCC; background-color:#EEEEEE; padding: 3px; z-index:99;\" id=\"useUPS\" class=\"pickupOnly\" onclick=\"\">Use this (Pickup)</span><br><br>';
		}
    
    
    
    console.dir(guitarBoxes);
    
		$('#myDimWeight').html(dimWeightNote);
		$('#ges_shipCalcNote').html(note);
	}
});
