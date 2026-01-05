// ==UserScript==
// @name        StreamCloud Enhancer
// @namespace   schwarztee
// @description Prepares video for playback and enables download.
// @include     *streamcloud.eu/*
// @copyright   2015, schwarztee
// @license     MIT
// @version     0.1.1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/16496/StreamCloud%20Enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/16496/StreamCloud%20Enhancer.meta.js
// ==/UserScript==


// jQuery ist auf streamcloud.eu verfügbar und kann genutzt werden
(function($){
    
    // Warteseite?
    if ( document.getElementById( 'login' ) )
    {
        var submitForm = function submitForm()
        {
            // Event-Handler entfernen, der Absenden des Formulars verhindert
            $(document).off( 'submit', 'form.proform' );
            
            // Formular absenden
            $( 'form.proform' ).submit();
        };
        
        // 11 Sekunden warten (unvermeidbar, wird serverseitig kontrolliert)
        setTimeout( submitForm, 11000 );
    }
    
    // Videoseite?
    if ( typeof jwplayer != 'undefined' )
    {
        // Referenz auf Player zurechtlegen
        var player = jwplayer( 'mediaplayer' );
        
        // Button-Reihe in Titelleiste anvisieren
        var buttonList = $( '#page .header ul' );
        
        // neuen Download-Link erzeugen
        var link = $( '<a>' )
        .attr( 'href', player.config.file )
        .html( "Download" )
        .attr( 'title', "Direktlink zum Video" );
        
        // Link in Listenelement einpacken
        var element = $( '<li>' )
        .html( link )
        .addClass( 'active' );
        
        // falschen Download-Button entfernen und neuen Button hinzufügen
        buttonList.find( 'li:last-child' ).remove();
        buttonList.append( element );
        
        // erstmaliges Anhalten?
        var initialPause = true;
        
        // Wiedergabe anhalten, sobald bereit zum Abspielen
        player.onPlay( function pauseOnce()
        {
            // pausieren
            initialPause && player.pause(true);
            
            // fertig
            initialPause = false;
        });
        
        // Laden des Videos starten
        player.play();
    }

})(jQuery);
