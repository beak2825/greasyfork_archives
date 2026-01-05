// ==UserScript==
// @name         Fliesnow's Politics and War Aide
// @namespace    http://politicsandwar.com
// @version      1.1.0
// @description  Extends the Politics and War game to reduce gruntwork
// @author       Fliesnow
// @match        https://politicsandwar.com/*
// @require      http://ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js
// @locale       en
// @downloadURL https://update.greasyfork.org/scripts/24872/Fliesnow%27s%20Politics%20and%20War%20Aide.user.js
// @updateURL https://update.greasyfork.org/scripts/24872/Fliesnow%27s%20Politics%20and%20War%20Aide.meta.js
// ==/UserScript==

(function() {
	'use strict';
	if ($(".alert-warning").length) {
		callAllResourceAPIs(generateTradeTable);
	}

	if ($("button#powerb").length) {
		addQuickCityButtons();
	}

	if ($(".hiddenresource").length) {
		callAllResourceAPIs(generateRevenueTable);
	}
})();

/*###################################### CALLBACKS ######################################*/

function generateTradeTable(market) {
	resourcesOwned = $(".informationbar").text().split(/\s/).filter(function(n){ return n !== '';});

	outputString = '<table class="nationtable" style="width: 100%; margin: 0 auto;">';
	outputString += '<tr><th>Resource</th><th>Lowest Sell Price</th><th>Your Sell Value</th><th>Highest Buy Price</th><th>Your Buy Value</th><th>Profit Per Unit</th><th>ROI</th></tr>';

	for (var i = 1; i < market.length; i++) {

		var sellPrice = market[i].lowestbuy.price;
		var buyPrice = market[i].highestbuy.price;
		var ppu = sellPrice - buyPrice;
		var profit = (ppu / buyPrice) * 100;
		var sellValue = sellPrice * allToNumber(resourcesOwned[i-1]);
		var buyValue = buyPrice * allToNumber(resourcesOwned[i-1]);

		sellPrice = dollarString(psweetFriendlyOutput(Math.round(sellPrice)));
		buyPrice = dollarString(psweetFriendlyOutput(Math.round(buyPrice)));
		sellValue = dollarString(psweetFriendlyOutput(Math.round(sellValue)));
		buyValue = dollarString(psweetFriendlyOutput(Math.round(buyValue)));
		ppu = dollarString(psweetFriendlyOutput(ppu));



		market[i].resourceUpper = capitalizeFirstLetter(market[i].resource);

		outputString += "<tr><td>" + market[i].resourceUpper +
			"</td><td><a href='https://politicsandwar.com/index.php?id=90&display=world&resource1=" + market[i].resource + "&buysell=sell&ob=price&od=ASC&maximum=50&minimum=0&search=Go'>" + sellPrice + "</a></td>" +
			"<td>" + sellValue + "</td>" +
			"<td><a href='https://politicsandwar.com/index.php?id=90&display=world&resource1=" + market[i].resource + "&buysell=buy&ob=price&od=DESC&maximum=50&minimum=0&search=Go'>" + buyPrice + "</a></td>" +
			"<td>" + buyValue + "</td><td>" + ppu + "</td><td>" + profit.toFixed(2) + "%</td></tr>";
	}

	outputString += '</table><br/>';

	jQuery(outputString).insertAfter('.alert-warning');
}

var revenueTableMap = {114:2,116:3,118:7,120:6,122:5,124:4,126:12,128:8,130:11,132:10,134:9};
function generateRevenueTable(market) {
	var m = revenueTableMap;
	var revenueTable = $(".nationtable")[0].tBodies[0].childNodes;
	var output = '<tr><th colspan="3">Net Values</th></tr>';
	var tickSum = 0;
	var daySum = 0;
	for (i = 114; i < 135; i+=2) {
		var sellPrice = market[m[i]].lowestbuy.price;
		var row = revenueTable[i].childNodes;
		var tickValue = allToNumber(row[1].innerText.split(' ')[0]);
		var dayValue = allToNumber(row[2].innerText.split(' ')[0]);
		var tickTotal = sellPrice * tickValue;
		var dayTotal = sellPrice * dayValue;
		tickSum += tickTotal;
		daySum += dayTotal;
		output += '<tr><td>' + row[0].childNodes[0].outerHTML + " " + capitalizeFirstLetter(market[m[i]].resource) + ' Value</td>' +
			'<td class="right">' + dollarString(psweetFriendlyOutput(Math.round(tickTotal))) + '</td>' +
			'<td class="right">' + dollarString(psweetFriendlyOutput(Math.round(dayTotal))) + '</td></tr>';
	}
	output += '<tr><td style="font-weight:bold;">Net Resource Value</td>' +
		'<td class="right" style="font-weight:bold;">' + dollarString(psweetFriendlyOutput(Math.round(tickSum))) + '</td>' +
		'<td class="right" style="font-weight:bold;">' + dollarString(psweetFriendlyOutput(Math.round(daySum))) + '</td></tr>';

	var row = revenueTable[136].childNodes;
	tickSum += allToNumber(row[1].innerText.split(' ')[0].slice(1));
	daySum += allToNumber(row[2].innerText.split(' ')[0].slice(1));

	output += '<tr><td style="font-weight:bold;">Net Value</td>' +
		'<td class="right" style="font-weight:bold;">' + dollarString(psweetFriendlyOutput(Math.round(tickSum))) + '</td>' +
		'<td class="right" style="font-weight:bold;">' + dollarString(psweetFriendlyOutput(Math.round(daySum))) + '</td></tr>';

	$(".nationtable").append(output);
}

