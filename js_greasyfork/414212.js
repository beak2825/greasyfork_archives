// ==UserScript==
// @name        PeaceYellow
// @namespace   Violentmonkey Scripts
// @match       https://www.codingame.com/*
// @grant       none
// @version     1.0
// @author      BlaiseEbuth
// @description Change the Codingame notification's agressive red to a peaceful yellow...
// @downloadURL https://update.greasyfork.org/scripts/414212/PeaceYellow.user.js
// @updateURL https://update.greasyfork.org/scripts/414212/PeaceYellow.meta.js
// ==/UserScript==

'use strict';

var peace = function()
{
  var bubbles = document.getElementsByClassName("cg-notification-bubble");
  
  for(var i = 0; i < bubbles.length; ++i)bubbles[i].style.cssText = "background-color:#f2bb13 !important";
  
  var badges = document.querySelectorAll('[class^=badge-]');
  
  for(var i = 0; i < badges.length; ++i)badges[i].style.cssText = "background-color:#f2bb13 !important";
}

setInterval(peace, 1000);