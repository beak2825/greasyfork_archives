// ==UserScript==
// @name         Scorebing live url
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Přesměruje url na "match_live".
// @author       Martin Kaprál
// @match        https://www.scorebing.com/match/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=scorebing.com
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/469241/Scorebing%20live%20url.user.js
// @updateURL https://update.greasyfork.org/scripts/469241/Scorebing%20live%20url.meta.js
// ==/UserScript==

(function() {
    'use strict';
const newUrl = location.href.replace("match", "match_live");

    location.href = newUrl

})();