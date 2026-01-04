// ==UserScript==
// @name         AO3: [Wrangling] Snooze Buttons
// @description  Add snooze buttons for wrangling page
// @version      0.2

// @author       endofthyme
// @namespace    http://tampermonkey.net/
// @license      GPL-3.0 <https://www.gnu.org/licenses/gpl.html>

// @require      https://ajax.googleapis.com/ajax/libs/jquery/1.9.0/jquery.min.js
// @match        *archiveofourown.org/tag_wranglers/*
// @grant	 GM.getValue
// @grant	 GM.setValue
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/432628/AO3%3A%20%5BWrangling%5D%20Snooze%20Buttons.user.js
// @updateURL https://update.greasyfork.org/scripts/432628/AO3%3A%20%5BWrangling%5D%20Snooze%20Buttons.meta.js
// ==/UserScript==

var DEFAULT_DAYS_TO_SNOOZE = 7;
var CUSTOM_SNOOZE_TIMES = [
    ['Megafandom Name', 1],
    ['Fandom That Gets A Ton Of Crossover Draft Tags That Are Never For That Fandom', 14],
];

// 1: hide snoozed, 2: hide unsnoozed, 3: show all fandoms
var DEFAULT_BUTTON_OPTION = 1;

(function($) {

    var saved_date_map = GM_getValue('saved_date_map', '{}');
    saved_date_map = saved_date_map == '{}' ? new Map() : new Map(JSON.parse(saved_date_map));
    var today = new Date();

    // add Snooze column header
    $('thead tr th:contains("Fandom")').after('<th rowspan="2" scope="col">Snooze</th>');

    $('div.tag_wranglers-show.dashboard #user-page table tbody tr').each(function(index) {

        // Check if the fandom's been snoozed.
        var fandom_name = $(this).find('th a').text();
        if (saved_date_map.has(fandom_name) && new Date(saved_date_map.get(fandom_name)) > today) {
            $(this).addClass('snoozed');
        } else {
            $(this).addClass('unsnoozed');
        }

        // Check how long the fandom should be snoozed if snooze button is pressed.
        var snooze_length = DEFAULT_DAYS_TO_SNOOZE;
        for (var element of CUSTOM_SNOOZE_TIMES) {
            if (fandom_name.includes(element[0])) {
                snooze_length = element[1];
            }
        }

        // Add snooze button to each fandom.
        var snooze_button = $('<a></a>').html('[Snooze]');
        snooze_button.click(function() {
            addSnooze(fandom_name, snooze_length);
        });
        var titles = $(this).find('th[title="fandom"]').after(snooze_button);
    });
    var toggle_p = $('<p></p>').html('Show:&nbsp;&nbsp;');
    setUpToggleMenu();

    var style = $('<style type="text/css"></style>').appendTo($('head'));
    addCss(DEFAULT_BUTTON_OPTION);

    function setUpToggleMenu() {
        var only_unsnoozed_fandoms = $('<a style="font-weight: bold"></a>').html('[ unsnoozed ]');
        var only_snoozed_fandoms = $('<a></a>').html('[ snoozed ]');
        var all_fandoms = $('<a></a>').html('[ snoozed + unsnoozed ]');
        var clear_snoozes = $('<a></a>').html('[ clear all snoozes ]');

        only_unsnoozed_fandoms.click(() => onSnoozeSelection(only_unsnoozed_fandoms, 1));
        only_snoozed_fandoms.click(() => onSnoozeSelection(only_snoozed_fandoms, 2));
        all_fandoms.click(() => onSnoozeSelection(all_fandoms, 3));

        clear_snoozes.click(function() {
            saved_date_map = new Map();
            GM_setValue('saved_date_map', '{}');

            // Set all rows to unsnoozed on click.
            $('div.tag_wranglers-show.dashboard #user-page table tbody tr').each(function(index) {
                $(this).removeClass('snoozed').addClass('unsnoozed');
            });
        });

        toggle_p.append(only_unsnoozed_fandoms, '&nbsp;&nbsp;', only_snoozed_fandoms, '&nbsp;&nbsp;',
                        all_fandoms, '&nbsp;&nbsp;-&nbsp;&nbsp;', clear_snoozes);

        $('#user-page table').before(toggle_p);
    }

    function addSnooze(fandom_name, days) {
        var snoozedDate = new Date();
        snoozedDate.setDate(snoozedDate.getDate() + days);
        saved_date_map.set(fandom_name, snoozedDate);
        GM_setValue('saved_date_map', JSON.stringify(Array.from(saved_date_map.entries())));
        console.log(fandom_name + ' snoozed to ' + snoozedDate);

        // Disappear the snoozed row.
        $('div.tag_wranglers-show.dashboard #user-page table tbody tr').each(function(index) {
            if ($(this).find('th a:contains(' + fandom_name +')').text() == fandom_name) {
                $(this).removeClass('unsnoozed').addClass('snoozed');
            }
        });
    }

    function onSnoozeSelection(button, css_option) {
        addCss(css_option);
        toggle_p.find('a').css('font-weight', 'normal');
        button.css('font-weight', 'bold');
    }

    // 1: hide snoozed, 2: hide unsnoozed, 3: show all fandoms
    function addCss(option) {
        var css_unsnoozed = '.snoozed {display: none;}';
        var css_snoozed = '.unsnoozed {display: none;}';

        switch (option) {
            case 1:
                style.html(css_unsnoozed);
                break;
            case 2:
                style.html(css_snoozed);
                break;
            default:
                style.html('');
        }
        console.log(style);
    }

})(jQuery);