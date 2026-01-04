// ==UserScript==
// @name         Fast F95-Zone skipper
// @namespace    https://f95zone.to
// @version      1.3
// @description  Automatically clicks on Download button.
// @match        https://f95zone.to/masked/*
// @grant        none
// @author       Baluzs
// @license      MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=f95zone.to
// @supportURL https://greasyfork.org/en/scripts/528136-fast-f95-zone-skipper
// @downloadURL https://update.greasyfork.org/scripts/528136/Fast%20F95-Zone%20skipper.user.js
// @updateURL https://update.greasyfork.org/scripts/528136/Fast%20F95-Zone%20skipper.meta.js
// ==/UserScript==

(function () {
    'use strict';
    Promise.resolve().then(() => {
        const button = document.querySelector('a.host_link');
        if (button) {
            button.click();
        }
    });
})();
