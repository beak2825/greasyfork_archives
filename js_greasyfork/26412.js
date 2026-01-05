// ==UserScript==
//
// @name         RED/Apollo Hide Filled on Request
// @version      0.2
// @description  Hide filled requests on the request page.
// @author       kjung
// @include      http*://*apollo.rip/*
// @include      http*://*redacted.ch/*
// @grant        none
// @namespace https://greasyfork.org/en/users/6863
// @downloadURL https://update.greasyfork.org/scripts/26412/REDApollo%20Hide%20Filled%20on%20Request.user.js
// @updateURL https://update.greasyfork.org/scripts/26412/REDApollo%20Hide%20Filled%20on%20Request.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function getRequestUrl() {
        var hostname = window.location.hostname;

        var requestUrl = 'requests.php?submit=true&search=&tags=&tags_type=1&releases%5B%5D=1&releases%5B%5D=3&releases%5B%5D=5&releases%5B%5D=6&releases%5B%5D=7&releases%5B%5D=9&releases%5B%5D=11&releases%5B%5D=13&releases%5B%5D=14&releases%5B%5D=15&releases%5B%5D=16&releases%5B%5D=17&releases%5B%5D=18&releases%5B%5D=19&releases%5B%5D=21&formats%5B%5D=0&formats%5B%5D=1&formats%5B%5D=2&formats%5B%5D=3&formats%5B%5D=4&bitrates%5B%5D=0&bitrates%5B%5D=1&bitrates%5B%5D=2&bitrates%5B%5D=3&bitrates%5B%5D=4&bitrates%5B%5D=5&bitrates%5B%5D=6&bitrates%5B%5D=7&bitrates%5B%5D=8&bitrates%5B%5D=9&bitrates%5B%5D=10&media%5B%5D=0&media%5B%5D=1&media%5B%5D=2&media%5B%5D=3&media%5B%5D=4&media%5B%5D=5&media%5B%5D=6&media%5B%5D=7&media%5B%5D=8';

        if (hostname === 'apollo.rip') {
            requestUrl = 'requests.php?submit=true&search=&tags=&tags_type=1&releases%5B%5D=1&releases%5B%5D=3&releases%5B%5D=5&releases%5B%5D=6&releases%5B%5D=7&releases%5B%5D=9&releases%5B%5D=11&releases%5B%5D=13&releases%5B%5D=14&releases%5B%5D=15&releases%5B%5D=16&releases%5B%5D=21&formats%5B%5D=0&formats%5B%5D=1&formats%5B%5D=2&formats%5B%5D=3&formats%5B%5D=4&formats%5B%5D=5&bitrates%5B%5D=0&bitrates%5B%5D=1&bitrates%5B%5D=2&bitrates%5B%5D=3&bitrates%5B%5D=4&bitrates%5B%5D=5&bitrates%5B%5D=6&bitrates%5B%5D=7&bitrates%5B%5D=8&bitrates%5B%5D=9&bitrates%5B%5D=10&bitrates%5B%5D=11&media%5B%5D=0&media%5B%5D=1&media%5B%5D=2&media%5B%5D=3&media%5B%5D=4&media%5B%5D=5&media%5B%5D=6&media%5B%5D=7&media%5B%5D=8';
        }

        return requestUrl;
    }

    var request = document.getElementById('nav_requests');
    var requestAnchor = request.querySelector("a");
    requestAnchor.href = getRequestUrl();
})();
