// ==UserScript==
// @name         CSP - Upgrade Insecure Requests
// @namespace    r-a-y/csp/upgrade-insecure-requests
// @version      1.0.0
// @description  Tries to upgrade HTTP assets to HTTPS using CSP
// @author       r-a-y
// @match        https://*/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/415210/CSP%20-%20Upgrade%20Insecure%20Requests.user.js
// @updateURL https://update.greasyfork.org/scripts/415210/CSP%20-%20Upgrade%20Insecure%20Requests.meta.js
// ==/UserScript==

var csp = document.createElement("meta");
csp.setAttribute("http-equiv", "Content-Security-Policy")
csp.setAttribute("content", "upgrade-insecure-requests")
document.head.appendChild(csp);