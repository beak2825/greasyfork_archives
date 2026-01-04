// ==UserScript==
// @name         Cookie Clicker Autoclicker
// @namespace    http://tampermonkey.net/
// @license      sovietarctic777@outlook.com
// @version      1.2
// @description  A simple script for cookie clicker that will autoclick cookies for you
// @author       You
// @match        http://sunset-nova-group.glitch.me/
// @match        https://orteil.dashnet.org/cookieclicker/
// @match        https://eli-schwartz.github.io/cookieclicker/
// @match        https://cookieclickercity.com/
// @match        https://sites.google.com/site/unblockedgames66ez/cookie-clicker
// @match        https://trixter9994.github.io/Cookie-Clicker-Source-Code/
// @match        https://www.tynker.com/community/projects/play/cookie-clicker-2/59a2f5655ae0295c7e8b4582/
// @match        https://watchdocumentaries.com/cookie-clicker-game/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/461850/Cookie%20Clicker%20Autoclicker.user.js
// @updateURL https://update.greasyfork.org/scripts/461850/Cookie%20Clicker%20Autoclicker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let autoClickerIntervalId;

function startAutoClicker() {
  autoClickerIntervalId = setInterval(() => {
    // click the cookie
    document.getElementById("bigCookie").click();
  }, 10); // click the cookie every 10 milliseconds
}

function stopAutoClicker() {
  clearInterval(autoClickerIntervalId);
}

document.addEventListener("keydown", (event) => {
  if (event.key === "s") {
    startAutoClicker();
  } else if (event.key === "Escape") {
    stopAutoClicker();
  }
});

    //Add an event listener for the key 1 that gives you 10000 cookies
    document.addEventListener("keydown", function(event) {
  if (event.keyCode === 49) {
    console.log("Giving you 10000 Cookies!");
   Game.Earn(10000)
  }
});
    //Add an event listener for the key 2 that gives you 1,000,000 cookeis
document.addEventListener("keydown", function(event) {
  if (event.keyCode === 50) {
    console.log("Giving you 1000000 Cookies!");

    Game.Earn(1000000)
  }
});
    //Add an event listener for the key 3 that gives you 1 Billion Cookies
    document.addEventListener("keydown", function(event) {
  if (event.keyCode === 51) {
    console.log("Giving you 1Billion Cookies");
    Game.Earn(1000000000)
  }
});
    //Add an event listener for the key 4 that makes your cps 1000
document.addEventListener("keydown", function(event) {
  if (event.keyCode === 52) {
    console.log("Setting your cps to 1000");
    Game.computedMouseCps=1000
  }
});
//Add an event listener for the key 5 that makes your cps 1 Million
document.addEventListener("keydown", function(event) {
  if (event.keyCode === 53) { // 53 is the keyCode for the key "5"
    console.log("Setting your Cps to 1 Million");
    Game.computedMouseCps=1000000;
  }
});

    //Add an event listener for the key 6 that makes your Cps 1 Trillion
document.addEventListener("keydown", function(event) {
  if (event.keyCode === 54) {
    console.log("Setting your Cps to 100 Trillion cuz its fun");
    var a = Game.computedMouseCps=1000000000000;
      a = true > Infinity
  }
});
    document.addEventListener("keydown", function(event) {
  if (event.keyCode === 48) {
    console.log("Resets the game cuz you ruined it");
      Game.SesameReset(); 
  }
});

    document.addEventListener("keydown", function(event) {
  if (event.keyCode === 55) {
    console.log("Gives you all achievements");
    Game.SetAllAchievs(1);
  }
});

    document.addEventListener("keydown", function(event) {
  if (event.keyCode === 56) {
    console.log("Gives you all Upgrades");
    Game.SetAllUpgrade(1);
  }
});

    document.addEventListener("keydown", function(event) {
  if (event.keyCode === 57) {
    console.log("Ruining the games fun!");
    Game.RuinTheFun(1);
  }
});

})();