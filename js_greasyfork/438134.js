// ==UserScript==
// @name         Keymash Favicon Replacer
// @namespace    http://tampermonkey.net/
// @version      1.0
// @license      MIT
// @description  Replaces the keymash favicon when using themes by (or inspired by) Syndric (requires reload to apply when changing themes)
// @author       xx_dragon_slayer_god_369_xx
// @match        https://keyma.sh/*
// @icon         https://www.google.com/s2/favicons?domain=keyma.sh
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/438134/Keymash%20Favicon%20Replacer.user.js
// @updateURL https://update.greasyfork.org/scripts/438134/Keymash%20Favicon%20Replacer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //Favicon is overwritten by some js loading on keyma.sh and I couldn't figure out how to hook it, so a loop is used instead
    function replaceCheckLoop( )
    {
        var shouldReplace = document.querySelector('body') != undefined;
        if( shouldReplace )
        {
            replaceIcon( );
        }
        else
        {
            requestAnimationFrame( replaceCheckLoop );
        }
    }

    function getIconUrl( )
    {
        //If the user has multiple themes applied at once, take the one with the highest "priority index"
        var stylusIds = [];
        var stylesheets = document.querySelectorAll( 'style' );
        for( var i = 0; i < stylesheets.length; i++ )
        {
            if( stylesheets[i].id.startsWith( "stylus-" ) )
            {
                stylusIds.push( stylesheets[i].id );
            }
        }

        var priorityStyleIndex = 0;
        var priorityStyleId = "";

        for( var i = 0; i < stylusIds.length; i++ )
        {
            var styleIndex = parseInt( stylusIds[i].split( "-" )[1] );
            if( styleIndex > priorityStyleIndex )
            {
                priorityStyleIndex = styleIndex;
                priorityStyleId = stylusIds[i];
            }
        }

        var stylesheet = document.getElementById( priorityStyleId );
        var iconUrl = stylesheet.innerText.split( "img[alt=\"Logo\"]" )[1].split( "url(\"")[1].split( "\")")[0];
        return iconUrl;
    }

    function replaceIcon( )
    {
        var links = document.querySelectorAll('link');
        for( var i = 0; i < links.length; i++ )
        {
            if( links[i].href == "https://keyma.sh/favicon.ico" )
            {
                links[i].href = getIconUrl( );
            }
        }
        requestAnimationFrame( replaceIcon );
    }

    replaceCheckLoop( );
})(); 