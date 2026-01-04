// ==UserScript==
// @name         Meneame.net - EscondeNéame
// @namespace    meneame.net
// @version      0.6
// @description  Oculta meneos y comentarios
// @author       wildseven23
// @match        https://www.meneame.net/*
// @require      https://openuserjs.org/src/libs/sizzle/GM_config.js
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/422108/Meneamenet%20-%20EscondeN%C3%A9ame.user.js
// @updateURL https://update.greasyfork.org/scripts/422108/Meneamenet%20-%20EscondeN%C3%A9ame.meta.js
// ==/UserScript==

( function() {
    'use strict';

    var elementsToHide = [];
    var domainsToHide = [];
    var usersToHide = [];

    GM_config.init(
        {
            'id': 'EscondeNéame',
            'title': 'Configuración',
            'fields':
            {
                'hiddenDomains':
                {
                    'label': 'Dominios a esconder',
                    'type': 'text',
                    'size': 60,
                    'default': 'youtube.com, twitter.com'
                },
                'hiddenUsers':
                {
                    'label': 'Usuarios a esconder',
                    'type': 'text',
                    'size': 60,
                    'default': ''
                }
            },
            'events':
            {
                'save': saveData
            }
        } );

    var header = document.getElementById( "header-menu" );
    var ul = header.getElementsByClassName( "header-menu01" )[ 0 ].getElementsByClassName( "menu01-itemsl" )[ 0 ];
    var li = document.createElement( "li" );
    li.title = "Esconde/muestra los dominios y usuarios seleccionados";
    ul.appendChild( li );
    li.addEventListener( "click", function() { showhideYT( false ); } );
    li.addEventListener( "dblclick", showModal );
    li.addEventListener( "contextmenu", showModal );

    li.innerHTML = "<span style='cursor:pointer' class='badge'><i class='fa fa-shower'></i> <span id='escondeID'>?<span></span>";

    getDomainsToHide();
    getUsersToHide();
    getSummaries();
    showhideYT( false );

    function showhideYT( forceHide = false ) {
        if( forceHide === false ) elementsToHide.forEach( ytBlock => ytBlock.style.display = ytBlock.style.display !== "none" ? "none" : "block" );
        else elementsToHide.forEach( ytBlock => ytBlock.style.display = 'none' );
    };

    function showModal() {
        GM_config.open();
    }

    function saveData() {
        GM_config.close();
        getDomainsToHide();
        getUsersToHide();
        getSummaries();
        showhideYT( true );
    }

    function getDomainsToHide() {
        domainsToHide = GM_config.get( 'hiddenDomains' ).replace( /\s/g, "" ).split( "," );
    }

    function getUsersToHide() {
        usersToHide = GM_config.get( 'hiddenUsers' ).replace( /\s/g, "" ).split( "," );
    }

    function getSummaries() {
        var summaries = document.getElementsByClassName( "news-summary" );
        elementsToHide = [];
        for( let div of summaries ) {
            var newsInfo = div.getElementsByClassName( "news-body" );
            var minUrl = newsInfo[ 0 ].getElementsByClassName( "news-submitted" )[ 0 ].getElementsByClassName( "showmytitle" )[ 0 ];
            if( typeof minUrl != "undefined" ) {
                if( domainsToHide.includes( minUrl.innerHTML ) ) {
                    newsInfo[ 0 ].style.border = "1px solid #ffb380";
                    elementsToHide.push( newsInfo[ 0 ] );
                }
            }
        }
        var comments = document.getElementsByClassName( "comment" );
        for( let div of comments ) {
            var commentBody = div.getElementsByClassName( "comment-body" )[ 0 ];
            if( typeof commentBody != "undefined" ) {
                var userName = commentBody.getElementsByClassName( "comment-header" )[ 0 ].getElementsByClassName( "username" )[ 0 ].innerHTML;
                if( usersToHide.includes( userName ) ) {
                    div.style.border = "1px solid #ffb380";
                    elementsToHide.push( div );
                }
            }
        }

        document.getElementById( 'escondeID' ).innerHTML = elementsToHide.length;
    }

} )();