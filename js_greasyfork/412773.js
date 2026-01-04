// ==UserScript==
// @name         Facebook Resize Story Nav
// @namespace    https://greasyfork.org/en/users/162009-delmain
// @author       delmain
// @version      0.1.0
// @description  Resize the nav on FB Story view for vertical monitors
// @match        *://*.facebook.com/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/412773/Facebook%20Resize%20Story%20Nav.user.js
// @updateURL https://update.greasyfork.org/scripts/412773/Facebook%20Resize%20Story%20Nav.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle('#viewer_dialog > .o36gj0jk  { width: 100px !important; }');
    console.log('Added Nav CSS');
})();