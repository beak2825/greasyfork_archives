// ==UserScript==
// @name         No Forced Steam Language
// @namespace    https://jakooob.dev/
// @homepage     https://jakooob.dev/
// @version      1.0.0
// @description  Removes any forced language settings from Steam URLs in search engines
// @author       Jakooob
// @license      MIT
// @match        https://*.steamcommunity.com/*?l=*
// @match        https://*.steampowered.com/*?l=*
// @icon         https://steamcommunity.com/favicon.ico
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/502011/No%20Forced%20Steam%20Language.user.js
// @updateURL https://update.greasyfork.org/scripts/502011/No%20Forced%20Steam%20Language.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const url = document.URL;
    const reg = new RegExp("\\?l=.*/|\\?l=.*");

    const matchedUrl = url.replace(reg, "");

    window.location.replace(matchedUrl);
})();