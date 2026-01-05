// ==UserScript==
// @name         GSK LLC
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  automatically set all dropdowns to no.
// @author       pyro
// @require      http://code.jquery.com/jquery-2.1.4.min.js
// @include      *www.mturkcontent.com*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/25586/GSK%20LLC.user.js
// @updateURL https://update.greasyfork.org/scripts/25586/GSK%20LLC.meta.js
// ==/UserScript==

(function() {
    'use strict';
    if ($("p:contains('Please answer the following questions based on the post shown. Each post should take about 1-3 minutes.')").length) {
        console.log("GSK LLC");
        $('select').val('0');
    }
})();