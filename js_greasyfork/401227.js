// ==UserScript==
// @name               Remove Big Brother Blurbs
// @name:en-US         youtube google
// @namespace          sneaky.youtube
// @version            0.1
// @description        remove-google-youtube-big-brother-censorship-fact-checker-garbage-blurb
// @author             sneakyla
// @match              *://www.youtube.com/*
// @downloadURL https://update.greasyfork.org/scripts/401227/Remove%20Big%20Brother%20Blurbs.user.js
// @updateURL https://update.greasyfork.org/scripts/401227/Remove%20Big%20Brother%20Blurbs.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function removeElement(elementId) {
        // Removes an element from the document
        var element = document.getElementById(elementId);
        element.parentNode.removeChild(element);
    }

    removeElement("clarify-box");

})();