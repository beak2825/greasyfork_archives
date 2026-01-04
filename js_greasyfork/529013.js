// ==UserScript==
// @name         Autodarts - Auto Fullscreen
// @namespace    http://tampermonkey.net/
// @version      0.14
// @description  Enables auto fullscreen-mode after game start
// @author       benebelter
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js
// @match        https://play.autodarts.io/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=autodarts.io
// @license      MIT
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/529013/Autodarts%20-%20Auto%20Fullscreen.user.js
// @updateURL https://update.greasyfork.org/scripts/529013/Autodarts%20-%20Auto%20Fullscreen.meta.js
// ==/UserScript==

(function() {
    'use strict';

//     $(document).on('click', '.rematch_button',  function(){
//         document.querySelector("html").requestFullscreen();
//     })

   $(document).on('click', 'button:contains("Start game"), #enter_fullscreen, .rematch_button',  function(){  //
    //    $(document).on('click', '.chakra-button', function(){
        // collapse side bar

        $('#enter_fullscreen').hide();

        if( $('.css-17xejub').width() > 100 ){
            $('[aria-label="Collapse side bar"]').click();
        }

        if( window.innerHeight != screen.height) {
            document.querySelector("html").requestFullscreen();
            $('#exit_fullscreen').show();

        }

        $(document).on('click', '#exit_fullscreen', function(){
            $('#enter_fullscreen').show();
            $('#exit_fullscreen').hide();
        })

        if ($('#exit_fullscreen').length < 1) {
            $('.css-1jc8v6r').last().after('<a id="exit_fullscreen" class="chakra-menu__menuitem css-1jc8v6r" onclick="document.exitFullscreen();  ">Exit Fullscreen</a>');
        }

    })


    let timeout = setTimeout (
        function () {
            if ($('#enter_fullscreen').length < 1){
                $('.css-1jc8v6r').last().after('<a id="enter_fullscreen" class="chakra-menu__menuitem css-1jc8v6r" onclick="">Enter Fullscreen</a>');
            }
            else {
                clearTimeout(anzeigeTastaturshortcuts);}
        }, 2000);


})();