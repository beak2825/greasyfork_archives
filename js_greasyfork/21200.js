// ==UserScript==
// @name         Storeparser Pagination
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Copy the pagination controls to the bottom of the page as well
// @author       AJ
// @match        http://www.storeparser.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/21200/Storeparser%20Pagination.user.js
// @updateURL https://update.greasyfork.org/scripts/21200/Storeparser%20Pagination.meta.js
// ==/UserScript==

(function() {
    $('#sp_control_bar_container').clone(true).appendTo('#sp_products_container');
})();