// ==UserScript==
// @name        AO3: Kudosed and seen history
// @description Highlight or hide works you kudosed/marked as seen.
// @namespace https://greasyfork.org/scripts/410132-ao3-kudosed-and-seen-history
// @author Melissa Pham
// @version 1.9.2
// @history 1.9.2 - update namespace to allow concurrent install from min's script
// @history 1.9.1 - set all debug statements to use flag
// @history 1.9 - switch to using the quality score algorithm from TheShinySnivy's script
// @history 1.8 - add hiding of works on bookmark view
// @history 1.7 - Add word count range for work lists that do not filter by word count
// @history 1.6 - Add kudos ratio cutoff
// @history 1.5 - import/export seen list
// @history 1.4 - thinner stripes, remembers bookmarks you left
// @history 1.3 - option to collapse blurbs of seen works
// @history 1.2.1 - double click on date marks work as seen
// @history 1.2 - check for bookmarks you left, changes to the menu
// @grant       none
// @include     http://archiveofourown.org/*
// @include     https://archiveofourown.org/*
// @require http://code.jquery.com/jquery-3.2.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/410132/AO3%3A%20Kudosed%20and%20seen%20history.user.js
// @updateURL https://update.greasyfork.org/scripts/410132/AO3%3A%20Kudosed%20and%20seen%20history.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // get the header menu
    var header_menu = $('ul.primary.navigation.actions');
    // create and insert menu button
    var seen_menu = $('<li class="dropdown"></li>').html('<a>Seen works</a>');
    header_menu.find('li.search').before(seen_menu);
    // create and append dropdown menu
    var drop_menu = $('<ul class="menu dropdown-menu"></li>');
    seen_menu.append(drop_menu);

