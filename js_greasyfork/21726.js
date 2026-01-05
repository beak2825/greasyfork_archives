// ==UserScript==
// @name        Pokevision Enhancer
// @namespace   https://greasyfork.org/en/users/814-bunta
// @description Save/Load filter list, scan an area for pokemon, plus more!
// @include     *pokevision.com/*
// @version     1.2
// @Author      Bunta
// @license     http://creativecommons.org/licenses/by-nc-sa/3.0/us/
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/21726/Pokevision%20Enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/21726/Pokevision%20Enhancer.meta.js
// ==/UserScript==


var scanDelay = 1000; // time between scans for each lat/long position. Should be no lower than 1000 (1s)
var autoDelay = 60000; // time between scans repeating when Auto checkbox is enabled
var scanOnLoad = false; // if true will perform scan as soon as page is loaded or refreshed
var minLat = -36.84, maxLat = -36.86, minLon = 174.62, maxLon = 174.64; // bounds for the scan area. minLat is northmost value, minLon is westmost value. Scans adjust lat/long by 0.01

/* run below code (after setting above position variables) in console to view the bounds of your search area
App.home.createMarker(1,{latitude: minLat,longitude:minLon,pokemonId:151,}); // Mew should be top left
App.home.createMarker(1,{latitude: minLat,longitude:maxLon,pokemonId:25,});  // Pikachu should be top right
App.home.createMarker(1,{latitude: maxLat,longitude:minLon,pokemonId:26,});  // Raichu should be bottom left
App.home.createMarker(1,{latitude: maxLat,longitude:maxLon,pokemonId:150,}); // MewTwo should be bottom right
*/

var  pokemonAlertList = { //Choose which pokemon you want to be alerted about!
	"Bulbasaur": false,
	"Ivysaur":false,
	"Venusaur":false,
	"Charmander":false,
	"Charmeleon":true,
	"Charizard":true,
	"Squirtle":false,
	"Wartortle":false,
	"Blastoise":true, 
	"Caterpie":false, 
	"Metapod":false,
	"Butterfree":false,
	"Weedle":false,
	"Kakuna":false,
	"Beedrill":false,
	"Pidgey":false,
	"Pidgeotto":false,
	"Pidgeot":false,
	"Rattata":false,
	"Raticate":false,
	"Spearow":false,
	"Fearow":false,
	"Ekans":false,
	"Arbok":false,
	"Pikachu":true,
	"Raichu":true,
	"Sandshrew":false,
	"Sandslash":false,
	"Nidoran♀":false,
	"Nidorina":false,
	"Nidoqueen":true,
	"Nidoran♂":false,
	"Nidorino":false,
	"Nidoking":false,
	"Clefairy":false,
	"Clefable":false,
	"Vulpix":false,
	"Ninetales":true,
	"Jigglypuff":false,
	"Wigglytuff":false,
	"Zubat":false,
	"Golbat":false,
	"Oddish":false,
	"Gloom":false,
	"Vileplume":true,
	"Paras":false,
	"Parasect":false,
	"Venonat":false,
	"Venomoth":false,
	"Diglett":false,
	"Dugtrio":true,
	"Meowth":false,
	"Persian":false,
	"Psyduck":false,
	"Golduck":false,
	"Mankey":false,
	"Primeape":true,
	"Growlithe":false,
	"Arcanine":false,
	"Poliwag":false,
	"Poliwhirl":false,
	"Poliwrath":false,
	"Abra":false,
	"Kadabra":false,
	"Alakazam":true,
	"Machop":false,
	"Machoke":true,
	"Machamp":true,
	"Bellsprout":false,
	"Weepinbell":false,
	"Victreebel":false,
	"Tentacool":false,
	"Tentacruel":false,
	"Geodude":false,
	"Graveler":false,
	"Golem":true,
	"Ponyta":false,
	"Rapidash":true,
	"Slowpoke":false,
	"Slowbro":false,
	"Magnemite":false,
	"Magneton":true,
	"Farfetch'd":true,
	"Doduo":false,
	"Dodrio":false,
	"Seel":false,
	"Dewgong":true,
	"Grimer":false,
	"Muk":true,
	"Shellder":false,
	"Cloyster":true,
	"Gastly":false,
	"Haunter":false,
	"Gengar":true,
	"Onix":false,
	"Drowzee":false,
	"Hypno":true,
	"Krabby":false,
	"Kingler":false,
	"Voltorb":false,
	"Electrode":false,
	"Exeggcute":false,
	"Exeggutor":true,
	"Cubone":false,
	"Marowak":true,
	"Hitmonlee":false,
	"Hitmonchan":false,
	"Lickitung":false,
	"Koffing":false,
	"Weezing":false,
	"Rhyhorn":false,
	"Rhydon":true,
	"Chansey":false,
	"Tangela":false,
	"Kangaskhan":true,
	"Horsea":false,
	"Seadra":false,
	"Goldeen":false,
	"Seaking":false,
	"Staryu":false,
	"Starmie":false,
	"Mr. Mime":true,
	"Scyther":false,
	"Jynx":false,
	"Electabuzz":false,
	"Magmar":false,
	"Pinsir":false,
	"Tauros":true,
	"Magikarp":false,
	"Gyarados":true,
	"Lapras":true,
	"Ditto":true,
	"Eevee":false,
	"Vaporeon":false,
	"Jolteon":true,
	"Flareon":true,
	"Porygon":false,
	"Omanyte":false,
	"Omastar":true,
	"Kabuto":false,
	"Kabutops":true,
	"Aerodactyl":false,
	"Snorlax":false,
	"Articuno":true,
	"Zapdos":true,
	"Moltres":true,
	"Dratini":false,
	"Dragonair":false,
	"Dragonite":true,
	"Mewtwo":true, 
	"Mew":true,
}

