// ==UserScript==
// @name         Kickass Torrents (thekat.app) Link Replacer
// @namespace    https://greasyfork.org/en/users/814-bunta
// @version      0.1
// @description  Replace mylink links with actual download URLs
// @author       Bunta
// @match        https://thekat.app/*
// @license      http://creativecommons.org/licenses/by-nc-sa/3.0/us/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/408853/Kickass%20Torrents%20%28thekatapp%29%20Link%20Replacer.user.js
// @updateURL https://update.greasyfork.org/scripts/408853/Kickass%20Torrents%20%28thekatapp%29%20Link%20Replacer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    $('a').attr('href', function(n, old) { if (old) return unescape(old.replace(/https?:\/\/mylink\.cx\/\?url=/i, "")) });
})();