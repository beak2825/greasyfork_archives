// ==UserScript==
// @name         RealmScans auto Full Screen
// @namespace    https://greasyfork.org/users/45933
// @version      0.3
// @author       Fizzfaldt
// @license      MIT
// @run-at       document-end
// @description  Tries to turn on full screen automatically on realmscans when screen is vertical
// @match        https://realmscans.com/*
// @match        https://realmscans.xyz/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=realmscans.xyz
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/467537/RealmScans%20auto%20Full%20Screen.user.js
// @updateURL https://update.greasyfork.org/scripts/467537/RealmScans%20auto%20Full%20Screen.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if (!screen.width || !screen.height) {
        console.log("Error getting width [" + screen.width + "] and height [" + screen.height + "]");
        return;
    }
    if (screen.width > screen.height) {
        // Currently widescreen; choosing "full screen" will make it harder to read
        return;
    }

    var sel = document.getElementById('screenmode');
    if (!sel) {
        return;
    }
    sel.value = 'cover';
    var evt = document.createEvent("HTMLEvents");
    evt.initEvent('change', true, true );
    !sel.dispatchEvent(evt);
})();