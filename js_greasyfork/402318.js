// ==UserScript==
// @name         Fix hrnest
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       mrstolarsky
// @match        https://hrnest.io/Account/ChangePassword
// @grant        none
// @run-at     document-start
// @downloadURL https://update.greasyfork.org/scripts/402318/Fix%20hrnest.user.js
// @updateURL https://update.greasyfork.org/scripts/402318/Fix%20hrnest.meta.js
// ==/UserScript==

(function() {
    'use strict';
    if (location.href == "https://hrnest.io/Account/ChangePassword") {
        location.replace("https://hrnest.io/start");
    };
})();