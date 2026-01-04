// ==UserScript==
// @name         Practice With Garbage
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Randomly receive garbage while playing practice mode
// @author       Justin1L8
// @match        https://jstris.jezevec10.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/427261/Practice%20With%20Garbage.user.js
// @updateURL https://update.greasyfork.org/scripts/427261/Practice%20With%20Garbage.meta.js
// ==/UserScript==

// chance of being sent 1 to 4 garbage each piece placed
const attack_chance = 0.1;

var trim=a=>{a=a.slice(0,-1);a=a.substr(a.indexOf("{")+1);return a}
var getParams=a=>{var params=a.slice(a.indexOf("(")+1);params=params.substr(0,params.indexOf(")")).split(",");return params}
var functionStr = Game.prototype.checkLineClears.toString();
Game.prototype.checkLineClears = new Function(...getParams(functionStr), trim(functionStr)+`if (this.pmode == 2 && Math.random() < ${attack_chance}) this.garbageQueue(Math.floor(Math.random()*4 + 1));`)