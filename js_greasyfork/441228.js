// ==UserScript==
// @name         Clicky clookie
// @namespace    http://tampermonkey.net/
// @version      0.30
// @description  Cookie clicker hacks
// @author       Zackary, William, Bennett.
// @match       https://ozh.github.io/cookieclicker/
// @icon         https://external-content.duckduckgo.com/iu/?u=http%3A%2F%2Fthedeliciousplate.com%2Fwp-content%2Fuploads%2F2018%2F04%2FIMG_1766.jpg&f=1&nofb=1
// @grant        none
// @license GNU
// @downloadURL https://update.greasyfork.org/scripts/441228/Clicky%20clookie.user.js
// @updateURL https://update.greasyfork.org/scripts/441228/Clicky%20clookie.meta.js
// ==/UserScript==
 var version = 0.25
// on load
 setTimeout(function(){
    alert("Hello, welcome to clicky clookie. Ctrl+Shift+I then find the console to get a list of key binds and commands. ")
    console.log("Clicky Clookie guide");
    console.log("==================");
    console.log("Sugerlumpadd = v");
    console.log("Cookieadd = b");
    console.log("Pause = p")
    console.log("Prestige chips = h")
    console.log("==================");
    console.log("");
    console.log("Non keybined");
    console.log("==================");
    console.log("ACVall() = unlock all Achievements");
    console.log("AutoClick()")
    console.log("WhatVersionDoIUse()")
    console.log("");
}, 2000);


function AutoClick() {
var autoclicker = setInterval(function(){
  try {
    document.getElementById('bigCookie').click();
  } catch (err) {
    clearInterval();
  }
}, 10);
}


function WhatVersionDoIuse() {
console.log("This is only approved for https://ozh.github.io/cookieclicker/.")
console.log("Just remember this was made at school so updates and testing is rather slow.")
    console.log("Therefore i cant do much about testing it on other due to fire wall issue although any updates will be in the change log.")
    console.log("")
    console.log("- Zack, b.")
}

var bakeryNameHistory = Game.bakeryName


function Bakeryfix() {
Game.bakeryNameSet(bakeryNameHistory)
}

// give all Achievements
function ACVall() {
    Game.AchievementsById.forEach(function(e) {
        // if (e.hide != 3)
        Game.Win(e.name);
    });
};

// on event shit https://greasyfork.org/en/users/699088-childconsumer69420 made the suger lump and cookie shit
window.addEventListener('keydown', function(e){
    if(e.key == "v"){
var ez = prompt("Enter your suger lump amount: ", 0);
Game.gainLumps(parseInt(ez));
    }
});

window.addEventListener('keydown', function(e){
    if(e.key == "p"){
      var trump = prompt("Game paused");
    }
});

window.addEventListener('keydown', function(e){
    if(e.key == "h"){
      var chips = prompt("Insert how many chips")
      Game.heavenlyChips=parseInt(chips)
    }
});



window.addEventListener('keydown', function(e){
    if(e.key == "b"){
var ez = prompt("Enter Number of cookies You Want.", 0);
Game.Earn(parseInt(ez));
    }
});

