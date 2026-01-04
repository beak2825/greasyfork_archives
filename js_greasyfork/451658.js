// ==UserScript==
// @name         Auto-file Qrgateway
// @icon         https://icons.duckduckgo.com/ip2/es.qrgateway.com.ico
// @version      0.1
// @namespace    https://greasyfork.org/users/592063
// @description  Auto-file para Qrgateway.
// @author       wuniversales
// @license      MIT
// @match        https://*.qrgateway.com/qr-code-scanner
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/451658/Auto-file%20Qrgateway.user.js
// @updateURL https://update.greasyfork.org/scripts/451658/Auto-file%20Qrgateway.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
    window.addEventListener("load", function(){
        document.body.querySelector('input#switcher-1').click();
    });
})();