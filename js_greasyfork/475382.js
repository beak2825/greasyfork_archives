// ==UserScript==
// @name         Pawoo flex columns
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Make Pawoo columns expand to fit the page width.
// @author       Cro
// @match        https://pawoo.net/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=pawoo.net
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/475382/Pawoo%20flex%20columns.user.js
// @updateURL https://update.greasyfork.org/scripts/475382/Pawoo%20flex%20columns.meta.js
// ==/UserScript==

(function() {
    'use strict';
    GM_addStyle('.column { flex: 1 }');
})();