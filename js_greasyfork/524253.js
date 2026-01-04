// ==UserScript==
// @name         devtoolsDetector remover
// @namespace    http://tampermonkey.net/
// @version      1
// @description  annoying when on hianime.to for example
// @author       Big watermelon
// @license      MIT
// @match        *://*/*
// @icon         data:image/jpeg;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAW0lEQVQY052QSwqAMBBDX0sR739SwZ1onwtB+9OFgSwmE0JmABCykNVEAUHBaripQQ3CUeq98UrvNNRpsCi5P110fjVqpCm+DCqstFDjIC0xgrBVB3yh+t0f4wkql4NuwIC5igAAAABJRU5ErkJggg==
// @grant        unsafeWindow
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/524253/devtoolsDetector%20remover.user.js
// @updateURL https://update.greasyfork.org/scripts/524253/devtoolsDetector%20remover.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const FAKE = { launch: () => 0, addListener: () => 0 };
    Object.defineProperty(unsafeWindow, 'devtoolsDetector', {
        set: () => 0,
        get: () => FAKE
    });
})();