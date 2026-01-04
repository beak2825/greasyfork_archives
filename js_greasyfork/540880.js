// ==UserScript==
// @name         Sharty ServiceWorker Spoofer
// @namespace    https://t.me/qooryqoor
// @version      1.0
// @description  Use with Mullvad browser and a VPN/proxy for maximum privacy.
// @license      MIT
// @author       mazal
// @match        *://www.soyjak.st/*
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/540880/Sharty%20ServiceWorker%20Spoofer.user.js
// @updateURL https://update.greasyfork.org/scripts/540880/Sharty%20ServiceWorker%20Spoofer.meta.js
// ==/UserScript==

(function () {
    'use strict';

    Object.defineProperty(navigator, 'serviceWorker', {
        get: () => true,
        configurable: true
    });

})();