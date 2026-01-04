// ==UserScript==
// @name         MANYLABND TELEPORT HACK
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://manyland.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/380413/MANYLABND%20TELEPORT%20HACK.user.js
// @updateURL https://update.greasyfork.org/scripts/380413/MANYLABND%20TELEPORT%20HACK.meta.js
// ==/UserScript==

(function() {var scrx = ig.game.screen.x
var scry = ig.game.screen.y
var curposx = ig.game.O2499.pos.x
var curposy = ig.game.O2499.pos.y
ig.input.mouse.x = curposx
ig.input.mouse.y = curposy
setInterval(function(){
ig.game.screen.x = scrx
ig.game.screen.y = scry
ig.game.O2499.jumping=false
ig.game.O2499.fallTimer=0
var posx = ig.input.mouse.x
var posy = ig.input.mouse.y
ig.game.O2499.pos.x = posx
ig.game.O2499.pos.y = posy}, 0);
    'use strict';

    // Your code here...
})();