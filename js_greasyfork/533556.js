// ==UserScript==
// @name         PYA no warning
// @namespace    http://tampermonkey.net/
// @version      1
// @description  removes dotting warning
// @author       small bee
// @match        *://*.pixelya.fun/*
// @match        *://pixelya.fun/*
// @license MIT
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/533556/PYA%20no%20warning.user.js
// @updateURL https://update.greasyfork.org/scripts/533556/PYA%20no%20warning.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function removeElements() {
        const alertEl = document.querySelector('div.Alert.show');
        if (alertEl) {
            alertEl.remove();
        }

        const overlayEl = document.querySelector('div.overlay.show');
        if (overlayEl) {
            overlayEl.remove();
        }
    }

    removeElements();

    const observer = new MutationObserver(removeElements);
    observer.observe(document.documentElement, {
        childList: true,
        subtree: true
    });

    setInterval(removeElements, 2000);
})();