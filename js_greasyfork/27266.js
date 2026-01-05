// ==UserScript==
// @name         Return Github Light
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Make Header Light
// @author       Bestony
// @match        https://*.github.com/
// @match        https://github.com/*

// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/27266/Return%20Github%20Light.user.js
// @updateURL https://update.greasyfork.org/scripts/27266/Return%20Github%20Light.meta.js
// ==/UserScript==
document.querySelector('.header').classList.remove('header-dark');