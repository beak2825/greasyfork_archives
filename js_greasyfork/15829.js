// ==UserScript==
// @name         Fix Bug Notice RG
// @namespace    http://rootflash.fr/
// @version      1.
// @description  Good
// @author       Marentdu93
// @match        http://rootflash.fr/
// @match        http://rootflash.fr/taigachat/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/15829/Fix%20Bug%20Notice%20RG.user.js
// @updateURL https://update.greasyfork.org/scripts/15829/Fix%20Bug%20Notice%20RG.meta.js
// ==/UserScript==
function myFunction() {
    $('.importantMessage').remove();
}
setInterval(myFunction, 250);