if (typeof (Storage) !== 'undefined') {
    var debug = false;
    // newest more-or-less major version, for the update notice
    var current_version = 1.9;
    var username_saved = localStorage.getItem('kudoshistory_username');
    var userlink = $('#greeting li.dropdown > a[href^="/users/"]');
    var username = '';
    if (!username_saved) {
        localStorage.setItem('kudoshistory_lastver', current_version);
    }
    // if logged in
    if (userlink.length) {
        username = userlink.attr('href').split('/')[2];
        debug && console.log('found username: ' + username + ', saved username: ' + username_saved);
        if (!username_saved || username_saved !== username) {
            debug && console.log('saving username: ' + username);
            localStorage.setItem('kudoshistory_username', username);
        }
    }
    // if not logged in, but remembers username
    else if (!!username_saved) {
        debug && console.log("didn't find username on page, saved username: " + username_saved);
        username = username_saved;
    } else {
        username = prompt('AO3: Kudosed and seen history\n\nYour AO3 username:');
        localStorage.setItem('kudoshistory_username', username);
    }

	var kudo_ratio_cutoff = parseFloat(localStorage.getItem('kudo_ratio_cutoff'));
	var wordrange_start = parseInt(localStorage.getItem('wordrange_start'));
	var wordrange_end = parseInt(localStorage.getItem('wordrange_end'));

    // check the 'hide seen works' setting
    var kudoshistory_hide = localStorage.getItem('kudoshistory_hide');

	// check the 'hide low ratio' setting
    var kudosratio_hide = localStorage.getItem('kudosratio_hide');

	// check the 'hide high ratio' setting
    var kudosratio_hide_high = localStorage.getItem('kudosratio_hide_high');

    // check the 'hide by word count range' setting
    var wordrange_hide = localStorage.getItem('wordrange_hide');

    // check the 'mark as seen on open' setting
    var auto_seen = false;
    if (localStorage.getItem('kudoshistory_autoseen') == 'yes') {
        auto_seen = true;
    }
    // check the 'highlight bookmarked' setting
    var highlight_bookmarked = true;
    if (localStorage.getItem('kudoshistory_highlight_bookmarked') == 'no') {
        highlight_bookmarked = false;
    }
    // uncomment the next four lines if you need to clear your local lists (then comment them again after refreshing the page once)
    // localStorage.removeItem('kudoshistory_kudosed');
    // localStorage.removeItem('kudoshistory_checked');
    // localStorage.removeItem('kudoshistory_seen');
    // localStorage.removeItem('kudoshistory_bookmarked');
    var list_kudosed = localStorage.getItem('kudoshistory_kudosed');
    var list_checked = localStorage.getItem('kudoshistory_checked');
    var list_seen = localStorage.getItem('kudoshistory_seen');
    var list_bookmarked = localStorage.getItem('kudoshistory_bookmarked');
    if (!list_kudosed) {
        list_kudosed = ',';
    }
    if (!list_checked) {
        list_checked = ',';
    }
    if (!list_seen) {
        list_seen = ',';
    }
    if (!list_bookmarked) {
        list_bookmarked = ',';
    }
    $(document).ajaxStop(function () {
        localStorage.setItem('kudoshistory_kudosed', list_kudosed);
        localStorage.setItem('kudoshistory_checked', list_checked);
        localStorage.setItem('kudoshistory_seen', list_seen);
        localStorage.setItem('kudoshistory_bookmarked', list_bookmarked);
    });
    var style = $('<style type="text/css"></style>').appendTo($('head'));
    // add css rules for kudosed works
    addCss(0);
    // if there's a list of works or bookmarks, add menu
    var found_blurbs = $('li.work.blurb').add('li.bookmark.blurb');
    if (found_blurbs.length) {
        addSeenMenu();
    }
    // if it's the first time after an update
    addNotice();
    // for each work blurb
    $('li.work.blurb').not('.deleted').each(function () {
        // get work id
        var work_id = $(this).attr('id').replace('work_', '');
        debug && console.log('works loop ' + work_id);
        // get work kudo ratio
        var kudo_ratio = calcRatio( $(this).find('dd.hits'), $(this).find('dd.kudos a'), $(this).find('dd.chapters'));
        var words_value = parseInt($(this).find('dd.words').text().replace(',', ''), 10);
        blurbCheck(work_id, 'work_' + work_id, $(this), true, kudo_ratio, words_value);
        // double click on date marks work as seen
        var work_date = $(this).not('.marked-seen').not('.has-kudos').find('p.datetime');
        if (work_date.length) {
            debug && console.log('set date click ' + work_id);
            work_date.one('dblclick', function () {
                list_seen = localStorage.getItem('kudoshistory_seen');
                list_seen = ',' + work_id + list_seen;
                localStorage.setItem('kudoshistory_seen', list_seen);
                $('#work_' + work_id).addClass('marked-seen');
            });
        }
    });
    // for each bookmark blurb
    $('li.bookmark.blurb').not('.deleted').each(function () {
        // get bookmark and work ids
        var bookmark_id = $(this).attr('id');
        var work_link = $(this).find('h4 a:first').attr('href');
        // if it's not a deleted work and not a series bookmark
        if (!!work_link && work_link.indexOf('series') == -1) {
            var work_id = work_link.split('/').pop();
            debug && console.log('bookmarks loop ' + work_id + ' ' + bookmark_id);
            // if it's your own bookmark
            var own_bookmark = $(this).find('div.own.user.module.group');
            if (own_bookmark.length) {
                list_bookmarked = ',' + work_id + list_bookmarked.replace(',' + work_id + ',', ',');
                $(this).addClass('is-bookmarked');
                blurbCheck(work_id, bookmark_id, $(this), false, kudo_ratio, words_value);
                own_bookmark.find('a[href$="/confirm_delete"]').click(function () {
                    list_bookmarked = localStorage.getItem('kudoshistory_bookmarked');
                    list_bookmarked = list_bookmarked.replace(',' + work_id + ',', ',');
                    $('#' + bookmark_id).removeClass('is-bookmarked');
                    localStorage.setItem('kudoshistory_bookmarked', list_bookmarked);
                });
            } else {
                // get work kudo ratio
                var kudo_ratio = calcRatio( $(this).find('dd.hits'), $(this).find('dd.kudos a'), $(this).find('dd.chapters'));
                var words_value = parseInt($(this).find('dd.words').text().replace(',', ''), 10);
                blurbCheck(work_id, bookmark_id, $(this), true, kudo_ratio, words_value);
            }
        }
    });
    // if it's a work page
    if ($('#workskin').length) {
        // get work id
        var work_id = $('#kudo_commentable_id').val();
        debug && console.log('work_id ' + work_id);
        // check if work id is on the seen list
        var is_seen = list_seen.indexOf(',' + work_id + ',');
        if (auto_seen) {
            if (is_seen == -1) {
                list_seen = ',' + work_id + list_seen;
                is_seen = 1;
            }
            $('dl.work.meta.group').addClass('marked-seen');
        } else if (is_seen > -1) {
            $('dl.work.meta.group').addClass('marked-seen');
        }
        addSeenButtons();
        // if work id is on the kudosed list
        if (list_kudosed.indexOf(',' + work_id + ',') > -1) {
            $('dl.work.meta.group').addClass('has-kudos');
            debug && console.log('on kudosed list');
        } else {
            var found_kudos = false;
            // check if there are kudos from the user
            var user_kudos = $('#kudos').find('[href="/users/' + username + '"]');
            if (user_kudos.length) {
                // highlight blurb and add work id to kudosed list
                list_kudosed = ',' + work_id + list_kudosed;
                list_checked = list_checked.replace(',' + work_id + ',', ',');
                $('dl.work.meta.group').addClass('has-kudos');
                found_kudos = true;
            } else if (list_checked.indexOf(',' + work_id + ',') == -1) {
                // add work id to checked list
                list_checked = ',' + work_id + list_checked;
            }
            if (!found_kudos) {
                $('#new_kudo').click(function () {
                    list_kudosed = localStorage.getItem('kudoshistory_kudosed');
                    list_checked = localStorage.getItem('kudoshistory_checked');
                    list_kudosed = ',' + work_id + list_kudosed;
                    list_checked = list_checked.replace(',' + work_id + ',', ',');
                    $('dl.work.meta.group').addClass('has-kudos');
                    localStorage.setItem('kudoshistory_kudosed', list_kudosed);
                    localStorage.setItem('kudoshistory_checked', list_checked);
                });
            }
        }
        // check if it's bookmarked
        var bookmark_button_text = $('a.bookmark_form_placement_open').filter(':first').text();
        if (bookmark_button_text.indexOf('Edit') > -1) {
            // highlight blurb
            list_bookmarked = ',' + work_id + list_bookmarked.replace(',' + work_id + ',', ',');
            $('dl.work.meta.group').addClass('is-bookmarked');
        } else {
            list_bookmarked = list_bookmarked.replace(',' + work_id + ',', ',');
        }
    }
    // keep the kudos, checked and bookmarked lists under 200k characters (~25k works)
    if (list_kudosed.length > 200000) {
        list_kudosed = list_kudosed.slice(0, 180000);
    }
    if (list_checked.length > 200000) {
        list_checked = list_checked.slice(0, 180000);
    }
    if (list_bookmarked.length > 200000) {
        list_bookmarked = list_bookmarked.slice(0, 180000);
    }
    // keep the seen list under 2mil characters (~250k works)
    if (list_seen.length > 2000000) {
        list_seen = list_seen.slice(0, 1900000);
    }
    // save all lists
    try {
        debug && console.log('god do i try (to save the lists)');
        localStorage.setItem('kudoshistory_kudosed', list_kudosed);
        localStorage.setItem('kudoshistory_checked', list_checked);
        localStorage.setItem('kudoshistory_seen', list_seen);
        localStorage.setItem('kudoshistory_bookmarked', list_bookmarked);
    } catch (e) {
        debug && console.log('error while saving lists');
        list_seen = list_seen.slice(0, list_seen.length * 0.9);
        localStorage.setItem('kudoshistory_kudosed', list_kudosed);
        localStorage.setItem('kudoshistory_checked', list_checked);
        localStorage.setItem('kudoshistory_seen', list_seen);
        localStorage.setItem('kudoshistory_bookmarked', list_bookmarked);
    }
}
    
