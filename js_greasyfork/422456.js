// ==UserScript==
// @name            Eurosportplayer – Video control via keyboard and remote.
// @name:de         Eurosportplayer – Video-Steuerung via Keyboard und Fernbedienung
// @namespace       http://tampermonkey.net/
// @version         0.2
// @description     Forward/Rewind video control via keyboard/remote.
// @description:de  Vor- & Zurückspringen via Cursortasten und Fernbedienung.
// @author          YOKAI-Berlin
// @match           https://www.eurosportplayer.com/*
// @require         https://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/422456/Eurosportplayer%20%E2%80%93%20Video%20control%20via%20keyboard%20and%20remote.user.js
// @updateURL https://update.greasyfork.org/scripts/422456/Eurosportplayer%20%E2%80%93%20Video%20control%20via%20keyboard%20and%20remote.meta.js
// ==/UserScript==

(function() {
    'use strict';

    jQuery(document).ready(function ($) {
        // set control functions
        function letsControl() {
            setTimeout(function() {
                $(document).keydown(function(e) {
                    switch(e.which) {
                        case 37:
                            $('#app div[class*="styles-rewind"]').click();
                            console.log('#prev');
                            break;
                        case 39:
                            $('#app div[class*="styles-forward"]').click();
                            console.log('#next');
                            break;
                        default: return;
                    }
                    e.preventDefault();
                    showControls();
                });
            },2000);
        }
        var timer;
        function showControls() {
            clearTimeout(timer);
            $('#app div[class*="styles-controls"], #app div[class*="overlay-overlay"]').css({ 'opacity' : '1', 'visibility' : 'visible' });
            timer = setTimeout(function() {
                $('#app div[class*="styles-controls"], #app div[class*="overlay-overlay"]').removeAttr('style');
            },2000);
        }
        // let's play
        letsControl();
        $('a').on("click",function() {
            letsControl();
        });
    });
})();