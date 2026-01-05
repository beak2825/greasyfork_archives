// ==UserScript==
// @name         Fix Bug Notice RG
// @namespace    https://realitygaming.fr/
// @version      1.
// @description  Good
// @author       Marentdu93
// @match        https://realitygaming.fr/
// @match        https://realitygaming.fr/chatbox/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/15186/Fix%20Bug%20Notice%20RG.user.js
// @updateURL https://update.greasyfork.org/scripts/15186/Fix%20Bug%20Notice%20RG.meta.js
// ==/UserScript==
function myFunction() {
    $('.importantMessage').remove();
}
setInterval(myFunction, 250);