// ==UserScript==
// @name Cookie Monster
// @namespace Cookie
// @include http://orteil.dashnet.org/cookieclicker/
// @version 1
// @grant none
// @description Loads the CookieMonster helper tool for CookieClicker Idle game
// @downloadURL https://update.greasyfork.org/scripts/18793/Cookie%20Monster.user.js
// @updateURL https://update.greasyfork.org/scripts/18793/Cookie%20Monster.meta.js
// ==/UserScript==

javascript:(function() {
    var checkReady = setInterval(function() {
        if (typeof Game.ready !== 'undefined' && Game.ready) {
            Game.LoadMod('http://aktanusa.github.io/CookieMonster/CookieMonster.js');
            clearInterval(checkReady);
        }
    }, 1000);
}());