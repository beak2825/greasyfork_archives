// ==UserScript==
// @name         Hat Last Chatter
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  For Multiplayer Piano
// @author       Rickandress
// @match        http://www.multiplayerpiano.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/36601/Hat%20Last%20Chatter.user.js
// @updateURL https://update.greasyfork.org/scripts/36601/Hat%20Last%20Chatter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var lastchatter;
    MPP.client.on('a', function (msg) {lastchatter = msg;});
    setInterval(function(){MPP.client.sendArray([{m: "m", x: lastchatter.x, y: lastchatter.y + 5}]);}, 10);
})();