// ==UserScript==
// @name         T rex hacked
// @namespace    http://tampermonkey.net/
// @version      99999
// @description  get highest score possible
// @author       You
// @match        http://www.trex-game.skipser.com/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/393821/T%20rex%20hacked.user.js
// @updateURL https://update.greasyfork.org/scripts/393821/T%20rex%20hacked.meta.js
// ==/UserScript==

//
Runner.instance_.setSpeed(9999)
var original = Runner.prototype.gameOver
Runner.prototype.gameOver = function(){}
Runner.instance_.distanceRan = 0 
Runner.instance_.distanceMeter.config.COEFFICIENT
Runner.instance_.tRex.setJumpVelocity(50)
//