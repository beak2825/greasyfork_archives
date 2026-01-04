// ==UserScript==
// @name         Lofter origin
// @namespace    http://lf127.net/
// @version      0.1
// @description  Redirect to origin version without watermark when opening images in Lofter.
// @author       @cnbeining
// @match        https://*.lf127.net/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=lf127.net
// @grant        none
// @license      WTFPL
// @downloadURL https://update.greasyfork.org/scripts/449901/Lofter%20origin.user.js
// @updateURL https://update.greasyfork.org/scripts/449901/Lofter%20origin.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    var url_href = window.location.href;
    const url = new URL(url_href);
    if (url.search.length > 5) {
        var new_url = 'https://' + url.host + url.pathname;
        window.location.href = new_url;
    };
})();