// ==UserScript==
// @name         ClassificaReale
// @author       GinoLoSpazzino[IT]
// @namespace    NomeSpazio
// @version      0.0.1
// @description  Elimina Esponenziali da CLASSIFICA STIDDARI
// @include      http://s1.stiddari.com/game/score.php
// @grant    none
// @downloadURL https://update.greasyfork.org/scripts/35947/ClassificaReale.user.js
// @updateURL https://update.greasyfork.org/scripts/35947/ClassificaReale.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var tabSCORE = document.getElementsByTagName('table')[5];
    var righe = tabSCORE.getElementsByTagName('tr');
    var NomePlayer, PtAllenam, PtStanze, PtUnita, PtAccount, NEdifici;
  
  	try {
    	for (var i = 2; i < righe.length; i++) {
    		var riga = righe[i];
    		PtAllenam = riga.getElementsByTagName('td')[4].attributes[2].value;
    			riga.getElementsByTagName('td')[4].innerHTML = PtAllenam;
    		PtStanze = riga.getElementsByTagName('td')[5].attributes[2].value;
    			riga.getElementsByTagName('td')[5].innerHTML = PtStanze;
    		PtUnita = riga.getElementsByTagName('td')[6].attributes[2].value;
    			riga.getElementsByTagName('td')[6].innerHTML = PtUnita;
    		PtAccount = riga.getElementsByTagName('td')[7].attributes[2].value;
    			riga.getElementsByTagName('td')[7].innerHTML = PtAccount;
        }
        tabSCORE.style.width = "800px"
    } catch (e) {
        console.error('// MAIN \\ : -- ' + e.stack)
    }
})();