// ==UserScript==
// @name	SGW Fixer II - DEPRECATED
// @namespace	https://greasyfork.org
// @include	https://sellers.shopgoodwill.com/sellers/newAuctionItem-catsel.asp*
// @include	https://sellers.shopgoodwill.com/sellers/reviewItem-label.asp*
// @include	https://sellers.shopgoodwill.com/sellers/reviewItem-label.asp?state=2
// @include	http://localhost/sgw.html
// @version	7.2.1
// @description Implements numerous improvements to the functionality of the Shopgoodwill seller site.
// @grant	none
// @require	https://greasyfork.org/scripts/10208-gm-api-script/code/GM%20API%20script.js?version=54964
// @downloadURL https://update.greasyfork.org/scripts/14942/SGW%20Fixer%20II%20-%20DEPRECATED.user.js
// @updateURL https://update.greasyfork.org/scripts/14942/SGW%20Fixer%20II%20-%20DEPRECATED.meta.js
// ==/UserScript==

				 
				 
window.addEventListener ("message", receiveMessage, false);
var url = document.URL;

function receiveMessage (event) {
	var messageJSON;
	try {
		messageJSON = JSON.parse (event.data);
	}
	catch (zError) {
		// Do nothing
	}
	var safeValue = JSON.stringify(messageJSON);
	if (typeof(messageJSON['lastLocation'])!== "undefined") {
		GM_setValue("lastLocation", safeValue);
	} else {
		GM_setValue("storedPresets", safeValue);
	}
}

if (url == "https://sellers.shopgoodwill.com/sellers/reviewItem-label.asp?state=2") {
	var myLastLoc = JSON.parse(GM_getValue("lastLocation", ""));
	if (typeof myLastLoc !== "undefined") {
		$('a:contains("Add")').before("<span id='lastLoc' style='font-size:18px; position:relative; top:-15px;'>Location: "	+ myLastLoc['lastLocation']	+ "</span><br>");
		$('p').first().before("<p id='lastTitle'><b> "	+ myLastLoc['lastTitle']	+ "</b></p>");
		GM_deleteValue("lastLocation");
	}
}

if(url == "https://sellers.shopgoodwill.com/sellers/newAuctionItem-catsel.asp?clear=yes") {
	// Hides form if photos are not uploaded
		// the return URL from the photo uploader is:
		// https://sellers.shopgoodwill.com/sellers/newauctionitem-catsel.asp?btnSubmit=Return+to+item+entry
	$('#form1').hide(); //hide form1
}



if (GM_getValue("lastLocation")) {
	myLastLoc = JSON.parse(GM_getValue("lastLocation", ""));
//	console.log(url	+ ": Last location stored as "	+ myLastLoc['lastLocation']);
//	console.log(url	+ ": Last title: "	+	myLastLoc['lastTitle'])
}

// The name as listed is what the script looks for at the top of the page, as in "Welcome Firstname Lastname". 
//		(Any piece of that is fine: "John L", "John Linnell", and "hn Lin" would all pick out John Linnell)
// "buttonLock" : "yes" causes the shipping buttons to have a lock over them for that user
// "unlockY" : [number] is an optional argument that allows you to set the height of the unlock button (with icon): a larger number makes the
//		button lower on the page

var posters = {

	"Ann S" : {
		"name" : "Ann",
		"duration" : 7
	},
	"Jacob L" : {
		"name" : "Jacob",
		"duration" : 7,
		"skip" : "allow",
//		"CM" : "yes",
	},
	"Jackie C" : {
		"name" : "Jackie",
//		"CM" : "yes",
	},
	"Jeff H" : {
		"name" : "Jeff",
		"duration" : 7,
		"skip" : "allow",
		"CM" : "BIN",
	},
	"Jeremy J" : {
		"name" : "Jeremy",
//		"skip" : "allow",
		"CM" : "yes",
	},
	"Kathy O" : {
		"name" : "Kathy",
		"skip" : "allow",
	},
	"Nick Q" : {
		"name" : "Nick"
	},
	"Phalada X" : {
		"name" : "Phalada",
		"duration" : 7,
		"skip" : "allow",
//		"CM" : "yes",
	},
	"Steven R" : {
		"name" : "Steven",
		"skip" : "allow",
//		"CM" : "BIN",
	},
	"Tanya K" : {
		"name" : "Tanya"
	},
	"Tom B" : {
		"name" : "Tom",
	},
	"Valerie W" : {
		"name" : "Valerie",
		"duration" : 7,
		"skip" : "allow",
		"CM" : "yes",
	},
}


var thisPoster = "";

$.each(posters, function(name, info) { //working 10/27
	re = new RegExp(name,"gi");
	if(re.exec($(".smtext").html())) {
		thisPoster = name.replace(/ /gi,"");
		console.log(thisPoster);
	}
});

var presetTypes = {
		"Store" : "",
		"Shipping Weight" : "",
		"Display Weight" : "",
		"Location" : "",
		"Duration" : "",
		"Ship Charge" : "",
		"Ship Type" : "", 
	//				^^^	general, guitar, art, lot, long, Media <---- note the capital M!
		"Ship in own box/between cardboard" : "", 
	//										^^^ yes for yes, any other value defaults to no
		"Dimension 1" : "",
		"Dimension 2" : "",
		"Dimension 3" : "",	
		"Skip" : "",
		"Owner" : "",
}

if (GM_getValue("storedPresets")) {
	var presets = JSON.parse (GM_getValue("storedPresets"));
	if (!presets.hasOwnProperty('Owner') || presets['Owner'] != thisPoster) {
		if(presets['Skip'] == 'skip') {
//			console.log('Skip==skip');
			$("head").append("<script id='docready3'>$(document).ready(function() {"
								+ "myURL = document.URL;"
								+ "if (myURL.indexOf('reviewItem') > 0) {"
									+ "$('input[name=\"submit\"]').trigger('click');"
								+ "}"
							+ "});</script>");
		} else {
		}
		presets = {
			"Store" : "",
			"Shipping Weight" : "",
			"Display Weight" : "",
			"Location" : "",
			"Duration" : "",
			"Ship Charge" : "",
			"Ship Type" : "", 
		//				^^^	general, guitar, art, lot, long, Media <---- note the capital M!
			"Ship in own box/between cardboard" : "", 
		//										^^^ yes for yes, any other value defaults to no
			"Dimension 1" : "",
			"Dimension 2" : "",
			"Dimension 3" : "",
			"Skip" : "",
			"Owner" : thisPoster,
	 };
	} else {
		if (!presets.hasOwnProperty('Duration')) {
			presets['Duration'] = "";

		} else {
		}
		if(presets['Skip'] == 'skip') {
			$("head").append("<script id='docready3'>$(document).ready(function() {"
								+ "myURL = document.URL;"
								+ "if (myURL.indexOf('reviewItem') > 0) {"
									+ "$('input[name=\"submit\"]').trigger('click');"
								+ "}"
							+ "});</script>");
		} else {
			console.log('Skip!=skip');
		}
	}
} else { 
	var presets = {
		"Store" : "",
		"Shipping Weight" : "",
		"Display Weight" : "",
		"Location" : "",
		"Duration" : "",
		"Ship Charge" : "",
		"Ship Type" : "", 
	//				^^^	general, guitar, art, lot, long, Media <---- note the capital M!
		"Ship in own box/between cardboard" : "", 
	//										^^^ yes for yes, any other value defaults to no
		"Dimension 1" : "",
		"Dimension 2" : "",
		"Dimension 3" : "",
		"Skip" : "",
		"Owner" : thisPoster,
	};
}

var myPresets = "";

var presetBox = "<div id='presetBox' style='position:relative; left:15px; display:none;'><b style='font-size:22px;'>Set presets:</b><br><br></div><br>";
$('p:contains("photos are uploaded")').after(presetBox);
$.each(presetTypes, function(key, value){
	var myVal = presets[key];
	if (myVal && myVal.length) {
		myPresets	+= "<div id='presetSpan"	+ key	+ "' class='presetSpan' ><b>"	+ key	+ ":</b> "	+ myVal	+ "<br></div>";
	}

	key2 = "<b>"	+ key	+ "</b>"
	if (key == 'Ship Type') {
		key2	+= " (general, guitar, art, long, <b><u>M</u></b>edia, pickup)";
	} else if (key == "Ship in own box/between cardboard") {
		key2 = "<b>Own box/cardboard:</b> (yes or blank/no)";
	}
	key2	+= ": ";
	$('#presetBox').append("<span id='presetInput"	+ key	+ "'>"	+ key2	+ "<input id='preset"	+ key	+ "' value="	+ myVal	+ "><br></span>");
});

$('#presetInputOwner').hide();

if (myPresets.length) {
	myPresets = "<div id='myPresets' style='width:300px; border: 3px solid red; background-color:#FFFF11; padding:25px;'><b style='font-size:24px;'>Presets:</b><br>"	+ myPresets	+ "</div><br>";
	$('#presetBox').before(myPresets);
	$('#myPresets').data("data", presets);
}

if(myPresets['Ship Type'] == "media") {
	myPresets['Ship Type'] = "Media";
}


$('#presetBox').append("<br><span id='updatePresetsButton' style='border: 1px solid #CCCCCC; background-color:#EEEEEE; padding: 3px;' onclick='javascript:updatePresets();$(\"#presetBox\").hide();$(\"#presetBoxButton\").show();'><b>Update presets</b></span>");
$('#presetBox').after("<br><span id='presetBoxButton' style='border: 1px solid #CCCCCC; background-color:#EEEEEE; padding: 3px;' onclick='javascript:$(\"#presetBox\").show();$(\"#presetBoxButton\").hide();'><b>Edit presets</b></span>");

