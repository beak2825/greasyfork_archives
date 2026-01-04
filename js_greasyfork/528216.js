// ==UserScript==
// @name          Google - AI Free Search
// @description   Adds '&udm=14' parameter to Google URLs
// @author        TheRealHawk
// @license       MIT
// @namespace     https://greasyfork.org/en/users/18936-therealhawk
// @include       https://www.google.tld/search*
// @version       1.1
// @downloadURL https://update.greasyfork.org/scripts/528216/Google%20-%20AI%20Free%20Search.user.js
// @updateURL https://update.greasyfork.org/scripts/528216/Google%20-%20AI%20Free%20Search.meta.js
// ==/UserScript==

(function() {
    'use strict';
 
    const url = new URL(window.location.href);
    const udmParam = url.searchParams.get('udm');
    if (udmParam === null) {
        url.searchParams.append('udm', '14');
        window.location.replace(url.href);
    } else if (udmParam !== '2' && udmParam !== '14') {
        url.searchParams.set('udm', '14');
        window.location.replace(url.href);
    }
})();
