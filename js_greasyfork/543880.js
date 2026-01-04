// ==UserScript==
// @name         Bypass Time Check and Auto Flip
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Overrides the time check on nextTop clicks and auto-flips every 1-2 seconds randomly on the specified webpage.
// @author       Grok
// @match        http://wap.xiaoyuananquantong.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/543880/Bypass%20Time%20Check%20and%20Auto%20Flip.user.js
// @updateURL https://update.greasyfork.org/scripts/543880/Bypass%20Time%20Check%20and%20Auto%20Flip.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to generate random interval (e.g., 1-2 seconds in ms; adjust min/max as needed)
    function getRandomInterval() {
        return Math.floor(Math.random() * (2 - 1 + 1) + 1) * 1000;
    }

    // Wait for the page to load and elements to be ready
    window.addEventListener('load', function() {
        // Ensure jQuery and elements are available
        if (typeof $ !== 'undefined' && $('#nextTop').length) {
            // Remove the original click handler to bypass the built-in time check
            $('#nextTop').off('click');

            // Extract necessary variables from the page's scope (these are global or DOM-based)
            var oPicUl = $("#picBox ul");
            var w1 = $(window).width();
            var len1 = $('#picBox li').length;
            var index = 0; // We manage our own index since we're overriding

            // Attach a new click handler without the time check
            $('#nextTop').click(function () {
                if (index < len1 - 1) {
                    index++;
                    oPicUl.animate({'left': -index * w1});
                } else {
                    console.log('Last image reached');
                    console.log("nextArticleId:", $('#nextArticleId').val());
                    handleTest(); // Call the page's handleTest function as in original
                }
            });

            // Function to auto-trigger the click
            function autoFlip() {
                $('#nextTop').click();
                console.log('Auto-flipped to next');
                // Schedule next auto-flip
                setTimeout(autoFlip, getRandomInterval());
            }

            // Start auto-flipping
            autoFlip();
        } else {
            console.log('jQuery or nextTop element not found.');
        }
    });
})();