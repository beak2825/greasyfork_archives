// ==UserScript==
// @name         Delete annoying badges!
// @namespace    http://tampermonkey.net/
// @version      2025.03.07
// @description  This script is basic asf, only deletes badges (no willing to update, you can easily update it by inspect element duh)
// @author       Abeja
// @match        https://www.pathofexile.com/forum/view-thread/*
// @match        https://www.pathofexile.com/forum/post-reply/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/501853/Delete%20annoying%20badges%21.user.js
// @updateURL https://update.greasyfork.org/scripts/501853/Delete%20annoying%20badges%21.meta.js
// ==/UserScript==
(function() {
    'use strict';
    function removeBadges() {
        var badges = document.querySelectorAll('div.badges.clearfix');
        badges.forEach(function(badge) {
            badge.remove();
        });
    }
    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.addedNodes.length) {
                removeBadges();
            }
        });
    });
    observer.observe(document.body, { childList: true, subtree: true });
    window.addEventListener('load', function() {
        removeBadges();
        setTimeout(removeBadges, 4000);
    });
})();