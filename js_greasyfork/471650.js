// ==UserScript==
// @name         Use old Twitter favicon
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Reverts the new X icon to the old blue bird icon
// @author       vipirius
// @match        https://twitter.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/471650/Use%20old%20Twitter%20favicon.user.js
// @updateURL https://update.greasyfork.org/scripts/471650/Use%20old%20Twitter%20favicon.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.querySelector('link[rel~="icon"]').href="https://abs.twimg.com/favicons/favicon.ico"
})();