// ==UserScript==
// @name         OTIS Auto Log On
// @namespace    http://tampermonkey.net/
// @version      2023.11.22.1
// @description  Auto-clicks "Log On" when launching OTIS
// @author       Vance M. Allen
// @match        https://apps.sde.idaho.gov/Otis/Home/Home
// @icon         https://www.google.com/s2/favicons?sz=64&domain=idaho.gov
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/480562/OTIS%20Auto%20Log%20On.user.js
// @updateURL https://update.greasyfork.org/scripts/480562/OTIS%20Auto%20Log%20On.meta.js
// ==/UserScript==

/* globals $ */
(function() {
    'use strict';

    $('a[href="/Otis/Home/LogOn"]').each(function() {
        console.warn('OTIS Auto Log On running.');
        window.location.href = $(this).attr('href');
    });
})();