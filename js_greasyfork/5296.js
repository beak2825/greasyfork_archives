// ==UserScript==
// @name         Nexus Clash: Bold Shadows
// @namespace    http://nexusclash.com/wiki/index.php/user:xensyria
// @version      1.1
// @description  Helps to see hunting targets at a glance: if shadows can be seen from outside a building it makes that part of the description bold
// @match        http://nexusclash.com/modules.php?name=Game*
// @match        http://www.nexusclash.com/modules.php?name=Game*
// @exclude      http://nexusclash.com/modules.php?name=Game&op=disconnect
// @exclude      http://www.nexusclash.com/modules.php?name=Game&op=disconnect
// @grant        none
// @copyright    PD
// @downloadURL https://update.greasyfork.org/scripts/5296/Nexus%20Clash%3A%20Bold%20Shadows.user.js
// @updateURL https://update.greasyfork.org/scripts/5296/Nexus%20Clash%3A%20Bold%20Shadows.meta.js
// ==/UserScript==

    // If writing box is available then the message description is two elements later
var childNumber = 18;
if (document.getElementsByName('writing').length > 0){
  childNumber=20;
}
    // Check if any "shadow"s moving in "windows" are in the tile description
if (document.getElementById('Messages').parentNode.childNodes[childNumber].textContent.match(/shadow[^\.]+windows\./)){

    // Get the tile description split up into parts
  var tileDesc = document.getElementById('Messages').parentNode.childNodes[childNumber].textContent.match(/(.*)\.([^\.]+shadow[^\.]+windows\.)(.*)/);
    // Since this node can't include HTML directly, set it as the first part of the description, before the bold tags begin
  document.getElementById('Messages').parentNode.childNodes[childNumber].textContent = tileDesc[1] + ". ";
    // Use the next element to insert the HTML bold tags and the rest of the description
  document.getElementById('Messages').parentNode.childNodes[childNumber].nextSibling.insertAdjacentHTML('beforebegin', '<b>' + tileDesc[2] + '</b>' + tileDesc[3]);
}