// ==UserScript==
// @name         GOLD NAME (DON'T CHANGE)
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       Lazaro
// @match        https://agma.io/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/414042/GOLD%20NAME%20%28DON%27T%20CHANGE%29.user.js
// @updateURL https://update.greasyfork.org/scripts/414042/GOLD%20NAME%20%28DON%27T%20CHANGE%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

var i = 1;
var timer = setInterval(function(){

  if(i>Infinity){
    clearInterval(timer)
  }else{
    document.getElementById('cGoldName').dispatchEvent(new MouseEvent("click"));
    i++;
  }

}, 100)
})();