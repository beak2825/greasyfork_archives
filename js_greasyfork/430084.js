// ==UserScript==
// @name         Soap+
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  player for soap2day
// @author       You
// @match        https://soap2day.to/*
// @match        https://soap2day.ac/*
// @match        https://soap2day.sh/*
// @match        https://s2dfree.to/*
// @match        https://s2dfree.is/*
// @match        https://s2dfree.in/*
// @match        https://s2dfree.nl/*
// @match        https://s2dfree.cc/*
// @match        https://s2dfree.de/*
// @icon         https://www.google.com/s2/favicons?domain=s2dfree.cc
// @grant        none
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/430084/Soap%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/430084/Soap%2B.meta.js
// ==/UserScript==

(function () {
    'use strict';


    const SWITCH_TO_PLAYER_AUTOMATICALLY = false; //WARNING: setting this value to true could lead to soap+ entering into player with unwanted videos.

    function switchPlayer(videoSource, thumbnail) {
        $('body').html(`
            <style>
                video {
                    width: 100%;
                    position: absolute;
                    left: 50%;
                    top: 50%;
                    transform: translate(-50%, -50%);
                    background: url(${thumbnail}) no-repeat;
                    background-position: center center;
                    background-repeat: no-repeat;
                    -webkit-background-size: cover;
                    -moz-background-size: cover;
                    -o-background-size: cover;
                    background-size: cover;
                }
                .control-wrapper {
                    position: relative;
                    z-index; -100;
                }
                .controls {
                    position:absolute;
                    height: 5%;
                    width: 100%;
                    background-color: white;
                    bottom: 10%;
                }
            </style>
            <video controls src="${videoSource}"></video>
            `);

            $('body').attr('style', 'background: black !important;');
    }

    var checkExist = setInterval(function () {
        if ($('video').length) {
            var videoSource = $('video').attr('src');
            var thumbnail = $('.thumbnail').find('img').attr('src');


            if(SWITCH_TO_PLAYER_AUTOMATICALLY) { switchPlayer(videoSource, thumbnail); } else {
                $('#divPlayerSelect').append('<div id="btnSoapPlus" class="btn btn-dark">Use Soap+ Player</div>');
                $( "#btnSoapPlus" ).click(function() {
                    switchPlayer(videoSource);
                });
            }

            clearInterval(checkExist);
        }
    }, 100); // check every 100ms

})();