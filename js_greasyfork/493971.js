// ==UserScript==
// @name         Calculator version francais
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  juste une calculatrice pour faire des division
// @author       LongName
// @match        https://agma.io
// @match        https://www.youtube.com
// @match        https://www.roblox.com/home
// @match        https://www.chess.com
// @match        https://github.com
// @match        https://adblockplus.org
// @icon         https://cdn-icons-png.flaticon.com/512/4374/4374752.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/493971/Calculator%20version%20francais.user.js
// @updateURL https://update.greasyfork.org/scripts/493971/Calculator%20version%20francais.meta.js
// ==/UserScript==

   (function() {
       'use strict';
// vous pouvez en fait ajouter des sites Web juste en haut en ajoutant a la suite // @match        https://exemple.com/.fr/.io

// ce programme calcule le quotient de 2 entiers entrés par l'itulisateur

   let dividende;
   let diviseur;
   let quotient = 1;

   console.log(dividende);

   dividende = Number.parseInt(prompt("entrer le dividende entier", "0"));
   diviseur = Number.parseInt(prompt("entrer le diviseur entier ", "1"));
   quotient = dividende / diviseur;

   alert("le quotient est "+quotient+".");

   console.log(`le quotient est ${quotient}.`);

})();