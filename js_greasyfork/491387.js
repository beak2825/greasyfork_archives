// ==UserScript==
// @name         GC - Happy Valley Ice Cream Dropdown Selector
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Auto selects default values for Happy Valley Ice Cream dropdowns
// @author       Teffy
// @match        https://www.grundos.cafe/winter/icecream/
// @match        http://grundos.cafe/winter/icecream/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=grundos.cafe
// @grant        none
// @license      MIT
// @grant        none
// @downloadURL
// @updateURL
// @downloadURL https://update.greasyfork.org/scripts/491387/GC%20-%20Happy%20Valley%20Ice%20Cream%20Dropdown%20Selector.user.js
// @updateURL https://update.greasyfork.org/scripts/491387/GC%20-%20Happy%20Valley%20Ice%20Cream%20Dropdown%20Selector.meta.js
// ==/UserScript==

(function() {
    'use strict';

    $(document).ready(function() {
        $('[name="coupon"]').val($('[name="coupon"] option:not([hidden]):first').val()); // first dropdown option
        $('[name="flavor"]').val('1'); // Vanilla
        $('[name="spins"]').val('5'); // 44
    });
})();