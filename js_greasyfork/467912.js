// ==UserScript==
// @name         [AO3-PAC] No New Zoho
// @author       lydia-theda
// @version      1.0
// @description  redirects old-old and new-Zoho links to old Zoho
// @match        https://*.zoho.com/*
// @namespace    http://tampermonkey.net/
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/467912/%5BAO3-PAC%5D%20No%20New%20Zoho.user.js
// @updateURL https://update.greasyfork.org/scripts/467912/%5BAO3-PAC%5D%20No%20New%20Zoho.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if (window.location.pathname.includes('ao3abuse')) {
        window.location = window.location.href.replace('ao3abuse', 'otwao3')
    }
    if (window.location.pathname.startsWith('/agent')) {
        window.location = "https://desk.zoho.com/support/otwao3/ShowHomePage.do#Cases/dv/" + window.location.pathname.split('details/')[1]
    }

})();