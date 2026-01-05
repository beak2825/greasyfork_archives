// ==UserScript==
// @name         Open spotify keyboard controls
// @namespace    http://digfish.org/
// @version      0.1
// @description  control open spotify with the keyboard
// @author       digfish
// @match        *.spotify.*
// @grant        none
// @include    https://*.spotify.*/*
// @match      http://*.spotify.*/*
// @match      https:/*.spotify.*/*
// @copyright  digfish, based on  ${4:Gustavo Keener}
// @debugger
// @require   http://code.jquery.com/jquery-1.8.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/29751/Open%20spotify%20keyboard%20controls.user.js
// @updateURL https://update.greasyfork.org/scripts/29751/Open%20spotify%20keyboard%20controls.meta.js
// ==/UserScript==

// Add jQuery, unless it already exists

if(typeof jQuery === 'undefined'|| !jQuery){
    (function(){
        var s=document.createElement('script');
        s.setAttribute('src','https://ajax.googleapis.com/ajax/libs/jquery/1/jquery.js');
        if(typeof jQuery=='undefined'){
            document.getElementsByTagName('head')[0].appendChild(s);
            console.log('jQuery inject userscript: LOADED jQuery via userscript');
        } else {
            console.log('jQuery inject userscript: jQuery WAS NOT LOADED via userscript');

        }
    })();
}

(function() {
    //    'use strict';

    console.log('Loading Script Open Spotify keyboard controls!');
    $('body').keyup(function(evt) {

        console.log('Pressed on key:', evt.which);
         // fast forward is not reacting... and to catch volume keys impossible, unless you use 
        // the usual Fx key functions...
        if (evt.which == 179 ) { // F7 Play-Pause
            $('button.control-button.spoticon-pause-16').click();
            $('button.control-button.spoticon-play-16').click();
        } else if (evt.which == 177) { // F6 rewind
            $('.spoticon-skip-forward-16').click();
        }
    });
    





})();