function addQuickCityButtons() {
	//Make sure the links stil work
	var cityPath = window.location.pathname.split('&')[0];
	$("button#powerb").replaceWith('<a href="https://politicsandwar.com' + cityPath + '&display=power#improvements"><b>Power</b></a>');
	$("button#resourcesb").replaceWith('<a href="https://politicsandwar.com' + cityPath + '&display=resources#improvements"><b>Resources</b></a>');
	$("button#manufacturingb").replaceWith('<a href="https://politicsandwar.com' + cityPath + '&display=manufacturing#improvements"><b>Manufacturing</b></a>');
	$("button#civilb").replaceWith('<a href="https://politicsandwar.com' + cityPath + '&display=civil#improvements"><b>Civil</b></a>');
	$("button#commerceb").replaceWith('<a href="https://politicsandwar.com' + cityPath + '&display=commerce#improvements"><b>Commerce</b></a>');
	$("button#militaryb").replaceWith('<a href="https://politicsandwar.com' + cityPath + '&display=military#improvements"><b>Military</b></a>');

	//Add the Buttons
	//WHY WHY WHY
	//JQUERY, WHY HAVE YOU FORSAKEN ME
	var html = document.documentElement.innerHTML;

	var map = [
		["Coal Power Plant", "coalpower", "power", "power"],
		["Oil Well", "oilwell", "resources", "resource"],
		["Coal Mine ", "coalmine", "resources", "resource"],
		["Oil Refinery", "gasrefinery", "manufacturing", "manufacturing"],
		["Police Station", "policestation", "civil", "civil"],
		["Supermarket", "supermarket", "commerce", "commerce"],
		["Barracks", "barracks", "military", "military"],
		["Oil Power Plant", "oilpower", "power", "power"],
		["Bauxite Mine ", "bauxitemine", "resources", "resource"],
		["Iron Mine", "ironmine", "resources", "resource"],
		["Steel Mill", "steelmill", "manufacturing", "manufacturing"],
		["Hospital", "hospital", "civil", "civil"],
		["Bank", "bank", "commerce", "commerce"],
		["Factory", "factory", "military", "military"],
		["Nuclear Power Plant", "nuclearpower", "power", "power"],
		["Uranium Mine", "uramine", "resources", "resource"],
		["Lead Mine ", "leadmine", "resources", "resource"],
		["Aluminum Refinery", "aluminumrefinery", "manufacturing", "manufacturing"],
		["Recycling Center", "recyclingcenter", "civil", "civil"],
		["Shopping Mall", "mall", "commerce", "commerce"],
		["Hangar", "airforcebase", "military", "military"],
		["Wind Power Plant", "windpower", "power", "power"],
		["Farm", "farm", "resources", "resource"],
		["Munitions Factory", "munitionsfactory", "manufacturing", "manufacturing"],
		["Subway", "subway", "civil", "civil"],
		["Stadium", "stadium", "commerce", "commerce"],
		["Drydock", "drydock", "military", "military"]
	];

	var token = $('input[name=token]').attr('value');

	for (var i = 0; i < map.length; i++) {
		html = html.replace(
			"</span> " + map[i][0] + "</td>",
			"</span> " + map[i][0] +
			"<form " +
			"action='" + cityPath + "&display=" + map[i][2] +
			"#improvements' method='post' class='" +  map[i][3] + "imps'>" +
			"<input type='submit' name='buy" + map[i][1] + "' value='+' style='padding:0px; width:40%'>" +
			"<input type='submit' name='sell" + map[i][1] + "' value='-' style='padding:0px; width:40%'>" +
			"<input type='hidden' name='token' value='" + token + "'>" +
			"</form></td>"
		);
	}

	document.documentElement.innerHTML = html;

}

/*######################################FUNCTIONS AND UTILITIES######################################*/
//Globals
var market = [];
var responses = 0;
var resourcesArray = ["credits", "coal", "oil", "uranium", "lead", "iron", "bauxite", "gasoline", "munitions", "steel", "aluminum", "food"];

function callAllResourceAPIs(resourceCallback) {
	market=[];
	responses = 0;
	callResourceAPI("credits", 1, resourceCallback);
	callResourceAPI("coal", 2, resourceCallback);
	callResourceAPI("oil", 3, resourceCallback);
	callResourceAPI("uranium", 4, resourceCallback);
	callResourceAPI("lead", 5, resourceCallback);
	callResourceAPI("iron", 6, resourceCallback);
	callResourceAPI("bauxite", 7, resourceCallback);
	callResourceAPI("gasoline", 8, resourceCallback);
	callResourceAPI("munitions", 9, resourceCallback);
	callResourceAPI("steel", 10, resourceCallback);
	callResourceAPI("aluminum", 11, resourceCallback);
	callResourceAPI("food", 12, resourceCallback);
}



function callResourceAPI(resource, index, resourceCallback) {
	var marketIndex = index;
	var callback = resourceCallback;
	$.getJSON("https://politicsandwar.com/api/tradeprice/resource=" + resource, function(response){
		market[marketIndex] = response;
		responses++;
		if (responses == 12) {
			resourceCallback(market);
		}
	});
}


function allToString(number) {
	return number.toString();
}

function allToNumber(string) {
	string = string.toString();
	return parseFloat(string.replaceAll(/\,/, ""));
}

function psweetFriendlyOutput(string) {
	return allToString(string).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function dollarString(string) {
	if (string.charAt(0) == "-") {
		return "-$" + string.slice(1);
	} else {
		return "$" + string;
	}
}

function capitalizeFirstLetter(string) {
	var capped =  string.charAt(0).toUpperCase() + string.slice(1);
	return capped;
}

function lowerFirstLetter(string) {
	var capped = string.charAt(0).toLowerCase() + string.slice(1);
	return capped;
}

String.prototype.replaceAll = function(search, replacement) {
	var target = this;
	return target.split(search).join(replacement);
};