// ==UserScript==
// @name         cityline start button
// @namespace    http://tampermonkey.net/
// @version      0.7
// @description  cityline start button normal
// @author       You
// @match        https://shows.cityline.com/*
// @exclude      https://msg.cityline.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=msg.cityline.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/461834/cityline%20start%20button.user.js
// @updateURL https://update.greasyfork.org/scripts/461834/cityline%20start%20button.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Load the script
    var script = document.createElement("SCRIPT");
    script.src = 'https://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js';
    script.type = 'text/javascript';
    document.getElementsByTagName("head")[0].appendChild(script);

    var loopCheckStart = setInterval(checkReadyForSales,1);

    function checkReadyForSales(){
        var startbutton = document.querySelector(".buyTicketBox > button:nth-child(1)");
        console.log('loop check start');
        if( startbutton ){
            clearInterval(loopCheckStart);
            startbutton.click();
        }
    }

})();