// ==UserScript==
// @name        Youtube floating player
// @description Pins the video player in its original position while you scroll the page.
// @version     3.2
// @author      REVerdi
// @namespace   https://openuserjs.org/users/REVerdi
// @copyright   2014+, REVerdi (https://openuserjs.org/users/REVerdi)
// @license     (CC) Attribution Non-Commercial Share Alike; http://creativecommons.org/licenses/by-nc-sa/3.0/
// Por causa do SPF (Structured Page Fragments), não posso usar  // @include   http*://www.youtube.com/watch?*
// porque se o 1° link no YouTube não for do tipo acima, esse script nunca será executado.
// @include     http*://www.youtube.com/*
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/21979/Youtube%20floating%20player.user.js
// @updateURL https://update.greasyfork.org/scripts/21979/Youtube%20floating%20player.meta.js
// ==/UserScript==


/*
TESTADO APENAS NO FIREFOX

ONLY TESTED ON FIREFOX
*/


/*
O YouTube "quase" exatamente como eu queria!
Eu não sou programador, então não joguem tomates podres em mim :)

YouTube "almost" exactly as I wanted!
I'm not a programmer, so don't throw rotten tomatoes at me :)
*/


// Based on the ideia of drhouse (http://userscripts.org/scripts/show/186872)
// and contains source code written by tforbus:
// http://www.tristinforbus.com/
// https://github.com/tforbus/youtube-fixed-video-bookmarklet
// http://www.whattheforbus.com/youtube-bookmarklet [removed]
// https://chrome.google.com/webstore/detail/video-pinner/egfhbaheiflmihggjcfmnmchkijkcdpl [removed]


