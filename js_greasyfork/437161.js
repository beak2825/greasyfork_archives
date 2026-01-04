// ==UserScript==
// @name        Kenorbs
// @match       *://discord.com/*
// @grant       none
// @version     1.1
// @description Copied from https://gist.github.com/thebigsmileXD/c3b79a816d380fb747fa46f58e3c6ce3
// @license     none
// @namespace https://greasyfork.org/users/400395
// @downloadURL https://update.greasyfork.org/scripts/437161/Kenorbs.user.js
// @updateURL https://update.greasyfork.org/scripts/437161/Kenorbs.meta.js
// ==/UserScript==

/* jshint esversion: 6 */
(function() {
    'use strict';
    var skipper = setInterval(function() {
        let mentionButtons = document.querySelectorAll('[aria-label="Mention"]');
        if(mentionButtons.length > 0) {
            let grandparent = mentionButtons[0].parentNode.parentNode;
            let didManuallyClick = (grandparent.getAttribute('aria-checked') != null && grandparent.getAttribute('aria-checked') == 'false');
            if (grandparent && !didManuallyClick) {
                console.log('unpinging');
                grandparent.click();
            }
        }
    }, 500);
})();