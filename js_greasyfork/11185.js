// ==UserScript==
// @author		  https://prohardver.hu/tag/spammer.html
// @namespace 	https://greasyfork.org/users/2358-spammer
// @name        Logout.hu: fáradt gőz topikokat a fórum tetejére
// @description Logout.hu fórum főoldalán a tetejére rakja a Fáradt gőzös topikokat
// @include     https://logout.hu/forum/index.html
// @match       https://logout.hu/forum/index.html
// @version     1.1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/11185/Logouthu%3A%20f%C3%A1radt%20g%C5%91z%20topikokat%20a%20f%C3%B3rum%20tetej%C3%A9re.user.js
// @updateURL https://update.greasyfork.org/scripts/11185/Logouthu%3A%20f%C3%A1radt%20g%C5%91z%20topikokat%20a%20f%C3%B3rum%20tetej%C3%A9re.meta.js
// ==/UserScript==


/* 
Itt állíthatod be, hogy legyen-e külön 'FÁRADT GŐZ' fejléc 
VAGY a topikok a LOGOUT fejléc alá kerüljenek a többi közé
*/   

// Külön fejléc?
var fejlec = "igen" 
   

/* ----------------------------------------------------- */

/* Topikok beszúrsa a megfelelő helyre */

var for_50 = document.getElementsByClassName('for_50');

var for_60 = document.getElementsByClassName('for_60');
var for_61 = document.getElementsByClassName('for_61');
var for_62 = document.getElementsByClassName('for_62');
var for_63 = document.getElementsByClassName('for_63');
var for_64 = document.getElementsByClassName('for_64');
var for_65 = document.getElementsByClassName('for_65');
var for_23 = document.getElementsByClassName('for_23');
var for_24 = document.getElementsByClassName('for_24');
var for_25 = document.getElementsByClassName('for_25');
var for_27 = document.getElementsByClassName('for_27');

for_50[0].parentNode.insertBefore(for_60[0], for_50[0].nextSibling);

for_60[0].parentNode.insertBefore(for_61[0], for_60[0].nextSibling);
for_61[0].parentNode.insertBefore(for_62[0], for_61[0].nextSibling);
for_62[0].parentNode.insertBefore(for_63[0], for_62[0].nextSibling);
for_63[0].parentNode.insertBefore(for_64[0], for_63[0].nextSibling);
for_64[0].parentNode.insertBefore(for_65[0], for_64[0].nextSibling);
for_65[0].parentNode.insertBefore(for_23[0], for_65[0].nextSibling);
for_23[0].parentNode.insertBefore(for_24[0], for_23[0].nextSibling);
for_24[0].parentNode.insertBefore(for_25[0], for_24[0].nextSibling);
for_25[0].parentNode.insertBefore(for_27[0], for_25[0].nextSibling);


/* Fáradt gőz fejléc */ 

var nodes = document.body.getElementsByTagName('tr');
var last=nodes.length-1;
var node = nodes[last];

if (node) { node.setAttribute("class", "faradtgoz_fejlec"); }
var for_60 = document.getElementsByClassName('for_60');

var faradtgoz_fejlec = document.getElementsByClassName('faradtgoz_fejlec');

if (fejlec == "igen") {
    
    for_50[0].parentNode.insertBefore(faradtgoz_fejlec[0], for_50[0].nextSibling);
    
} else {
  
  node.parentNode.removeChild (node);
  
}