function calcRatio(hits, kudos, chapters){
    var split_string = chapters.text().split("/");
    var chapters_string = split_string[0];

    // if hits and kudos were found
    if (kudos.length && hits.length && hits.text() !== '0') {

        // get counts
        var hits_count = parseInt(hits.text());
        var kudos_count = parseInt(kudos.text());
        var chapters_count = parseInt(chapters_string.toString());

        debug && console.log("Hits: " + hits_count + "Kudos: " + kudos_count + "Chapters:" + chapters_count);

        var new_hits_count = hits_count / Math.sqrt(chapters_count);

        debug && console.log("New hits count: " + new_hits_count);

        // count percentage
        var percents = 100*kudos_count/new_hits_count;
        if (kudos_count < 11) {
            percents = 1;
        }
        var p_value = getPValue(new_hits_count, kudos_count, chapters_count);
        if (p_value < 0.05) {
            percents = 1;
        }

        return percents.toFixed(1);
    }

    return 0;
}
    
function getPValue(hits, kudos, chapters) {
    var null_hyp = 0.04;
    var test_prop = kudos / hits;
    var z_value = (test_prop - null_hyp) / Math.sqrt( (null_hyp * (1 - null_hyp)) / hits );
    return normalcdf(0, -1 * z_value, 1);
}

function normalcdf(mean, upper_bound, standard_dev) {
    var z = (standard_dev-mean)/Math.sqrt(2*upper_bound*upper_bound);
    var t = 1/(1+0.3275911*Math.abs(z));
    var a1 = 0.254829592;
    var a2 = -0.284496736;
    var a3 = 1.421413741;
    var a4 = -1.453152027;
    var a5 = 1.061405429;
    var erf = 1-(((((a5*t + a4)*t) + a3)*t + a2)*t + a1)*t*Math.exp(-z*z);
    var sign = 1;
    if(z < 0)
    {
        sign = -1;
    }
    return (1/2)*(1+sign*erf);
}

