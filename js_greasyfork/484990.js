// ==UserScript==
// @name         Redirect Segurosdevida.site link shortener shortlink
// @version      1.0
// @description  Redirects link shortener shortlink segurosdevida.site for some sites including mandranime.com
// @author       Rust1667
// @match        *://segurosdevida.site/*
// @grant        none
// @namespace https://greasyfork.org/users/980489
// @downloadURL https://update.greasyfork.org/scripts/484990/Redirect%20Segurosdevidasite%20link%20shortener%20shortlink.user.js
// @updateURL https://update.greasyfork.org/scripts/484990/Redirect%20Segurosdevidasite%20link%20shortener%20shortlink.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to extract the URL from the onclick attribute
    function extractUrlFromOnclick(onclickValue) {
        // Use regular expression to extract the URL
        var match = onclickValue.match(/window\.open\('([^']+)'/);
        return match ? match[1] : null;
    }

    // Find elements with onclick attribute
    var elementsWithOnclick = document.querySelectorAll('[onclick]');

    // Loop through the elements and check for onclick attribute
    elementsWithOnclick.forEach(function(element) {
        // Extract the URL from onclick attribute
        var url = extractUrlFromOnclick(element.getAttribute('onclick'));

        // If a valid URL is found, redirect the page
        if (url) {
            window.location.href = url;
        }
    });
})();