// ==UserScript==
// @name         0bin.net auto-select never expire
// @namespace    https://github.com/Alistair1231/my-userscripts/
// @version      0.1.3
// @description  auto selects never expire when making a paste
// @author       Alistair1231
// @match        https://0bin.net/
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/425786/0binnet%20auto-select%20never%20expire.user.js
// @updateURL https://update.greasyfork.org/scripts/425786/0binnet%20auto-select%20never%20expire.meta.js
// ==/UserScript==


(function() {
    'use strict';
    document.getElementById("expiration").value="never";
    // Your code here...
})();