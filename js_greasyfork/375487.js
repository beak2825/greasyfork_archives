// ==UserScript==
// @name         Youtrack improvements
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Add sum to Chart view tooltips
// @author       njd
// @match        https://issuetracker.getprintbox.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/375487/Youtrack%20improvements.user.js
// @updateURL https://update.greasyfork.org/scripts/375487/Youtrack%20improvements.meta.js
// ==/UserScript==

(function($) {
    'use strict';


    setInterval(function() {
        let sum = 0;
        let rows = $('.nvtooltip .value');
        if (rows.length === 0) {
            return;
        }

        rows.each(function(i, e) {
            sum += parseInt($(e).html());
        })

        let parent = $('.value').closest('tbody')
        if (parent.find('.tooltip-sum').length === 0) {
            parent.append(`
<tr><hr></tr>
<tr class="nv-pointer-events-none tooltip-sum">
    <td class="legend-color-guide nv-pointer-events-none" style="border-top: 1px solid rgba(0,0,0,0.16)">
        <div style="background-color: rgba(0, 0, 0. 0);" class="nv-pointer-events-none">
        </div>
    </td>
    <td class="key nv-pointer-events-none" style="border-top: 1px solid rgba(0,0,0,0.16)">Sum</td>
    <td class="value nv-pointer-events-none" style="border-top: 1px solid rgba(0,0,0,0.16)">${sum}</td>
</tr>
            `);
        }

    }, 320);
})($);