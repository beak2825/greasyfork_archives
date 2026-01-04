// ==UserScript==
// @name         Override documents hasFocus
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  Simple script to trick document to focus even if document is in background
// @author       Neeraj Khandelwal
// @match        *://*/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/458266/Override%20documents%20hasFocus.user.js
// @updateURL https://update.greasyfork.org/scripts/458266/Override%20documents%20hasFocus.meta.js
// ==/UserScript==

(function() {
    'use strict';

    setTimeout(() => {
        window.in_focus = 1;
        document.hasFocus = () => true;
    }, 500);
})();