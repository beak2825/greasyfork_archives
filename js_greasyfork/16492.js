// ==UserScript==
// @name        AdDefend Klatsche
// @namespace   schwarztee
// @description Sucht global nach Skripten von AdDefend und macht diese unwirksam.
// @include     *
// @copyright   2015, schwarztee
// @license     MIT
// @version     0.2.1
// @grant       none
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/16492/AdDefend%20Klatsche.user.js
// @updateURL https://update.greasyfork.org/scripts/16492/AdDefend%20Klatsche.meta.js
// ==/UserScript==


(function(){
    
    'use strict';
    
    // Muster für verdächtige Funktionsnamen
    var filter = /\.uab[A-Z][a-z]+|UABP/;
    
    // Zähler für blockierte Skripte
    var blocked = 0;
    
    // startende Skripte abfangen
    document.addEventListener( 'beforescriptexecute', function checkScript( event )
    {
        // Skript auf unerwünschtes Muster prüfen
        if ( filter.test( event.target.innerHTML ) )
        {
            // und wenn nötig stoppen
            event.stopPropagation();
            event.preventDefault();
            
            // Aktion mitzählen
            blocked++;
        }
    });
    
    // nach kurzer Wartezeit…
    setTimeout( function status()
    {
        // Statusinformation anzeigen
        console.log( "[ADK] " + String(blocked) + " Skript" + ( blocked == 1 ? '' : 'e' ) + " von AdDefend blockiert" );
        
    }, 2000 );
    
})();
