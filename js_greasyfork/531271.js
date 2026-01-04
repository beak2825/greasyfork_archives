// ==UserScript==
// @name         AO3: Warn for Old Publication Date on Drafts
// @namespace    https://greasyfork.org/en/users/906106-escctrl
// @description  Drafts publish with their initial creation date. This script shows a hint to update the publication date before you post the work.
// @author       escctrl
// @version      2.0
// @match        https://*.archiveofourown.org/works/*/edit
// @grant        none
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.7.0/jquery.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/531271/AO3%3A%20Warn%20for%20Old%20Publication%20Date%20on%20Drafts.user.js
// @updateURL https://update.greasyfork.org/scripts/531271/AO3%3A%20Warn%20for%20Old%20Publication%20Date%20on%20Drafts.meta.js
// ==/UserScript==

/* eslint-disable no-multi-spaces */
/* global jQuery */

(function($) {
    'use strict';

    // stop if this is not a draft but an already posted work
    if ($('input[name="save_button"]').length === 0) return;

    // compare the (possibly hidden) selected publication date with current
    let day   = $('#work_chapter_attributes_published_at_3i, #chapter_published_at_3i').prop('value');
    let month = $('#work_chapter_attributes_published_at_2i, #chapter_published_at_2i').prop('value');
    let year  = $('#work_chapter_attributes_published_at_1i, #chapter_published_at_1i').prop('value');

    let selectedDate = new Date(`${month} ${day}, ${year} 00:00`);
    let currentDate = new Date();

    // if the dates don't match, show a warning to user with a button to conveniently set the publication to today
    if (selectedDate.toDateString() !== currentDate.toDateString()) {
        $('#work-form, #chapter-form').find('fieldset').last().append(`<p id="warnOldPublishDate" class="caution notice">This draft is using an old publication date.
                                     You might want to <button type="button" id="setNewPublishDate">update it to today's date</button>.</p>`);
    }

    $('button#setNewPublishDate').on('click', function(e) {
        e.preventDefault(); // don't try to submit the form

        if ($('#work-form').length > 0 && !$('#backdate-options-show').prop('checked')) $('#backdate-options-show').trigger('click'); // mimick user click -> trigger events to show fields
        $('#work_chapter_attributes_published_at_3i, #chapter_published_at_3i').prop('value', currentDate.getDate()); // set today's date
        $('#work_chapter_attributes_published_at_2i, #chapter_published_at_2i').prop('value', currentDate.getMonth()+1); // set today's month (getMonth is zero-based)
        $('#work_chapter_attributes_published_at_1i, #chapter_published_at_1i').prop('value', currentDate.getFullYear()); // set today's year (4-digit version)

        $('#warnOldPublishDate').hide(); // hide the warning message
        $('dt.backdate, dt#managePublicationDate')[0].scrollIntoView(); // scroll to the updated publication date for visual confirmation
    });

})(jQuery);