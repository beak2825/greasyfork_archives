// ==UserScript==
// @name DelugeRPG PokeFinder
// @namespace Pokemon
// @version 1.3
// @description Tools
// @author Elijah Watson
// @require http://code.jquery.com/jquery-1.11.0.min.js
// @match *.delugerpg.com/*
// @grant none
// @email ElighScript@gmail.com
// @downloadURL https://update.greasyfork.org/scripts/406277/DelugeRPG%20PokeFinder.user.js
// @updateURL https://update.greasyfork.org/scripts/406277/DelugeRPG%20PokeFinder.meta.js
// ==/UserScript==
/*********Information*************/
// To use this script you need to install TamperMonkey/GreaseMonkey ( EXTENSIONS ) on your web browser (e.g. Chrome/Firefox)
// Select add script and paste all of this script and enable it
// For this one i already set up a Legendary Catcher only so you can just go to any map and wait until a notification pops up saying 'Found Something' and you just got yourself a legendary. Have fun !
/**********LOGIN SETTING**********/
var autoLogin = false; //auto-login when logged out

var username = "example1990";
var password = "QwertY12345";

/**********ON/OFF SETTINGS**********/
var doBattle = false; //enable battles same battle over and over again
var forceBattle = false; //enable being sent to the battle url when at dashboard
var findPokemon = true; //enable finding pokemon alerts
var findLevels = false; //enable find specific pokemon levels
var findLevelsAndUp = false; //enable finding pokemon levels and up
var autoWalkFind = true; //enable walking+finding without you doing work

/**********FINDING SETTINGS**********/
// Normal, Shiny, Metallic, Ghost, Dark, Shadow, Mirage, Chrome, Negative, Retro.
//Must include capital letters at the start of each pokemon AND the modifier name.
//For a normal pokemon just type the name with no additional tags.
var pokemonToFind = [
// Custom
'Shiny Beldum',
'Ghost Beldum',
'Dark Beldum',
'Shadow Beldum',
'Mirage Beldum',
'Chrome Beldum',
'Negative Beldum',
'Retro Beldum',
'Metallic Beldum',
'Beldum',
];
//the pokemon you want to be alerted of
//make sure you get the right spelling
//TIP: You can also use the above setting as
//a general keyword searcher in the pokemon you see
//e.g. "shiny", "dark"

var levelsToFind = ["4"]; //The specific levels you want to be alerted for
//keep this a string array

var levelsAndUpToFind = 50; //level and up to alert about pokemon
//dont make this a string or array

var scanFreq = 75; //time to wait between every time the script checks if you saw what you wanted (in milliseconds)

var isDoneLoadingFreq = 350; //time to wait between checking if looking for pokemon has finished loading (in milli)
//dont make this too low (keep it how it is, it works fine) unless you have very super speedy internet
//THE LOWER THIS IS THE HIGHER CHANCE YOU HAVE OF LOSING A LEGEND

/**********FIGHTING SETTINGS**********/
var battle = "/S-Flying";
//change this to your battle url, but make sure you remove everything up to the /battle.php?jglasd=dfjklgdfj
//Even though it does automatically :P

var firstPokemonPrefAtt = 0; // 0 = don't pick
var seconPokemonPrefAtt = 0; // 0 = don't pick
var thirdPokemonPrefAtt = 0; // 0 = don't pick
var fourtPokemonPrefAtt = 0; // 0 = don't pick
var fifthPokemonPrefAtt = 0; // 0 = don't pick
var sixthPokemonPrefAtt = 0; // 0 = don't pick

var firstPokemonName = ""; // These names just need to be unique
var seconPokemonName = ""; // Capitalization is ignored
var thirdPokemonName = ""; // if empty it will be skipped
var fourtPokemonName = ""; // if not found it will be skipped
var fifthPokemonName = ""; // Make sure you spell right :p
var sixthPokemonName = ""; //
var attackFreq = 500; //time to wait between every click while fighting (in milliseconds)

/**********IGNORE EVERYTHING PAST THIS**********/
var pokeNames = [firstPokemonName, seconPokemonName, thirdPokemonName, fourtPokemonName, fifthPokemonName, sixthPokemonName];
var pokeAtts = [firstPokemonPrefAtt, seconPokemonPrefAtt, thirdPokemonPrefAtt, fourtPokemonPrefAtt, fifthPokemonPrefAtt, sixthPokemonPrefAtt];
var battleUrl = ".delugerpg.com/battle/computer/username";
var findUrl = ".delugerpg.com/map";
var loginUrl = ".delugerpg.com/login";
var dashboardUrl = ".pokemon-vortex.com/dashboard.php";
var attTimes = 0;
var moveTimes = 0;

