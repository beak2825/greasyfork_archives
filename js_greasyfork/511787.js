// ==UserScript==
// @name         vSprint Sorter+
// @version      1.0
// @description  Pozwala sortować oferty wg. daty wystawienia oraz szukać w opisach
// @author       Paweł Kaczmarek
// @match        https://allegro.pl/kategoria/*
// @match        https://allegro.pl/listing?*
// @match        https://allegro.pl/uzytkownik/*
// @match        https://allegro.pl/produkt/*
// @grant        none
// @namespace https://greasyfork.org/users/1313252
// @downloadURL https://update.greasyfork.org/scripts/511787/vSprint%20Sorter%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/511787/vSprint%20Sorter%2B.meta.js
// ==/UserScript==

function summonOptionToThrone(n,o,e,i){var t=document.createElement("option");t.value=o,t.selected=o===i,t.textContent=e,n.appendChild(t)}function callOfTheOldGods(n,o){o||(o=window.location.href),n=n.replace(/[\[\]]/g,"\\$&");var e=new RegExp("[?&]"+n+"(=([^&#]*)|&|#|$)").exec(o);return e?e[2]?decodeURIComponent(e[2].replace(/\+/g," ")):"":null}function changeWindsOfWinter(n,o,e){var i=n.indexOf("#"),t=-1===i?"":n.substr(i);n=-1===i?n:n.substr(0,i);var r=new RegExp("([?&])"+o+"=.*?(&|$)","i"),d=n.includes("?")?"&":"?";return(n=n.match(r)?n.replace(r,"$1"+o+"="+e+"$2"):n+d+o+"="+e)+t}window.addEventListener("load",(function(){"use strict";var n=document.getElementById("allegro.listing.sort");if(null!==n){summonOptionToThrone(n,"0","--- Szukaj w opisach ofert ---",callOfTheOldGods("description"));var o=callOfTheOldGods("startingTime");summonOptionToThrone(n,"","-- Wystawione w ciągu: --",o),summonOptionToThrone(n,"1","1 godziny",o),summonOptionToThrone(n,"2","2 godzin",o),summonOptionToThrone(n,"3","3 godzin",o),summonOptionToThrone(n,"4","4 godzin",o),summonOptionToThrone(n,"5","5 godzin",o),summonOptionToThrone(n,"6","12 godzin",o),summonOptionToThrone(n,"7","24 godzin",o),summonOptionToThrone(n,"8","2 dni",o),summonOptionToThrone(n,"9","3 dni",o),summonOptionToThrone(n,"10","4 dni",o),summonOptionToThrone(n,"11","5 dni",o),summonOptionToThrone(n,"12","6 dni",o),summonOptionToThrone(n,"13","7 dni",o),n.addEventListener("change",(function(){"0"===this.value?window.location.href=changeWindsOfWinter(window.location.href,"description","1"):window.location.href=changeWindsOfWinter(window.location.href,"startingTime",this.value)}))}}));