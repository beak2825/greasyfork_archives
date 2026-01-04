// ==UserScript==
// @name         Remove URL Part
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Removes a part of the URL of the current page and redirects to the modified URL
// @match        https://up.codes/*
// @grant        none
// @license coargroup
// @downloadURL https://update.greasyfork.org/scripts/464572/Remove%20URL%20Part.user.js
// @updateURL https://update.greasyfork.org/scripts/464572/Remove%20URL%20Part.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var oldUrl = window.location.href;
    var newUrl = oldUrl.replace("/thumbnails", "");

    if (newUrl !== oldUrl) {
        window.location.replace(newUrl);
    }
})();
