// ==UserScript==
// @name         Unblur logo on 2015
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Replaces the YouTube image source with the modified one.
// @author       You
// @match        https://vanced-youtube.neocities.org/2015/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/471009/Unblur%20logo%20on%202015.user.js
// @updateURL https://update.greasyfork.org/scripts/471009/Unblur%20logo%20on%202015.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to replace the image source
    function replaceImageSource() {
        const imageElement = document.getElementById("hplogo");
        if (imageElement) {
            imageElement.src = "https://oldgoogle.neocities.org/images/srpr/logo11w.png";
        }
    }

    // Call the function when the page loads
    replaceImageSource();

})();