// Test if local storage is available
function storageAvailable(type) {
	try {
		var storage = window[type],
			x = '__storage_test__';
		storage.setItem(x, x);
		storage.removeItem(x);
		return true;
	}
	catch(e) {
		return false;
	}
}
var storageAllowed = storageAvailable('localStorage');

// Start with some style fixes to improve map visibility
function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}
addGlobalStyle("header { padding: 5px 0 ! important }")
addGlobalStyle("body.home {	padding: 40px 0px 0px 0 ! important }")
$("footer").remove()

// Function to update the pokemon list to the selected pokemon above
function refreshFilter() {
	$("button.bs-deselect-all").click()
	for (key in pokemonAlertList) {
		if (pokemonAlertList[key]) {
			$("ul.dropdown-menu.inner li span").filter(function(index) { return $(this).text() === key; }).click();
		}
	}
}

// Function to save the pokemon list to local storage
function saveFilter() {
	var selectedPokemon = [];
	$('.dropdown-menu.inner li.selected').each(function(_, el){
		selectedPokemon.push($(el).data('original-index'));
	});
	localStorage.setItem('selectedPokemon', JSON.stringify(selectedPokemon));
}

// Function to load the pokemon list from local storage
function loadFilter() {
	var selectedPokemon
	try {
  	selectedPokemon = JSON.parse(localStorage.selectedPokemon);
	} catch(e) {
		refreshFilter();
		return;
	}
	
	if (selectedPokemon == null || selectedPokemon == "") { refreshFilter(); return; }
	
	$("button.bs-deselect-all").click()
	selectedPokemon.forEach(function(pokemonId) {
		$("ul.dropdown-menu.inner li[data-original-index=" + pokemonId + "] a").click();
	});
}

var scanning = false;

// function to perform scanning in grid area bound by lat/long variables set above
function scanLoop(lat,lon) {
	if (lon > maxLon) {
		lat -= 0.01;
		lon = minLon;
	}
	
	if (lat < maxLat) {
		console.log("Scanning Complete:", (new Date()).toLocaleTimeString());
		if ($("#autoRescan").prop("checked"))
		{
			console.log("Next scan will start:", (new Date((new Date()).getTime() + autoDelay)).toLocaleTimeString());
			setTimeout(function() {
				console.log("Initiating Scan:", (new Date()).toLocaleTimeString());
				scanLoop(minLat,minLon);
			}, autoDelay);
		} else {
  		scanning = false;
		}
		return;
	}
	
	//console.log("scanning:",lat,lon);
	App.home.findNearbyPokemon(lat, lon);
	setTimeout(function() { scanLoop(lat,lon+0.01); }, scanDelay);
}

// Add buttons to header bar
if (storageAllowed) {
  $("a.header-map-locate").before('<input type="checkbox" name="autoRescan" id="autoRescan" value="Auto">Auto  <button id="rescanPokes">Scan</Rescan><button id="saveFilter">Save Filter</button><button id="loadFilter">Load Filter</button>');
} else {
  $("a.header-map-locate").before('<input type="checkbox" name="autoRescan" id="autoRescan" value="Auto">Auto  <button id="rescanPokes">Scan</Rescan><button id="refreshFilter">Filter</button>');
}

// Add click functions to buttons
$("#rescanPokes").click(function() {
  console.log("rescanPokes");
	if (!scanning) {
		scanning = true;
		console.log("Initiating Scan:", (new Date()).toLocaleTimeString());
		scanLoop(minLat,minLon);
	}
});
$("#refreshFilter").click(function() {
  console.log("refreshFilter");
  refreshFilter();
});
$("#saveFilter").click(function() {
  console.log("saveFilter");
  saveFilter();
});

$("#loadFilter").click(function() {
  console.log("loadFilter");
  loadFilter();
});


// Update filter and scan on page load (if enabled)
$(window).load(function(){
	if (storageAllowed) {
		loadFilter();
	} else {
		refreshFilter();
	}
	
	if (!scanning && scanOnLoad) {
		scanning = true;
		console.log("Initiating Scan:", (new Date()).toLocaleTimeString());
		scanLoop(minLat,minLon);
	}
});
