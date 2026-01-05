// ==UserScript==
// @name         Brazzers Additions
// @description  Some additions for Brazzers website.
// @namespace    https://www.pierreyves.io/
// @version      1.1
// @author       Pierre-Yves Lebecq
// @license      MIT
// @match        https://ma.brazzers.com/*
// @grant        none
// @require      http://code.jquery.com/jquery-2.0.3.min.js
// @downloadURL https://update.greasyfork.org/scripts/16271/Brazzers%20Additions.user.js
// @updateURL https://update.greasyfork.org/scripts/16271/Brazzers%20Additions.meta.js
// ==/UserScript==

var _$ = jQuery.noConflict(true);

(function ($) {
    var $pagination = $('#container .section-release-card + nav');
    if ($pagination.length > 0) {
        var $clonedPagination = $pagination.clone();
        $('.section-release-card').before($clonedPagination);
    }
})(_$);
