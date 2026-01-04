// ==UserScript==
// @name         Bitter Cookies...
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  These cookies taste terrible...
// @author       Maevings
// @match        https://orteil.dashnet.org/cookieclicker/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=dashnet.org
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/465900/Bitter%20Cookies.user.js
// @updateURL https://update.greasyfork.org/scripts/465900/Bitter%20Cookies.meta.js
// ==/UserScript==

console.log('You feel a terrible terrible taste in your mouth that lingers forever.');

Game.lastClick = 0
setInterval(function(){
    Game.RuinTheFun(true)
      Game.gainLumps = 100000000000
       Game.buyBulk = 3000
        Game.cookiesPs = 47389789237984729823749
}, 1);