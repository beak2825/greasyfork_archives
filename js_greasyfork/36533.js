// ==UserScript==
// @name         Cookie Clicker Bot
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Turn the Cookie Clicker to the Bot! the bot helps you to click fast and buy items
// @author       Rickandress
// @match        http://orteil.dashnet.org/experiments/cookie/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/36533/Cookie%20Clicker%20Bot.user.js
// @updateURL https://update.greasyfork.org/scripts/36533/Cookie%20Clicker%20Bot.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // CCBot by rickandress - Works for Old Cookie Clicker Game
    // CCBot Start
    setInterval(function(){ ClickCookie(); }, 100);
    setInterval(function(){ HoverCookie(); }, 200);
    setInterval(function(){ document.getElementById("buyCursor").click(); }, 3000);
    setInterval(function(){ document.getElementById("buyGrandma").click(); }, 3000);
    setInterval(function(){ document.getElementById("buyFactory").click(); }, 3000);
    setInterval(function(){ document.getElementById("buyMine").click(); }, 3000);
    setInterval(function(){ document.getElementById("buyShipment").click(); }, 3000);
    setInterval(function(){ document.getElementById("buyAlchemy lab").click(); }, 3000);
    setInterval(function(){ document.getElementById("buyPortal").click(); }, 3000);
    setInterval(function(){ document.getElementById("buyTime machine").click(); }, 3000);
    // CCBot End
})();