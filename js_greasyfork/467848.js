// ==UserScript==
// @name         Googleusercontent_max_size
// @namespace    https://play-lh.googleusercontent.com
// @version      1.0.1
// @description  Modifies the URL parameter to add "=s9999" after the equals sign (=), that do the max size and quality to image to download.
// @icon         https://www.google.com/s2/favicons?sz=64&domain=play-lh.googleusercontent.com
// @author       Wizzergod
// @license MIT
// @match        https://play-lh.googleusercontent.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/467848/Googleusercontent_max_size.user.js
// @updateURL https://update.greasyfork.org/scripts/467848/Googleusercontent_max_size.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var url = window.location.href;
    var modifiedURL = url.replace(/=(.*)/g, '=s9999');

    if (modifiedURL !== url) {
        window.location.href = modifiedURL;
    }
})();
