// ==UserScript==
// @name         OTIS Auto Log On
// @namespace    http://tampermonkey.net/
// @version      2026.01.12.2
// @description  Auto-clicks "Log On" when launching OTIS
// @author       Vance M. Allen
// @match        https://apps.sde.idaho.gov/Otis/Home/Home
// @match        https://apps2.sde.idaho.gov/Otis/Home/Home
// @icon         https://www.google.com/s2/favicons?sz=64&domain=idaho.gov
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/480562/OTIS%20Auto%20Log%20On.user.js
// @updateURL https://update.greasyfork.org/scripts/480562/OTIS%20Auto%20Log%20On.meta.js
// ==/UserScript==

/*
Change log
2023.11.22.1  - Original release
2026.01.12.2  - Add APPS2 server support.
*/
/* globals $ */
(function() {
    'use strict';
    const apps2 = location.hostname.split('.').shift() === 'apps2';

    $(`a[href="/${apps2 ? 'OTIS' : 'Otis'}/Home/LogOn"]`).each(function() {
        console.warn('OTIS Auto Log On running.');
        window.location.href = $(this).attr('href');
    });
})();