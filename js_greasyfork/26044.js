// ==UserScript==
// @name        Mixcloud Download
// @namespace   schwarztee
// @description Adds a download button to the Mixcloud player.
// @include     https://www.mixcloud.com/*
// @copyright   2016, schwarztee
// @license     MIT
// @version     0.1.2-deactivated
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/26044/Mixcloud%20Download.user.js
// @updateURL https://update.greasyfork.org/scripts/26044/Mixcloud%20Download.meta.js
// ==/UserScript==

(function(){

    'use strict'
    
    console.log( '[Mixcloud Download] Script deactivated. Needs update to support HTTP live streaming, sorry.' )

    /*function makeButton( href )
    {
        let title = ''

        try
        {
            // try to get audio title
            title = document.querySelector( '.player-cloudcast-title' ).textContent
        }
        catch ( exception ) {}

        // strip any sensitive characters for use as filename
        title = title.replace( /[^A-Za-z0-9\-\.\+]/g, '_' )

        // create anchor element
        let button = document.createElement( 'a' )
        button.className = 'player-follow-button dwnld'
        button.download = title && title+'.m4a' || ''
        button.style.display = 'inline'
        button.style.color = 'inherit'
        button.title = "Download"
        button.innerHTML = '↓'
        button.href = href

        // add button to player
        document.querySelector( '.player-cloudcast-author' ).appendChild( button )
    }

    function removeButton()
    {
        try
        {
            // try to find and remove existing download button
            document.querySelector( '.player-cloudcast-author a.dwnld' ).remove()
        }
        catch ( exception ) {}
    }

    let oldURL = ''

    function checkAudio()
    {
        let newURL = ''

        try
        {
            // try to find audio and get current source URL
            newURL = document.querySelector( 'audio source' ).src
        }
        catch ( exception )
        {
            // developer information
            console.log( "[Mixcloud Download] No active audio element found." )
        }

        // source URL found?
        if ( newURL )
        {
            // new URL or download button not present?
            if ( newURL != oldURL || !document.querySelector( '.player-cloudcast-author a.dwnld' ) )
            {
                // developer information
                console.log( "[Mixcloud Download] Found audio source:", newURL )

                // remove any old button
                removeButton()

                // make new button
                makeButton( newURL )
            }
        }
        else
        {
            // remove any old button
            removeButton()
        }

        // update URL cache
        oldURL = newURL
    }

    // check player every four seconds
    setInterval( checkAudio, 4000 )*/

})()
