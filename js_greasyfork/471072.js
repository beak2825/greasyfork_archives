// ==UserScript==
// @name         Google 2014 part 8
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Replaces the footer on Vanced YouTube website.
// @author       You
// @match        https://vanced-youtube.neocities.org/2011/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/471072/Google%202014%20part%208.user.js
// @updateURL https://update.greasyfork.org/scripts/471072/Google%202014%20part%208.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // The new footer HTML you provided
    var newFooterHTML = '<div class="ctr-p" data-jiis="bp" id="footer"> <div id="footcnt"> <style>...</style>   </div>';

    // Find the existing footer element
    var existingFooter = document.getElementById('footer');
    if (existingFooter) {
        // Replace the existing footer with the new HTML
        existingFooter.outerHTML = newFooterHTML;
    }
})();
