// ==UserScript==
// @name         Example Test
// @namespace    https://redcodi.com/
// @version      1.0
// @description  Replace all of https://example.com/ with a blank page displaying "test" and set the page title to "test"
// @author       Redcodi
// @license MIT
// @match        https://example.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/527504/Example%20Test.user.js
// @updateURL https://update.greasyfork.org/scripts/527504/Example%20Test.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Remove all existing styles and scripts
    document.head.innerHTML = '';
    document.body.innerHTML = '';

    // Load Google Fonts Roboto
    var fontLink = document.createElement('link');
    fontLink.rel = 'stylesheet';
    fontLink.href = 'https://fonts.googleapis.com/css2?family=Roboto:wght@400&display=swap';
    document.head.appendChild(fontLink);

    // Replace the entire page content
    document.body.innerHTML = '<p style="font-family: Roboto, sans-serif;">test</p>';

    // Set the page title to "test"
    document.title = 'test';

    // Change the favicon to a test icon
    var link = document.createElement('link');
    link.rel = 'icon';
    link.href = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y="80" font-size="80">Σ</text></svg>';
    document.head.appendChild(link);
})();
