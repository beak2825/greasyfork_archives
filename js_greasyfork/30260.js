// ==UserScript==
// @name         imgpix.net
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Skip to the image
// @author       Yksok
// @match        http://imgpix.net/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/30260/imgpixnet.user.js
// @updateURL https://update.greasyfork.org/scripts/30260/imgpixnet.meta.js
// ==/UserScript==

(function() {
    'use strict';

    $("#continuetoimage").find(".button").click();
})();