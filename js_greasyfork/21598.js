// ==UserScript==
// @name        PokevisionMod
// @namespace   PokeMod
// @description Pokevision Mod
// @include     https://pokevision.com/*
// @version     1.1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/21598/PokevisionMod.user.js
// @updateURL https://update.greasyfork.org/scripts/21598/PokevisionMod.meta.js
// ==/UserScript==
//POKEVISION AFK MOD - Take 2 (Thanks to Dkaussie,ffejmania & Lolologist)
console.log("%cLOADING POKEVISION MOD","color:lightblue");
console.log("- Original Script by Dkaussie");
console.log("- Big thanks to ffejmania for the distance calculator");

/* Check these guys out for there awesome narrator API! http://responsivevoice.org/ */
$.getScript("https://code.responsivevoice.org/responsivevoice.js",function() {
	console.log("Loaded narrator");
});
/*Sound effects, in case the narrator bugs up (happens a lot)
	Hopefully these guys don't mind we're using their sound :)
	http://ionden.com/a/plugins/ion.sound/static/sounds/button_tiny.mp3
*/
var audio = new Audio('http://ionden.com/a/plugins/ion.sound/static/sounds/button_tiny.mp3');
function blip() {
	audio.play();
}
//Clean that side bar. Sorry website owners.
$(".home-sidebar p:not(.home-sidebar-social), .home-sidebar ol, .home-sidebar h3").remove();
$(".home-sidebar").append(`
	<h3 id="distanceheader">Alert distance <1500m</h3>
	<input id="searchdistance" type="range" min="10" max="3000" value="1500"></input>
	<h3>Pokemon</h3>
	<p><button id="deselectall">Deselect All</button><button id="selectall">Select All</button></p>
	<ol id="alertlist" type="1">
	</ol>
`);
$(".home-map-scan").remove();

var pokemonAlertList = { //Choose which pokemon you want to be alerted about!
	"Bulbasaur": true,
	"Ivysaur":true,
	"Venusaur":true,
	"Charmander":true,
	"Charmeleon":true,
	"Charizard":true,
	"Squirtle":true,
	"Wartortle":true,
	"Blastoise":true, 
	"Caterpie":false, 
	"Metapod":true,
	"Butterfree":true,
	"Weedle":true,
	"Kakuna":true,
	"Beedrill":true,
	"Pidgey":false, //Hell no
	"Pidgeotto":true,
	"Pidgeot":true,
	"Rattata":false,
	"Raticate":true,
	"Spearow":true,
	"Fearow":true,
	"Ekans":true,
	"Arbok":true,
	"Pikachu":true,
	"Raichu":true,
	"Sandshrew":true,
	"Sandslash":true,
	"Nidoran♀":true,
	"Nidorina":true,
	"Nidoqueen":true,
	"Nidoran♂":true,
	"Nidorino":true,
	"Nidoking":true,
	"Clefairy":true,
	"Clefable":true,
	"Vulpix":true,
	"Ninetales":true,
	"Jigglypuff":true,
	"Wigglytuff":true,
	"Zubat":false, //Hell no
	"Golbat":true,
	"Oddish":true,
	"Gloom":true,
	"Vileplume":true,
	"Paras":true,
	"Parasect":true,
	"Venonat":true,
	"Venomoth":true,
	"Diglett":true,
	"Dugtrio":true,
	"Meowth":true,
	"Persian":true,
	"Psyduck":true,
	"Golduck":true,
	"Mankey":true,
	"Primeape":true,
	"Growlithe":true,
	"Arcanine":true,
	"Poliwag":true,
	"Poliwhirl":true,
	"Poliwrath":true,
	"Abra":true,
	"Kadabra":true,
	"Alakazam":true,
	"Machop":true,
	"Machoke":true,
	"Machamp":true,
	"Bellsprout":true,
	"Weepinbell":true,
	"Victreebel":true,
	"Tentacool":true,
	"Tentacruel":true,
	"Geodude":true,
	"Graveler":true,
	"Golem":true,
	"Ponyta":true,
	"Rapidash":true,
	"Slowpoke":true,
	"Slowbro":true,
	"Magnemite":true,
	"Magneton":true,
	"Farfetch'd":true,
	"Doduo":true,
	"Dodrio":true,
	"Seel":true,
	"Dewgong":true,
	"Grimer":true,
	"Muk":true,
	"Shellder":true,
	"Cloyster":true,
	"Gastly":true,
	"Haunter":true,
	"Gengar":true,
	"Onix":true,
	"Drowzee":true,
	"Hypno":true,
	"Krabby":true,
	"Kingler":true,
	"Voltorb":true,
	"Electrode":true,
	"Exeggcute":true,
	"Exeggutor":true,
	"Cubone":true,
	"Marowak":true,
	"Hitmonlee":true,
	"Hitmonchan":true,
	"Lickitung":true,
	"Koffing":true,
	"Weezing":true,
	"Rhyhorn":true,
	"Rhydon":true,
	"Chansey":true,
	"Tangela":true,
	"Kangaskhan":true,
	"Horsea":true,
	"Seadra":true,
	"Goldeen":true,
	"Seaking":true,
	"Staryu":true,
	"Starmie":true,
	"Mr. Mime":true,
	"Scyther":true,
	"Jynx":true,
	"Electabuzz":true,
	"Magmar":true,
	"Pinsir":true,
	"Tauros":true,
	"Magikarp":true,
	"Gyarados":true,
	"Lapras":true,
	"Ditto":true,
	"Eevee":true,
	"Vaporeon":true,
	"Jolteon":true,
	"Flareon":true,
	"Porygon":true,
	"Omanyte":true,
	"Omastar":true,
	"Kabuto":true,
	"Kabutops":true,
	"Aerodactyl":true,
	"Snorlax":true,
	"Articuno":true,
	"Zapdos":true,
	"Moltres":true,
	"Dratini":true,
	"Dragonair":true,
	"Dragonite":true,
	"Mewtwo":true, 
	"Mew":true, //The dream
}

