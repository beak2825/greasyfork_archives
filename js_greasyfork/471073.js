// ==UserScript==
// @name         Replace Footer for Vanced YouTube
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Replaces the footer on Vanced YouTube website.
// @author       You
// @match        https://vanced-youtube.neocities.org/2011/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/471073/Replace%20Footer%20for%20Vanced%20YouTube.user.js
// @updateURL https://update.greasyfork.org/scripts/471073/Replace%20Footer%20for%20Vanced%20YouTube.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // The new footer HTML you provided
    var newFooterHTML = '<div class="ctr-p" data-jiis="bp" id="footer"> <div id="footcnt"> <style>...</style>   </div>';

    // Remove the existing footer element
    var existingFooter = document.getElementById('footer');
    if (existingFooter) {
        existingFooter.remove();
    }

    // Append the new footer HTML to the body
    var body = document.getElementsByTagName('body')[0];
    body.insertAdjacentHTML('beforeend', newFooterHTML);
})();
