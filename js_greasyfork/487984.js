// ==UserScript==
// @name         Block Orientation Sensor Access
// @namespace    Ka0uS
// @version      0.2
// @description  Blocks websites on Safari mobile from accessing iPad's Orientation sensors. (22/2/2024)
// @include      https://remote.wemod.com/#/app
// @include      https://remote.wemod.com/*
// @include      http://remote.wemod.com/*
// @include      https://wemod.com/*
// @include      http://*.wemod.com/*
// @include      https://*.wemod.com/*
// @include      *
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/487984/Block%20Orientation%20Sensor%20Access.user.js
// @updateURL https://update.greasyfork.org/scripts/487984/Block%20Orientation%20Sensor%20Access.meta.js
// ==/UserScript==


(function() {
    'use strict';

    // Is an iPad?
    var isiPad = /iPad/i.test(navigator.userAgent);

    // Check if safari supports 'DeviceOrientationEvent'
    var supportsOrientation = 'DeviceOrientationEvent' in window;

    // block access to orientation events
    if (isiPad && supportsOrientation) {
        window.addEventListener('deviceorientation', function(event) {
            // prevent the default handling of the event
            event.stopPropagation();
            event.preventDefault();
            // Log if the event is blocked
            console.log('Blocked device orientation event:', event);
        }, true);
    }
})();