// ==UserScript==
// @name         Windows 10 Search Redirector
// @namespace    https://davidjb.online/
// @version      0.1.0
// @description  Redirect searches from the Windows 10 Start menu to Google
// @author       David Bailey
// @match        https://www.bing.com/search?*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/40225/Windows%2010%20Search%20Redirector.user.js
// @updateURL https://update.greasyfork.org/scripts/40225/Windows%2010%20Search%20Redirector.meta.js
// ==/UserScript==

if (location.search.match(/&form=WNS[A-Z]{3}&/)) {
    location.href = `https://www.google.com/search${location.search}`;
}