(function(){


"use strict";


var _window;
if (typeof unsafeWindow !== undefined){
    _window = unsafeWindow;
}
else {
    _window = window;
}


/*
 * constants
 */
const        BODY_ID = 'body';

const      PLAYER_ID = 'player';                                                //why not 'movie_player'?
const     THEATER_ID = 'theater-background';
const    PLAYLIST_ID = 'watch-appbar-playlist';
const     CONTENT_ID = 'watch7-content';
const     SIDEBAR_ID = 'watch7-sidebar';
const PLACEHOLDER_ID = 'placeholder-player';                                    //to detect if the user is or is not on a video page

const   BUTTON_CLASS = 'ytp-size-button ytp-button';                            //player view toggle button class

/*
 * flow control variables
 */
var       eventListenersAdded = 0;
var bodyMutationObserverAdded = 0;

/*
 * user is playing a...
 */
const SINGLE_VIDEO = 1;
const     PLAYLIST = 2;

/*
 * player view mode
 */
var playerViewMode;
const NOT_DETECTED = 0;
const DEFAULT_VIEW = 1;
const THEATER_MODE = 2;


var playerViewToggleButton;                                                     //tem que ser pública para que se possa rodar o removeEventListener


//http://www.w3schools.com/colors/colors_names.asp
//if (document.getElementById(        PLAYER_ID)) document.getElementById(        PLAYER_ID).style.border = "thick solid cyan"   ;
//if (document.getElementById(       THEATER_ID)) document.getElementById(       THEATER_ID).style.border = "thick solid red"    ;
//if (document.getElementById(      PLAYLIST_ID)) document.getElementById(      PLAYLIST_ID).style.border = "thick solid pink"   ;
//if (document.getElementById(       SIDEBAR_ID)) document.getElementById(       SIDEBAR_ID).style.border = "thick solid yellow" ;
//if (document.getElementById(   PLACEHOLDER_ID)) document.getElementById(   PLACEHOLDER_ID).style.border = "thick solid green"  ;
//if (document.getElementById(   'movie_player')) document.getElementById(   'movie_player').style.border = "thick solid blue"   ;
//if (document.getElementById('player-playlist')) document.getElementById('player-playlist').style.border = "thick solid fuchsia";


function userIsOnAVideoPage() {                                                 //user is where?
    var playerPlaceHolder = document.getElementById(PLACEHOLDER_ID);
    if( playerPlaceHolder ) return 1;                                           //user IS     on a video page
    else                    return 0;                                           //user is NOT on a video page
}


function userIsPlayingA() {
    if( /list/.test(document.location) === false ) return SINGLE_VIDEO;
    else                                           return PLAYLIST;
}


function getPlayerViewToggleButton() {
    var player  = document.getElementById(PLAYER_ID);
    var buttons = player.getElementsByTagName('BUTTON');
    for( var b = 0; b < buttons.length; b++ ) {
        if( buttons[b].className == BUTTON_CLASS) {
            var buttonTitle = buttons[b].getAttribute('title');
            if( buttonTitle != 'null' ) return buttons[b];
        }
    }
}




function resizePlayer() {
    var  playerRect;
    var theaterRect;
    var sidebarRect;
    
    var playlist;
    
    var  player = document.getElementById( PLAYER_ID);
    var theater = document.getElementById(THEATER_ID);
    var sidebar = document.getElementById(SIDEBAR_ID);
    
    var content = document.getElementById(CONTENT_ID);
    var contentRect = content.getBoundingClientRect();
    
    var playerPlaceHolder = document.getElementById(PLACEHOLDER_ID);
    playerPlaceHolder.firstElementChild.style.backgroundColor = 'transparent';

     player.style.top      = '60px';                                            //determinado por tentativa e erro :S
     player.style.position = 'fixed';
    theater.style.position = 'fixed';
    sidebar.style.position = 'inherit';                                         //static|absolute|fixed|relative|initial|inherit
    
    switch( playerViewMode ) {
        case DEFAULT_VIEW:
//          var content = document.getElementById(CONTENT_ID);
//          var contentRect = content.getBoundingClientRect();                  //bottom, height, left, right, top, width, x, y
            player.style.left = contentRect.left + 'px';
            switch( userIsPlayingA() ) {
                case SINGLE_VIDEO:
                     player.style.zIndex = 998;
                    sidebar.style.zIndex = 999;
                    break;
                    
                case PLAYLIST:
                     player.style.zIndex = 999;
                    sidebar.style.zIndex = 998;
                    
                    playlist = document.getElementById(PLAYLIST_ID);            //para desfazer o que foi feito para playlist em modo teatro
                    playlist.style.top      = '';
                    playlist.style.position = '';
                    playlist.style.width    = '';
                    playlist.style.left     = '';
                    
                     playerRect =  player.getBoundingClientRect();                    //to limit the
                    sidebarRect = sidebar.getBoundingClientRect();                    //width of
                     player.style.width = sidebarRect.right - playerRect.left + 'px'; //the playlist
                     
                    break;
            }
            break;
        case THEATER_MODE:
             player.style.zIndex = 999;
            sidebar.style.zIndex = 998;
            
             playerRect =  player.getBoundingClientRect();
            theaterRect = theater.getBoundingClientRect();
             player.style.left = (theaterRect.width / 2) - (playerRect.width / 2)  + 'px';
             
            switch( userIsPlayingA() ) {
                case SINGLE_VIDEO:
                    //nothing to do
                    break;
                    
                case PLAYLIST:
                    sidebarRect = sidebar.getBoundingClientRect();
                    
                    playlist = document.getElementById(PLAYLIST_ID);
                    playlist.style.top      = '170px';                          //determinado por tentativa e erro :S
                    playlist.style.position = 'fixed';
                    
                    playlist.style.width = sidebarRect.right - contentRect.right + 'px';
                    playlist.style.left  = contentRect.right + 'px';
                    //or
                  //playlist.style.width = sidebarRect.width + 'px';
                  //playlist.style.left  = sidebarRect.left  + 'px';
                    
                    break;
            }
            break;
    }
}




function pageResize() {
    resizePlayer();
}




function playerViewToggleButtonClick() {
    switch( playerViewMode ) {
        case DEFAULT_VIEW:
            playerViewMode = THEATER_MODE;
            break;
        case THEATER_MODE:
            playerViewMode = DEFAULT_VIEW;
            break;
    }
    resizePlayer();
}




function getPlayerViewMode() {
    var playerViewToggleButtonTitle = playerViewToggleButton.getAttribute('title');
    if( playerViewToggleButtonTitle != 'null' ) {
        playerViewToggleButtonTitle = playerViewToggleButtonTitle.toLowerCase();
        switch( playerViewToggleButtonTitle ) {                                 //detecta o modo de visualização pelo título do botão (eu sei, depende do idioma :S)
            case 'theater mode':                                                //'Theater mode'
            case 'modo teatro':                                                 //'Modo Teatro'
                playerViewMode = DEFAULT_VIEW;
                break;
            case 'default view':                                                //'Default view'
            case 'visualização padrão':                                         //'Visualização padrão'
                playerViewMode = THEATER_MODE;
                break;
        }
    }
  //else playerViewMode = NOT_DETECTED;                                         //isso ocorre, mas daí é mantido o último valor válido detectado
}



/*
function initElements() {                                                       //merged into resizePlayer()
    var  player = document.getElementById( PLAYER_ID);
    var theater = document.getElementById(THEATER_ID);
    var sidebar = document.getElementById(SIDEBAR_ID);
    
    var playerPlaceHolder = document.getElementById(PLACEHOLDER_ID);
    playerPlaceHolder.firstElementChild.style.backgroundColor = 'transparent';
    
     player.style.top      = '60px';                                            //determinado por tentativa e erro :S
     player.style.position = 'fixed';
    theater.style.position = 'fixed';
    sidebar.style.position = 'inherit';                                         //static|absolute|fixed|relative|initial|inherit
}
*/



//https://developer.mozilla.org/pt-BR/docs/Web/API/MutationObserver
//http://www.w3schools.com/jsref/met_element_addeventlistener.asp
var bodyMutationObserver = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
        if( userIsOnAVideoPage() ) {
            if( eventListenersAdded === 0 ) {                                   //só adiciona uma vez
                playerViewToggleButton = getPlayerViewToggleButton();
                playerViewToggleButton.addEventListener('click', playerViewToggleButtonClick, false);
                 _window.addEventListener('resize', pageResize, false);
                
                eventListenersAdded = 1;
                
                getPlayerViewMode();
              //initElements();
              //resizePlayer();                                                 //aqui não funciona 100%, portanto...
            }
            resizePlayer();                                                     //...tem que ficar aqui e ser chamada várias vezes :S
        }
        else {                                                                  //user is NOT on a video page
            if( eventListenersAdded ) {                                         //só remove uma vez
                var player = document.getElementById(PLAYER_ID);
                player.style.top      = '';
                player.style.position = '';
                player.style.zIndex   = '';
                player.style.left     = '';
                player.style.width    = '';
                
                playerViewToggleButton.removeEventListener('click', playerViewToggleButtonClick, false);
                 _window.removeEventListener('resize', pageResize, false);
                
                eventListenersAdded = 0;
            }
        }
    });
});
/*
function remBodyMutationObserver();
    if( bodyMutationObserverAdded == 1 ) {                                      //( bodyMutationObserverAdded == 1 ) ou apenas ( bodyMutationObserverAdded )
        bodyMutationObserver.disconnect();
        bodyMutationObserverAdded = 0;
    }
}
*/
function addBodyMutationObserver() {
    if( bodyMutationObserverAdded === 0 ) {                                     //( bodyMutationObserverAdded === 0 ) ou apenas ( !bodyMutationObserverAdded )
        var config = { attributes: true, characterData: true, childList: true };
        var target = document.getElementById(BODY_ID);                          //tem que ser 'body', porque 'page' só funciona quando a 1ª página NÃO for uma de vídeo
        if( target !== null ) {                                                 //( target !== null ) ou apenas ( target )
            bodyMutationObserver.observe(target, config);
            bodyMutationObserverAdded = 1;
        }
    }
}

addBodyMutationObserver();                                                      //initScript == entryPoint


})();