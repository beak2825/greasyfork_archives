// ==UserScript==
// @name         The Tidal advertising be silent
// @namespace    http://tampermonkey.net/
// @version      0.1
// @license      GPLv3
// @description  Tidal makes the subscription advertising loud and annoying, so make it bit quailet.
// @author       Gedweb
// @match        https://listen.tidal.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tidal.com
// @grant GM_setValue
// @grant GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/448638/The%20Tidal%20advertising%20be%20silent.user.js
// @updateURL https://update.greasyfork.org/scripts/448638/The%20Tidal%20advertising%20be%20silent.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let localMuted = false;

    function checkReady() {
        let playerNode = document.getElementsByTagName('video')[0];
        if (undefined === playerNode) {
            return;
        }

        let lastVolume = playerNode.volume;

        let node, containsAD = false;
        let titleRoot = document.querySelectorAll('[data-test="footer-track-title"]')[0] || document;
        let walk = document.createTreeWalker(titleRoot, NodeFilter.SHOW_TEXT, null);
        while (node = walk.nextNode()) {
            if ("Advertisement" === node.textContent) {
                containsAD = true;
            }
        }

        if (containsAD && !localMuted) {
            playerNode.volume = 0.3;
            localMuted = true;
        } else if (localMuted) {
            playerNode.volume = lastVolume;
            localMuted = false;
        }
    }

    setInterval(function () {
        checkReady();
    }, 1000);

})();
