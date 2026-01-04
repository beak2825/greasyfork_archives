// ==UserScript==
// @name         Google Sheets Call.CtrlQ.org redirect autoclose
// @namespace    http://tampermonkey.net/
// @version      2024-08-24
// @description  Closes the google redirect for call.ctrlq.org links
// @author       You
// @match        https://www.google.com/url?q=https://call.ctrlq.org/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @grant        window.close
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/504287/Google%20Sheets%20CallCtrlQorg%20redirect%20autoclose.user.js
// @updateURL https://update.greasyfork.org/scripts/504287/Google%20Sheets%20CallCtrlQorg%20redirect%20autoclose.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Wait for 1 seconds (1000 milliseconds) and then close the window
    setTimeout(function() {
        window.close();
    }, 1000);
})();