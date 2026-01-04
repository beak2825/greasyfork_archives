// ==UserScript==
// @name [deprecated] Auto Loot Assistant
// @description Loot assistant farms automatically
// @author FunnyPocketBook
// @version 1.1.2
// @date 03-10-2017
// @namespace FunnyPocketBook
// @include https://uk*.tribalwars.co.uk/game.php?village=*&screen=am_farm*
// @include https://ch*.staemme.ch/game.php?village=*&screen=am_farm*
// @include https://frs*.guerretribale.fr/game.php?village=*&screen=am_farm*
// @include https://de*.die-staemme.de/game.php?village=*&screen=am_farm*
// @include https://en*tribalwars.net/game.php?village=*&screen=am_farm*
// @include https://nl*.tribalwars.nlgame.php?village=*&screen=am_farm*
// @include https://pl*.plemiona.pl/game.php?village=*&screen=am_farm*
// @include https://sv*.tribalwars.se/game.php?village=*&screen=am_farm*
// @include https://br*.tribalwars.com.br/game.php?village=*&screen=am_farm*
// @include https://pt*.tribalwars.com.pt/game.php?village=*&screen=am_farm*
// @include https://cs*.divokekmeny.cz/game.php?village=*&screen=am_farm*
// @include https://ro*.triburile.ro/game.php?village=*&screen=am_farm*
// @include https://es*.guerrastribales.es/game.php?village=*&screen=am_farm*
// @include https://it*.tribals.it/game.php?village=*&screen=am_farm*
// @include https://us*.tribalswars.us/game.php?village=*&screen=am_farm*
// @downloadURL https://update.greasyfork.org/scripts/33733/%5Bdeprecated%5D%20Auto%20Loot%20Assistant.user.js
// @updateURL https://update.greasyfork.org/scripts/33733/%5Bdeprecated%5D%20Auto%20Loot%20Assistant.meta.js
// ==/UserScript==

window.onload = function(){ 

setInterval(function() {
    if(document.getElementsByClassName("rc-anchor-center-item").length > 0) {
		document.getElementsByClassName("rc-anchor-center-item")[0].click();
	} else{}
}, 10);

window.numAttVill = 30;
window.menu = $('#am_widget_Farm a.farm_icon_c');
var parentThingie = document.getElementById("inner-border");


// Insert buttons to set amount of attacks and send either A, B or C
// DON'T JUDGE BECAUSE I AM WRITING INEFFICIENT CODE AT LEAST I CAN DO IT OKAY

// Button to define the amount of attacks
var buttonAttNr = document.createElement("button");
buttonAttNr.innerHTML = "Number of Attacks";
buttonAttNr.setAttribute("id", "attNr");
buttonAttNr.setAttribute("style","float:left;margin:10px;");
buttonAttNr.setAttribute("class","btn");


// Button to choose A
var buttonChooseA = document.createElement("button");
buttonChooseA.innerHTML = "Choose A";
buttonChooseA.setAttribute("id", "chooseA");
buttonChooseA.setAttribute("style","float:left;margin:10px;");
buttonChooseA.setAttribute("class","btn");


// Button to choose B
var buttonChooseB = document.createElement("button");
buttonChooseB.innerHTML = "Choose B";
buttonChooseB.setAttribute("id", "chooseB");
buttonChooseB.setAttribute("style","float:left;margin:10px;");
buttonChooseB.setAttribute("class","btn");


// Button to choose C
var buttonChooseC = document.createElement("button");
buttonChooseC.innerHTML = "Choose C";
buttonChooseC.setAttribute("id", "chooseC");
buttonChooseC.setAttribute("style","float:left;margin:10px;");
buttonChooseC.setAttribute("class","btn");



// Button to launch
var buttonLaunch = document.createElement("button");
buttonLaunch.innerHTML = "Launch attacks";
buttonLaunch.setAttribute("id", "launch");
buttonLaunch.setAttribute("style","float:left;margin:10px;");
buttonLaunch.setAttribute("class","btn");



// Insert buttons
insertAfter();
function insertAfter(){
    "use strict";
    parentThingie.insertAdjacentElement('afterbegin', buttonLaunch);
    parentThingie.insertAdjacentElement('afterbegin', buttonChooseC);
    parentThingie.insertAdjacentElement('afterbegin', buttonChooseB);
    parentThingie.insertAdjacentElement('afterbegin', buttonChooseA);
    parentThingie.insertAdjacentElement('afterbegin', buttonAttNr);
}

    

document.getElementById("attNr").onclick = function () {
    "use strict";
    window.numAttVill = prompt("How many attacks should be sent?", 30);
};

document.getElementById("chooseA").onclick = function () {
    "use strict";
    window.menu = $('#am_widget_Farm a.farm_icon_a');
};    
    
document.getElementById("chooseB").onclick = function () {
    "use strict";
    window.menu = $('#am_widget_Farm a.farm_icon_b');
};

document.getElementById("chooseC").onclick = function () {
    "use strict";
    window.menu = $('#am_widget_Farm a.farm_icon_c');
};

document.getElementById("launch").onclick = function () {
    "use strict";
    autoFarm();
};

function autoFarm(){
"use strict";
var refreshPage = 1;
var tempo = 500;
var x = 0;
var whyDoesThisVarExist = "";
var remove_attacks = 0;
var changeVillageTime = 1;
var alreadySent = $(window.menu).parent().parent().find('img.tooltip').length + "000";
if (remove_attacks === 1) {
  $('img').each(function() {
    var tempStr = $(this).attr('src');
    if (tempStr.indexOf('attack') !== -1) {
      $(this).addClass('tooltip');
    }
  });
}

if (refreshPage === 1) {
  setInterval(function() {
    window.location.reload();
  }, 400000);
}
console.log("There is already " + alreadySent.substring(0, (alreadySent.length - 3)) + " village with attack.");
if (changeVillageTime === "1") {
   changeVillageTime = random(2000, 3000);
} else {
   changeVillageTime = parseInt(changeVillageTime) + parseInt(random(82353, 35356));
}
console.log("Wait " + changeVillageTime + " milliseconds to switch villages.");

function random(min, max) {
  var numPossibilities = min - max;
  var rand = Math.random() * numPossibilities;
  return Math.round(parseInt(min) + rand);
}
for (var i = 0; i < window.numAttVill; i++) {
  $(window.menu).eq(i).each(function() {
    if (!($(this).parent().parent().find('img.tooltip').length)) {
      var timeoutTime = (tempo * ++x) - random(250, 400);
      setTimeout(function(whyDoesThisExist) {
        $(whyDoesThisExist).click();
      }, timeoutTime, this);
    }
  });
}

function altAldeia() {
  $('.arrowRight').click();
  $('.groupRight').click();
}
setInterval(altAldeia, changeVillageTime);
console.log("Changed by the FunnyPocketBook");
}
}