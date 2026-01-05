// ==UserScript==
// @name         Firehose page title fixer
// @description    Replace Firehose page/tab title with heading from page content
// @namespace    http://tampermonkey.net/
// @version      0.1
// @author       Devin McCabe
// @match        *://firehose*:8080/*
// @match        *://firehose.broadinstitute.org:8080/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/23424/Firehose%20page%20title%20fixer.user.js
// @updateURL https://update.greasyfork.org/scripts/23424/Firehose%20page%20title%20fixer.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.title = document.getElementsByTagName('h2')[0].innerHTML;
})();