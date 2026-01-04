// ==UserScript==
// @name         Adult:Bngcms
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Auto click nag screen "I'm 18"
// @author       NoobAlert
// @match        https://*.bongacams.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bongacams.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/447993/Adult%3ABngcms.user.js
// @updateURL https://update.greasyfork.org/scripts/447993/Adult%3ABngcms.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    document.getElementsByClassName('mls_btn bt30_green agree wl_green_btn js-close_warning')[0].click();
})();