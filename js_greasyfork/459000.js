// ==UserScript==
// @name        Muj Wykop for Wykop.pl
// @namespace   Violentmonkey Scripts
// @match       https://*.wykop.pl/*
// @grant       none
// @version     1.0
// @author      LuK1337
// @description Adds "Muj Wykop" shortcut to header
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/459000/Muj%20Wykop%20for%20Wykoppl.user.js
// @updateURL https://update.greasyfork.org/scripts/459000/Muj%20Wykop%20for%20Wykoppl.meta.js
// ==/UserScript==
 
(function() {
  'use strict';
 
  let mikroblog = document.querySelector('body > section > header > div.left > nav > ul > li:nth-child(3)')
 
  let mujWykop = mikroblog.cloneNode(true)
  mujWykop.querySelector("a").href = '/obserwowane'
  mujWykop.querySelector("a > span").innerHTML = 'Muj Wykop'
 
  mikroblog.parentElement.append(mujWykop)
})();