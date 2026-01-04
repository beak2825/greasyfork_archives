// ==UserScript==
// @name         Bing to Google
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Make Bing look like Google
// @author       You
// @match        https://www.bing.com/*
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/478326/Bing%20to%20Google.user.js
// @updateURL https://update.greasyfork.org/scripts/478326/Bing%20to%20Google.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Change Bing logo to Google logo
    var bingLogo = document.querySelector('.bing-logo');
    if (bingLogo) {
        bingLogo.style.backgroundImage = 'url(https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png)';
        bingLogo.style.backgroundSize = '100% 100%';
    }

    // Change search bar style to match Google's
    var searchBox = document.getElementById('sb_form_q');
    if (searchBox) {
        searchBox.style.borderRadius = '24px';
        searchBox.style.paddingLeft = '16px';
        searchBox.style.fontSize = '16px';
    }

    // Change background color to match Google's
    document.body.style.backgroundColor = '#f2f2f2';

    // Change font of search results to match Google's
    var searchResults = document.querySelectorAll('.b_algo');
    if (searchResults) {
        for (var i = 0; i < searchResults.length; i++) {
            searchResults[i].style.fontFamily = 'Arial, sans-serif';
        }
    }
})();
