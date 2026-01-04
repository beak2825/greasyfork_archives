// ==UserScript==
// @name         Bunker Domain Redirect
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Redirects bunker.** domains to bunker.ws
// @author       Your Name
// @match        *://*/*
// @grant        none
// @run-at       document-start
// @license n
// @downloadURL https://update.greasyfork.org/scripts/525976/Bunker%20Domain%20Redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/525976/Bunker%20Domain%20Redirect.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    const oldHost = window.location.hostname;
    const newDomain = 'bunker.ws';
    
    // Регулярное выражение для определения bunker.**
    const bunkerPattern = /^bunker\.[a-z]{2,}$/i;
    
    if (bunkerPattern.test(oldHost) && oldHost !== newDomain) {
        const newURL = new URL(window.location.href);
        newURL.hostname = newDomain;
        window.location.replace(newURL.href);
    }
})();