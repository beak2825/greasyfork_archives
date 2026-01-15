// ==UserScript==
// @name         web.snapchat.com - Remove Bitmoji from Snapchat Web Home Screen
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Removes your Bitmoji div from Snapchat Web
// @author       petabyte
// @match        *://*.snapchat.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/537859/websnapchatcom%20-%20Remove%20Bitmoji%20from%20Snapchat%20Web%20Home%20Screen.user.js
// @updateURL https://update.greasyfork.org/scripts/537859/websnapchatcom%20-%20Remove%20Bitmoji%20from%20Snapchat%20Web%20Home%20Screen.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function removeBitmojiDiv() {
        const targetDiv = document.querySelector('div.EIyPZ.Ws4Dn.oJcqU');
        if (targetDiv) {
            targetDiv.remove();
            console.log('[petabyte userscript] Bitmoji div removed.');
        }
    }

    // Try removing immediately
    removeBitmojiDiv();

    // Also watch for dynamic page changes (Snapchat is SPA)
    const observer = new MutationObserver(removeBitmojiDiv);
    observer.observe(document.body, { childList: true, subtree: true });
})();
