// ==UserScript==
// @name         Change Min-Height for Vanced YouTube Footer
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Changes min-height property on Vanced YouTube footer.
// @author       You
// @match        https://vanced-youtube.neocities.org/2011/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/471075/Change%20Min-Height%20for%20Vanced%20YouTube%20Footer.user.js
// @updateURL https://update.greasyfork.org/scripts/471075/Change%20Min-Height%20for%20Vanced%20YouTube%20Footer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // The new min-height value you want
    var newMinHeight = '434px';

    // Find the footer element with the specific class
    var footerElement = document.querySelector('div.ctr-p[data-jiis="bp"]#footer');
    if (footerElement) {
        // Change the min-height property
        footerElement.style.minHeight = newMinHeight;
    }
})();
