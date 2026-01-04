// ==UserScript==
// @name         Bypass LiveJournal External Link Warning
// @namespace    https://github.com/dear-clouds/mio-userscripts
// @version      1.0
// @description  Automatically bypass LiveJournal's external link warning page
// @author       Mio.
// @supportURL   https://github.com/dear-clouds/mio-userscripts/issues
// @icon         https://www.google.com/s2/favicons?sz=64&domain=livejournal.com
// @license      GPL-3.0
// @match        *://*.livejournal.com/away?to=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/508373/Bypass%20LiveJournal%20External%20Link%20Warning.user.js
// @updateURL https://update.greasyfork.org/scripts/508373/Bypass%20LiveJournal%20External%20Link%20Warning.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var urlParams = new URLSearchParams(window.location.search);
    var redirectUrl = urlParams.get('to');

    if (redirectUrl) {
        window.location.href = decodeURIComponent(redirectUrl);
    }
})();
