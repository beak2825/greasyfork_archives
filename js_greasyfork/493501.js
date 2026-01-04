// ==UserScript==
// @name         GC - Scratchcards Dropdown Selector
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Auto selects the scratchcard option for you
// @author       Teffy
// @match        https://www.grundos.cafe/*/kiosk/
// @match        https://grundos.cafe/*/kiosk/
// @match        https://www.grundos.cafe/*/purchase-scratchcard/
// @match        https://grundos.cafe/*/purchase-scratchcard/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=grundos.cafe
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/493501/GC%20-%20Scratchcards%20Dropdown%20Selector.user.js
// @updateURL https://update.greasyfork.org/scripts/493501/GC%20-%20Scratchcards%20Dropdown%20Selector.meta.js
// ==/UserScript==

(function() {
    'use strict';

    $(document).ready(function() {
        $('form select[name="card"]').each(function() {
            $(this).val($(this).find('option:not([hidden]):eq(0)').val());
        });
    });
})();