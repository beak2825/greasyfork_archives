// ==UserScript==
// @name         Mouse Wheel Event Inverter
// @namespace    lainscripts_mouse_wheel_event_inverter
// @description  Inverts values returned by 'wheel' event.
// @version      0.2
// @author       lainverse
// @grant        none
// @run-at       document-start
// Google Maps, Yandex Maps
// @match        *://*/maps/*
// @downloadURL https://update.greasyfork.org/scripts/33294/Mouse%20Wheel%20Event%20Inverter.user.js
// @updateURL https://update.greasyfork.org/scripts/33294/Mouse%20Wheel%20Event%20Inverter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let descriptor,
        debug = false;
    for (let prop of ['deltaX', 'deltaY', 'deltaZ']) {
        descriptor = Object.getOwnPropertyDescriptor(WheelEvent.prototype, prop);
        let getter = descriptor.get;
        descriptor.get = function() {
            return -getter.call(this);
        };
        Object.defineProperty(WheelEvent.prototype, prop, descriptor);
    }

    if (debug)
        window.addEventListener('wheel', function(e) {
            console.log(e.deltaX, e.deltaY, e.deltaZ, e.deltaMode);
        }, false);
})();