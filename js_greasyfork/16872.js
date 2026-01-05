// ==UserScript==
// @name         Fix Bug Notice MC
// @namespace    https://www.modzcatz.fr/index.php
// @version      1.1
// @description  Good Fuck 
// @author       Sharke
// @match        https://www.modzcatz.fr/index.php
// @match        https://www.modzcatz.fr/index.php
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/16872/Fix%20Bug%20Notice%20MC.user.js
// @updateURL https://update.greasyfork.org/scripts/16872/Fix%20Bug%20Notice%20MC.meta.js
// ==/UserScript==
function myFunction() {
    $('.importantMessage').remove();
}
setInterval(myFunction, 250);