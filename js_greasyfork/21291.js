// ==UserScript==
// @name         DrFlash55's Confirm-Exit Crap
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        diep.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/21291/DrFlash55%27s%20Confirm-Exit%20Crap.user.js
// @updateURL https://update.greasyfork.org/scripts/21291/DrFlash55%27s%20Confirm-Exit%20Crap.meta.js
// ==/UserScript==

window.onbeforeunload = function(){
  return 'Idk why I have to put this here';
};