$('#presetLocation').attr('id', 'tempLoc');
$('#tempLoc').after("<select id='presetLocation'></select>");
$('#tempLoc').remove();
var shelves=["", "01-01","01-02","01-03","01-04","01-05","01-06","01-07","01-08","01-09","01-10","02-01","02-02","02-03","02-04","02-05","02-06","02-07","02-08","02-09","02-10","02-11","02-12","02-13","02-14","02-15","03-01","03-02","03-03","03-04","03-05","03-06","03-07","03-08","03-09","03-10","03-11","03-12","03-13","03-14","03-15","04-01","04-02","04-03","04-04","04-05","04-06","04-07","04-08","04-09","04-10","04-11","04-12","04-13","04-14","04-15","05-01","05-02","05-03","05-04","05-05","05-06","05-07","05-08","05-09","05-10","05-11","05-12","05-13","05-14","06-01","06-02","06-03","06-04","06-05","06-06","06-07","06-08","06-09","06-10","06-11","06-12","06-13","06-14","06-15","06-16","06-17","06-18","06-19","06-20","06-21","06-22","06-23","06-24","06-25","07-01","07-02","07-03","07-04","07-05","07-06","07-07","07-08","07-09","07-10","07-11","07-12","07-13","07-14","07-15","07-16","07-17","07-18","07-19","07-20","07-21","07-22","07-23","07-24","07-25","08-01","08-02","08-03","08-04","08-05","08-06","08-07","08-08","08-09","08-10","08-11","08-12","08-13","08-14","08-15","08-16","08-17","08-18","08-19","08-20","08-21","08-22","08-23","08-24","08-25","09-01","09-02","09-03","09-04","09-05","09-06","09-07","09-08","09-09","09-10","09-11","09-12","09-13","09-14","09-15","09-16","09-17","09-18","09-19","09-20","09-21","09-22","09-23","09-24","09-25","10-01","10-02","10-03","10-04","10-05","10-06","10-07","10-08","10-09","10-10","10-11","10-12","10-13","10-14","10-15","10-16","10-17","10-18","10-19","10-20","10-21","10-22","10-23","10-24","10-25","11-01","11-02","11-03","11-04","11-05","11-06","11-07","11-08","11-09","11-10","11-11","11-12","11-13","11-14","11-15","11-16","11-17","11-18","11-19","11-20","11-21","11-22","11-23","11-24","11-25","12-01","12-02","12-03","12-04","12-05","12-06","12-07","12-08","12-09","12-10","12-11","12-12","12-13","12-14","12-15","12-16","12-17","12-18","12-19","12-20","12-21","12-22","12-23","12-24","12-25","13-01","13-02","13-03","13-04","13-05","13-06","13-07","13-08","13-09","13-10","13-11","13-12","13-13","13-14","13-15","13-16","13-17","13-18","13-19","13-20","13-21","13-22","13-23","13-24","13-25","14-01","14-02","14-03","14-04","14-05","14-06","14-07","14-08","14-09","14-10","14-11","14-12","14-13","14-14","14-15","14-16","14-17","14-18","14-19","14-20","14-21","14-22","14-23","14-24","14-25","15-01","15-02","15-03","15-04","15-05","15-06","15-07","15-08","15-09","15-10","15-11","15-12","15-13","15-14","15-15","15-16","15-17","15-18","15-19","15-20","15-21","15-22","15-23","15-24","15-25","16-01","16-02","16-03","16-04","16-05","16-06","16-07","16-08","16-09","16-10","16-11","16-12","16-13","16-14","16-15","16-16","16-17","16-18","16-19","16-20","16-21","16-22","16-23","16-24","16-25","16-26","16-27","16-28","16-29","16-30","17-01","17-02","17-03","17-04","17-05","17-06","17-07","17-08","17-09","17-10","17-11","17-12","17-13","17-14","17-15","17-16","17-17","17-18","17-19","17-20","17-21","17-22","17-23","17-24","17-25","17-26","17-27","17-28","17-29","17-30","18-01","18-02","18-03","18-04","18-05","18-06","18-07","18-08","18-09","18-10","18-11","18-12","18-13","18-14","18-15","18-16","18-17","18-18","18-19","18-20","18-21","18-22","18-23","18-24","18-25","19-01","19-02","19-03","19-04","19-05","19-06","19-07","19-08","19-09","19-10","19-11","19-12","19-13","19-14","19-15","19-16","19-17","19-18","19-19","19-20","19-21","19-22","19-23","19-24","19-25","20-01","20-02","20-03","20-04","20-05","20-06","20-07","20-08","20-09","20-10","20-11","20-12","20-13","20-14","20-15","20-16","20-17","20-18","20-19","20-20","20-21","20-22","20-23","20-24","20-25","21-01","21-02","21-03","21-04","21-05","21-06","21-07","21-08","21-09","21-10","21-11","21-12","21-13","21-14","21-15","21-16","21-17","21-18","21-19","21-20","21-21","21-22","21-23","21-24","21-25","22-01","22-02","22-03","22-04","22-05","22-06","22-07","22-08","22-09","22-10","22-11","22-12","22-13","22-14","22-15","22-16","22-17","22-18","22-19","22-20","22-21","22-22","22-23","22-24","22-25","22-26","22-27","22-28","23-01","23-02","23-03","23-04","23-05","23-06","23-07","23-08","23-09","23-10","23-11","23-12","23-13","23-14","23-15","23-16","23-17","23-18","23-19","23-20","23-21","23-22","23-23","23-24","23-25","23-26","23-27","23-28","24-01","24-02","24-03","24-04","24-05","24-06","24-07","24-08","24-09","24-10","24-11","24-12","24-13","24-14","24-15","24-16","24-17","24-18","24-19","24-20","24-21","24-22","24-23","24-24","24-25","24-26","24-27","24-28","25-01","25-02","25-03","25-04","25-05","25-06","25-07","25-08","25-09","25-10","25-11","25-12","25-13","25-14","25-15","25-16","25-17","25-18","25-19","25-20","25-21","25-22","25-23","25-24","25-25","25-26","25-27","25-28","26-01","26-02","26-03","26-04","26-05","26-06","26-07","26-08","26-09","26-10","26-11","26-12","26-13","26-14","26-15","26-16","26-17","26-18","26-19","26-20","26-21","26-22","26-23","26-24","26-25","26-26","26-27","26-28","27-01","27-02","27-03","27-04","27-05","27-06","27-07","27-08","27-09","27-10","27-11","27-12","27-13","27-14","27-15","27-16","27-17","27-18","27-19","27-20","27-21","27-22","27-23","27-24","27-25","27-26","27-27","27-28","28-01","28-02","28-03","28-04","28-05","28-06","28-07","28-08","28-09","28-10","28-11","28-12","28-13","28-14","28-15","28-16","28-17","28-18","28-19","28-20","28-21","28-22","28-23","28-24","28-25","28-26","28-27","28-28","29-01","29-02","29-03","29-04","29-05","29-06","29-07","29-08","29-09","29-10","29-11","29-12","29-13","29-14","29-15","29-16","29-17","29-18","29-19","29-20","29-21","29-22","29-23","29-24","29-25","29-26","29-27","29-28","Art1- Top","Art1-Bottom","Art2- Top","Art2-Bottom","Art3- Top","Art3-Bottom","ARTBLUE-BOTTOM","ARTBLUE-TOP","Floor1","HOLD-01","HOLD-02","HOLD-03","HOLD-04","HOLD-05","HOLD-06","HOLD-07","HOLD-08","HOLD-09","HOLD-10","HOLD-11","Hold-Floor","Hold_A-H","Hold_I-P","Hold_Q-Z","J01-01","J01-02","J01-03","J01-04","J01-05","J01-06","J01-07","J01-08","Rack1-A","Rack1-B","Rack2-A","Rack2-B","Rack3-A","Rack3-B","Rack4-A","Rack4-B","Rugs","Safe","Warehouse"];
$.each(shelves, function(key, val){
	$('#presetLocation').append("<option value='"	+ val	+ "'>"	+ val	+ "</option>");
});


$('#presetStore').attr('id', 'tempStore');
$('#tempStore').after($('#itemsellerstore').clone().attr('id', 'presetStore'));
$('#tempStore').remove();
$('#presetStore').prepend("<option val=''></option>");


$("#form1").append("<script id='jqueryui' src='https://code.jquery.com/ui/1.11.4/jquery-ui.js'></script>");
$("#form1").append("<div id='combineCheck' style='display:none;'>false</div>");
var upsDivisor = 225;

// These are editable! Format is as follows:
//
// "Button name" : price,
//
// Important notes:
// 1. Name MUST be in quotation marks.
// 2. A comma MUST follow the price, 

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
	"Lt clothing" : {
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
	},
	"Sm guitar box" : {
		"note" : "6x18x44 guitar box",
		"tooltip" : "Interior dimensions: 6x18x44; shipping weight: "	+ Math.ceil((7*19*45)/upsDivisor),
		"weight" : Math.ceil((7*19*45)/upsDivisor),
		"method" : "UPS"
	},
	"Lg guitar box" : {
		"note" : "8x20x50 guitar box",
		"tooltip" : "Interior dimensions: 8x20x50; shipping weight: "	+ Math.ceil((9*21*51)/upsDivisor),
		"weight" : Math.ceil((9*21*51)/upsDivisor),
		"method" : "UPS"
	},
	"Sm print box" : {
		"note" : "5x24x30 print box",
		"tooltip" : "Interior dimensions: 5x24x30; shipping weight: "	+ Math.ceil((6*24*31)/upsDivisor),
		"weight" : Math.ceil((6*24*31)/upsDivisor),
		"method" : "UPS"
	},
	"Lg print box" : {
		"note" : "5x30x36 print box",
		"tooltip" : "Interior dimensions: 5x30x36; shipping weight: "	+ Math.ceil((6*31*37)/upsDivisor),
		"weight" : Math.ceil((6*31*37)/upsDivisor),
		"method" : "UPS"
	},
	"Huge print box" : {
		"note" : "5.5x36x40 print box",
		"tooltip" : "Interior dimensions: 5.5x36x39; shipping weight: "	+ Math.ceil((7*37*40)/upsDivisor),
		"weight" : Math.ceil((7*37*40)/upsDivisor),
		"method" : "UPS"
	},
/*	"8x8 long box" : {
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
		"tooltip" : "Interior dimensions: 9x12x12; shipping weight: "	+ Math.ceil((10*13*13)/upsDivisor),
		"weight" : Math.ceil((10*13*13)/upsDivisor),
		"method" : "UPS"
	},
	"Med coat box" : {
		"note" : "6x14x18 coat box",
		"tooltip" : "Interior dimensions: 6x14x18; shipping weight: "	+ Math.ceil((7*15*19)/upsDivisor),
		"weight" : Math.ceil((7*15*19)/upsDivisor),
		"method" : "UPS"
	},
	"Very lg coat box" : {
		"note" : "10x14x18 coat box",
		"tooltip" : "Interior dimensions: 10x14x18; shipping weight: "	+ Math.ceil((11*15*19)/upsDivisor),
		"weight" : Math.ceil((11*15*19)/upsDivisor),
		"method" : "UPS"
	},
	"Standard sm UPS box" : {
		"note" : "6.25x7.25x10.25 small box",
		"tooltip" : "Interior dimensions: 6.25x7.25x10.25; shipping weight: "	+ Math.ceil((7*8*11)/upsDivisor),
		"weight" : Math.ceil((7*8*11)/upsDivisor),
		"method" : "UPS",
	},
/*	"Sew mchn w/case" : {
		"note" : "20x14x18 box",
		"tooltip" : "Interior dimensions: 14x18x20; shipping weight: "	+ Math.ceil((15*19*21)/upsDivisor),
		"weight" : Math.ceil((15*19*21)/upsDivisor),
		"method" : "UPS",
	},
	"Sew mchn, no case" : {
		"note" : "10x14x18 box",
		"tooltip" : "Interior dimensions: 10x14x18; shipping weight: "	+ Math.ceil((11*15*19)/upsDivisor),
		"weight" : Math.ceil((11*15*19)/upsDivisor),
		"method" : "UPS",
	}*/
};

var minimumWeight = 3; // This is the minimum weight we'll charge.


// This next section sets up our default boxes.

// It's CRITICALLY IMPORTANT that the dimensions for these boxes get listed in ascending order (e.g. 8, 17, 36).

// "Interior" is the interior dimensions of the box - how large an item can fit inside. "Exterior" is the set of dimensions used to calculate the weight.
// The reason that these are defined separately is so that we can require a varying amount of padding per dimension and per box.

var guitarBoxes = {
	"default" : {
		0 : 8,
		1 : 17,
		2 : 36
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
		0 : 6,
		1 : 18,
		2 : 20
	},
	"boxes" : {
		1 : {
			"interior" : {
				0 : 3,
				1 : 20,
				2 : 20
			},
			"exterior" : {
				0 : 6,
				1 : 25,
				2 : 25
			}
		},
		2 : {
			"interior" : {
				0 : 3,
				1 : 20,
				2 : 26
			},
			"exterior" : {
				0 : 6,
				1 : 25,
				2 : 31
			},
			"name" : "Small print box",
		"corresponds" : "Sm print box"
		},
		3 : {
			"interior" : {
				0 : 3,
				1 : 26,
				2 : 32
			},
			"exterior" : {
				0 : 6,
				1 : 31,
				2 : 37
			},
			"name" : "Large print box",
		"corresponds" : "Lg print box"
		},
/*	4 : {
			"interior" : {
				0 : 3.5,
				1 : 36,
				2 : 48
			},
			"exterior" : {
				0 : 7,
				1 : 37,
				2 : 49
			},
			"name" : "Huge print box",
		"corresponds" : "Huge print box"
		},*/
	}
};