var searchdistance = 1500; //Are they worth the walk?
var showUnwanted = true; //If it's not on the alert list should it be shown? This isn't a feature just yet...

//Add pokemon to the list
for (key in pokemonAlertList) {
	var isChecked = pokemonAlertList[key]? "checked" : "";
	$("#alertlist").append('<li><input type="checkbox" '+isChecked+'></input> '+key+'</li>');
}

//Bind events to the list items
$("#selectall").click(function(){
	console.log("selectall");
	$("#alertlist li").each(function(e){
		$(this).find("input").prop("checked",true);
		var name = $(this).text().replace(/\s+/g, '');
		pokemonAlertList[name] = true;
	});
});
$("#deselectall").click(function(){
	console.log("deselectall");
	$("#alertlist li").each(function(e){
		$(this).find("input").prop("checked",false);
		var name = $(this).text().replace(/\s+/g, '');
		pokemonAlertList[name] = false;
	});
});
$("#searchdistance").mousemove(function(e){
	var dis = $(this).val();
	searchdistance = dis;
	if (dis < 3000) {
		$("#distanceheader").text("Alert distance <" + dis + "m");
	} else {
		$("#distanceheader").text("No limit");
	}
});
$("#alertlist li input").click(function(e){
	var name = $(this).parent().text().replace(/\s+/g, '');
	var state = $(this).is(":checked");
	console.log(name,state);
	pokemonAlertList[name] = state; //Update the variable
});

//The cool stuff
App.home.updateMarkers = function() {
	e = App.home;
	if (!e.map) {
		return
	};
	for (var i in e.pokemon) {
		var t = e.pokemon[i],
			o = t.expiration_time - Math.floor(+new Date() / 1000),
			n = e.markers['pokemon-' + i];
		if (o <= 0) {
			if (n) {
				e.map.removeLayer(n);
				delete e.markers['pokemon-' + i]
			};
			delete e.pokemon[i];
			continue
		};
		if (!n) { //Check if it's on the alert list and if its wanted
			if (pokemonAlertList[e.pokedex[t.pokemonId]])
			{
				n = e.createMarker(i, t);
				foundPokemon(e.pokedex[t.pokemonId], getDistanceMetres(App.home.latitude, App.home.longitude, n._latlng.lat, n._latlng.lng));
			}
		};
		if (n != null) {
			n.updateLabel(e.secondsToString(o))
		}
	}
};

function search () {
	console.log("Scanning...");
	App.home.findNearbyPokemon(App.home.latitude, App.home.longitude, !0);
	setTimeout(search(),31000); //Scans at websites desired delay, please don't change this!		
}

function foundPokemon(pokemon,d) {
	console.log("FOUND POKEMON!" + pokemon + " " + d + " metres away");
	if (pokemonAlertList[pokemon] && (d <= searchdistance || searchdistance === "3000")) { //If it's within range
		console.log("Alerting user!");
		responsiveVoice.speak("Found a " + pokemon+ " " + d + " metres away"); //Talk!
		blip(); //BLIP!
		App.success(
			'There is a ' + pokemon + ' ' + d + ' metres away! Go catch it!' //Pop up
		);
		return;
	}
}

//Big thanks to ffejmania (and Lolologist) :)
function getDistanceMetres(lat1,lon1,lat2,lon2) {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2-lat1);  // deg2rad below
  var dLon = deg2rad(lon2-lon1);
  var a =
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon/2) * Math.sin(dLon/2)
    ;
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  var d = Math.floor(R * c * 1000); // Distance in m
  return d;
}
function deg2rad(deg) {
  return deg * (Math.PI/180);
}

//Start the repeating search function
search();
App.success(
	'The mod has started running! It will automatically refresh the search every 30 seconds' //Pop up
);
blip();