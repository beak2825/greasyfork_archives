// ==UserScript==
// @name         Dr Multi Hit
// @namespace    *
// @version      2.2
// @description  Operation Goat Smash
// @author       Some n00b,
// @include      http://209.97.150.225//Steal.cfm?TargetID=*
// @include      http://209.97.150.225//Steal.cfm?TargetID=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/22558/Dr%20Multi%20Hit.user.js
// @updateURL https://update.greasyfork.org/scripts/22558/Dr%20Multi%20Hit.meta.js
// ==/UserScript==
window.addEventListener('load', function() {
document.body.innerHTML= document.body.innerHTML.replace(/You may only steal from an individual once per 6 hours./g,"<br />Check who you are hitting.<br /><br /><input type='submit' name='Cash' value='Steal Cash'> &nbsp;&nbsp; <input type='submit' name='Hoes' value='Steal Hoes'> &nbsp;&nbsp; <input type='submit' name='Drugs' value='Steal Drugs'><br />");
document.body.innerHTML= document.body.innerHTML.replace(/You will need to wait/g,"You will NOT need to wait");					  
}, false);
