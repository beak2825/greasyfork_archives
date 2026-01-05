// ==UserScript==
// @name         Fix Bug Notice W&A
// @namespace    https://worldaide.fr/
// @version      1.
// @description  Good
// @author       Marentdu93
// @match        https://worldaide.fr/
// @match        https://worldaide.fr/chatbox/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/15187/Fix%20Bug%20Notice%20WA.user.js
// @updateURL https://update.greasyfork.org/scripts/15187/Fix%20Bug%20Notice%20WA.meta.js
// ==/UserScript==
function myFunction() {
    $('.importantMessage').remove();
}
setInterval(myFunction, 250);