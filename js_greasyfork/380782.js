// ==UserScript==
// @name Cookie Monster
// @namespace Cookie
// @include http://orteil.dashnet.org/cookieclicker/
// @include https://orteil.dashnet.org/cookieclicker/
// @version 1
// @grant none
// @description Auto loads Cookie Monster for Cookie Clicker
// @downloadURL https://update.greasyfork.org/scripts/380782/Cookie%20Monster.user.js
// @updateURL https://update.greasyfork.org/scripts/380782/Cookie%20Monster.meta.js
// ==/UserScript==

var code = "(" + (function() {
    var checkReady = setInterval(function() {
        if (typeof Game.ready !== 'undefined' && Game.ready) {
            Game.LoadMod('https://aktanusa.github.io/CookieMonster/CookieMonster.js');
            clearInterval(checkReady);
        }
    }, 1000);
}).toString() + ")()";

window.eval(code);