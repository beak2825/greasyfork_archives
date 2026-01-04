// ==UserScript==
// @name         T-Rex Game Leaker
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  LEAKED BY Mr-jhRoX
// @author       Mr-jhRoX
// @match        https://elgoog.im/t-rex/
// @match        http://www.trex-game.skipser.com/
// @match        https://chromedino.com/
// @match        https://apps.thecodepost.org/trex/trex.html
// @match        https://trex-runner.com/  
// @match        https://chromedino.com/black/  
// @match        https://chromedino.com/mario/
// @match        https://chromedino.com/batman/             
// @match        https://chromedino.com/joker/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/411579/T-Rex%20Game%20Leaker.user.js
// @updateURL https://update.greasyfork.org/scripts/411579/T-Rex%20Game%20Leaker.meta.js
// ==/UserScript==


    'use strict';

   //cheat codes

Runner.instance_.setSpeed(1999)
Runner.prototype.gameOver = function(){}
Runner.config.GAMEOVER_CLEAR_TIME = 999999999999999999
Runner.prototype.gameOver = original
Runner.instance_.tRex.setJumpVelocity(90)
Runner.instance_.distanceRan = 999999 / Runner.instance_.distanceMeter.config.COEFFICIENT
Runner.instance_.playingIntro = false
var original = Runner.prototype.gameOver
Runner.prototype.gameOver = function(){}
Runner.instance_.tRex.setJumpVelocity(100)