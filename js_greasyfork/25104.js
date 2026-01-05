// ==UserScript==
// @name       NanoChecker
// @namespace  Il_Nano
// @version    1.1.1Finale
// @description  Figheeee so che!!!
// @match      https://*.imperiaonline.org/imperia/game_v5/game/village.php
// @match      http://*.imperiaonline.org/imperia/game_v5/game/village.php
// @copyright  2017, Dwalin88 alias Il Nano
// @downloadURL https://update.greasyfork.org/scripts/25104/NanoChecker.user.js
// @updateURL https://update.greasyfork.org/scripts/25104/NanoChecker.meta.js
// ==/UserScript==


document.body.style.background = 'violet';

function init() {
    var myFunction = function() {
        suka();
        var rand = Math.round(Math.random() * (1500 - 500)) + 500;
        setTimeout(myFunction, rand);
    };
    myFunction();
}
$(function() {
  init();
});

function suka(){
    alert("Suka, l'allarme funzionante al 100% lo tengo per me!!");
    alert("Se lo vuoi anche tu, scrivi a Dwalin88 su imperia e vi concordate per il prezzo.");
    alert("Un bacione.....SUKA....SUKA ANCORA");
    alert("HO DETTO SUKAAAAAAAAAA");
    alert("Ciao!!!!!");
    alert("P.S. Ho anche altri script compresa la V6!");
    alert("Suka!");
    
    
}