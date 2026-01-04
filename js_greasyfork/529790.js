// ==UserScript==
// @name        YouTube Volume Mouse Controller - With Alt Key
// @version     1.0.3
// @description Modifies YouTube Volume Mouse Controller to only work with Alt + Mousewheel
// @match       *://www.youtube.com/*
// @grant       none
// @run-at      document-start
// @license MIT
// @namespace https://greasyfork.org/users/91424
// @downloadURL https://update.greasyfork.org/scripts/529790/YouTube%20Volume%20Mouse%20Controller%20-%20With%20Alt%20Key.user.js
// @updateURL https://update.greasyfork.org/scripts/529790/YouTube%20Volume%20Mouse%20Controller%20-%20With%20Alt%20Key.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function handleWheelEvent(event) {
        if (event.srcElement.nodeName !== 'VIDEO') return;
        if (!event.altKey) {
            event.stopPropagation();
            event.stopImmediatePropagation();
        }
    }

    document.addEventListener('wheel', handleWheelEvent, { capture: true, passive: false });
    document.addEventListener('mousewheel', handleWheelEvent, { capture: true, passive: false });
    document.addEventListener('DOMMouseScroll', handleWheelEvent, { capture: true, passive: false });
})();