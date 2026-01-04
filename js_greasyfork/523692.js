// ==UserScript==
// @name         ShareMods Bypasser
// @namespace    https://sharemods.com/
// @version      2024-09-25
// @description  Bypass ShareMod lLinks
// @author       chunkbanned
// @match        https://sharemods.com/*/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/523692/ShareMods%20Bypasser.user.js
// @updateURL https://update.greasyfork.org/scripts/523692/ShareMods%20Bypasser.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const form = document.getElementsByName("F1")[0]
    if (form) form.submit();
})();