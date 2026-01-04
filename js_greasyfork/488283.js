// ==UserScript==
// @name       Wageningse Herschrijver
// @namespace  http://tampermonkey.net/
// @version    1.0
// @description Logt leerjaar, niveau en wiskunde versie van Math4all website en past de href van de "Navigatie" knop aan om direct naar de juiste pagina op de Wageningse Methode website te gaan. Bepaalt of de "C" versie van de wiskunde methode geopend moet worden.
// @author     You
// @match      http://wm.math4allview.appspot.com/view*
// @icon       none
// @grant      none
// @license    I DONT FUCKING CARE
// @downloadURL https://update.greasyfork.org/scripts/488283/Wageningse%20Herschrijver.user.js
// @updateURL https://update.greasyfork.org/scripts/488283/Wageningse%20Herschrijver.meta.js
// ==/UserScript==

(function() {
 'use strict';

 const divsToRemove = document.getElementsByClassName('overzichtDiv grid_5');

for (const div of divsToRemove) {
 div.parentNode.removeChild(div);
}

 // Functie om data uit URL te extraheren
 function getDataFromUrl() {
   const urlParams = new URLSearchParams(window.location.search);
   const leerjaarNiveau = urlParams.get('comp');
   const wiskundeAB = urlParams.get('subcomp');
   const variant = urlParams.get('variant');

   if (leerjaarNiveau && wiskundeAB && variant) {
     const leerjaar = leerjaarNiveau.substring(2, 3);
     const niveau = leerjaarNiveau.substring(4, 5);
     const wiskundeVersie = wiskundeAB.substring(6, 7);

     return {
       leerjaar,
       niveau,
       wiskundeVersie,
     };
   } else {
     console.log('Data niet gevonden in URL');
     return null;
   }
 }

 // Functie om de href van de knop te wijzigen
 function updateButtonHref(leerjaar, niveau, wiskundeVersie) {
   let nieuweLink = `https://wageningse-methode.nl/methode/het-lesmateriaal/?S=y${leerjaar}${niveau}-${wiskundeVersie}`;

   // Bepaal of de "C" versie van de wiskunde methode geopend moet worden
   if (wiskundeVersie === 'a' && leerjaar === '4') {
     nieuweLink = `https://wageningse-methode.nl/methode/het-lesmateriaal/?S=y${leerjaar}${niveau}-ac`;
   }

   return nieuweLink;
 }

 // Data ophalen
 const data = getDataFromUrl();

 // Knop aanpassen
 if (data) {
   const nieuweLink = updateButtonHref(data.leerjaar, data.niveau, data.wiskundeVersie);

   const logoHeaderDiv = document.querySelector('.logo-header-div');
   logoHeaderDiv.setAttribute('href', nieuweLink);
   logoHeaderDiv.style.cursor = 'pointer';

   // Add an event listener for the click event to the image
   logoHeaderDiv.addEventListener('click', () => {
   // Open the new link in the current tab
   window.location.href = nieuweLink;
 });
 }



})();
