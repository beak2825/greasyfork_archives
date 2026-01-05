// ==UserScript==
// @name        Filter Pokemon
// @namespace   pokeradario
// @include     *.pokeradar.io*
// @version     1
// @grant       none
// @description Don't display common pokemons in pokeradar.io
// @downloadURL https://update.greasyfork.org/scripts/22666/Filter%20Pokemon.user.js
// @updateURL https://update.greasyfork.org/scripts/22666/Filter%20Pokemon.meta.js
// ==/UserScript==
/* pokeradar io include jquery 3.1.0 */

var commons = [
  "Pidgey"
, "Rattata"
, "Weedle"
, "Zubat"
, "Magikarp" //yeah, 400 is a lot
, "Spearow"
, "Drowzee"
, "Caterpie"
//, "Eevee" //soooo cute!
, "Psyduck"
, "Paras"
, "Venonat"
, "Ekans"
, "Poliwag"
, "Goldeen"
, "Krabby"
, "Staryu"
, "Nidoran♂"
, "Nidoran♀"
, "Geodude"
, "Bellsprout"
, "Horsea"
, "Sandshrew"
, "Slowpoke"
, "Pidgeotto"
, "Oddish"      
    ]

/* less than 1% spawn rate */
var commons2 = [
  "Pinsir"
, "Clefairy"
, "Mankey"
, "Growlithe"
, "Meowth"
, "Tentacool"
, "Gastly"
, "Exeggcute"
, "Magnemite"
, "Bulbasaur"
, "Voltorb"
, "Rhyhorn"
, "Cubone"
, "Squirtle"
, "Doduo"
, "Shellder"
, "Ponyta"
, "Machop"
, "Kakuna"
, "Golbat"
, "Abra"
, "Raticate"
, "Diglett"
, "Jigglypuff"
, "Jynx"
, "Dratini"
, "Seel"
, "Charmander"
, "Tangela"
, "Vulpix"
, "Dodrio"
, "Pikachu"
, "Koffing"
, "Metapod"
, "Fearow"
, "Scyther"
, "Omanyte"
, "Pidgeot"
, "Poliwhirl"
, "Tauros"
, "Onix"
, "Hypno"
, "Magmar"
, "Kabuto"
];
 
 /* less than 0.1% spawn rate */
var medium = [
  "Nidorina"
, "Golduck"
, "Nidorino"
, "Tentacruel"
, "Seaking"
, "Parasect"
, "Electabuzz"
, "Arbok"
, "Venomoth"
, "Weepinbell"
, "Graveler"
, "Gloom"
, "Kingler"
, "Grimer"
, "Haunter"
, "Beedrill"
, "Ivysaur"
, "Sandslash"
, "Slowbro"
, "Wartortle"
, "Machoke"
, "Seadra"
, "Starmie"
, "Primeape"
, "Kadabra"
, "Magneton"
, "Butterfree"
, "Persian"
, "Hitmonchan"
, "Rhydon"
, "Farfetch'd"
, "Electrode"
, "Marowak"
, "Hitmonlee"
, "Dragonair"
, "Wigglytuff"
, "Aerodactyl"
, "Venasaur"
, "Nidoking"
, "Arcanine"
, "Flareon"
, "Weezing"
, "Snorlax"
, "Cloyster"
, "Dugtrio"
, "Exeggutor"
, "Vaporean"
, "Dewgong"
, "Chansey"
, "Charmeleon"
, "Nidoqueen"
, "Clefable"
, "Jolteon"
, "Porygon"
, "Poliwrath"
, "Rapidash"
, "Lickitung"
];
 
 
/* less than 0,01% spawn rate */
var rare = [
  "Vileplume"
, "Kangaskhan"
, "Ninetails"
, "Raichu"
, "Alakazam"
, "Machamp"
, "Blastoise"
, "Gengar"
, "Omastar"
, "Lapras"
, "Victreebell"
, "Golem"
, "Gyrados"
, "Kabutops"
, "Charizard"
, "Muk"
, "MrMime"
, "Dragonite"
];

/*
 * Just uncoment what you want to filter. 
 * By default, only removing most commons. 
 */
var filtered = commons.concat(
//  commons2
//, medium
//, rare
);
    

jQuery( document ).ready(function(){ 
  window.setInterval(function(){
    for( var i = 0; i < filtered.length; i++) {
      $("img[title='"+filtered[i]+"']").parent().css("display", "none")
    }
  }, 500) 
});