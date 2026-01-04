// ==UserScript==
// @name         Desktop Mode & Disable DPI Detection
// @namespace    http://dmxdpi.41
// @version      1.0
// @description  Forces the browser to use desktop mode and prevents sites from determining the browser DPI
// @author       FortyOne
// @license MIT
// @match        *://*/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/489478/Desktop%20Mode%20%20Disable%20DPI%20Detection.user.js
// @updateURL https://update.greasyfork.org/scripts/489478/Desktop%20Mode%20%20Disable%20DPI%20Detection.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Set viewport meta tag to ensure desktop mode
    var viewport = document.createElement('meta');
    viewport.setAttribute('name', 'viewport');
    viewport.setAttribute('content', 'width=1200, user-scalable=yes');
    document.head.appendChild(viewport);

    // Prevent sites from determining browser DPI
    Object.defineProperty(window.screen, 'deviceXDPI', { value: 96, writable: false, configurable: false });
    Object.defineProperty(window.screen, 'logicalXDPI', { value: 96, writable: false, configurable: false });
    Object.defineProperty(window.screen, 'devicePixelRatio', { value: 1, writable: false, configurable: false });
})();