// check if work is on lists
function blurbCheck(work_id, blurb_id, blurb, check_bookmark, ratio = 0, words = 0) {
    // ratio is low
    if (ratio !== 0 && ratio < kudo_ratio_cutoff) {
        debug && alert('is low ratio');
        blurb.addClass('low-ratio');
    }
    // ratio is high
    if (ratio !== 0 && ratio > kudo_ratio_cutoff) {
        debug && alert('is high ratio');
        blurb.addClass('high-ratio');
    }
    // word count is outside word range
    if (words !== 0 && ((wordrange_start !== 0 && wordrange_start > words) || (wordrange_end !== 0 && wordrange_end < words))) {
        debug && (words, wordrange_start, wordrange_end);
        debug && alert('is outside word range');
        blurb.addClass('wordrange');
    }

    // if work id is on the kudosed list
    if (list_kudosed.indexOf(',' + work_id + ',') > -1) {
        debug && console.log('is kudosed');
        blurb.addClass('has-kudos');
        list_kudosed = ',' + work_id + list_kudosed.replace(',' + work_id + ',', ',');
    }
    // if work id is on the seen list
    else if (list_seen.indexOf(',' + work_id + ',') > -1) {
        debug && console.log('is seen');
        blurb.addClass('marked-seen');
        list_seen = ',' + work_id + list_seen.replace(',' + work_id + ',', ',');
    }         // if work is low ratio
    // if work id is on the checked list
    else if (list_checked.indexOf(',' + work_id + ',') > -1) {
        debug && console.log('is checked');
        list_checked = ',' + work_id + list_checked.replace(',' + work_id + ',', ',');
    } else {
        debug && console.log('loading kudos for ' + blurb_id);
        // add a div to the blurb that will house the kudos
        blurb.append('<div id="kudos_' + blurb_id + '" style="display: none;"></div>');
        // retrieve a list of kudos from the work
        var work_url = 'http://archiveofourown.org/works/' + work_id + '/kudos #kudos';
        $('#kudos_' + blurb_id).load(work_url, function () {
            // check if there are kudos from the user
            var user_kudos = $('#kudos_' + blurb_id).find('[href="/users/' + username + '"]');
            if (user_kudos.length) {
                // highlight blurb and add work id to kudosed list
                $('#' + blurb_id).addClass('has-kudos');
                list_kudosed = ',' + work_id + list_kudosed;
            } else {
                // add work id to checked list
                list_checked = ',' + work_id + list_checked;
            }
        });
    }
    // if work id is on the bookmarked list
    if (check_bookmark) {
        if (list_bookmarked.indexOf(',' + work_id + ',') > -1) {
            debug && console.log('is bookmarked');
            blurb.addClass('is-bookmarked');
            list_bookmarked = ',' + work_id + list_bookmarked.replace(',' + work_id + ',', ',');
        }
    }
}
// mark all works on the page as seen
function markPageSeen() {
    list_seen = localStorage.getItem('kudoshistory_seen');
    // for each work blurb
    $('li.work.blurb').not('.marked-seen').not('.has-kudos').not('.deleted').each(function () {
        var work_id = $(this).attr('id').replace('work_', '');
        debug && console.log('marking as seen ' + work_id);
        $(this).addClass('marked-seen');
        list_seen = ',' + work_id + list_seen;
    });
    // for each bookmark blurb
    $('li.bookmark.blurb').not('.marked-seen').not('.has-kudos').not('.deleted').each(function () {
        var work_link = $(this).find('h4 a:first').attr('href');
        // if it's not a series bookmark
        if (!!work_link && work_link.indexOf('series') == -1) {
            var work_id = work_link.split('/').pop();
            debug && console.log('marking as seen ' + work_id);
            $(this).addClass('marked-seen');
            list_seen = ',' + work_id + list_seen;
        }
    });
    localStorage.setItem('kudoshistory_seen', list_seen);
}
// mark all works on the page as unseen
function markPageUnseen() {
    list_seen = localStorage.getItem('kudoshistory_seen');
    // for each work blurb
    $('li.work.blurb').not('.deleted').each(function () {
        var work_id = $(this).attr('id').replace('work_', '');
        debug && console.log('marking as unseen ' + work_id);
        $(this).removeClass('marked-seen');
        list_seen = list_seen.replace(',' + work_id + ',', ',');
    });
    // for each bookmark blurb
    $('li.bookmark.blurb').not('.deleted').each(function () {
        var work_link = $(this).find('h4 a:first').attr('href');
        // if it's not a series bookmark
        if (!!work_link && work_link.indexOf('series') == -1) {
            var work_id = work_link.split('/').pop();
            debug && console.log('marking as unseen ' + work_id);
            $(this).removeClass('marked-seen');
            list_seen = list_seen.replace(',' + work_id + ',', ',');
        }
    });
    localStorage.setItem('kudoshistory_seen', list_seen);
}
// re-check the page for kudos
function recheckKudos() {
    list_kudosed = localStorage.getItem('kudoshistory_kudosed');
    list_checked = localStorage.getItem('kudoshistory_checked');
    // for each non-kudosed work blurb
    $('li.work.blurb').not('.has-kudos').not('.deleted').each(function () {
        // get work id
        var work_id = $(this).attr('id').replace('work_', '');
        debug && console.log('works loop ' + work_id);
        loadKudos(work_id, 'work_' + work_id, $(this));
    });
    // for each non-kudosed bookmark blurb
    $('li.bookmark.blurb').not('.has-kudos').not('.deleted').each(function () {
        // get bookmark and work ids
        var bookmark_id = $(this).attr('id');
        var work_link = $(this).find('h4 a:first').attr('href');
        // if it's not a series bookmark
        if (!!work_link && work_link.indexOf('series') == -1) {
            var work_id = work_link.split('/').pop();
            debug && console.log('bookmarks loop ' + work_id + ' ' + bookmark_id);
            loadKudos(work_id, bookmark_id, $(this));
        }
    });

    function loadKudos(work_id, blurb_id, blurb) {
        // add a div to the blurb that will house the kudos
        blurb.append('<div id="kudos_' + blurb_id + '" style="display: none;"></div>');
        // retrieve a list of kudos from the work
        var work_url = 'http://archiveofourown.org/works/' + work_id + '/kudos #kudos';
        $('#kudos_' + blurb_id).load(work_url, function () {
            // check if there are kudos from the user
            var user_kudos = $('#kudos_' + blurb_id).find('[href="/users/' + username + '"]');
            if (user_kudos.length) {
                // highlight blurb and add work id to kudosed list
                $('#' + blurb_id).addClass('has-kudos');
                list_kudosed = ',' + work_id + list_kudosed;
                list_checked = list_checked.replace(',' + work_id + ',', ',');
            }
        });
    }
    localStorage.setItem('kudoshistory_kudosed', list_kudosed);
    localStorage.setItem('kudoshistory_checked', list_checked);
}
// check the page for bookmarks
function checkForBookmarks() {
    list_bookmarked = localStorage.getItem('kudoshistory_bookmarked');
    // for each work and bookmark blurb
    $('li.work.blurb').add('li.bookmark.blurb').not('.deleted').each(function () {
        // get work link
        var blurb_id = $(this).attr('id');
        var work_link = $(this).find('h4 a:first').attr('href');
        debug && console.log('checking for bookmark ' + blurb_id);
        // if it's not deleted and not a series
        if (!!work_link && work_link.indexOf('series') == -1) {
            var work_id = work_link.split('/').pop();
            // add a div to the blurb that will house the bookmark button
            $(this).append('<div id="bookmarked_' + blurb_id + '" style="display: none;"></div>');
            // retrieve the bookmark button from the work
            var work_url = 'http://archiveofourown.org' + work_link + ' a.bookmark_form_placement_open:first';
            $('#bookmarked_' + blurb_id).load(work_url, function () {
                // check if there is a bookmark from the user
                var bookmark_button_text = $('#bookmarked_' + blurb_id).find('a').text();
                if (bookmark_button_text.indexOf('Edit') > -1) {
                    // highlight blurb
                    $('#' + blurb_id).addClass('is-bookmarked');
                    list_bookmarked = ',' + work_id + list_bookmarked.replace(',' + work_id + ',', ',');
                } else {
                    $('#' + blurb_id).removeClass('is-bookmarked');
                    list_bookmarked = list_bookmarked.replace(',' + work_id + ',', ',');
                }
            });
        }
    });
    localStorage.setItem('kudoshistory_bookmarked', list_bookmarked);
}
// show the box with import/export options
function importExport() {
    var importexport_bg = $('<div id="importexport-bg" class="modal-bg"></div>');
    var importexport_box = $('<div id="importexport-box" class="modal-box"></div>');
    var box_button_save = $('<input type="button" id="importexport-button-save" value="Import seen list"></input>');
    box_button_save.click(function () {
        var confirmed = confirm('Sure you want to replace your seen list?');
        if (confirmed) {
            var new_seen_list = $('#import-seen-list').val();
            if (new_seen_list.length > 2000000) {
                new_seen_list = new_seen_list.slice(0, 1900000);
            } else if (new_seen_list == '') {
                new_seen_list = ',';
            }
            list_seen = new_seen_list;
            localStorage.setItem('kudoshistory_seen', new_seen_list);
            $('#importexport-save').prepend('Seen list imported! ');
        }
    });
    var box_button_close = $('<input type="button" id="importexport-button-close" value="Close"></input>');
    box_button_close.click(function () {
        importexport_box.detach();
        importexport_bg.detach();
    });
    importexport_box.append(
        $('<p class="actions"></p>').append(box_button_close),
        $('<h3></h3>').text('Export your seen list'),
        $('<p></p>').text('Copy your current seen list from the field below and save it wherever you want as a backup.'),
        $('<input type="text" id="export-seen-list" />').val(localStorage.getItem('kudoshistory_seen')),
        $('<h3 style="margin-top: 1.5em;"></h3>').text('Import your seen list'),
        $('<p></p>').html('Put your saved seen list in the field below and select the "Import seen list" button. <strong>Warning:</strong> it will <u>replace</u> your current seen list.'),
        $('<input type="text" id="import-seen-list" />'),
        $('<p class="actions" id="importexport-save"></p>').append(box_button_save)
    );
    $('body').append(importexport_bg, importexport_box);
}

