// ==UserScript==
// @name         TorrentBD Shoutbox Input Lock
// @version      1.3
// @description  Locks focus on shoutbox input after click; removes focus if clicked elsewhere.
// @author       5ifty6ix
// @namespace    5ifty6ix
// @match        https://*.torrentbd.com/*
// @match        https://*.torrentbd.net/*
// @match        https://*.torrentbd.org/*
// @match        https://*.torrentbd.me/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/541474/TorrentBD%20Shoutbox%20Input%20Lock.user.js
// @updateURL https://update.greasyfork.org/scripts/541474/TorrentBD%20Shoutbox%20Input%20Lock.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let shoutFocusInterval = null;
    let shoutbox = null;

    function keepFocus() {
        if (document.activeElement !== shoutbox) {
            shoutbox.focus();
        }
    }

    function activateFocusLock() {
        if (!shoutFocusInterval) {
            shoutFocusInterval = setInterval(keepFocus, 300);
        }
    }

    function deactivateFocusLock() {
        if (shoutFocusInterval) {
            clearInterval(shoutFocusInterval);
            shoutFocusInterval = null;
        }
    }

    function setupShoutboxLock() {
        shoutbox = document.querySelector('input#shout_text.shoutbox-text');

        if (!shoutbox) {
            setTimeout(setupShoutboxLock, 500);
            return;
        }

        shoutbox.addEventListener('click', (e) => {
            e.stopPropagation();
            activateFocusLock();
        });

        document.addEventListener('click', (e) => {
            if (!shoutbox.contains(e.target)) {
                deactivateFocusLock();
            }
        });
    }

    setupShoutboxLock();
})();
