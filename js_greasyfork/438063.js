// ==UserScript==
// @name         AO3: [Wrangling] UW Tag Snooze Buttons
// @description  Adds snooze buttons for unwrangled tags
// @version      0.4

// @author       endofthyme
// @namespace    http://tampermonkey.net/
// @license      GPL-3.0 <https://www.gnu.org/licenses/gpl.html>

// @match        *://*.archiveofourown.org/tags/*/wrangle?*&status=unwrangled
// @require      https://ajax.googleapis.com/ajax/libs/jquery/1.9.0/jquery.min.js
// @grant        GM.getValue
// @grant        GM_getValue
// @grant	 GM.deleteValue
// @grant        GM_deleteValue
// @downloadURL https://update.greasyfork.org/scripts/438063/AO3%3A%20%5BWrangling%5D%20UW%20Tag%20Snooze%20Buttons.user.js
// @updateURL https://update.greasyfork.org/scripts/438063/AO3%3A%20%5BWrangling%5D%20UW%20Tag%20Snooze%20Buttons.meta.js
// ==/UserScript==

var DEFAULT_DAYS_TO_SNOOZE = 7;
var DRAFT_DAYS_TO_SNOOZE = 2;

var SHOW_CROSSOVER_FANDOMS = true;

// 1: hide snoozed, 2: hide unsnoozed, 3: show all tags
var DEFAULT_BUTTON_OPTION = 1;

// Set to true to migrate old GM_ map to new localStorage map.
// Set to false if you're encountering compatibility issues with GM_ functions.
var MIGRATION_IN_PROGRESS = true;