// show the box with settings
function editSettings() {
    var settings_bg = $('<div id="settings-bg" class="modal-bg"></div>');
    var settings_box = $('<div id="settings-box" class="modal-box"></div>');
    var box_button_save = $('<input type="button" id="settings-button-save" value="Save"></input>');
    box_button_save.click(function () {
        localStorage.setItem('kudo_ratio_cutoff', $('#kudo_ratio_cutoff').val());
        localStorage.setItem('wordrange_start', $('#wordrange_start').val());
        localStorage.setItem('wordrange_end', $('#wordrange_end').val());
        $('#settings-save').prepend('New settings saved! ');
    });
    var box_button_close = $('<input type="button" id="settings-button-close" value="Close"></input>');
    box_button_close.click(function () {
        settings_box.detach();
        settings_bg.detach();
    });
    settings_box.append(
        $('<p class="actions"></p>').append(box_button_close),
        $('<h3 style="margin-top: 1.5em;"></h3>').text('Kudo ratio cutoff'),
        $('<input type="text" id="kudo_ratio_cutoff"/>').val(localStorage.getItem('kudo_ratio_cutoff')),
        $('<h3 style="margin-top: 1.5em;"></h3>').text('Word Count Start'),
        $('<input type="text" id="wordrange_start"/>').val(localStorage.getItem('wordrange_start')),
        $('<h3 style="margin-top: 1.5em;"></h3>').text('Word Count End'),
        $('<input type="text" id="wordrange_end"/>').val(localStorage.getItem('wordrange_end')),
        $('<p class="actions" id="settings-save"></p>').append(box_button_save)
    );
    $('body').append(settings_bg, settings_box);
}