var uspsBoxes = {
	"smallFlat1" : {
	/* Because these are billed at a flat rate, they also don't need two separate sets of dimensions. All we need to know is if the item will fit. */
		0 : 1.25,
		1 : 4.75,
		2 : 8.25,
		"name" : "small ($6.80) flat rate box",
	"corresponds" : "Sm flat rate box"
	},
	"medFlat1" : {
		0 : 3.25,
		1 : 11.75,
		2 : 13.25,
		"name" : "medium ($13.00) flat rate box",
	"corresponds" : "Med flat rate box"
	},
	"medFlat2" : {
		0 : 5.25,
		1 : 8.25,
		2 : 10.75,
		"name" : "medium ($13.00) flat rate box",
	"corresponds" : "Med flat rate box"
	},
}

var generalBoxes = [
	{
		"interior" : [
			8,
			8.75,
			11.25
		],
		"name" : "11.25x8.75x8",
		"cut" : "0",
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
			6,
			14,
			18
		],
		"name" : "18x14x6",
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
			48
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
			40
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
			9,
			11,
			14
		],
		"name" : "9x14x11",
		"cut" : "1",
	},
	{
		"interior" : [
			6.5,
			10,
			24
		],
		"name" : "24x10x6.5",
		"cut" : "0",
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
			
$.each(generalBoxes, function(boxIndex, boxObject){
	exterior = [];
	
	dimWeight = 1;
	$.each(boxObject.interior, function(interiorIndex, interiorValue) { 
		exteriorValue = Math.ceil(interiorValue)+1;
		dimWeight *= exteriorValue;
		exterior.push(exteriorValue);
	});
	
	this.exterior = exterior;
	this.dimWeight = Math.ceil(dimWeight / upsDivisor);
});
		
$.each(generalBoxes, function(boxIndex, boxObject){
//	console.log(this.name	+ " : "	+ this.dimWeight);
});
			 


// Okay, please don't mess with anything below here, though, if you aren't up on your javascript.
// If you ARE up on your javascript... please don't judge. I learned as I went and vice-versa. >.>

var button1 = "<span style='border: 1px solid #CCCCCC; background-color:#EEEEEE; padding: 3px;'";
var button2 = "</span>&nbsp;";
			 
if ($('input[name="authentic"]').length) {
	$('input[name="authentic"]').attr('checked', true);
}


$("body").prepend("<div id='upsDivisor' style='display:none;'>"	+ upsDivisor	+ "</div>");
$("body").prepend("<div id='currentDimWeight' style='display:none;'>9999</div>");
		$("body").prepend("<div id='calculatedBox' style='display-none;'></div>");
var shippingOptions = "";
var buttonCount = 0;
$.each( shippingMethods, function( key, value ) {
		shippingOptions = shippingOptions	+ "<span name='"	+ key	+ "' style='border: 1px solid #CCCCCC; background-color:#EEEEEE; padding: 3px;' id='"	+ key	+ "' class='shipCharge shipType'>"	+ key	+ "</span>&nbsp;&nbsp;";
		if (key == 'Med clothing' || key == 'Huge print box') {
			shippingOptions = shippingOptions	+ "<br><br>";
		}
		buttonCount++;
}); 
			 
$('.shipType').css('font-size','4');
$("b:contains('Shipping Charge')").before("<div id='shippingOptions' style='position:relative; bottom:20px;font-size:14px'></div>");

$('#shippingOptions').after("<br><br>");

$("body").prepend("<div id='boxDefinitions' style='display:none;'></div>");
$("#boxDefinitions").data('defs', shippingMethods);


$('input[name="itemNoCombineShipping"]').attr('checked', true);
$('input[name="itemAutoInsurance"]').attr( "disabled", false );
if ($('font:contains(\"Uploading images\")').length) {
	$('input[name="itemAutoInsurance"]').before('<div style="position:relative;"><div style="position: absolute;top:0;left:0;width: 200px;height:40px;background-color: blue;z-index:99;opacity:0;filter: alpha(opacity = 50)"></div></div>');
	$('input[name="itemShippingPrice"]').before('<div id="shipPriceLock" style="position:relative;"><div style="position: absolute;top:0;left:0;width: 90px;height:22px;background-color: gray;z-index:99;opacity:0.2;filter: alpha(opacity = 50)"></div></div>');
	$('#itemShipMethod').before('<div id="shipMethodLock" style="position:relative;"><div style="position: absolute;top:0;left:0;width: 100px;height:22px;background-color: gray;z-index:99;opacity:0.2;filter: alpha(opacity = 50)"></div></div>');
	$('#itemShipMethod').after("<br><br>"	+ button1	+ "<span onclick=\"$('#shipMethodLock').remove();\" style='position:relative; left: 50px; margin:10px;'>Unlock shipping method</span>"	+ button2	+ "<br>");
}
var currentDur = $('select[name=\"itemDuration\"]').val();
			 
var cmAllow = "no";
var cmBIN = "no";
$('select[name=\"itemDuration\"]').replaceWith("<input name='itemDuration' id='itemDuration' value='"	+ currentDur	+ "' min='0' max='15'>");

$.each(posters, function(name, info) { //here2
	re = new RegExp(name,"gi");
	if(re.exec($(".smtext").html())) {
		if (info["buttonLock"] == "yes") {
			var unlockY = 1535;
			if (info["unlockY"]) {
				unlockY = info["unlockY"];
			}
			$('#shippingOptions').before('<div class="shipButtonLock" id="shipButtonLock" title="Click the lock button to unlock" style="position:relative;"><div style="position: absolute;top:-45;left:0;width: 717px;height:122px;background-color: grey;z-index:89;opacity:0.2;filter: alpha(opacity = 50)"></div></div>');
			$('#shippingOptions').before('<div class="shipButtonLock" style="position:absolute; left:696px; top:'	+ unlockY	+ 'px; width:50px; height:50px; background-color:#BBBBBB; z-index:999;opacity:100; border: 1px solid #888888; margin-left: auto; margin-right: auto;" onclick="javascript:$(\'.shipButtonLock\').hide(\'explode\');"><img src="http://simpleicon.com/wp-content/uploads/lock-10.png" style="width:40px; height: 40px; position: relative; top: 50%; -webkit-transform: translateY(-50%); -ms-transform: translateY(-50%); transform: translateY(-50%); margin-left: auto; margin-right: auto; left:5px;"></div>');
		}
		if (info['skip'] && info['skip'] == 'allow') {
		} else {
			$('#presetInputSkip').hide();
		}
		if (info['CM'] == 'yes' || info['CM'] == 'BIN') {
			cmAllow = "yes";
			if (info['CM'] == 'BIN') {
				cmBIN = "yes";
			}
		}
		if (info['duration']) {
			$('#itemDuration').attr('value', info['duration']);
// Suck it, javascript. Why do I have to use attr() for this?! Why won't val() freaking work?! God, I hate you.
		}
	$("body").append("<div id='posterName' style='display:none;'>"	+ info['name']	+ "</div>");
	}
});

// Cyber Monday buttons

    now = new Date();
    currentDate = now.getDate();
    cyberMondayStart = 29;
    daysTillCMStart = cyberMondayStart - currentDate;
    cyberMonday = 36;
    daysTillCM = cyberMonday - currentDate;
    if (cmAllow == "yes") {
//			$('strong:contains("Shipping Weight")').before("butts");
//        $('#BINBoxShowButton').after("<br><br>sdfdsf<span style='border: 1px solid #CCCCCC; background-color:#ffbf80; padding: 5px; font-size:14px;' id='cyberMondayDurButton' onclick='javascript:$(\"#itemDuration\").val(" + daysTillCM + "); $(\".bidStartDurBox\").show(); $(\"#bidStartDurBoxButton\").hide();'>Cyber Monday</span>");
			  $('strong:contains("Shipping Weight")').before("<span style='border: 1px solid #CCCCCC; background-color:#ffbf80; padding: 5px; font-size:14px;' id='cyberMondayDurButton' onclick='javascript:$(\"#itemDuration\").val(" + daysTillCM + "); $(\".bidStartDurBox\").show(); $(\"#bidStartDurBoxButton\").hide();'>Linked Sale</span><br><br>");
        if (daysTillCMStart > 0) {
            $('#cyberMondayDurButton').after("&nbsp;<span style='border: 1px solid #CCCCCC; background-color:#ffbf80; padding: 5px; font-size:14px;' id='cyberMondayDelayedButton' onclick='javascript:$(\"#itemStartOffset\").val(" + daysTillCMStart + "); $(\"#itemstarttime\").val(\"6:00\"); $(\"#itemDuration\").val(" + (cyberMonday - cyberMondayStart) + "); $(\".bidStartDurBox\").show(); $(\"#bidStartDurBoxButton\").hide();'>Linked Sale (pre-post)</span>");
        }
        if (cmBIN == "yes") {
            $('#cyberMondayDurButton').after("&nbsp;<span style='border: 1px solid #CCCCCC; background-color:#ffb3b3; padding: 5px; font-size:14px;' id='cyberMondayBINButton' onclick='javascript:$(\"#itemStartOffset\").val(" + daysTillCM + "); $(\"#itemstarttime\").val(\"6:00\"); $(\"#itemDuration\").val(7); $(\".bidStartDurBox\").show(); $(\"#bidStartDurBoxButton\").hide(); binButton();'>Linked Sale BIN</span>");
        }
    }



	$("select[name=itemStartOffset]").attr('tabindex', "-1");
		$("select[name=itemstarttime]").attr('tabindex', "-1");
		$("select[name=itemDuration]").attr('tabindex', "-1");
		$("select[name=itemEndTime]").attr('tabindex', "-1");
		$("#itemShipMethod").attr('tabindex', "-1");
	$('input[name="itemShippingPrice"]').attr('tabindex', "-1");
	$('input[name="itemNoCombineShipping"]').attr('tabindex', "-1");
	$("#itemAutoInsurance").attr('tabindex', "-1");

// Something is broken: having the above lines where they were (toward the bottom), they suddenly stopped working when the counter was fixed - moving them up caused them to work again... IDFK

$("#WebWizRTE, #itemDescription").height(700);
$("#WebWizRTE, #itemDescription").width(810);
re = new RegExp("(ry Sn)","gi");
if(re.exec($(".smtext").html())) {
	$("#itemDescription").width(800);
}
$("#s1").attr("size", 100);





$("strong:contains('Item Title')").prepend("<script type=text/javascript>function capsButton(){ var myText = $('input[name=itemTitle]').val(); var small = ['the', 'by', 'iPod', 'iPad', 'iMac', 'iTunes', 'w/', 'ft', 'in', 'at', 'or', 'lb', 'lbs']; var titleCase = function(str, glue){ glue = (glue) ? glue : ['of', 'for', 'and']; return str.replace(/(\w)(\w*)/g, function(_, i, r){ var j = i.toUpperCase()	+ (r != null ? r : ''); return (glue.indexOf(j.toLowerCase())<0)?j:j.toLowerCase(); }); }; var myNewTitle = titleCase(myText, small); var myNewTitle = myNewTitle.replace('•	', '');	$('input[name=itemTitle]').val(myNewTitle); $('input[name=itemTitle]').val(); }</script>");	
$("strong:contains('Item Title')").prepend("<br>");
$("input[name=itemTitle]").attr("maxlength",50);
$("input[name=itemTitle]").attr("onkeyup", "javascript: var length=$('input[name=itemTitle]').val().length,remaining=50-length;$('#myCounter').html(remaining);");
$("input[name=itemTitle]").attr("onkeypress", "");
$("#myCounter").html("50");
//$("input[name=itemTitle]").after("&nbsp;<span style='border: 1px solid #CCCCCC; background-color:#EEEEEE; padding: 3px;' onclick='javascript:$(\"input[name=itemTitle]\").css(\"text-transform\", \"capitalize\");'>Capitalize</span><br>");
//$("input[name=itemTitle]").after("&nbsp;<span style='border: 1px solid #CCCCCC; background-color:#EEEEEE; padding: 3px;' onclick='capsButton();'>Capitalize</span><br>");	



$('font:contains("Numbers and decimal point")').after("<br><br>"	+ button1	+ "<span onclick=\"setToUSPS(prompt('Price?'));\" style='position:relative; left: 50px; margin:10px;'>Set Post Office shipping charge</span>"	+ button2	+ "<br>");

$('strong:contains("Private Description")').hide();
$('#itemSellerInfo').hide();

$('p:contains("optimization")').hide();

shippingOptions = shippingOptions	+ "<br><br>"	+ button1	+ "class='shipType' id='UPS'><b>UPS</b>"	+ button2;
shippingOptions = shippingOptions	+ ""	+ button1	+ "class='shipType' id='pickupOnly' name='pickupOnly'><b>Pickup Only</b>"	+ button2;

$("#shippingOptions").html(shippingOptions);



//	var html = document.getElementById('form1').children[0].children[0].children[1].children[1];
//	var html2 = document.getElementById('form1').children[2].children[0].children[0].children[0];

	var html = $('#form1 > table > tbody > tr:eq(1) > td:eq(1)')[0];
	var html2 = $('#form1 > table:eq(1) > tbody > tr > td')[0];

	



	html2.innerHTML = html2.innerHTML.replace(/You will be advised[\s\S]*place your listing[\s\S]*will be assessed[\s\S]*in the next screen\./g,"");
	$("p:contains('Make sure you know')").hide();
	$("p:contains('Please review the')").hide();
	$("p:contains('read shopgoodwill')").hide();

	$("hr").hide();
	

	$('p:contains("Starting Bid")').addClass("bidStartDurBox");
	$('p:contains("Auction Duration")').addClass("bidStartDurBox").after("<br><br>");
	$('p:contains("Auction Duration")').after("<span style='border: 1px solid #CCCCCC; background-color:#EEEEEE; padding: 2px; font-size:12px;' id='bidStartDurBoxButton' onclick='javascript:$(\".bidStartDurBox\").show().after();$(\"#bidStartDurBoxButton\").hide();'>Starting bid, start time, duration</span><br>")
	$('#bidStartDurBoxButton').after("<span style='border: 1px solid #CCCCCC; background-color:#EEEEEE; padding: 2px; font-size:12px;' id='BINBoxShowButton' onclick='javascript:binButton();'>Buy now price</span>");
	$('.bidStartDurBox').hide();

	$('select[name="itemStartOffset"]').attr("id", "itemStartOffset");
	$('select[name="itemstarttime"]').attr("id", "itemstarttime");
	$('input[name="itemDuration"]').attr("id", "itemDuration");

	html.innerHTML = html.innerHTML.replace("onblur", "alt");
	html.innerHTML = html.innerHTML.replace(/<hr align="center" noshade="" width="350">/g,"");
	html.innerHTML = html.innerHTML.replace(/pounds((.|\n)*)oversized packages\./g,"");
	html.innerHTML = html.innerHTML.replace(/Shipping Charge allows((.|\n)*)United States\./g,"");
	$('b:contains("Set the Shipping Charge")').hide();
	html.innerHTML = html.innerHTML.replace(/to use the default shipper's rate calculator\./g,"");
	html.innerHTML = html.innerHTML.replace(/This is the number((.|\n)*)become active\./g,"");
	html.innerHTML = html.innerHTML.replace(/This is the number((.|\n)*)will end\./g,"");
	$('font:contains("UPS dimensional weight calculator click")').hide();
	html.innerHTML = html.innerHTML.replace(/Select this option to change the shipping method from your default method\./g,"");
	html.innerHTML = html.innerHTML.replace(/One line((.|\n)*)find your item\.|You may use((.|\n)*)do not use HTML\.|For |Dutch auctions((.|\n)*)selling a single set\.|This is the price((.|\n)*)and commas \(','\)|Bid increment is((.|\n)*)each bid\.|Reserve Price is((.|\n)*)Reserve Price!|Buy Now allows((.|\n)*)Buy Now!/g, "");
	html.innerHTML = html.innerHTML.replace(/Item Quantity((.|\n)*)itemQuantity" size="3" value="1">/g, "<span id=\"qtyBox\" style=\"display:none;\"><input maxlength=\"3\" name=\"itemQuantity\" size=\"3\" value=\"1\"></span></strong>");
	html.innerHTML = html.innerHTML.replace(/per item((.|\n)*): 3\.00/g, "");	
	html.innerHTML = html.innerHTML.replace(/Bid Increment((.|\n)*)10\.00/g, "<span id=\"incrementReserveBox\" style=\"display:none;\"><b>Bid increment:</b> <input maxlength=\"11\" name=\"itemBidIncrement\" size=\"9\" value=\"1\"><br><b>Reserve price:</b> <input maxlength=\"11\" name=\"itemReserve\" size=\"9\" value=\"0\"><br></span><span id=\"BINBox\" style=\"display:none;\"><b>Buy now price:</b> <input maxlength=\"11\" name=\"itemBuyNowPrice\" size=\"9\" value=\"0\"> </strong>(leave at 0 to not have buy-it-now as an option)</span></strong>");
	html.innerHTML = html.innerHTML.replace(/Box Selection((.|\n)*)willing to ship your item\./g, "<span id=\"boxBox\" style=\"display:none;\"><select name=\"itembox\"><option value=\"-1\">No Boxes Defined</option></select><select name=\"itemShipping\" id=\"itemShipping\" size=\"1\"><option value=\"2\">U.S. and Canada Only</option><option value=\"0\" selected=\"\">No international shipments (U.S. Only)</option><option value=\"1\">Will ship internationally</option></select></span></strong></b>")
	html.innerHTML = html.innerHTML.replace(/Handling Charge((.|\n)*)final item selling price\)\./g, "</strong><span id=\"handleBox\" style=\"display:none;\"><input maxlength=\"11\" name=\"itemHandlingPrice\" size=\"11\" value=\"2\"></span></b>");
	html.innerHTML = html.innerHTML.replace(/<input name="itemNoCombineShipping" value="ON" type="checkbox">/g, "</strong><input name=\"itemNoCombineShipping\" value=\"ON\" type=\"checkbox\" tabindex=\"-1\" CHECKED></strong>");
	html.innerHTML = html.innerHTML.replace(/<i>Example: 1<\/i>/g, "");
	html.innerHTML = html.innerHTML.replace(/<a href="tools\/UPSdimweightcalculator.asp" target="_blank">here<\/a>/g, "<a href=\"tools/UPSdimweightcalculator.asp\" target=\"_blank\" tabindex=\"-1\">here</a>");
		html.innerHTML = html.innerHTML.replace(/<a href="tools\/uspsdimweight1.asp" target="_blank">here<\/a>/g, "<a href=\"tools/uspsdimweight1.asp\" target=\"_blank\" tabindex=\"-1\">here</a>");
		html.innerHTML = html.innerHTML.replace(/<select name="itemStartOffset" size="1">/g, "<select name=\"itemStartOffset\" size=\"1\" tabindex=\"-1\">");
		html.innerHTML = html.innerHTML.replace(/<select name="itemstarttime" size="1">/g, "<select name=\"itemstarttime\" size=\"1\" tabindex=\"-1\">");
		html.innerHTML = html.innerHTML.replace(/<select name="itemDuration" size="1">/g, "<select name=\"itemDuration\" size=\"1\" tabindex=\"-1\">");
		html.innerHTML = html.innerHTML.replace(/<select name="itemEndTime" size="1">/g, "<select name=\"itemEndTime\" size=\"1\" tabindex=\"-1\">");
		html.innerHTML = html.innerHTML.replace(/<select name="itemShipMethod" id="itemShipMethod" onchange="modify()">/g, "<select name=\"itemShipMethod\" id=\"itemShipMethod\" onchange=\"modify()\" tabindex=\"-1\">");
		html.innerHTML = html.innerHTML.replace(/<input id="itemAutoInsurance" name="itemAutoInsurance" value="ON" disabled="true" type="checkbox">/g, "<input id=\"itemAutoInsurance\" name=\"itemAutoInsurance\" value=\"ON\" disabled=\"true\" type=\"checkbox\" tabindex=\"-1\">");
	html.innerHTML = html.innerHTML.replace(/USPS Only/g, 'Post Office Only');
	$("input[name=itemTitle]").val("");

	html2.innerHTML = html2.innerHTML.replace(/Press <input tabindex="-99" id="reset1" name="reset1" type="reset" value="Reset Form">((.|\n)*) to start over\./g, "");
	html2.innerHTML = html2.innerHTML.replace(/<input tabindex="-99" id="reset1" name="reset1" value="Reset Form" type="reset">/g, "<input tabindex=\"-99\" id=\"reset1\" name=\"reset1\" value=\"Reset Form\" type=\"reset\" style=\"display:none;\">");
	html2.innerHTML = html2.innerHTML.replace(/Press to((.|\n)*)start over./g, "");
		html2.innerHTML = html2.innerHTML.replace(/<input id="submit1" name="submit1" value="Review Item" type="submit">/g, "<input id=\"submit1\" name=\"submit1\" value=\"Review Item\" type=\"submit\">");

	$('p:contains("Auction Gallery")').replaceWith('<br><b>Auction Gallery:</b><input name="itemGallery" id="itemGallery" value="ON" onclick="javascript:SetFeaturedButton();" type="checkbox"> ($7.95 charge)<br>Checking this box causes the auction to appear in the gallery on the site\'s front page.<br><b>Please make sure the photos are square</b>, either by adding white space using Paint, or by cropping them with <a href="http://www.croppola.com" target="_blank">Croppola</a>.<br><br>');
	$('td:contains("Featured Auction")').replaceWith('<td><b>Featured Auction:</b><input name="itemFeatured" id="itemFeatured" value="ON" type="checkbox"> ($4.95 charge)<br>This adds the item to the Featured Auctions in its category.<br>Photos can be used as-is.</td><br>');

	
	$('input[name="itemWeight"]').attr('id', 'itemWeight');
	$('input[name="itemDisplayWeight"]').attr('id', 'itemDisplayWeight');
	
$.each( shippingMethods, function( key, value ) {
	if (value['tooltip']) {
		$("span:contains('"	+ key	+ "')").attr('title', value['tooltip']);
	}
});

calcButtonList = {
	"general" : "General",
	"guitar" : "Guitar",
	"art" : "Frame/print",
//	"lot" : "Cub box",
	"long" : "Rug/long"
}

var myCalcButtons = "";

$.each(calcButtonList, function(index, value) {
	myCalcButtons = myCalcButtons
		+ ""
		+ button1
		+ " class='calcType'"
		+ " id='"	+ index	+ "'"
		+ ">"
		+ value
		+ button2;
});

$('p:contains("Starting Bid")').before("<div style='position:relative; top: -20px;' id='shipCalcContainer'>"
	+ "<div style='padding: 4px; border: 1px solid #AAA; width:400px;'>"
	+ "<b>Shipping calculator</b><br><br>"
	+ "<div style='padding:2px; position: relative; top: 4px;' id='calcButtonRow'>"
	+ "<b>Type:</b>&nbsp;&nbsp;" + myCalcButtons	+ "</div>"
	+ "<div style='padding:2px; position: relative; top: 8px;'><b>Dimensions:</b> <input id='dim1' size=5 style='position:relative; left:2px;'> <input id='dim2' size=5> <input id='dim3' size=5></div>"
	+ "<div style='padding:2px; position: relative; top: 8px;'><b>Real weight:</b> <input id='actualWeight' size=5></div>"
	+ "<div style='padding:2px; position: relative; top: 8px;'><b>Add</b> <span type='text' readonly id='addInches' size=2 style='border:0; font-size:120%;'>2</span> <span id='inches'>inches</span> to each side<div id='inchesSlider'></div></div>"
	+ "<div style='padding:2px; position: relative; top: 8px;'><b>Add</b> <span type='text' readonly id='addPounds' size=2 style='border:0; font-size:120%;'>2</span> <span id='pounds'>pounds</span> of packing material<div id='poundsSlider'></div></div>"
	+ "<div style='padding:2px; position: relative; top: 8px;'><b id='ownBoxText'>Ship in own (current) box?</b> <input type='checkbox' id='ownBox'></div>"
	+ "<div style='padding:2px; position: relative; top: 14px;' id='myDimWeight'></div>"
	+ "<div style='padding:8px; position: relative;' id='note'></div>"
	+ "</div></div>"
);

$('#shipCalcContainer').before("<div id='step3Header' style='background-color: #ffc700; width: 103%; height: 24px; z-index: 99; position: relative; top: -44px; left: -30px; padding:3px;'><font size='4'><strong>Step 3 - Shipping</strong></font></div>");
$('p:contains(\"Seller Store\")').before("<div id='step4Header' style='background-color: #ffc700; width: 103%; height: 24px; z-index: 99; position: relative; top: -12px; left: -30px; padding:3px;'><font size='4'><strong>Step 4 - Store and location</strong></font></div>");
$('font:contains(\"Step 1\")').html("Step 1 - Images and presets");
$('strong:contains(\"Step 2\")').html("Step 2 - Item information");


myGuitarBoxes = JSON.stringify(guitarBoxes);
myArtBoxes = JSON.stringify(artBoxes);
myUSPSBoxes = JSON.stringify(uspsBoxes);
myGeneralBoxes = JSON.stringify(generalBoxes);
$("body").append("<div id='guitarBoxes' style='display:none;'>"	+ myGuitarBoxes	+ "</div>");
$("#form1").append("<script id='boxDefinitions'>guitarBoxes = JSON.parse('"	+ myGuitarBoxes	+ "');"
	+ "artBoxes = JSON.parse('"	+ myArtBoxes	+ "');"				 
	+ "uspsBoxes = JSON.parse('"	+ myUSPSBoxes	+ "');"
	
+ "</script>");



$("#form1").append(
	"<script id='shippingCalc'>"
	
	
+ "function updateCalc() {"
	+ "$('#currentDimWeight').html('9999');"
	+ "var pickup = 0;"
	+ "var bigGuitar = 0;"
	+ "var boxName = '';"
	+ "var calcType = myCalcType;"
	+ "plusInches = ($('#addInches').html()) * 2;" // Listed on the page as plus inches per SIDE;" we want per DIMENSION
	+ "plusPounds = Math.ceil($('#addPounds').html());"
	+ "if (!$('#dim1').val().length || !$('#dim2').val().length || $('#dim3').val().length || (Math.ceil($('#actualWeight').val())	+ plusPounds) > $('input[name=\"itemWeight\"]').val()) {"
		+ "$('input[name=\"itemWeight\"]').val(Math.ceil($('#actualWeight').val())	+ plusPounds);"
	+ "}"
	+ "if ($('#dim1').val().length && $('#dim2').val().length && $('#dim3').val().length) {"
		+ "var ownBox = $('#ownBox:checked').val();"
		+ "baseDimensions = [Number($('#dim1').val().replace(/[\D]/g, ''))	+ 0, Number($('#dim2').val().replace(/[\D]/g, ''))	+ 0, Number($('#dim3').val().replace(/[\D]/g, ''))	+ 0];"
		+ "baseDimensions.sort(function(a, b){return a-b});"
		+ "var list = [];"
		+ "$.each(baseDimensions, function(index, value){"
			+ "list[index] = value;"
		+ "});"
		
		+ "if (calcType == 'general') {"
			+ "if(ownBox == 'on') {"
				+ "$.each(list, function(index, value) {" 
					+ "list[index] = value	+ 1;" 
				+ "});"
			+ "} else {"
				+ "$.each(list, function(index, value) {"
					+ "list[index] = value	+ plusInches;" 
				+ "});" 
			+ "}"
		+ "} else if (calcType == 'guitar') {"
			// do nothing: guitars don't get extra inches
		+ "} else if (calcType == 'long') {"
			+ "list[0] = baseDimensions[0];"
			+ "list[1] = baseDimensions[1];"
			+ "list[2] = baseDimensions[2]	+ plusInches;"
		+ "}"
		+ "list.sort(function(a, b){return a-b});"
		+ "dimWeight = '';"
		+ "boxName = '';"
		
		+ "if (calcType == 'guitar') {"
			+ "if (list[1] <= guitarBoxes['default'][1] && list[2] <= guitarBoxes['default'][2]) {"
				+ "calcType = 'general';" // This guitar is small enough to go in a regular old boxName
			+ "} else {"
				+ "results = compareBoxType(list, guitarBoxes);"
				+ "if (results['isInBox'] == 'no') {"
					+ "calcType = 'general';"
					+ "$.each(list, function(index, value) {"
						+ "list[index] = value	+ plusInches;" 
					+ "});"
					+ "bigGuitar = 'yes';"
				+ "} else {"
					+ "dimWeight = results['dimWeight'];"
					+ "boxName = results['boxName'];"
					+ "corresponds = results['corresponds'];"
					+ "$.each(results['dimensions'], function(index, value) {"
						+ "list[index] = value;" 
					+ "});"
				+ "}"
			+ "}"
		+ "} else if (calcType == 'art') {"
			+ "if (ownBox == 'on'){"
				+ "if (baseDimensions[0] > 1) {"
					+ "alert('This item is too thick to be shipped between cardboard.');"
					+ "$.each(list, function(index, value) {" 
						+ "list[index] = value	+ plusInches;" 
					+ "});"
					+ "$('input#ownBox').attr('checked', false);"
					+ "ownBox = 'off';"
				+ "} else {"
					+ "list[0] = 2;"
					+ "list[1] = (list[1]	+ 3);"
					+ "list[2] = (list[2]	+ 3);" 
					+ "calcType = 'general';"
				+ "}"
			+ "}"
			+ "if (ownBox != 'on') {"
				+ "if (list[1] <= artBoxes['default'][1] && list[2] <= artBoxes['default'][2]) {"
					+ "calcType = 'general';"
					+ "$.each(list, function(index, value) {" 
						+ "list[index] = value	+ plusInches;" 
					+ "});"
				+ "} else {"
					+ "results = compareBoxType(list, artBoxes);"
					+ "if (results['isInBox'] == 'no') {"
						+ "calcType = 'general';"
						+ "$.each(list, function(index, value) {" 
							+ "list[index] = value	+ plusInches;" 
						+ "});"
						+ "pickup = 'yes';"
					+ "} else {"
						+ "dimWeight = results['dimWeight'];"
						+ "boxName = results['boxName'];"
						+ "corresponds = results['corresponds'];"
						+ "$.each(results['dimensions'], function(index, value) {" 
							+ "list[index] = value;" 
						+ "});"
					+ "}"
				+ "}"
			+ "}"
		+ "} else if (calcType =='long') {"
			+ "console.dir(list);"
			+ "if (list[1] > 12) {"
				+ "pickup = 'yes';"
				+ "calcType = 'general';"
			+ "} else if (list[1] > 8) {"
				+ "if (list[2] > 76) {"
					+ "pickup = 'yes';"
					+ "calcType = 'general';"
				+ "} else {"
					+ "list[0] = 13;"
					+ "list[1] = 13;"
				+ "}"
//					+ "corresponds = '12x12 long box';"
			+ "} else {"
				+ "if (list[2] > 90) {"
					+ "pickup = 'yes';"
					+ "calcType = 'general';"
				+ "} else {"
					+ "list[0] = 9;"
					+ "list[1] = 9;"
				+ "}"
//					+ "corresponds = '8x8 long box';"
			+ "}"
			+ "dimWeight = Math.ceil(list[0] * list[1] * list[2]) / " + upsDivisor + ";"
		+ "}"
		+ "realWeight = Number($('#actualWeight').val());"
		+ "var sgwDimList = ['itemLength', 'itemWidth', 'itemHeight'];"
		+ "$.each(list, function(index, value) {" 
			+ "$('#'	+ sgwDimList[index]).val(value);" // All this is doing is saving values into SGW's crap
		+ "});"
		+ "dimWeight = Math.ceil(Math.max(dimWeight, (realWeight+plusPounds), 3));" // Which is to say: either the dimensional weight as calculated, OR the real weight (modified), OR 3 pounds - whichever is greatest
		+ "note = '';"
		+ "if (calcType == 'general') {"
			+ "currentDimWeight = $('#currentDimWeight').html();"
			+ "var inUSPSBox = 'no';"
			// TODO: Make USPS recommendations only for certain item types? Yes? No? NOT for certain item types?
			+ "$.each( uspsBoxes, function( key, value ) {"
				+ "if (inUSPSBox == 'no') {"
					+ "if (list[0]-plusInches <= value[0] && list[1]-3 <= value[1] && list[2]-3 <= value[2]) {"
						+ "note = '<br><b><font color=\"blue\">This item <i><u><font size=4.5>may</font></u></i> fit in a '	+ value['name']	+ '.</font> <font size=5.5 color=\"red\">Use discretion.</font></b>';"
						+ "note = note	+ '<span style=\"position:relative; left: 20px; border: 1px solid #CCCCCC; background-color:#EEEEEE; padding: 3px; z-index:99;\" onclick=\"javascript:useUSPSBox(\\''	+ value['corresponds']	+ '\\');\" id=\"useUSPS\">Use this (Post Office)</span><br><br>';"
						+ "inUSPSBox = 'yes';"
					+ "}"
				+ "}"
			+ "});" 

			+ "var myBox;"
			+ "generalBoxes = JSON.parse('"	+ myGeneralBoxes + "');" 
			+ "$.each(generalBoxes, function(boxIndex, boxObject){"
				+ "thisBoxDimWeight = 1;"
				+ "if (list[0] <= boxObject.interior[0] && list[1] <= boxObject.interior[1] && list[2] <= boxObject.interior[2]) {"
					+ "console.log(boxObject.interior[boxObject.cut] + ' (boxObject.interior[' + boxObject.cut + ']) should be cut to ' + list[boxObject.cut]);"
					+ "boxObject.interior[boxObject.cut] = list[boxObject.cut];" // Now, this should already have plusInches built into it.
					+ "console.dir(boxObject.interior);"
					+ "$.each(boxObject.interior, function (dimIndex, dimValue){"
						+ "thisBoxDimWeight *= (Math.ceil(dimValue)+1);" // The +1 is the difference between interior and exterior dimensions (plus fudge room)
					+ "});"
					+ "thisBoxDimWeight = Math.ceil(thisBoxDimWeight/$('#upsDivisor').html());" // Using the upsDivisor in the hidden div rather than just plopping the value in because that screws up coding in regular js and applying quotation marks later......
					+ "console.log('fits ' + boxObject['name'] + '; weight ' + thisBoxDimWeight + ' (current weight: ' + currentDimWeight + ')');"
					+ "if (typeof currentDimWeight == 'undefined' || thisBoxDimWeight < currentDimWeight) {" // So here we're basically saving the current dimensional weight (and box) if there isn't one already, or if it's smaller than the previous one.
						+ "currentDimWeight = thisBoxDimWeight;"
						+ "myBox = boxIndex;"
					+ "}"
				+ "}"
				+ "$('#currentDimWeight').html(currentDimWeight);" // this wasn't working... needed its #
			+ "});"
			+ "console.log('calcingbox');"
			+ "myBoxNote = '<b>Calculated box:</b> ';"
			+ "if (typeof myBox != 'undefined') {"
				+ "dimWeight = Math.max(currentDimWeight, Math.ceil(realWeight) + Math.ceil(plusPounds), 3);" // Shipping weight should be based on either dim weight OR real weight, whichever is higher. Math.ceil because stupid js overloading of + for concatenation - terrible design choice
				+ "console.log('current box - ' + generalBoxes[myBox].name);"
				+ "$('#itemShipLength').val(Math.ceil(generalBoxes[myBox].interior[0])+1);"
				+ "$('#itemShipWidth').val(Math.ceil(generalBoxes[myBox].interior[1])+1);"
				+ "$('#itemShipHeight').val(Math.ceil(generalBoxes[myBox].interior[2])+1);"
				// These lines are I believe filling in SGW's silly dimension inputs.
				+ "myBoxNote += generalBoxes[myBox].name;"
				+ "myBoxNote += ', cut to '	+ generalBoxes[myBox].interior[0]	+ 'x'	+ generalBoxes[myBox].interior[1]	+ 'x'	+ generalBoxes[myBox].interior[2];"
			+ "} else {"
				+ "pickup = 'yes';"
				+ "myBoxNote += '<b>no box found</b>';"
			+ "}"
			+ "$('#calculatedBox').html(myBoxNote);"
			+ "console.log('myBoxNote ' + myBoxNote);"
		+ "}"
		+ "if (boxName.length) {"
			+ "note = '<br><b><font size=5.5 color=\"blue\">'	+ boxName	+ '</font></b>';"
		+ "} else if (pickup.length || bigGuitar.length) {"
			+ "note = '<span style=\"position:relative; top:15px;\"><b><font color=\"red\">This item should most likely be pickup only.</font></b> Please double-check with shipping.<br><br></span>';"
			+ "dimWeight = 'N/A'"
		+ "} else if (!note.length){"
			+ "note ='';" // ?
		+ "}"
		+ "if (typeof(corresponds) == 'undefined') {"
			+ "var corresponds = '';"
		+ "} else if (corresponds.length < 3) {" 
			+ "corresponds = '';"
		+ "}"
		+ "dimWeightNote = '<b>Dimensional weight:</b> <span id=\"dimWeightValue\" style=\"position: relative; left: 5px; font-size: 150%;\">' + dimWeight + '</span>';" // um.. if the dim weight is in a span with an id, why am I updating the whole line...?
		+ "if (!pickup.length && !bigGuitar.length) {" 
			+ "dimWeightNote = dimWeightNote + '<br><span style=\"position:relative; left: 140px; top:8px; border: 1px solid #CCCCCC; background-color:#EEEEEE; padding: 3px; z-index:99;\" id=\"useThisUPS\" onclick=\"javascript:doUPS(); darken(this);\">Use this (UPS)</span><br><br>';"
		+ "} else {"
			+ "dimWeightNote = dimWeightNote + '<br><span style=\"position:relative; left: 140px; top:8px; border: 1px solid #CCCCCC; background-color:#EEEEEE; padding: 3px; z-index:99;\" id=\"useUPS\" onclick=\"javascript:darken(this); doPickup();\">Use this (Pickup)</span><br><br>';"
		+ "}"
		+ "$('#myDimWeight').html(dimWeightNote);"
		+ "$('#note').html(note);"
	+ "}"
+ "}"
		
+ "function darken(el) {"
	+ "$(el).css('background-color', '#aaa').animate({'background-color' : '#eee'}, 1000);"
+ "}"
		
+ "function doUPS() {"
	+ "console.log('doing UPS!');"
	+ "myShipWeight = Number($('#dimWeightValue').html());"
	+ "if (myShipWeight.length < 1) {"
		+ "console.log('doUPS() dimWeightValue < 1');"
		+ "return false;"
	+ "}"
	+ "plusPounds = Math.ceil($('#addPounds').html());"
	+ "plusInches = ($('#addInches').html()) * 2;"
	+ "myRealWeight = Number($('#actualWeight').val())	+ plusPounds;"
	+ "$('#itemWeight').val(Math.max(myRealWeight, myShipWeight, 3));"
	+ "$('#itemWeight').val().length ? animTime = 1000 : animTime = 4000;" // if x ? then y : else z
	+ "$('span#useUPS').css('background-color', '#aaa').animate({'background-color' : '#eee'}, animTime);"
	+ "$('span#UPS').trigger('click');"
	+ "return true;"
+ "}"

+ "function setToUPS(){"
	+ "$('#itemAutoInsurance').attr('disabled', false);"
	+ "$('#itemAutoInsurance').prop('checked', false);"
	+ "$('#itemShipMethod option[value=3]').attr('selected', false);"
	+ "$('#itemShipMethod option[value=2]').attr('selected', 'selected');"
	+ "$('#itemShipMethod').val(2);"
	+ "$('input[name=\"itemShippingPrice\"]').val(0);"
	+ "return true;"
+ "}"


+ "function setToUSPS(price) {"	 
	+ "$('#itemShippingPrice').val(price);"
	+ "$('#itemShipMethod').val(3);"
	+ "$('#itemAutoInsurance').prop('checked', true);"
	+ "if ($('#itemWeight').val().length < 1) {"
		+ "$('#itemWeight').val($('#itemDisplayWeight').val());"
	+ "}"
+ "}"


+ "function doPickup() {"
	+ "if ($('input[name=\"itemDuration\"]').val() != 4) {"
		+ "duration = prompt('	Auction duration?', 4);"
		+ "$('input[name=\"itemDuration\"]').val(Math.min(Math.max(duration,4),15));"
	+ "}"
	+ "console.log('doing Pickup!');"
	+ "$('span#usePickup').css('background-color', '#aaa').animate({'background-color' : '#eee'}, 1000);"
	+ "if (!$('#itemWeight').val().length){"
		+ "$('#itemWeight').val(150);"
	+ "}"
	+ "$('#itemSellerInfo').html('Pickup only');"
	+ "$('#itemAutoInsurance').attr('disabled', false);"
	+ "$('#itemAutoInsurance').attr('checked', false);"
	+ "$('#itemShipMethod option[value=3]').attr('selected', false);"
	+ "$('#itemShipMethod option[value=2]').attr('selected', false);"
	+ "$('#itemShipMethod option[value=0]').attr('selected', 'selected');"
	+ "$('#itemShipMethod').val(0);"
	+ "$('#itemShippingPrice').val(0);"
+ "}"	
	
	
	
	+ "$( '#inchesSlider' ).slider({"
		+ "value:2,"
		+ "min: 1,"
		+ "max: 3,"
		+ "step: 1,"
		+ "slide: function( event, ui ) {"
		+ "$( '#addInches' ).html( ui.value );"
		+ "if(ui.value == 1) {"
			+ "$('#inches').html('inch');"
		+ "} else {"
			+ "$('#inches').html('inches');"
		+ "}"
		+ "updateCalc();"
		+ "}"
	+ "}).css({'width' : '200px', 'position' : 'relative', 'left' : '25px;'});"
	+ "$( '#addInches' ).html( $( '#inchesSlider' ).slider( 'value' ) );"
	+ "$( '#poundsSlider' ).slider({"
		+ "value:2,"
		+ "min: 1,"
		+ "max: 20,"
		+ "step: 1,"
		+ "slide: function( event, ui ) {"
		+ "$( '#addPounds' ).html( ui.value );"
		+ "if(ui.value == 1) {"
			+ "$('#pounds').html('pound');"
		+ "} else {"
			+ "$('#pounds').html('pounds');"
		+ "}"
		+ "updateCalc();"
		+ "}"
	+ "}).css({'width' : '200px', 'position' : 'relative', 'left' : '25px;'});"
	+ "$( '#addPounds' ).html( $( '#poundsSlider' ).slider( 'value' ) );"
	+ "var myUPSDivisor = Number($('#upsDivisor').html());"
	+ "var myCalcType = 'general';"
	+ "var dimWeight;"
	+ "function compareBoxType(item, boxType) {"
		+ "returnArray = {"
			+ "'dimWeight' : '',"
			+ "'boxName' : '',"
			+ "'isInBox' : 'no',"
			+ "'corresponds' : 'no',"
			+ "'dimensions' : []"
		+ "};"
		+ "if (boxType == 'general') {"
			+ "$.each(generalBoxes, function(index, value) {"
					+ "if (returnArray['isInBox'] == 'no') {"
					+ "if (item[0] <= value['interior'][0] && item[1] <= value['interior'][1] && item[2] <= value['interior'][2]) {"
						+ "returnArray['dimWeight'] = (value['exterior'][0] * value['exterior'][1] * value['exterior'][2]) / Number($('#upsDivisor').html());"
						+ "$.each(value['exterior'], function(index, value) {" 
							+ "returnArray.dimensions[index] = value"
						+ "});"
						+ "returnArray['isInBox'] = 'yes';"
						+ "if(value['name']){"
							+ "returnArray['boxName'] = value['name'];"
						+ "}"
						+ "if(value['corresponds']){returnArray['corresponds'] = value['corresponds'];}"
					+ "}"
				+ "}"
			+ "});"
		+ "} else {"
			+ "$.each(boxType['boxes'], function(index, value) {"
				+ "if (returnArray['isInBox'] == 'no') {"
					+ "if (item[0] <= value['interior'][0] && item[1] <= value['interior'][1] && item[2] <= value['interior'][2]) {"
						+ "returnArray['dimWeight'] = (value['exterior'][0] * value['exterior'][1] * value['exterior'][2]) / Number($('#upsDivisor').html());"
						+ "$.each(value['exterior'], function(index, value) {" 
							+ "returnArray.dimensions[index] = value"
						+ "});"
						+ "returnArray['isInBox'] = 'yes';"
						+ "if(value['name']){"
							+ "returnArray['boxName'] = value['name'];"
						+ "}"
						+ "if(value['corresponds']){returnArray['corresponds'] = value['corresponds'];}"
					+ "}"
				+ "}"
			+ "});"
		+ "}"
		+ "return returnArray;"
	+ "}"
	
	
	+ "function useUSPSBox(corresponds){"
		+ "$(\"input[name='itemWeight']\").val().length ? animTime = 1000 : animTime = 4000;"
		+ "$('span#useUSPS').css('background-color', '#aaa').animate({'background-color' : '#eee'}, animTime);"
		+ "$('span[name=\"'	+ corresponds	+ '\"]').trigger('click');"
		+ "console('clicking from 1304 ' + corresponds);"
	+ "}"
	
	
	+ "function updatePrivateDesc(){"
		+ "console.log('updatePrivateDesc');"
		+ "myString = '';"
		+ "myShipNote = '';"
		+ "myBoxNote = '';"
		+ "if($('#dim1').val().length && $('#dim2').val().length && $('#dim3').val().length) {"
			+ "console.log('dims set, generating tag');"
			+ "myString = ' {{';"
			+ "if (myCalcType == 'general') {"
				+ "myString = myString	+ 'gen';"
			+ "} else if (myCalcType == 'guitar') {"
				+ "myString = myString	+ 'guit';"
			+ "} else if (myCalcType == 'art') {"
				+ "myString = myString	+ 'art';"
			+ "} else if (myCalcType == 'lot') {"
				+ "myString = myString	+ 'lot';"
			+ "} else if (myCalcType == 'long') {"
				+ "myString = myString	+ 'lng';"
			+ "}"
			+ "myString = myString	+ ':'	+ $('#dim1').val()	+ 'x'	+ $('#dim2').val()	+ 'x'	+ $('#dim3').val();"
			+ "if ($('#ownBox:checked').val() == 'on') {"
				+ "myString = myString	+ '(own)';"
			+ "}"
			+ "myString	+= ';in:+'	+ 2*Math.ceil($('#addInches').html())	+ ';lbs:+'	+ $('#addPounds').html();"
			+ "myString = myString	+ '}}';"
			+ "console.log(myString);"
		+ "}"
		+ "if ($('#noteToShipping').val().length > 0) {"
			+ "myShipNote = '<b>Note from '	+ $('#posterName').html()	+ ': </b><br>'	+ $('#noteToShipping').val() + '<br>';"
//			+ "$('#itemSellerInfo').val($('#itemSellerInfo').val()	+ myShipNote);"
		+ "}"
		+ "if ($('#calculatedBox').html().length > 0) {"
			+ "myBoxNote = $('#calculatedBox').html()	+ '<br>';"
		+ "} else {"

//			+ "console.log('n');"
		+ "}"
		+ "myFinalShipNote = myString;"
		+ "if ((myFinalShipNote.length >0) && (myBoxNote.length > 0)) {"
			+ "myFinalShipNote += '<br><br>'"
		+ "}"
		+ "myFinalShipNote += myBoxNote;"
		+ "if ((myFinalShipNote.length >0) && (myShipNote.length > 0)) {"
			+ "myFinalShipNote += '<br><br>'"
		+ "}"
		+ "myFinalShipNote += myShipNote;"
		+ "$('#itemSellerInfo').text(myFinalShipNote);"
	+ "}"
	
	
	+ "$(document).ready(function(){"
		+ "$('#ownBox').change(function(){"
			+ "updateCalc();"
		+ "});"
		+ "$('.calcType').click(function(){"
			+ "if (this.id == 'long') {"
				+ "$('#calcButtonRow').after('<div id=\"longWarning\" style=\"color:#f00; font-size:20px; font-weight:bold; margin-top:10px; margin-bottom:2px;\">NOTE: The rug/long option does not add padding on the sides!</div>');"
			+ "} else {"
				+ "$('#longWarning').remove();"
			+ "}"
			+ "$('.calcType').css('background-color', '#EEEEEE');"
			+ "$(this).css('background-color', '#AAAAAA');"
			+ "myCalcType = this.id;"
			+ "if(myCalcType =='art') {"
				+ "$('#ownBoxText').html('Ship between cardboard (check with shipping)? ');"
			+ "} else {"
				+ "$('#ownBoxText').html('Ship in own (current) box? ');"
			+ "}"
			+ "updateCalc();"
		+ "});"
		+ "$('#dim1, #dim2, #dim3, #actualWeight').keyup(function(){"
			+ "updateCalc();"
			+ "if ($('#actualWeight').val().length) {"
				+ "$('#itemDisplayWeight').val($('#actualWeight').val());"
			+ "}"
		+ "});"
		+ "$('#form1').submit(function(e){"
		
			+ "preventSubmit = false;"
			+ "myLoc = $('#itemSellerInventoryLocationID').val();"
			+ "if (myLoc = '' || !myLoc) {"
			+ "preventSubmit = true;"
			+ "}"
			+ "updatePrivateDesc();"
			+ "myTitle = $('input[name=\"itemTitle\"]').val();"
			+ "if (!$('#itemsellerstore').val().length && !$('#presetStore').val().length) {"
				+ "myStore = prompt('Store number?');"
				+ "$('#itemsellerstore').val(myStore);"
			+ "} else { }"
			+ "if (!$('#itemSellerInventoryLocationID').val().length && !$('#presetLocation').val().length) {"
				+ "$('#itemSellerInventoryLocationID').val(prompt('Inventory location?'));"
			+ "}"
			+ "myLoc = $('#itemSellerInventoryLocationID').val();"
			+ "saveLocation = JSON.stringify({'lastLocation': myLoc, 'lastTitle': myTitle});"
			+ "window.postMessage (saveLocation, '*');"
			+ "console.log(saveLocation);"
			+ "presetData = $('#myPresets').data('data');"
			+ "if (presetData['Store'].length) {"
				+ "$('#itemsellerstore').val(presetData['Store']);"
			+ "}"
			+ "if (presetData['Shipping Weight'].length) {"
				+ "$('input[name=\"itemWeight\"]').val(presetData['Shipping Weight']);"
			+ "}"
			+ "if (presetData['Display Weight'].length) {"
				+ "$('#itemDisplayWeight').val(presetData['Display Weight']);"
			+ "}"
			+ "if (presetData['Location'].length && presetData['Location'] != '') {"
				+ "$('#itemSellerInventoryLocationID').val(presetData['Location']);"
			+ "}"
			+ "if (presetData['Duration'].length) {"
				+ "$('#itemDuration').val(presetData['Duration']);"
			+ "}"
			+ "if (presetData['Ship Charge'].length) {"
				+ "$('input[name=\"itemShippingPrice\"]').val(presetData['Ship Charge']);"
			+ "}"
			+ "if (presetData['Dimension 1'].length) {"
				+ "$('#dim1').val(presetData['Dimension 1']);"
			+ "}"
			+ "if (presetData['Dimension 2'].length) {"
				+ "$('#dim2').val(presetData['Dimension 2']);"
			+ "}"
			+ "if (presetData['Dimension 3'].length) {"
				+ "$('#dim3').val(presetData['Dimension 3']);"
			+ "}"
			+ "if ($.inArray(presetData['Ship Type'], ['general', 'guitar', 'art', 'long', 'media', 'pickup'])) {"
				+ "if (presetData['Ship Type'] == 'pickup') {"
					+ "presetData['Ship Type']	+= 'Only';"
				+ "}"
				+ "$('#'	+ presetData['Ship Type']).trigger('click');"
				+ "useThis = 'yes';"
			+ "}"
			+ "if (presetData['Ship in own box/between cardboard'].length) {"
				+ "$('#ownBox').trigger('click');"
				+ "useThis = 'yes';"
			+ "}"
			+ "if (useThis == 'yes') {"
				+ "$('#useUPS').trigger('click');"
			+ "}"
			+ "myCat = $('#s1').val();"
			+ "myTitle = $('input[name=\"itemTitle\"]').val();"
			+ "if (myCat.indexOf('Sculptures') < 0 && myCat.indexOf('Figurines') < 0 && myCat.indexOf('Cookie Jars') < 0 && myCat.indexOf('Music Boxes') < 0 && myCat.indexOf('Pottery') < 0 && myCat.indexOf('Glass') < 0 && myCat.indexOf('Grabbags') < 0 && myCat.indexOf('Barware') < 0 && myCat.indexOf('China') < 0 && myCat.indexOf('Cookware') < 0 && myCat.indexOf('Serving Pieces') < 0) {"	
				+ "if (myTitle.indexOf('Wedding Dress') < 0 && myTitle.indexOf('Gown') < 0){"
					+ "if ($('input[name=\"itemWeight\"]').val() < 20 && $('#combineCheck').html() != 'true') {"
						+ "$('#combineCheck').html('true');"
						+ "$('input[name=\"itemNoCombineShipping\"]').attr('checked', !confirm('Allow shipping to be combined?'));"
					+ "}"
				+ "}"
			+ "}"
			+ "myDisplayWeight = $('#itemDisplayWeight').val();"
			+ "if (myDisplayWeight == '' || myDisplayWeight <= 0 || !myDisplayWeight) {"
				+ "alert('Please enter shipping information!');"
				+ "e.preventDefault();"
			+ "}"
			+ "if (myTitle == '' || !myTitle) {"
				+ "alert('Please enter a title!');"
				+ "e.preventDefault();"
			+ "}"
			+ "if (preventSubmit) {"
				+ "e.preventDefault();"
				+ "$('#form1').submit();"
			+ "}"
			+ "if ($('#itemsellerstore').val() == '999'| myStore == '999') {"
				+ "($('#itemsellerstore').val('999 - Mixed Locations'));"
			+ "}"
			+ "});"
			+ "$('#itemGallery').click(function(){" 
				+ "if ($('#itemFeatured').attr('disabled') == 'disabled') {"
					+ "now = new Date();"
					+ "currentDate = now.getDate();"
					+ "currentWeekDay = now.getDay();" // 0 == Sunday; therefore 7 == Saturday; therefore daysTillSaturday = 6 - currentWeekDay; (7 inclusive, but we want not inclusive)			 
					+ "daysTillSaturday = 6 - currentWeekDay;"
					+ "daysInMonth = [31,28,31,30,31,30,31,31,30,31,30,31];"
					+ "daysThisMonth = daysInMonth[now.getMonth()];" // This gives us the end of the month.
					+ "var suggestedDuration;"
				 // We want to know is if the next Saturday is the end of the period... but there's no programmatic way to tell that. Crap.
					+ "if (daysTillSaturday <= 3) {"
					+ "suggestedDuration = daysTillSaturday	+ 7;"
					+ "} else {"
					+ "suggestedDuration = 7;"
					+ "}"
					+ "duration = prompt('						Auction duration?\\n(Note: if it\\'s close to the end of the period,\\n	you may want to do a shorter auction!)\\n\\n			(Minimum 4, maximum 15)\\n\\n', suggestedDuration);"
					+ "$('input[name=\"itemDuration\"]').val(Math.min(Math.max(duration,4),15));"

				+ "}"
			+ "});"

	
	+ "});"
	+"</script>"
);


$('#form1').append("<script id='updatePresets'>"
	+ "function updatePresets() {"	 
		+ "var presetList = ['Store', 'Shipping Weight', 'Display Weight', 'Location', 'Duration', 'Ship Charge', 'Ship Type', 'Ship in own box/between cardboard', 'Dimension 1', 'Dimension 2', 'Dimension 3', 'Skip', 'Owner'];"
		+ "var presetVals = {};"
		+ "$.each(presetList, function(key, value){"
			+ "presetVals[value] = $('[id=\"preset'	+ value	+ '\"]').val();"
			+ "myValue = $('[id=\"preset'	+ value	+ '\"]').val();"
		+ "});"
		+ "$.each(presetVals, function(key, value){"
			+ "console.log(key	+ '='	+ value);"	 
		+ "});"
		+ "$('#myPresets').remove();"
		+ "var myPresets = {};"
		+ "$.each(presetVals, function(key, value){"
			+ "if (value.length) {"
				+ "myPresets	+= '<b>'	+ key	+ ':</b> '	+ value	+ '<br>';"
			+ "}"
		+ "});"
		+ "if(myPresets['Ship Type'] == \"media\") {"
			+ "myPresets['Ship Type'] = \"Media\";"
		+ "}"	 
		+ "var messageTxt	= JSON.stringify (presetVals);"
		+ "window.postMessage (messageTxt, '*');"
		+ "if (myPresets.length) {"
			+ "myPresets = \"<div id='myPresets' style='width:300px; border: 3px solid red; background-color:#FFFF11; padding:25px;'><b style='font-size:24px;'>Presets:</b><br>\"	+ myPresets	+ \"</div><br>\";"
			+ "$('#presetBox').before(myPresets);"
			+ "$('#myPresets').data('data', presetVals);"
			+ "$('#myPresets').html($('#myPresets').html().replace('undefined',''));"
			+ "$('#myPresets').html($('#myPresets').html().replace('[object Object]',''));"
		+ "}"	
		
		
	+ "}"
+ "</script>");

$('#form1').append("<script id='buyItNowScript'>"
	+ "function binButton() {"	 
		+ "$(\"#BINBox\").show();"
		+ "$(\"#BINBoxShowButton\").hide();"
		+ "var price = Math.ceil(prompt('Price?')) - .01;"
		+ "$('input[name=\"itemBuyNowPrice\"]').val(price);"
	+ "}"
+ "</script>");



$("#form1").append("<script id='docready2'>$(document).ready(function() {"
	+ "$('#UPS, #general').css('background-color', '#AAAAAA');"
	+ "$('.shipType').click(function(){"
		+ "while ($('#itemDisplayWeight').val().length < 1) {"
			+ "$('#itemDisplayWeight').val(prompt('Item\\'s actual weight?'));"
		+ "}"
		+ "if (this.id == 'Sm flat rate box') {" // I'm keeping these separate because I want them to check against the entered dimensions.
			+ "dimArray = [Number($('#dim1').val().replace(/[\D]/g, ''))	+ 0, Number($('#dim2').val().replace(/[\D]/g, ''))	+ 0, Number($('#dim3').val().replace(/[\D]/g, ''))	+ 0];"
			+ "dimArray.sort(function(a, b){return a-b});"
			+ "if (dimArray[0] > 1.25 || dimArray[1] > 4.75 || dimArray[2] > 8.25) {"
				+ "alert('This item is too big to fit in a small flat-rate box!');"
				+ "return;"
			+ "} else {"
				+ "setToUSPS(" + shippingMethods['Sm flat rate box']['price'] + ");"
			+ "}"
		+ "} else if (this.id == 'Med flat rate box') {"
			+ "dimArray = [Number($('#dim1').val().replace(/[\D]/g, ''))	+ 0, Number($('#dim2').val().replace(/[\D]/g, ''))	+ 0, Number($('#dim3').val().replace(/[\D]/g, ''))	+ 0];"
			+ "dimArray.sort(function(a, b){return a-b});"
			+ "if ((dimArray[0] <= 3.25 && dimArray[1] <= 11.75 && dimArray[2] <= 13.25) || (dimArray[0] <= 5.25 && dimArray[1] <= 8.25 && dimArray[2] <= 10.75)) {"
				+ "setToUSPS(" + shippingMethods['Med flat rate box']['price'] + ");"
			+ "} else {"
				+ "alert('This item is too big to fit in a medium flat-rate box!');"
				+ "return;"
			+ "}"
		+ "} else if (this.id == 'Media') {"
			+ "while ($('#itemDisplayWeight').val().length < 1) {"
				+ "$('#itemDisplayWeight').val(prompt('Item\\'s actual weight?'));"
			+ "}"
			+ "doMedia($('#itemDisplayWeight').val());"
			+ "console.log($('#itemDisplayWeight').val());"
		+ "} else {"
			+ "boxDefs = $('#boxDefinitions').data('defs');"
			+ "if(typeof boxDefs[this.id] !== 'undefined') {"
				+ "myBox = boxDefs[this.id];"
				+ "if (myBox['method'] == 'USPS') {"
					+ "setToUSPS(myBox['price']);"
				+ "} else if (myBox['method'] == 'UPS') {"
					+ "$('#dimWeightValue').html(myBox['weight']);"
					+ "$('#itemWeight').val(myBox['weight']);"
					+ "console.log('doing UPS from 1649' + '    ' + myBox['weight']);"
					+ "setToUPS();"
				+ "}"
			+ "}"
		+ "}"
		+ "$('.shipType').css('background-color', '#EEEEEE');"
		+ "$(this).css('background-color', '#AAAAAA');"
		+ "if (this.id == 'pickupOnly') {" // PICKUP
			+ "doPickup();"
		+ "} else if (this.id == 'UPS') {" // UPS
			+ "$('#itemSellerInfo').html('');"
			+ "displayWeight = $('input[name=\"itemDisplayWeight\"]').val();"
			+ "while (!displayWeight.length || isNaN(displayWeight)) {"
				+ "displayWeight = prompt(\"Item's actual weight?\");"
			+ "}"
			+ "$('input[name=\"itemDisplayWeight\"]').val(displayWeight);"
			+ "shippingWeight = $('#itemWeight').val();"
			+ "if (!$('#itemWeight').val().length) {"
				+ "console.log('was: ' + shippingWeight);"
				+ "shippingWeight = prompt('Item dimensional weight?');"
				+ "console.log('now: ' + shippingWeight);"
			+ "}"
			+ "$('#itemWeight').val(shippingWeight);"
			+ "console.log('doing UPS from 1686');"
			+ "setToUPS();" // poops
		+ "}"
		+ "if(this.id != 'pickupOnly' && $('input[name=\"itemShippingPrice\"]').val() <= 0 || !$('input[name=\"itemShippingPrice\"]').val().length) {" 
			+ "myRealWeight = Number($('input[name=\"itemDisplayWeight\"]').val())	+ 2;"
			+ "myShipWeight = Number($('input[name=\"itemWeight\"]').val());"
			+ "$('input[name=\"itemWeight\"]').val(Math.max(myShipWeight, myRealWeight));" // ???????
		+ "}"
//		+ "$('input[name=\"itemNoCombineShipping\"]').attr('checked', true);"
		+ "updatePrivateDesc();"
	+ "});"
+ "});</script>");


$("#form1").append("<script id='uspsToPostOffice'>"
	+ "$(document).ready(function(){"
		+ "$('#itemShipMethod option[value=\"3\"]').text('Post Office');"
	+ "});"
+ "</script>");


$("#form1").append("<script id='hidePresetsIfApplicable'>"
	+ "$(document).ready(function(){"
		+ "presetCount = $('.presetSpan').length;"
		+ "if (presetCount <= 1) {"
			+ "$('#myPresets').hide();"
		+ "}"
	+ "});"
+ "</script>");
	


$("#itemSellerInfo").after("<b>Note to shipping:</b><br><textarea id='noteToShipping' rows='2' cols='40'></textarea><br>");

$("#form1").append("<script id='doMedia'>"
	+ "function getCharge(myWeight) {"
			+ "if (myWeight <= 3) {"
				+ "return '3.99';"
			+ "} else if (myWeight <= 6) {"
				+ "return '5.99';"
			+ "} else if (myWeight <= 10) {"
				+ "return '7.99';"
			+ "} else if (myWeight <= 13) {"
				+ "return '8.99';"
			+ "} else if (myWeight <= 15) {"
				+ "return '9.99';"
			+ "} else if (myWeight <= 19) {"
				+ "return '11.99';"
			+ "} else if (myWeight <= 25) {"
				+ "return '15.99';"
			+ "} else if (myWeight <= 27) {"
				+ "return '16.99';"
			+ "} else if (myWeight <= 29) {"
				+ "return '17.99';"
			+ "} else if (myWeight <= 31) {"
				+ "return '18.99';"
			+ "} else if (myWeight <= 33) {"
				+ "return '19.99';"
			+ "} else if (myWeight <= 35) {"
				+ "return '20.99';"
			+ "} else if (myWeight <= 37) {"
				+ "return '21.99';"
			+ "} else if (myWeight <= 39) {"
				+ "return '22.99';"
			+ "} else if (myWeight <= 41) {"
				+ "return '23.99';"
			+ "} else if (myWeight <= 43) {"
				+ "return '24.99';"
			+ "} else if (myWeight <= 45) {"
				+ "return '25.99';"
			+ "} else if (myWeight <= 47) {"
				+ "return '26.99';"
			+ "} else if (myWeight <= 49) {"
				+ "return '27.99';"
			+ "} else if (myWeight <= 51) {"
				+ "return '28.99';"
			+ "} else if (myWeight <= 53) {"
				+ "return '29.99';"
			+ "} else if (myWeight <= 55) {"
				+ "return '30.99';"
			+ "} else if (myWeight <= 57) {"
				+ "return '31.99';"
			+ "} else if (myWeight <= 59) {"
				+ "return '32.99';"
			+ "} else if (myWeight <= 61) {"
				+ "return '33.99';"
			+ "} else if (myWeight <= 63) {"
				+ "return '34.99';"
			+ "} else if (myWeight <= 65) {"
				+ "return '35.99';"
			+ "} else if (myWeight <= 67) {"
				+ "return '36.99';"
			+ "} else if (myWeight <= 68) {"
				+ "return '37.99';"
			+ "} else if (myWeight <= 69) {"
				+ "return '38.99';"
			+ "} else if (myWeight <= 70) {"
				+ "return '39.99';"
		+ "}"
			+ "}"
	+ "function doMedia(weight) {"	
		+ "console.log('doing media!');"
			+ "var myCharge;"
			+ "if (weight < 50) {"
				+ "myCharge = getCharge(weight);"
		+ "} else if (weight < 70) {"
		+ "myCharge = 2 * getCharge(weight/2);"
			+ "} else {"
				+ "if (weight <= 140) {"
					+ "weight /= 2;"
					+ "myCharge = 2.25 * getCharge(weight);"
				+ "} else if (weight <= 210) {"
					+ "weight /= 3;"
					+ "myCharge = 3.5 * getCharge(weight);"
				+ "}"
				+ "myCharge = (Math.ceil(myCharge) - .01)"
			+ "}"
		+ "setToUSPS(myCharge);"
	+ "}"

+ "</script>");

$("#form1").append("<script id='stufffff'>"


+ "function unlockShipCharge(){ $('#shipPriceLock').remove(); }"				 
+ "</script>");






$("#form1").append("<script id='availChars'>function titleAvailChars() {var length = $('input[name=itemTitle]').val().length;	var remaining = 50 - length; ('myCounter').html(remaining); }</script>");
$('input[name="itemShippingPrice"]').prop('disabled', false);
$('input[name="itemShippingPrice"]').attr('id', 'itemShippingPrice');




// End