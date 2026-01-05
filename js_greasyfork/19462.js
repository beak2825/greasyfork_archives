// ==UserScript==
// @name         Achievement Filter
// @namespace    pxgamer
// @version      0.7
// @description  Filter cheevos on the cheevo page.
// @author       pxgamer
// @include      *kat.cr/achievements/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/19462/Achievement%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/19462/Achievement%20Filter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var year = new Date().getFullYear();

    var assigned   = $('table.achTable tbody tr td.width100perc ul li span.achBadge.assignedAchievement').length;
    var unassigned = $('table.achTable tbody tr td.width100perc ul li span.achBadge').length - assigned;

    $('table.achTable').before('<div style="margin-bottom: 5px;"><span class="showAllCheevos kaButton smallButton normalText">Show All</span> <span class="showOnlyCollected kaButton smallButton normalText">Show Only Achieved ('+assigned+')</span> <span class="showNonCollected kaButton smallButton normalText">Show Non-Collected Achievements ('+unassigned+')</span> <span class="showCurrentCheevos kaButton smallButton normalText">Show Current Achievements</span></div><hr>');

    // Only show achievements you've already got
    $('.showOnlyCollected').on('click', function() {
        $('table.achTable tbody tr td.width100perc ul li').each(function() {
            $(this).show();
        });
        $('table.achTable tbody tr td.width100perc ul li span.achBadge').each(function() {
            if (!$(this).hasClass('assignedAchievement')) {
                $(this).parent().hide();
            }
        });
    });

    // Only show achievements you haven't got
    $('.showNonCollected').on('click', function() {
        $('table.achTable tbody tr td.width100perc ul li').each(function() {
            $(this).show();
        });
        $('table.achTable tbody tr td.width100perc ul li span.achBadge').each(function() {
            if ($(this).hasClass('assignedAchievement')) {
                $(this).parent().hide();
            }
        });
    });

    // Only current achievements
    $('.showCurrentCheevos').on('click', function() {
        $('table.achTable tbody tr td.width100perc ul li').each(function() {
            $(this).show();
        });
        $('table.achTable tbody tr td.width100perc ul li span.achBadge').each(function() {
            if (!$(this).hasClass('assignedAchievement') && $(this).children('a').children('span.achTitle').text().substring(0, 4) < year) {
                $(this).parent().hide();
            }
            if (!$(this).hasClass('assignedAchievement') && $(this).children('a').children('span.achTitle').text().substring($(this).children('a').children('span.achTitle').text().length - 4) < year) {
                $(this).parent().hide();
            }
        });
    });

    // Show all cheevos (reset)
    $('.showAllCheevos').on('click', function() {
        $('table.achTable tbody tr td.width100perc ul li').each(function() {
            $(this).show();
        });
    });
})();
