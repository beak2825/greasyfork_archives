// ==UserScript==
// @name         Untappd print version
// @namespace    http://tampermonkey.net/
// @version      2025-08-19
// @description  Untappd fancy print version
// @author       You
// @match        *://*.untappd.com/user/*
// @match        *://untappd.com/user/*
// @require      https://code.jquery.com/jquery-latest.js
// @icon         https://www.google.com/s2/favicons?sz=64&domain=untappd.com
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/546446/Untappd%20print%20version.user.js
// @updateURL https://update.greasyfork.org/scripts/546446/Untappd%20print%20version.meta.js
// ==/UserScript==

(function() {
// @require      https://cdnjs.cloudflare.com/ajax/libs/cash/8.1.5/cash.min.js
    'use strict';

$('body').append(`<style>
@media print {
header {display:none !important;}

#slide { padding-top: 0;}

.top-header {display:none !important;}
.menu-filter-options {display:none !important;}
.menu-search-bar {display:none !important;}
.sidebar { display: none !important;}
.main { padding-right: 0 !important;}
.list-container-area .list-item {display: block !important; page-break-inside: avoid !important;page-break-after:always !important;}
.show-more-info { display: none !important;}
.caps {display: inline-flex;}
.actions { display: none !important;}
.caps .cap {-webkit-print-color-adjust: exact !important;}
footer {display:none !important;}


  .print-friendly tr { page-break-inside: avoid !important; }

}
</style>`);

})();