// ==UserScript==
// @name         Do not track click link 
// @description  try track me click on forum.dobreprogramy.pl, remove redirect.
// @match        https://forum.dobreprogramy.pl/
// @include      https://forum.dobreprogramy.pl/*
// @icon         https://i.imgur.com/aoGUAKi.png
// @homepageURL  https://greasyfork.org/pl/scripts/37660-do-not-track-click-link
// @version      1.1.2
// @author       krystian3w
// @run-at       document-idle
// @grant        none
// @compatible   firefox Firefox
// @compatible   chrome Chrome
// @compatible   edge Edge
// @compatible   opera Opera
// @compatible   safari Safari
// @namespace https://greasyfork.org/users/167625
// @downloadURL https://update.greasyfork.org/scripts/37660/Do%20not%20track%20click%20link.user.js
// @updateURL https://update.greasyfork.org/scripts/37660/Do%20not%20track%20click%20link.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function addNoTrackLinks() {
        document.querySelectorAll('.regular.contents .cooked a[href*="//"], .regular.contents .cooked a[href^="/uploads/"], .excerpt a[href*="//"], .excerpt a[href^="/uploads/"]').forEach(function(link) {
            link.classList.add('no-track-link');
        });
    }

    window.addEventListener("DOMContentLoaded", addNoTrackLinks);

    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            mutation.addedNodes.forEach(function(node) {
                if (node.nodeType === 1 && node.tagName === 'A') {
                    addNoTrackLinks();
                }
            });
        });
    });

    observer.observe(document.body, { childList: true, subtree: true });

    document.body.addEventListener("mouseover", function(event) {
        if (event.target.tagName === 'A') {
            addNoTrackLinks();
        }
    });
})();