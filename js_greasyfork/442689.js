// ==UserScript==
// @name         Twitch Utilities
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Auto Functions for Twitch
// @author       AvalonRychmon
// @license      MIT
// @match        https://www.twitch.tv/*
// @icon         https://www.google.com/s2/favicons?domain=twitch.tv
// @require      https://code.jquery.com/jquery-latest.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/442689/Twitch%20Utilities.user.js
// @updateURL https://update.greasyfork.org/scripts/442689/Twitch%20Utilities.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Enable functions - true or false
    const enabled = {
        collect_points: true,
        play_button: false
    };

    // Stats
    let stats = {
        channelPoints : 0
    };


    // Start Functions
    window.setTimeout(() => {
        if (enabled['collect_points'] ) { collect_ChannelPoints(); }
        if (enabled['play_button'] ) { playButton(); }
    }, 1000);


    // Collect Channel Points
    function collect_ChannelPoints(){

        console.log('[Twitch-Utilities] Collect Channel Points - ENABLED');

        setInterval(() => {
            let pointsButtons = document.querySelectorAll('[data-test-selector="community-points-summary"] button');
            if(pointsButtons.length > 1) {
                pointsButtons[1].click();
                pointsButtons[1].remove();
            
                stats['channelPoints'] = stats['channelPoints']+50;
                console.log('[Twitch-Utilities] Collected: '+stats['channelPoints']+' Channel Points');
            };
        },1000);
   }

    // Add Play Marbles Button
    function playButton(){

        console.log('[Twitch-Utilities] Play Button - ENABLED');

        if(!$('#playButton').length){

        $('.chat-input__buttons-container div:first-child').after(`
            <div id="playButton"><button type="button" class="play">🏐Play</button></div>
        `);
            //setTimeout(playButton,10000);
            //return

        }

        $('button .play').on('click', function(){
            $('div [data-test-selector="chat-input"]').click();
            $('span [data-slate-string="true"]').html('!play');
        });




   }


})();