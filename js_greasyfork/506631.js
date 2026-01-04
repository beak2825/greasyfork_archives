// ==UserScript==
// @name         Altium viewer - disable number hotkeys
// @namespace    http://www.stderr.nl/
// @version      2024-09-03
// @description  Suppress some number keys in online altium viewer, to prevent accidentally switching between e.g. schematic and PCB views.
// @author       Matthijs Kooijman <matthijs@stdin.nl>
// @license      The MIT license; http://opensource.org/licenses/MIT
// @match        https://cdn.365.altium.com/microfrontends/viewer/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/506631/Altium%20viewer%20-%20disable%20number%20hotkeys.user.js
// @updateURL https://update.greasyfork.org/scripts/506631/Altium%20viewer%20-%20disable%20number%20hotkeys.meta.js
// ==/UserScript==

// Number keys can be used to switch between schematic, PCB and 3D views. When running Firefox
// on Gnome, switching between virtual desktops with super-1/2/3 seems to deliver the keyup event
// for that to the website, causing altium viewer to switch modes. This might be a gnome-shell bug,
// but this script eats up those keyup events to work around this.

// This script matches the URL of the viewer iframe in the altium webpage, since that is where the key events
// are handled (and if the iframe is focused, the outer document never sees the events).

// Approach is based on https://stackoverflow.com/a/19785922/740048

(function() {
    'use strict';
    var keys = ['1', '2', '3'];
    document.addEventListener('keyup', function(e) {
        // console.log("KEY EVT", e);
        if (keys.indexOf(e.key) != -1) {
            console.log("CANCELING EVT", e);
            e.cancelBubble = true;
            e.stopImmediatePropagation();
        }
        return false;
    }, {capture: true});
})();