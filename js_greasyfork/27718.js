// ==UserScript==
// @name         HIT Scraper Ghost
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Now hits hang around foreeeever.
// @author       You
// @match        https://www.mturk.com/mturk/findhits*hit_scraper
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/27718/HIT%20Scraper%20Ghost.user.js
// @updateURL https://update.greasyfork.org/scripts/27718/HIT%20Scraper%20Ghost.meta.js
// ==/UserScript==

(function() {
    // Load the script
    var script = document.createElement("SCRIPT");
    script.src = 'https://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js';
    script.type = 'text/javascript';
    script.onload = function() {
        var $ = window.jQuery;
        // Create new results...
        $('body').append("<table id='ghost'></table>");

       function update() {
           console.log('Only triggered once');
           var newElements = $('tr.shine:not(.ignored):not(blocklisted)').clone().prependTo('#ghost');
           $('#ghost tr').slice(16).remove();           
       }
        var triggerTimer;
            function triggerUpdate() {
                console.log('triggerd');
                
                clearTimeout(triggerTimer);
               // create timer function
                triggerTimer = setTimeout(update,100);
            }
        
        
        $('#resultsTable').on('DOMNodeInserted DOMNodeRemoved webkitTransitionEnd input', function() {
            triggerUpdate();
            // Get elements.
            
        
        });
    };
    document.getElementsByTagName("head")[0].appendChild(script);
})();