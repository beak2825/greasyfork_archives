// ==UserScript==
// @name         @@张大妈看值率
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  桌面web端张大妈显示值率
// @author       You
// @match        *://search.smzdm.com/*
// @require https://cdn.staticfile.org/jquery/1.12.2/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/373787/%40%40%E5%BC%A0%E5%A4%A7%E5%A6%88%E7%9C%8B%E5%80%BC%E7%8E%87.user.js
// @updateURL https://update.greasyfork.org/scripts/373787/%40%40%E5%BC%A0%E5%A4%A7%E5%A6%88%E7%9C%8B%E5%80%BC%E7%8E%87.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    var $listItems = $('#feed-main-list .feed-row-wide');
    $.each($listItems, function (i, item) {
        var zhi = $(item).find('[data-zhi-type="1"]').text();
        var buzhi = $(item).find('[data-zhi-type="-1"]').text() || 0;
        var result = 0;
        if (parseInt(buzhi) === 0) {
            if (parseInt(zhi) !== 0) result = 1;
        } else {
            result = parseInt(zhi) / (parseInt(zhi) + parseInt(buzhi));
        }

        var percent = parseFloat(result*100).toFixed(0);
        var className = percent > 49 ? 'z-highlight' : ''
        $(item).find('.price-btn-hover').prepend(`<span class="${className}" style="margin-right:20px">${percent}%</span>`);
    });
})();
