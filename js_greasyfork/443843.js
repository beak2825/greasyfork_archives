// ==UserScript==
// @name           Soap2Day Autoplay Toggleble
// @version        1.1.3
// @description    Autoplay soap2play shows and movies when the page loads with toggleble button bellow the player. Written in Tampermonkey.
// @author         audite
// @match          https://soap2day.to/*
// @match          https://soap2day.im/*
// @match          https://soap2day.ac/*
// @match          https://soap2day.se/*
// @match          https://s2dfree.to/*
// @match          https://s2dfree.cc/*
// @match          https://s2dfree.de/*
// @match          https://s2dfree.is/*
// @match          https://s2dfree.in/*
// @match          https://s2dfree.nl/*
// @grant          none
// @license        BY-NC-CD
// @source         https://audite.dev/soup2day.js
// @namespace      audite.dev
// @require        https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/443843/Soap2Day%20Autoplay%20Toggleble.user.js
// @updateURL https://update.greasyfork.org/scripts/443843/Soap2Day%20Autoplay%20Toggleble.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let CHECK = localStorage.getItem("autoplay")
    let SWITCH_TO_PLAYER_AUTOMATICALLY

    if(CHECK === "true"){
        SWITCH_TO_PLAYER_AUTOMATICALLY = true;
    }else{
        SWITCH_TO_PLAYER_AUTOMATICALLY = false;
    }

    function start(){
        function rafAsync() {
            return new Promise(resolve => requestAnimationFrame(resolve));
        }
        async function checkElement(selector) {
            let querySelector = null;
            while (querySelector === null) {
                await rafAsync();
                querySelector = document.querySelector(selector);
            }
            return querySelector;
        }
        checkElement('video').then(element => {
            const newScript = document.createElement("script");
            const inlineScript = document.createTextNode("jwplayer().play();jwplayer().setFullscreen(true);");
            newScript.appendChild(inlineScript);
            const target = document.body;
            target.appendChild(newScript);
        });
    }

    var checkExist = setInterval(function () {
        if ($('video').length) {
            var videoSource = $('video').attr('src');
            var thumbnail = $('.thumbnail').find('img').attr('src');

            if(SWITCH_TO_PLAYER_AUTOMATICALLY) {
                start();
                if(CHECK === "true"){
                    $('#divPlayerSelect').append('<div id="btnSoapAutoPlay" class="btn btn-dark">Toggle AutoPlay (Enabled)</div>');
                }else{
                    $('#divPlayerSelect').append('<div id="btnSoapAutoPlay" class="btn btn-dark">Toggle AutoPlay (Disabled)</div>');
                }
                $( "#btnSoapAutoPlay" ).click(function() {
                    localStorage.setItem("autoplay", "false");
                });
            } else {
                if(CHECK === "true"){
                    $('#divPlayerSelect').append('<div id="btnSoapAutoPlay" class="btn btn-dark">Toggle AutoPlay (Enabled)</div>');
                }else{
                    $('#divPlayerSelect').append('<div id="btnSoapAutoPlay" class="btn btn-dark">Toggle AutoPlay (Disabled)</div>');
                }
                $( "#btnSoapAutoPlay" ).click(function() {
                    start()
                    localStorage.setItem("autoplay", "true");
                });
            }

            clearInterval(checkExist);
        }
    }, 1000); // check every 1000ms

})();
