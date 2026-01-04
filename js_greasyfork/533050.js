// ==UserScript==
// @name         The Guardian Nag Nullifier
// @namespace    http://tampermonkey.net/
// @version      2025-04-16
// @description  Pay or consent or javascript
// @author       bzly
// @match        https://www.theguardian.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=theguardian.com
// @grant        none
// @license      GPL-3.0-or-later
// @downloadURL https://update.greasyfork.org/scripts/533050/The%20Guardian%20Nag%20Nullifier.user.js
// @updateURL https://update.greasyfork.org/scripts/533050/The%20Guardian%20Nag%20Nullifier.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function zap() {
        const popup = document.querySelector('[id^="sp_message_container_"]')
        const gate = document.querySelector('#sign-in-gate')
        if (popup) {
            console.log("Zapping pay or consent bullshit")
            popup.remove()
            document.querySelector('html').classList.remove('sp-message-open')
        }
        if (gate) {
            console.log("Zapping registration nag")
            gate.remove()
        }
    }

    zap()
    const observer = new MutationObserver(zap)
    observer.observe(document, { childList: true, subtree: true })
})();