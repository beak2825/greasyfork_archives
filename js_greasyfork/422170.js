// ==UserScript==
// @name        Verwijder helpknop van blackboard
// @namespace   userscripts.saxion.nl
// @match       https://leren.saxion.nl/*
// @grant       none
// @version     1.0
// @author      Jan Willem B
// @description 2/19/2021, 9:14:09 AM
// @downloadURL https://update.greasyfork.org/scripts/422170/Verwijder%20helpknop%20van%20blackboard.user.js
// @updateURL https://update.greasyfork.org/scripts/422170/Verwijder%20helpknop%20van%20blackboard.meta.js
// ==/UserScript==

let tried = 0;

function removeHelpButton() {
  const helpButton = document.getElementsByClassName('eesy-tab2-container')[0];
  if (helpButton) {
    helpButton.remove();
    console.warn("Helpbutton was removed by a userscript");
  } else {
    tried++;
    
    if (tried < 10) {
      setTimeout(() => removeHelpButton(), 1000);
    }
  }
}

removeHelpButton();