(function($) {

    if (MIGRATION_IN_PROGRESS) {
        var old_saved_date_map = GM_getValue('tags_saved_date_map', '{}');
        if (old_saved_date_map != '{}') {
            localStorage.setItem('tags_saved_date_map', old_saved_date_map);
            GM_deleteValue('tags_saved_date_map');
        }
    }

    var saved_date_map = localStorage.getItem('tags_saved_date_map');
    saved_date_map = saved_date_map == null ? new Map() : new Map(JSON.parse(saved_date_map));
    var today = new Date();
    clearOldSnoozes();

    console.log("Snoozes active:");
    console.log(saved_date_map);

    // Load icons
    var font_awesome_icons = document.createElement('script');
    font_awesome_icons.setAttribute('src', 'https://code.iconify.design/2/2.1.0/iconify.min.js');
    document.getElementsByTagName('head')[0].appendChild(font_awesome_icons);

    // add Snooze column header and snooze drafts button
    $('thead tr th:contains("Canonical")').before('<th scope="col">Snooze</th>');
    var snooze_draft_button = $('<ul class="actions" role="menu"><li><a id="snooze_drafts">Drafts</a></li></ul>');
    $("thead").find("th:contains('Snooze')").append(snooze_draft_button);

    // when snooze drafts button is pressed, check all tag pages, annotate, and snooze drafts
    $("a[id='snooze_drafts']").on("click", checkTagPages);

    // For each tag row on the page:
    $('tbody tr').each(function(i, row) {

        // Check if the tag's been snoozed.
        var tag_name = $(this).find("th[title='tag'] label").text();
        if (saved_date_map.has(tag_name) && new Date(saved_date_map.get(tag_name)) > today) {
            $(this).addClass('snoozed');

            // delete checkboxes for snoozed items (to prevent tags being wrangled accidentally)
            $(this).find("input[type='checkbox']").remove();
        } else {
            $(this).addClass('unsnoozed');
        }

        // Add snooze button for each tag.
        var snooze_button = $('<td title="snooze"><ul class="actions" role="menu"><li><a><span class="iconify" data-icon="mdi:sleep"></span></a></li></ul></td>');
        snooze_button.click(function() {
            addSnooze(tag_name, DEFAULT_DAYS_TO_SNOOZE);
        });
        var snoozecol = $(this).find('td[title="canonical?"]').before(snooze_button);
    });

    var snooze_banner = $('<div class="flash notice" id="snooze_banner">The following tags have been snoozed: </div>');

    var toggle_p = $('<p></p>').html('Show:&nbsp;&nbsp;');
    setUpToggleMenu();

    var style = $('<style type="text/css"></style>').appendTo($('head'));
    addCss(DEFAULT_BUTTON_OPTION);

    function setUpToggleMenu() {
        var only_unsnoozed_tags = $('<a style="font-weight: bold"></a>').html('[ unsnoozed ]');
        var only_snoozed_tags = $('<a></a>').html('[ snoozed ]');
        var all_tags = $('<a></a>').html('[ snoozed + unsnoozed ]');
        var clear_snoozes = $('<a></a>').html('[ clear all snoozes ]');

        only_unsnoozed_tags.click(() => onSnoozeSelection(only_unsnoozed_tags, 1));
        only_snoozed_tags.click(() => onSnoozeSelection(only_snoozed_tags, 2));
        all_tags.click(() => onSnoozeSelection(all_tags, 3));

        clear_snoozes.click(function() {
            saved_date_map = new Map();
            localStorage.removeItem('tags_saved_date_map');

            // Set all rows to unsnoozed on click.
            $('tbody tr').each(function(index) {
                $(this).removeClass('snoozed').addClass('unsnoozed');
            });
        });

        toggle_p.append(only_unsnoozed_tags, '&nbsp;&nbsp;', only_snoozed_tags, '&nbsp;&nbsp;',
                        all_tags, '&nbsp;&nbsp;-&nbsp;&nbsp;', clear_snoozes);
        $('#wrangulator').before(toggle_p);
    }

    function addSnooze(tag_name, days) {
        var tag_link_html = '';
        // Disappear the snoozed row.
        $('tbody tr').each(function(index) {
            if ($(this).find('th label').text() == tag_name) {
                $(this).removeClass('unsnoozed').addClass('snoozed');

                // delete checkboxes for snoozed items
                $(this).find("input[type='checkbox']").remove();

                // save tag link
                tag_link_html = "<a href='" + $(this).find("a[href$='/edit']").attr("href").replace(/'/g, "%27") + "'>" + tag_name + "</a>";
            }
        });

        var snoozedDate = new Date();
        snoozedDate.setDate(snoozedDate.getDate() + days);
        saved_date_map.set(tag_name, snoozedDate);
        localStorage.setItem('tags_saved_date_map', JSON.stringify(Array.from(saved_date_map.entries())));
        console.log(tag_name + ' snoozed to ' + snoozedDate);

        // Add snoozed tag to banner
        if ($('#snooze_banner').length) {
            snooze_banner.append(", " + tag_link_html);
        } else {
            snooze_banner.append(tag_link_html);
            $('#wrangulator').before(snooze_banner);
        }
    }

    function clearOldSnoozes() {
        localStorage.setItem('tags_saved_date_map',
                             JSON.stringify([...saved_date_map].filter(([k, v]) => new Date(v) > today)));
    }

    function onSnoozeSelection(button, css_option) {
        addCss(css_option);
        toggle_p.find('a').css('font-weight', 'normal');
        button.css('font-weight', 'bold');
        toggle_p.find('a').classList.remove('current');
        button.find('a').className = 'current';
    }

    // 1: hide snoozed, 2: hide unsnoozed, 3: show all tags
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
    }

    function checkTagPages() {
        // check each unsnoozed tag on page
        $("tbody tr.unsnoozed").each(function(i, row) {
            var tag_link = $(this).find("a[href$='/works']").attr("href").slice(0, -6);
            var taggings_cell = $(this).find("td[title='taggings']");
            var tag_name = $(this).find("th label").text();

            // check the tag's landing page
            $.get(tag_link, function(response) {
                // check for works
                if ($(response).find("div.work").length) {
                    // check for unrevealed works
                    var display_checkmark = true;
                    if ($(response).find("div.mystery").length) {
                        // check if there are any revealed works present
                        var total_works = $(response).find("li.work").length;
                        var total_unrevealed = $(response).find("div.mystery").length;
                        if (total_works == total_unrevealed) {
                            taggings_cell.append(" [unrevealed]");
                            display_checkmark = false;
                        }
                    }

                    // check author count
                    var authors = new Set();
                    $(response).find("div.work div.header").each(function(j, row2) {
                        var parsed_author = $(this).find("a[rel$='author']").first().text();
                        var check_pseud = parsed_author.match(/[^(]*\(([^)]*)\)/)
                        if (check_pseud) {
                            parsed_author = check_pseud[1]
                        }
                        if (parsed_author && parsed_author != "orphan_account") {
                            authors.add(parsed_author);
                        }
                    });

                    // check fandom count
                    var fandoms = new Set();
                    $(response).find("div.work div.header h5.fandoms a").each(function(j, row2) {
                        var fandom_name = $(this).text();
                        if (fandom_name != "Original Work") {
                            fandoms.add(fandom_name);
                        }
                    });

                    if (authors.size > 1 && fandoms.size > 1) {
                        taggings_cell.append(" [" + authors.size + " users/crossover]");
                        display_checkmark = false;
                    } else {
                        if (authors.size > 1) {
                            taggings_cell.append(" [" + authors.size + " users]");
                            display_checkmark = false;
                        }
                        if (fandoms.size > 1) {
                            taggings_cell.append(" [crossover]");
                            display_checkmark = false;
                            if (SHOW_CROSSOVER_FANDOMS) {
                                fandoms.forEach((value) => {
                                    taggings_cell.append("<br><small><span style='color:blue;'>" + value + "</span></small>");
                                });
                            }
                        }
                    }

                    if (display_checkmark) {
                        taggings_cell.append(" [\u2714]");
                    }

                // check for bookmarks
                } else if ($(response).find("div.bookmark").length) {
                    taggings_cell.append(" [bookmark]");

                // nothing there; is it canonical?
                } else if ($(response).find("p:contains('It\'s a common tag.')").length) {
                    taggings_cell.append(" [canonical]")

                // is it a syn?
                } else if ($(response).find("p:contains('has been made a synonym of')").length) {
                    taggings_cell.append(" [syn]")

                // must be a draft
                } else {
                    taggings_cell.append(" [draft]");
                    addSnooze(tag_name, DRAFT_DAYS_TO_SNOOZE);
                }

                var language = $(response).find("dd[class='language']").first().text();
                if (language != "English" && language != "") {taggings_cell.append(" - " + language)};
            });
        });

        // remove the button when finished
        $("ul").remove(":has(li a[id='snooze_drafts'])");
    }
})(jQuery);