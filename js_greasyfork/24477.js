// ==UserScript==
// @name        Süddeutsche AdBlock Aid
// @namespace   schwarztee
// @description Hindert sueddeutsche.de daran, AdBlocker zu umgehen.
// @include     http://www.sueddeutsche.de/*
// @copyright   2016
// @license     AGPLv3
// @version     0.1.0
// @grant       none
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/24477/S%C3%BCddeutsche%20AdBlock%20Aid.user.js
// @updateURL https://update.greasyfork.org/scripts/24477/S%C3%BCddeutsche%20AdBlock%20Aid.meta.js
// ==/UserScript==


;(function(){

    'use strict'

    // Muster für verdächtigen Skriptblock
    let filter = /\.initAdBlockLandingpage/

    // Erfolg dokumentieren
    let success = false

    // startende Skripte abfangen
    document.addEventListener( 'beforescriptexecute', function checkScript( event )
    {
        // Skript auf unerwünschtes Muster prüfen
        if ( filter.test( event.target.innerHTML ) )
        {
            // und wenn nötig stoppen
            event.stopPropagation()
            event.preventDefault()

            // Erfolg vermerken
            success = true
        }
    })

    // nachdem Seite vollständig geladen ist…
    document.addEventListener( 'DOMContentLoaded', function logSuccess()
    {
        // Statusinformation anzeigen
        console.log( "[SZ AdBlock Aid] Umleitung für AdBlocker " + ( success ? "wurde erfolgreich verhindert" : "konnte nicht verhindert werden" ) + "." )

    })

})()
