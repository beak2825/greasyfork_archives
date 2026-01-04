// ==UserScript==
// @name         put.hk post filter
// @namespace    
// @version      0.21
// @description  simple post filter on put.hk
// @author       twonilcdrom
// @match        *://put.hk/headline/*
// @grant        none
// @require      http://code.jquery.com/jquery-3.3.1.slim.min.js
// @downloadURL https://update.greasyfork.org/scripts/38768/puthk%20post%20filter.user.js
// @updateURL https://update.greasyfork.org/scripts/38768/puthk%20post%20filter.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var showDummyHeader = false;
    var blockedIds = ['爆黃屍狗', '米', 'LKK', 'mktgp'];
    $('table tr td:nth-child(3) a nobr').each(function() {
        if (blockedIds.includes(this.innerHTML)) {
            if (showDummyHeader) {
                $(this).parents('tr').before('<tr><td colspan="10" style="color: #ccc;"> - post filtered - </td></tr>');
            }
            $(this).parents('tr').remove();
        }
    });
})();