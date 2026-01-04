// ==UserScript==
// @name Cookie Clicker Add-ons
// @namespace CookieClicker
// @license MIT
// @description Add-ons for Cookie Clicker
// @version 0.1
// @match https://orteil.dashnet.org/cookieclicker/
// @downloadURL https://update.greasyfork.org/scripts/444315/Cookie%20Clicker%20Add-ons.user.js
// @updateURL https://update.greasyfork.org/scripts/444315/Cookie%20Clicker%20Add-ons.meta.js
// ==/UserScript==

var readyCheck = setInterval(function() {
  var Game = unsafeWindow.Game;

  if (typeof Game !== 'undefined' && typeof Game.ready !== 'undefined' && Game.ready) {
    Game.LoadMod('https://rainslide.neocities.org/cookieclicker/GoldenCookieClicker.js');
    Game.LoadMod('https://klattmose.github.io/CookieClicker/Horticookie.js');
    setTimeout(function() {
      Game.LoadMod('https://cookiemonsterteam.github.io/CookieMonster/dist/CookieMonster.js');
    }, 1000); // delay loading CookieMonster, has to be after for some reason.
    clearInterval(readyCheck);
  }
}, 1000);