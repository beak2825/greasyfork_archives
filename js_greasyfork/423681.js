// ==UserScript==
// @name         Auto Wrap Up
// @namespace    https://greasyfork.org/en/users/749682-catfather
// @version      1.1
// @description  Automatically enter wrap up mode and press enter on review screen to start another review session
// @author       catfather
// @include      https://www.wanikani.com/review*
// @icon         https://www.google.com/s2/favicons?domain=wanikani.com
// @downloadURL https://update.greasyfork.org/scripts/423681/Auto%20Wrap%20Up.user.js
// @updateURL https://update.greasyfork.org/scripts/423681/Auto%20Wrap%20Up.meta.js
// ==/UserScript==

(function() {
    'use strict';
    if (window.location.pathname === '/review') {
        document.querySelector('#start-session a').focus();
    } else if (window.location.pathname === '/review/session') {
        document.querySelector('#option-wrap-up').click();
    }
})();