// ==UserScript==
// @name         wiki.gg viewport fix
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Fix wiki.gg cancerous layout warped by ads
// @author       Vladik Sosnychev, erosman@stackoverflow
// @match        http*://*.wiki.gg/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=wiki.gg
// @grant        GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/536569/wikigg%20viewport%20fix.user.js
// @updateURL https://update.greasyfork.org/scripts/536569/wikigg%20viewport%20fix.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const css = `
aside {
  display: none !important;
}`;
GM_addStyle(css);
})();