// add the seen/unseen buttons
function addSeenButtons() {
    var seen_button1 = $('<li class="mark-seen"></li>').html('<a>Seen &check;</a>');
    var seen_button2 = seen_button1.clone();
    $('ul.actions').on('click', 'li.mark-seen', function () {
        debug && console.log('seen_button clicked');
        list_seen = localStorage.getItem('kudoshistory_seen');
        list_seen = ',' + work_id + list_seen;
        localStorage.setItem('kudoshistory_seen', list_seen);
        $('dl.work.meta.group').addClass('marked-seen');
        seen_button1.replaceWith(unseen_button1);
        seen_button2.replaceWith(unseen_button2);
    });
    var unseen_button1 = $('<li class="mark-unseen"></li>').html('<a>Unseen &cross;</a>');
    var unseen_button2 = unseen_button1.clone();
    $('ul.actions').on('click', 'li.mark-unseen', function () {
        debug && console.log('unseen_button clicked');
        list_seen = localStorage.getItem('kudoshistory_seen');
        list_seen = list_seen.replace(',' + work_id + ',', ',');
        localStorage.setItem('kudoshistory_seen', list_seen);
        $('dl.work.meta.group').removeClass('marked-seen');
        unseen_button1.replaceWith(seen_button1);
        unseen_button2.replaceWith(seen_button2);
    });
    if (is_seen == -1) {
        $('li.bookmark').after(seen_button1);
        $('#new_kudo').parent().after(seen_button2);
    } else {
        $('li.bookmark').after(unseen_button1);
        $('#new_kudo').parent().after(unseen_button2);
    }
}
// attach the menu
function addSeenMenu() {
    // create button - settings
    var button_edit_settings = $('<li></li>').html('<a>Edit Settings</a>');
    button_edit_settings.click(function () {
        editSettings();
    });
    // create button - import/export seen list
    var button_importexport_seen = $('<li></li>').html('<a>Import/export your seen list</a>');
    button_importexport_seen.click(function () {
        importExport();
    });
    // create button - all works
    var button_all_works = $('<li></li>').html('<a style="padding: 0.5em 0.5em 0.25em; text-align: center; font-weight: bold;">&mdash; For all works on this page: &mdash;</a>');
    // create button - mark page as seen
    var button_page_seen = $('<li></li>').html('<a>Mark as seen</a>');
    button_page_seen.click(function () {
        markPageSeen();
    });
    // create button - mark page as unseen
    var button_page_unseen = $('<li></li>').html('<a>Unmark as seen</a>');
    button_page_unseen.click(function () {
        markPageUnseen();
    });
    // create button - re-check page for kudos
    var button_recheck_kudos = $('<li></li>').html('<a>Re-check for kudos</a>');
    button_recheck_kudos.click(function () {
        recheckKudos();
    });
    // create button - check page for bookmarks
    var button_check_bookmarks = $('<li></li>').html('<a>Check for bookmarks</a>');
    button_check_bookmarks.click(function () {
        checkForBookmarks();
    });
    // create button - settings
    var button_settings = $('<li></li>').html('<a style="padding: 0.5em 0.5em 0.25em; text-align: center; font-weight: bold;">&mdash; Settings (click to change): &mdash;</a>');
    drop_menu.append(button_edit_settings, button_importexport_seen, button_all_works, button_page_seen, button_page_unseen, button_recheck_kudos, button_check_bookmarks, button_settings);

    // create button - seen works
    var seen_buttons = createHideButton('seen', 'kudoshistory_hide', 'hide');

    // create button - hide low ratio
    var low_ratio_buttons = createHideButton('low ratio', 'kudosratio_hide', 'hide-ratio');

    // create button - hide high ratio
    var high_ratio_buttons = createHideButton('high ratio', 'kudosratio_hide_high', 'hide-ratio-high');

    // create button - hide out of word range
    var wordrange_buttons = createHideButton('out of word count range', 'wordrange_hide', 'hide-wordrange');

    // create button - hightlight bookmarked
    var hightlight_bookmarked_buttons = createSettingsButton('Highlight bookmarked', 'kudoshistory_highlight_bookmarked', 'bmarked');

    // create button - mark as seen on open
    var autoseen_buttons = createSettingsButton('Mark as seen on open', 'kudoshistory_autoseen', 'auto');

    // append buttons to the dropdown menu
    appendButton(kudoshistory_hide, seen_buttons);
    appendButton(kudosratio_hide, low_ratio_buttons);
    appendButton(kudosratio_hide_high, high_ratio_buttons);
    appendButton(wordrange_hide, wordrange_buttons);
    appendButton(highlight_bookmarked, hightlight_bookmarked_buttons);
    appendButton(auto_seen, autoseen_buttons);
}
// create hide button in drop down menu
function createHideButton(title, setting, className){
    var button_hide_no = $('<li class="'+className+'-no"></li>').html('<a>Hide '+title+' works: NO</a>');
	var button_hide_yes = $('<li class="'+className+'-yes"></li>').html('<a>Hide '+title+' works: YES</a>');
	var button_hide_collapse = $('<li class="'+className+'-collapse"></li>').html('<a>Hide '+title+' works: COLLAPSE</a>');

	//don't hide works
    drop_menu.on('click', 'li.'+className+'-no', function () {
        localStorage.setItem(setting, 'yes');
        document[setting] = 'yes';
        addCss(1);
        button_hide_no.replaceWith(button_hide_yes);
    });

    //hide works
    drop_menu.on('click', 'li.'+className+'-yes', function () {
        localStorage.setItem(setting, 'collapse');
        document[setting] = 'collapse';
        addCss(1);
        button_hide_yes.replaceWith(button_hide_collapse);
    });

    //collapse works
    drop_menu.on('click', 'li.'+className+'-collapse', function () {
        localStorage.setItem(setting, 'no');
        document[setting] = 'no';
        addCss(1);
        button_hide_collapse.replaceWith(button_hide_no);
    });

    return {'no': button_hide_no, 'yes': button_hide_yes, 'collapse': button_hide_collapse};
}

