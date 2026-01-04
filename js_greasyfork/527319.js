// ==UserScript==
// @name         Bypass Kariyer.net Signup Warning
// @namespace    Violentmonkey Scripts
// @run-at       document-start
// @author       fr0stb1rd
// @noframes
// @version      1.1
// @match        https://www.kariyer.net/*
// @description  Removes the jobviewcount cookie on Kariyer.net to bypass job view limits
// @license      GPL-3.0
// @homepageURL  https://gitlab.com/fr0stb1rd/bypass-kariyer-net-signup-warning
// @supportURL   https://gitlab.com/fr0stb1rd/bypass-kariyer-net-signup-warning/-/issues
// @downloadURL https://update.greasyfork.org/scripts/527319/Bypass%20Kariyernet%20Signup%20Warning.user.js
// @updateURL https://update.greasyfork.org/scripts/527319/Bypass%20Kariyernet%20Signup%20Warning.meta.js
// ==/UserScript==
    
(function() {
    // Mevcut çerezi sil
    document.cookie = "jobviewcount=; path=/; domain=kariyer.net;";
})();