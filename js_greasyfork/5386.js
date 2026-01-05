// ==UserScript==
// @name         Futhead PC Price
// @description  adds player & squad prices for pc. prices are taken from futdb.net
// @include      http://*.futhead.com/15/players/*/*/
// @include      http://*futhead.com/15/squads/*/
// @exclude      http://*.futhead.com/15/players/*reviews*
// @exclude      http://*.futhead.com/15/players/*similar*
// @exclude      http://*.futhead.com/15/players/*linked*
// @author       Z4rc
// @grant        GM_xmlhttpRequest
// @version      0.2.4
// @namespace    https://greasyfork.org/users/5733
// @downloadURL https://update.greasyfork.org/scripts/5386/Futhead%20PC%20Price.user.js
// @updateURL https://update.greasyfork.org/scripts/5386/Futhead%20PC%20Price.meta.js
// ==/UserScript==


function get_player_price(player_name, player_rating) {
	// get FutDB URL
	var get_url = GM_xmlhttpRequest({
		method: "GET",
		url: "http://futdb.net/Search/Suggest?input=" + player_name,
		synchronous: true
	});
	var player_url = 'http://futdb.net' + get_url.responseText.split("(" + player_rating + ")")[1].split('PermanentLink":"')[1].split('"}')[0];

	// get PC price
	var get_price = GM_xmlhttpRequest({
		method: "GET",
		url: player_url  + '#blue',
		synchronous: true
	});
	var pc_price = get_price.responseText.split("Cheapest auction: <b>")[1].split("</b>")[0];
	return pc_price;
}

function get_player_name(player_url) {
	var get_name = GM_xmlhttpRequest({
		method: "GET",
		url: player_url,
		synchronous: true
	});
	var player_name = get_name.responseText.split('data-player-full-name="')[1].split('"')[0];
	return player_name;
}

function convert_price(player_price) {
	if (player_price.indexOf("k") > -1) {
		player_price = parseFloat(player_price.replace("k", ""))*1000;
	} else if (player_price.indexOf("mil") > -1) {
		player_price = parseFloat(player_price.replace("mil", ""))*1000000;
	} else {
		player_price = parseFloat(player_price);
	}
	return player_price;
}

function set_platform(platform) {
GM_xmlhttpRequest({
		method: "GET",
		url: 'http://futdb.net/Platform/Change?platformId=' + platform,
		synchronous: true
	});
}


if(window.location.href.indexOf("/players/") > -1) {
	set_platform(3);

	// player page
	var player_info = document.getElementById("player-overview-card");
	var player_name = player_info.innerHTML.split('data-player-full-name="')[1].split('"')[0];
	var player_rating = player_info.innerHTML.split('data-player-rating="')[1].split('"')[0];
	var player_price = convert_price(get_player_price(player_name, player_rating)).toLocaleString('de');

	var newLI = document.createElement("LI");
	document.getElementById("price-list").appendChild(newLI);
	newLI.innerHTML = '<img src="http://futhead.cursecdn.com/static/img/icons/pc_100x100.png"><div><span style="font-size: 24px; color: #D44A37;">' + player_price + '</span><span class="lowestbin">Lowest BIN</span><span><b>from <a>http://futdb.net</a></b></span></div>';

} else if (window.location.href.indexOf("/squads/") > -1) {
	set_platform(3);

	// squad page
	function calc_squad_price() {
		var price_row = document.getElementById("squad-header-bar").getElementsByTagName("table")[1].getElementsByTagName("tr")[3].getElementsByTagName("td")[1];
		price_row.innerHTML = '<img src="http://www.energy-storage-online.de/md_energy/custom/pub/icons/indicator_snake.gif">';

		var squad_price = 0
		for (var i = 1; i <= 11; i++) {
			var player_info = document.getElementById("p" + String(i));
			var player_url = 'http://www.futhead.com/' + player_info.innerHTML.split('<a href="')[1].split('">')[0];	
			var player_name = get_player_name(player_url);
			var player_rating = player_info.innerHTML.split('class="playercard-rating">')[1].split('<')[0];	
			var player_price = convert_price(get_player_price(player_name, player_rating));
			squad_price = squad_price + player_price;
		}
		price_row.innerHTML = squad_price.toLocaleString('en') + '<br>from <a>http://futdb.net</a>';
	}
	
	var price_row = document.getElementById("squad-header-bar").getElementsByTagName("table")[1].getElementsByTagName("tr")[3].getElementsByTagName("td")[1];
	price_row.innerHTML = '<input type="Button" value="calculate" id="calc_pc_price">';
	document.getElementById ("calc_pc_price").addEventListener("click", calc_squad_price, false);
}