// ==UserScript==
// @name         stable-izer for LineageOS downloads page
// @version      0.1
// @description  stable > nightly
// @author       LuK1337
// @match        https://download.lineageos.org/*
// @grant        none
// @namespace https://greasyfork.org/users/721956
// @downloadURL https://update.greasyfork.org/scripts/426736/stable-izer%20for%20LineageOS%20downloads%20page.user.js
// @updateURL https://update.greasyfork.org/scripts/426736/stable-izer%20for%20LineageOS%20downloads%20page.meta.js
// ==/UserScript==

(function() {
    'use strict';

    $('a').each((idx, elem) => {
        elem.innerHTML = elem.innerHTML.replace('nightly', 'stable');
    });
})();