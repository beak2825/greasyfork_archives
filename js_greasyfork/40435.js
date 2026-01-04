// ==UserScript==
// @name Pokemon Vortex V4 AutoFindPokemon
// @description Auto pokemon finder
// @author Blurt
// @version 1.0
// @namespace http://localhost
// @include *pokemon-vortex.com/map*
// @require http://code.jquery.com/jquery-2.1.4.js
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/40435/Pokemon%20Vortex%20V4%20AutoFindPokemon.user.js
// @updateURL https://update.greasyfork.org/scripts/40435/Pokemon%20Vortex%20V4%20AutoFindPokemon.meta.js
// ==/UserScript==

// THE REST OF THE SCRIPTS CAN BE FOUND HERE: https://mega.nz/#!mcdEVTYC!auCyQbMBWCMdyHXvhFhGZTQnRqAeiun6EQ1RXFHHk70
// I only uploaded this because the Moderators annoyed me, I had no intention of uploading this earlier. Great job Mods.
// If changes are made to the website that breaks the script(s) I will fix it and reupload/redistribute for free.
// Made by Blurt
// Message me at blurt.blaxter@gmail.com for any questions or concerns.
// You should NOT have paid for this program. This is free.

var state = Math.round((Math.random()));
var waiting = ["Please wait"];
var exists = document.querySelectorAll('#pkmnappear');
var pathname = window.location.pathname;

// CHANGE THE POKEMONS NAMES HERE TO THE ONES YOU WANT. CURRENTLY ALL LEGENDARIES ARE LISTED. ULTRA BEASTS ARE NOT.
var wanted = ["Articuno", "Zapdos", "Moltres", "Mewtwo", "Mew", "Raikou", "Entei", "Suicune", "Lugia", "Ho-oh", "Celebi", "Regirock", "Regice", "Registeel", "Latias", "Latios", "Kyogre", "Groudon", "Rayquaza", "Jirachi", "Deoxys", "Uxie", "Mesprit", "Azelf", "Dialga", "Palkia", "Giratina", "Heatran", "Regigigas", "Cresselia", "Darkrai", "Phione", "Manaphy", "Shaymin", "Arceus", "Victini", "Cobalion", "Terrakion", "Virizion", "Keldeo", "Tornadus", "Thundurus", "Landorus", "Reshiram", "Zekrom", "Kyurem", "Meloetta", "Genesect", "Xerneas", "Yveltal", "Zygarde"];
// CHANGE THE POKEMONS NAMES HERE TO THE ONES YOU WANT. CURRENTLY ALL LEGENDARIES ARE LISTED. ULTRA BEASTS ARE NOT.

//var wanted = ["Abra", "Volbeat", "Zorua", "Illumise", "Sigilyph"];
//var wanted = ["Spearow", "Pikipek", "Rufflet", "Murkrow", "Hoothoot", "Pidgey"];
//var wanted = ["Bulbasaur", "Charmander", "Squirtle", "Shadow", "Dark", "Shiny", "Mystic"]


start();

function start() {
$(".adsbygoogle").empty();
setTimeout(function() {
checkPokemon();
}, 3000);
}

function StartBattle() {
	$("#ajax").find("input[type='submit'][value='Battle!']").closest("form").submit();
}

function checkWaiting(title) {
for (var i= 0; i < waiting.length; i++){
var tag = waiting[i];
if (title.includes(tag)){
return true;
}
}
return false;
}

function checkPokemon(){
setTimeout(function() {
if (checkWaiting(exists[0].innerHTML)) {
console.log("We are waiting..");
checkPokemon();
} else {
if (checkIfWanted(exists[0].innerHTML)) {
console.log(exists[0].innerHTML);
beep();
StartBattle();
} else {
move();
}
}
}, 50);
}

function move() {
var rightURL = "https://static.pokemon-vortex.com/v4/images/maps/arrows/arrowright.gif";
var leftURL = "https://static.pokemon-vortex.com/v4/images/maps/arrows/arrowleft.gif";
var imgs = document.querySelectorAll('img');
var leftImage, rightImage;
for (var i= 0; i < imgs.length; i++) {
var img = imgs[i];
if (img.getAttribute("src") == leftURL ){
leftImage = img;
}
if (img.getAttribute("src") == rightURL){
rightImage = img;
}
}
if (leftImage != null && state == 0) {
leftImage.click();
} else if (leftImage == null) {
state = 1;
}

if (rightImage != null && state == 1) {
rightImage.click();
} else if (rightImage == null) {
state = 0;
}
checkPokemon();
}

function checkIfWanted(title) {
for (var i= 0; i < wanted.length; i++){
var tag = wanted[i];
if (title.includes(tag)){
return true;
}
}
return false;
}