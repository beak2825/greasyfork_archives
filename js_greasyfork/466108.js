// ==UserScript==
// @name         Eruda Console Injector
// @namespace    https://venderbad.github.io
// @version      0.0.3
// @description  A script to enable eruda console on any site
// @author       Venderbad
// @match        *://*/*
// @grant        GM_addElement
// @run-at       document-body
// @license      WTFPL
// @downloadURL https://update.greasyfork.org/scripts/466108/Eruda%20Console%20Injector.user.js
// @updateURL https://update.greasyfork.org/scripts/466108/Eruda%20Console%20Injector.meta.js
// ==/UserScript==

(function () {
    if (!/eruda=true/.test(window.location) && localStorage.getItem('active-eruda') != 'true') return;

    GM_addElement('script', {
        src: "https://cdn.jsdelivr.net/npm/eruda",
    }).onload = () => eruda.init();
})();
