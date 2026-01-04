// ==UserScript==
// @name         Episode Name Hider
// @namespace    https://github.com/yoku-nai-desu/
// @version      0.9.1
// @description  A simple script to hide names of episodes on 9anime/aniwave + avoid hover/pointer events for them
// @author       Alireza Rezaei (yoku-nai-desu)
// @license      WTFPL
// @match        https://aniwave.to/watch/*
// @match        https://9animetv.to/watch/*
// @match        https://9anime.com.pl/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/496160/Episode%20Name%20Hider.user.js
// @updateURL https://update.greasyfork.org/scripts/496160/Episode%20Name%20Hider.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('Script is running...');

    // Function to hide episode names
    function hideEpisodeNames() {
        console.log('hideEpisodeNames function is executing...');

        // Select all <span> elements with class "d-title" inside <li> elements within the episode list
        var spans = document.querySelectorAll('.episodes.name li span.d-title[data-jp]');

        console.log('Number of spans found:', spans.length);

        // Iterate through each span element
        spans.forEach(function(span) {
            console.log('Replacing text for span:', span.textContent);
            
            // Replace the text content of each span element
            span.textContent = 'Hidden';

            // Disable hover effect on the span element
            span.style.pointerEvents = 'none';
        });
    }

    // Execute the script immediately after injection
    hideEpisodeNames();
})();