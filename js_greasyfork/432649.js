// ==UserScript==
// @name         Google Search
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Google Search Set
// @author       You
// @include        *
// @run-at          context-menu
// @downloadURL https://update.greasyfork.org/scripts/432649/Google%20Search.user.js
// @updateURL https://update.greasyfork.org/scripts/432649/Google%20Search.meta.js
// ==/UserScript==

(function() {
    'use strict';
let link=`https://www.google.com/search?q=`;
    const event = new Event('cliplink');
    event.data={link};
    document.dispatchEvent(event);
})();