// create settings button in drop down menu
function createSettingsButton(title, setting, className){
	var button_yes = $('<li class="'+className+'-yes"></li>').html('<a>'+title+': YES</a>');
    var button_no = $('<li class="'+className+'-no"></li>').html('<a>'+title+': NO</a>');

    drop_menu.on('click', 'li.'+className+'-yes', function () {
        localStorage.setItem(setting, 'no');
        document[setting] = 'no';
        addCss(2);
        button_yes.replaceWith(button_no);
    });

    drop_menu.on('click', 'li.'+className+'-no', function () {
        localStorage.setItem(setting, 'yes');
        document[setting] = 'yes';
        addCss(2);
        button_no.replaceWith(button_yes);
    });

    return {'yes': button_yes, 'no': button_no};

}

function appendButton(setting, buttons){
    if (setting) {
        drop_menu.append(buttons[setting]);
    } else {
        drop_menu.append(buttons['no']);
    }
}

// add a notice about an update
function addNotice() {
    var update_1_5 = "<h3>version 1.5</h3>\
<p><b>&bull; Import/export your seen list.</b> A whole new world of possibilities available from the menu! Save your list just in case your browser derps. Or take it with you to a different browser. Or just cuddle it gently at night.</p>";
    var update_1_4 = "<h3>version 1.4</h3>\
<p><b>&bull; Thinner stripes on the highlighted blurbs.</b> You're not crazy, they changed a bit.</p>\
<p><b>&bull; Remembers when you bookmark a work.</b> Page through your bookmarks list once to make it remember the works you bookmarked previously (shhh just do it). You can turn off the highlighting in the menu.</p>";
    var last_version = parseFloat(localStorage.getItem('kudoshistory_lastver'));
    if (isNaN(last_version)) {
        last_version = 0;
    }
    if (last_version < current_version) {
        var update_notice = $('<div id="kudoshistory-update" class="notice"></div>');
        update_notice.append("<h3><b>Kudosed and seen history updated!</b></h3>");
        update_notice.append(update_1_5);
        if (last_version < 1.4) {
            update_notice.append(update_1_4);
        }
        update_notice.append("<p><a id='kudoshistory-hide-update'>Don't show this again</a></p>");
        $('#main').prepend(update_notice);
        $('#kudoshistory-hide-update').click(function () {
            localStorage.setItem('kudoshistory_lastver', current_version);
            $('#kudoshistory-update').detach();
        });
    }
}
// add css rules to page head
function addCss(option) {
    var css_highRatio = generateCss('high-ratio');
	var css_hide_highRatio = css_highRatio.hide;
    var css_collapse_highRatio = css_highRatio.collapse;

    var css_lowRatio = generateCss('low-ratio');
	var css_hide_lowRatio = css_lowRatio.hide;
    var css_collapse_lowRatio = css_lowRatio.collapse;

    var css_wordrange = generateCss('wordrange');
	var css_hide_wordrange = css_wordrange.hide;
    var css_collapse_wordrange = css_wordrange.collapse;

    var css_highlight = '.has-kudos,\
.has-kudos.marked-seen {background: url("http://i.imgur.com/jK7d4jh.png") left no-repeat, url("http://i.imgur.com/ESdBCSX.png") left repeat-y !important; padding-left: 50px !important;}\
.marked-seen {padding-left: 50px !important;}\
dl.is-bookmarked {background: url("http://i.imgur.com/qol1mWZ.png") right repeat-y !important; padding-right: 50px !important;}\
dl.has-kudos.is-bookmarked,\
dl.has-kudos.marked-seen.is-bookmarked {background: url("http://i.imgur.com/jK7d4jh.png") left no-repeat, url("http://i.imgur.com/ESdBCSX.png") left repeat-y, url("http://i.imgur.com/qol1mWZ.png") right repeat-y !important;}\
dl.marked-seen.is-bookmarked {background: url("http://i.imgur.com/ESdBCSX.png") left repeat-y, url("http://i.imgur.com/qol1mWZ.png") right repeat-y !important;}\
#kudoshistory-update {padding: 0.5em 1em 1em 1em;}\
.modal-box {position: fixed; top: 0px; bottom: 0px; left: 0px; right: 0px; width: 60%; height: 80%; max-width: 800px; margin: auto; overflow-y: auto; border: 10px solid #222121; box-shadow: 0px 0px 8px 0px rgba(0, 0, 0, 0.2); padding: 0 20px; background-color: #000; z-index: 999;}\
.modal-bg {position: fixed; width: 100%; height: 100%; background-color: #292929; opacity: 0.7; z-index: 998;}\
.modal-box input[type="button"] {height: auto;}\
.modal-box p.actions {float: none; text-align: right;}';
    var css_bookmarked = '.is-bookmarked {background: url("http://i.imgur.com/qol1mWZ.png") right repeat-y !important; padding-right: 50px !important;}\
.has-kudos.is-bookmarked,\
.has-kudos.marked-seen.is-bookmarked {background: url("http://i.imgur.com/jK7d4jh.png") left no-repeat, url("http://i.imgur.com/ESdBCSX.png") left repeat-y, url("http://i.imgur.com/qol1mWZ.png") right repeat-y !important;}\
.marked-seen.is-bookmarked {background: url("http://i.imgur.com/ESdBCSX.png") left repeat-y, url("http://i.imgur.com/qol1mWZ.png") right repeat-y !important;}\
.bookmark.is-bookmarked p.status {padding-right: 37px;}';

    var css_hide = '#main li.has-kudos,\
#main li.marked-seen {display: none !important;}';
    var css_collapse = 'li.has-kudos h6.landmark.heading,\
li.has-kudos > ul,\
li.has-kudos blockquote.userstuff.summary,\
li.has-kudos dl.stats,\
li.has-kudos .header .fandoms.heading,\
li.marked-seen h6.landmark.heading,\
li.marked-seen > ul,\
li.marked-seen blockquote.userstuff.summary,\
li.marked-seen dl.stats,\
li.marked-seen .header .fandoms.heading\
 {display: none !important;}\
li.has-kudos ul.required-tags,\
li.marked-seen ul.required-tags\
{opacity: 0.6;}\
li.has-kudos ul.required-tags li + li,\
li.marked-seen ul.required-tags li + li\
{position: absolute; left: 56px; top: 0px;}\
li.has-kudos ul.required-tags li + li + li,\
li.marked-seen ul.required-tags li + li + li\
{left: 28px;}\
li.has-kudos ul.required-tags li + li + li + li,\
li.marked-seen ul.required-tags li + li + li + li\
{left: 84px; top: 0px;}\
li.has-kudos .header,\
li.marked-seen .header\
{min-height: 27px;}\
li.has-kudos .header .heading,\
li.marked-seen .header .heading\
{margin: 0.375em 5.25em 0px 121px;}';
    // add initial rules
    if (option == 0) {
        style.append(css_highlight);

        switch (kudoshistory_hide) {
        case 'yes':
            style.append(css_hide);
            break;
        case 'collapse':
            style.append(css_collapse);
        }

        switch (kudosratio_hide) {
        case 'yes':
            style.append(css_hide_lowRatio);
            break;
        case 'collapse':
            style.append(css_collapse_lowRatio);
        }

        switch (kudosratio_hide_high) {
        case 'yes':
            style.append(css_hide_highRatio);
            break;
        case 'collapse':
            style.append(css_collapse_highRatio);
        }

        switch (wordrange_hide) {
        case 'yes':
            style.append(css_hide_wordrange);
            break;
        case 'collapse':
            style.append(css_collapse_wordrange);
        }

        if (highlight_bookmarked == 'yes') {
            style.append(css_bookmarked);
        }
    }
    // change "kudoshistory_hide" setting
    else if (option == 1) {

        switch (kudoshistory_hide) {
        case 'yes':
            style.append(css_hide);
            break;
        case 'collapse':
            style.html(style.html().replace(css_hide, ''));
            style.append(css_collapse);
            break;
        default:
            style.html(style.html().replace(css_collapse, ''));
        }

        switch (kudosratio_hide) {
        case 'yes':
            style.append(css_hide_lowRatio);
            break;
        case 'collapse':
            style.html(style.html().replace(css_hide_lowRatio, ''));
            style.append(css_collapse_lowRatio);
            break;
        default:
            style.html(style.html().replace(css_collapse_lowRatio, ''));
        }

        switch (kudosratio_hide_high) {
        case 'yes':
            style.append(css_hide_highRatio);
            break;
        case 'collapse':
            style.html(style.html().replace(css_hide_highRatio, ''));
            style.append(css_collapse_highRatio);
            break;
        default:
            style.html(style.html().replace(css_collapse_highRatio, ''));
        }

        switch (wordrange_hide) {
        case 'yes':
            style.append(css_hide_wordrange);
            break;
        case 'collapse':
            style.html(style.html().replace(css_hide_wordrange, ''));
            style.append(css_collapse_wordrange);
            break;
        default:
            style.html(style.html().replace(css_collapse_wordrange, ''));
        }
    }
    // change "highlight_bookmarked" setting
    else if (option == 2) {
        if (highlight_bookmarked == 'yes') {
            style.append(css_bookmarked);
        } else {
            style.html(style.html().replace(css_bookmarked, ''));
        }
    }
}

function generateCss(className){
    return {
        'hide': '#main:not(.bookmarks-show) li.has-kudos,#main:not(.bookmarks-show) li.'+className+' {display: none !important;}',
        'collapse': 'li.'+className+' > ul,li.'+className+' blockquote.userstuff.summary,li.'+className+' dl.stats,li.'+className+' .header .fandoms.heading,li.'+className+'.bookmark > .recent {display: none !important;}li.'+className+' ul.required-tags {opacity: 0.6;}li.'+className+' ul.required-tags li + li {position: absolute; left: 56px; top: 0px;}li.'+className+' ul.required-tags li + li + li {left: 28px;}li.'+className+' ul.required-tags li + li + li + li {left: 84px; top: 0px;}li.'+className+' .header {min-height: 27px;}li.'+className+' .header .heading {margin: 0.375em 5.25em 0px 121px;}'
    }
}

})();