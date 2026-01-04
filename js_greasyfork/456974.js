// ==UserScript==
// @name         Pokeclicker give every berry
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Give every berry to the player
// @author       Loliprane
// @match        https://www.pokeclicker.com/
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/456974/Pokeclicker%20give%20every%20berry.user.js
// @updateURL https://update.greasyfork.org/scripts/456974/Pokeclicker%20give%20every%20berry.meta.js
// ==/UserScript==

    document.addEventListener('keyup',function(evt){
    if(evt.keyCode==13){ //press enter to trigger the event. You can also change the keycode value so that you can press the key you want
      for (let i = 0; i < 68; i++) { //loop from 0 to 67 to gain every 68 berries.
        App.game.farming.gainBerry(i,10000,true) //give 10000 of the designated berry (if you want more or less just change the value)
      }
    }});