// ==UserScript==
// @name            watchpage boiteajeux.net
// @namespace       Violentmonkey Scripts
// @version         0.1.1
// @description     Raffraîchit automatiquement la page et prévient quand c’est votre tour de jeu
// @author          Jo
// @match           http://*.boiteajeux.net/*/partie.php*
// @grant           GM_notification
// @grant           GM_setValue
// @grant           GM_getValue
// @grant           GM_deleteValue


// @downloadURL https://update.greasyfork.org/scripts/393625/watchpage%20boiteajeuxnet.user.js
// @updateURL https://update.greasyfork.org/scripts/393625/watchpage%20boiteajeuxnet.meta.js
// ==/UserScript==
(function(){
    'use strict';

    console.debug( "watchpage" );

    //  in seconds
    function randomUpdatePeriod()
    {
        return 30 + Math.random()*60;
    }

    var currentPage = window.location.href;

    //  returns either "waiting", "playing", "ended", or undefined in case we cannot guess
    function getStatus()
    {
        var text = document.body.innerText;
        if( /[Aa]ttend(re|ez) votre tour|[Vv]ous devez attendre/.test( text ) )
        {
            return "waiting";
        }
        if( /[sS]électionnez|[cC]liquez|[cC]hoisissez|devez choisir/.test( text ) )
        {
            return "playing";
        }
        if( /partie termin[ée]e/i.test( text ) )
        {
            return "ended";
        }
    }

    const TITLE_HIGHLIGHT_START = "(1) ";
    function checkAndWarnIfNeeded()
    {
        var status = getStatus();

        var key = `statusof ${currentPage}`
        var previousStatus = GM_getValue( key );
        console.debug( `${new Date().toLocaleTimeString()} - checkAndWarnIfNeeded, status=${status}, previousStatus=${previousStatus}` );

        if( !status )   //  can’t identify status -> act as it has not changed
        {
            status = previousStatus;
        }
        if( status === "waiting" )
        {
            GM_setValue( key, "waiting" );
            //  schedule page update and re-check after some (random) time period
            var t = randomUpdatePeriod();
            console.debug( `Waiting ${Math.round(t)} seconds` );
            setTimeout( function(){
                setTimeout( checkAndWarnIfNeeded, 5000 );  // if the page is not reloaded, check after a simple timeout
                actualiserPage();  // will either reload the page, or update it
            }, 1000 * t );

            if( document.title.startsWith( TITLE_HIGHLIGHT_START ) )
            {
                document.title = document.title.slice( TITLE_HIGHLIGHT_START.length );
            }
        }
        else  // status is "ended" or "playing"
        {
            if( previousStatus === "waiting" )
            {
                //  we were waiting before, but are not anymore: update last status and warn the user
                if( status !== "ended" )    //  no need to set the value in case it is the end, it will simply be deleted later
                {
                    GM_setValue( key, status );
                }

                GM_notification({
                    text: status === "ended" ?
                    "Partie terminée" :
                    "C’est votre tour",
                    title: document.title,
                    highlight: true,
                    silent: false,
                    timeout: 0,
                    onclick: function(){ window.focus(); }
                });
            }

            if( status === "ended" )
            {
                GM_deleteValue( key );  //  the end. Do not restart a timeout, and delete the value
            }
            else
            {
                //  the game has not yet ended. Continue to check regularly until the status becomes "waiting" again
                setTimeout( checkAndWarnIfNeeded, 5000 );
                if( !document.title.startsWith( TITLE_HIGHLIGHT_START ) )
                {
                    document.title = TITLE_HIGHLIGHT_START + document.title;
                }
            }
        }
    }

    setTimeout( function(){
        checkAndWarnIfNeeded();
    }, 5000 );


}());
