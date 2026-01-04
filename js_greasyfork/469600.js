// ==UserScript==
// @name ChangeYear
// @namespace Violentmonkey Scripts
// @match https://vanced-youtube.neocities.org/2015/
// @grant none
// @version 1.0
// @license MIT
// @description Description goes here
// @downloadURL https://update.greasyfork.org/scripts/469600/ChangeYear.user.js
// @updateURL https://update.greasyfork.org/scripts/469600/ChangeYear.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Find the target paragraph element
    var paragraph = document.querySelector('p[style="color:#767676;font-size:8pt"]');

    // Check if the paragraph element exists
    if (paragraph) {
        // Update the year to 2013
        paragraph.innerHTML = '© 2013 - <a href="/web/20150218000620/http://www.google.com/intl/en/policies/privacy/">Privacy</a> - <a href="/web/20150218000620/http://www.google.com/intl/en/policies/terms/">Terms</a>';
    }
})();