// ==UserScript==
// @name         Book Hall
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  adds context menu button
// @license      MIT
// @author       Me
// @match        http://*/*
// @include      *
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_openInTab
// @run-at       context-menu
// @downloadURL https://update.greasyfork.org/scripts/445176/Book%20Hall.user.js
// @updateURL https://update.greasyfork.org/scripts/445176/Book%20Hall.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_openInTab("https://topup.chch.ox.ac.uk/BlockBook.aspx?autobook=informal");

})();