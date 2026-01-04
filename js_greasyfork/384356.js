// ==UserScript==
// @name         v2ex ad
// @namespace    mtgnorton
// @version      0.1
// @description  remove v2ex ad
// @author       mtgnorton
// @grant        none
// @include       https://www.v2ex.com/*
// @downloadURL https://update.greasyfork.org/scripts/384356/v2ex%20ad.user.js
// @updateURL https://update.greasyfork.org/scripts/384356/v2ex%20ad.meta.js
// ==/UserScript==

// @require  https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js
(function() {
    'use strict';

    $('.sidebar_compliance').parent().remove()
    // Your code here...
})();