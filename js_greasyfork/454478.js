// ==UserScript==
// @name         CookieClicker haxx
// @namespace    CookieClicker Mod
// @version      0.1
// @description  Cookieclicker Haxx
// @author       Cookiecopter_HD
// @match        https://orteil.dashnet.org/cookieclicker/
// @icon         https://bit.ly/3PtTlLP
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/454478/CookieClicker%20haxx.user.js
// @updateURL https://update.greasyfork.org/scripts/454478/CookieClicker%20haxx.meta.js
// ==/UserScript==
Game.lastClick = 0
setInterval(function(){
    Game.cookies = Infinity
    Game.cookiesPs = Infinity
    }, 1);