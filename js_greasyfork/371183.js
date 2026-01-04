// ==UserScript==
// @name         clear UI
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Press shift + Q to toggle death screen/UI on and off.
// @author       Me
// @match        diep.io
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/371183/clear%20UI.user.js
// @updateURL https://update.greasyfork.org/scripts/371183/clear%20UI.meta.js
// ==/UserScript==

var renUI = true;
document.addEventListener('keydown', function(event) {
  if (event.shiftKey == true){
    if (event.key == 'Q'){
    renUI = !renUI;
    input.set_convar("ren_ui", renUI);
    }
  }
});