if(battle.indexOf(".com")>-1){
battle = battle.split(".com")[1];
}

if (doBattle && window.location.href.indexOf(battleUrl) > -1) {
function startBattle() {
for(var d = 0; d < 6; d++)
// if(pokeAtts[d] !== 0 && $("h3:contains('Your')").text().toLowerCase().indexOf(pokeNames[d].toLowerCase()) > -1 && pokeNames[d] !== "")
// $("input#attack"+pokeAtts[d]).click();

// if($("input[value*='Start Battle']").length)
$("input[value*='Start Battle']").click();
$("input[value*='Start Battle']").submit();
if($("input[value*='Attack']").length)
$("input[value*='Attack']").submit();
if($("a:contains('Rebattle Opponent')").length)
$("a:contains('Rebattle Opponent')").click();
}
if (window.location.href.indexOf(battle) >-1) {
setInterval(function () {
if($("#loading").css("visibility") == "hidden"){
startBattle();
attTimes = 0;
}else{
attTimes++;
}
if(times >= 100)
location.reload(true);

}, attackFreq);
} else {
window.location.href = battle;
}
}else if ((findPokemon || findLevels || findLevelsAndUp) && window.location.href.indexOf(findUrl) > -1) {
var a;
var b;
var finderOn = true;
var whichMove = 1;

function fireKey(el, key) {
//Set key to corresponding code. This one is set to the left arrow key.
//37 = left, 38 = up, 39 = right, 40 = down;
if (document.createEventObject) {
var eventObj = document.createEventObject();
eventObj.keyCode = key;
el.fireEvent("onkeydown", eventObj);
} else if (document.createEvent) {
var eventObj = document.createEvent("Events");
eventObj.initEvent("keydown", true, true);
eventObj.which = key;
el.dispatchEvent(eventObj);
}
}


function found(thing){
if($('#showpoke').first().html().toLowerCase().indexOf(thing.toLowerCase()) > -1){
$('input[type="submit"][id="catch"]').click();
setTimeout(function(){$('input[type="submit"][value="Start Battle"]').click();}, 5000);
setTimeout(function(){$('input[type="radio"][value="masterball"]').click();}, 5069);
$('input[type="submit"][value="Throw Pokeball"]').click();
finderOn = true;
clearInterval(a);
if(autoWalkFind){
clearInterval(b);
}
return true;
}else{
return false;
}
}

function setFinder(){
finderOn = true;

if(autoWalkFind){
b = setInterval(function(){
var isLoading = $("#showpoke").text().indexOf("Searching...") > -1;
if(!isLoading){
switch(whichMove){
case 1:
fireKey(document,37);
whichMove = 2;
break;
case 2:
fireKey(document,38);
whichMove = 3;
break;
case 3:
fireKey(document,39);
whichMove = 4;
break;
case 4:
fireKey(document,40);
whichMove = 1;
break;
}
moveTimes=0;
}else{
moveTimes++;
}
if(moveTimes >= 100)
location.reload(true);
},isDoneLoadingFreq);
}

a = setInterval(function () {
if(findPokemon)
for (var i = 0; i < pokemonToFind.length; i++)
found(pokemonToFind[i]);

if(findLevels)
for (var i = 0; i < levelsToFind.length; i++)
found("Level: " + levelsToFind[i] + " ");

if(findLevelsAndUp)
for(var l = levelsAndUpToFind; l<101;l++)
if (found("Level: " + l + " "))
break;

}, scanFreq);
}

setFinder();
$(document).keydown(function(event) {
switch (event.keyCode) {
case 37: case 38: case 39: case 40: case 87: case 65: case 83: case 68: if(!finderOn)setFinder();
break;
}
});

}else if(autoLogin && window.location.href.indexOf(loginUrl) > -1){
$("input[name*='username']").val(username);
$("input[name*='password']").val(password);
$("input[value*='Login']").click();
$("input[value*='Login']").submit();
}else if(forceBattle && window.location.href.indexOf(dashboardUrl) > -1){
window.location.href = battle;
}