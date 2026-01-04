// ==UserScript==
// @license GPL-2.0-only
// @name         Refresh Frontpad
// @version      0.3
// @description  Avoids timeout by refreshing the page every 1 minutes
// @author       A V
// @include     /^https?://\.frontpad\.ru*$/
// @include     https://app.frontpad.ru/complect/
// @include     app.frontpad.ru/complect/
// @grant        none
// @namespace 
// @downloadURL https://update.greasyfork.org/scripts/411365/Refresh%20Frontpad.user.js
// @updateURL https://update.greasyfork.org/scripts/411365/Refresh%20Frontpad.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const refreshMins = 1;
    const interval = refreshMins * 30 * 1000;
    setInterval(() => {
      document.querySelector('#menu_update').click();

    }, interval);
}
)();
