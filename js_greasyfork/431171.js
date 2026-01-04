// ==UserScript==
// @name         Dark Mode
// @version      0.1
// @description  Enable Dark Mode for all websites
// @author       RaghavP
// @match        *://*/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @namespace https://greasyfork.org/users/807263
// @downloadURL https://update.greasyfork.org/scripts/431171/Dark%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/431171/Dark%20Mode.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.onload = function() {
        //invert the filter
        document.querySelector('html').style.filter = 'invert(1)';
    };
})();