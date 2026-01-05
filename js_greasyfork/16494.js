// ==UserScript==
// @name        ARD Mediathek Download
// @namespace   schwarztee
// @description Erweitert den Video-Player um einen Download-Button.
// @include     http://www.ardmediathek.de/*
// @copyright   2015, schwarztee
// @license     MIT
// @version     0.1.2
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/16494/ARD%20Mediathek%20Download.user.js
// @updateURL https://update.greasyfork.org/scripts/16494/ARD%20Mediathek%20Download.meta.js
// ==/UserScript==

'use strict';

(function(){
    
    // Helfer: DOM-Element finden
    function find( selector ) { return document.querySelector( selector ); }
    
    // Video-URL finden
    function findVideoURL()
    {
        // nach HTML5-Player suchen
        var htmlVideo = find( 'video.ardplayer-mediacanvas source' );
        
        // nach Flash-Player suchen
        var flashObject = find( 'object.ardplayer-mediacanvas' );
        
        // HTML5 gefunden?
        if ( htmlVideo )
        {
            // URL einfach von src-Attribut nehmen
            return htmlVideo.src;
        }
        
        // Flash gefunden?
        if ( flashObject )
        {
            // Player-ID herausfinden
            var id = flashObject.id.replace( /\w+_(\d+)/, '$1' );
            
            // relevante Konfiguration holen
            var player = window.ardplayer[ 'eventCtrlplayer_'+id ];
            
            // Daten zum aktuellen Stream erfahren
            var currentStream = player.getPlayingStreamObject();
            
            // URL extrahieren
            var url = currentStream._stream;
            
            // mp4-Link in URL vorhanden?
            if ( /^http.*mp4$/.test( url ) )
            {
                // passt, URL zurückgeben
                return url;
            }
            else
            {
                // hmm, wahrscheinlich liegt RTMP-Stream vor
                // na gut, dann versuchen, alle mp4-Streams zu holen
                var mediaStreamArray = player.mc._mediaArray[1]._mediaStreamArray;
                
                // Stream mit passender Qualität finden
                for ( var index = 0; index < mediaStreamArray.length; index++ )
                {
                    // Qualität dieses Streams gleich der des aktuell abgespielten?
                    if ( mediaStreamArray[index]._quality == currentStream._quality )
                    {
                        // perfekt, URL(s) zu dieser Datei extrahieren
                        url = mediaStreamArray[index]._stream;
                        
                        // falls mehrere Dateien zu dieser Qualität vorliegen…
                        if ( url.length && url[0].length > 1 )
                        {
                            // …einfach die erste nehmen
                            return url[0];
                        }
                        else
                        {
                            // ansonsten direkt die gefundene URL zurückgeben
                            return url;
                        }
                    }
                }
            }
        }
        
        // kein Video gefunden
        return false;
    }
    
    // Download-Button einrichten
    function setupDownloadButton( url )
    {
        // Container für Steuer-Buttons zurechtlegen
        var controlBar = find( '.ardplayer-player-funktion' );
        
        // nach schon vorhandenem Download-Link suchen
        var link = find( 'a.video-download' );
        
        // falls noch nicht vorhanden
        if ( !link )
        {
            // Klassenname für Abspiel-Button
            var buttonClass = 'ardplayer-btn-playpause';
            
            // hübschen Button erzeugen
            var button = document.createElement( 'button' );
            button.setAttribute( 'title', "Video herunterladen" );
            button.setAttribute( 'class', buttonClass );
            button.setAttribute( 'style', 'transform: rotate(90deg); border: 0;' );
            
            // Mouseover-Effekt für Button
            button.onmouseenter = function() { button.setAttribute( 'class', buttonClass+' hover' ); };
            button.onmouseleave = function() { button.setAttribute( 'class', buttonClass ); };
            
            // frischen Link erzeugen
            link = document.createElement( 'a' );
            link.setAttribute( 'class', 'video-download' );
            link.target = '_blank';
            
            // neuen Button verlinken und den anderen Buttons voranstellen
            link.appendChild( button );
            controlBar.insertBefore( link, controlBar.childNodes[0] );
        }
        
        // URL setzen
        link.href = url;
    }
    
    // letzte Video-URL merken
    var lastURL = '';
    
    // Button hinzufügen oder erneuern
    function manageButton()
    {
        // aktuelle Video-URL suchen
        var newURL = findVideoURL();
        
        // URL vorhanden und geändert?
        if ( newURL && newURL != lastURL )
        {
            // Entwicklerinformation
            console.log( "[ARD Mediathek Download] Stream-URL:", newURL );
            
            // Download-Button hinzufügen oder aktualisieren
            setupDownloadButton( newURL );
            
            // neue URL merken
            lastURL = newURL;
        }
    }
    
    // regelmäßig DOM prüfen; ein neuer Player kann jederzeit geladen werden
    setInterval( manageButton, 1000 );
    
})();
