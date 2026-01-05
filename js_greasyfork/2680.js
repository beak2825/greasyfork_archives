/**
 *
 * This is a Greasemonkey script and must be run using a Greasemonkey-compatible browser.
 *
 * @author maymay <bitetheappleback@gmail.com>
 * @author Marnen Laibow-Koser <marnen@marnen.org>
 */
// ==UserScript==
// @name           Better FetLife
// @version        0.2
// @namespace      com.maybemaimed.fetlife.better
// @description    Enhances the functionality of various features of FetLife.com. Best used in conjunction with other browser add-ons, such as those that reveal Microformats.
// @include        /^https?://fetlife\.com/(user|event)s/\d+/
// @require        https://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js
// @grant          GM_log
// @downloadURL https://update.greasyfork.org/scripts/2680/Better%20FetLife.user.js
// @updateURL https://update.greasyfork.org/scripts/2680/Better%20FetLife.meta.js
// ==/UserScript==

var FL_BETTER = {};
FL_BETTER.CONFIG = {
    'debug': false, // switch to true to debug.
};

// Utility debugging function.
FL_BETTER.log = function (msg) {
    if (!FL_BETTER.CONFIG.debug) { return; }
    GM_log('BETTER FETLIFE: ' + msg);
};

// Initializations.
FL_BETTER.init = function () {
    FL_BETTER.main();
};
window.addEventListener('DOMContentLoaded', FL_BETTER.init);

// This is the main() function, executed on page load.
// TODO: Mark up events on user pages and users on event pages.
FL_BETTER.main = function () {
    // Determine what type of page and what its ID number is.
    var m = window.location.pathname.match(/^\/(user|event)s\/(\d+)$/);
    FL_BETTER.log('Loaded page for ' + m[1] + ' number ' + m[2] + '.');
    switch (m[1]) {
        // If on a user profile page,
        case 'user':
            FL_BETTER.processUser();
        break;

        // If on an event page,
        case 'event':
            FL_BETTER.processEvent();
        break;
    }
};

FL_BETTER.processEvent = function () {
    var parseDateTime = function (metaDateTimeElement) {
        return metaDateTimeElement.attr('content').replace(/Z$/, '');
    };

    var dateTimeMarkup = function (dateTimeString) {
        return $('<abbr class="value"></abbr>').attr('title', dateTimeString);
    };

    var addTimeMarkup = function (startOrEnd) {
        var timeElement = $('[itemprop=' + startOrEnd + 'Date]');
        var dateTimeString = timeElement[0] ? parseDateTime(timeElement) : null;
        var container = $('<span></span>').addClass('dt' + startOrEnd);
        container.append(dateTimeMarkup(dateTimeString));
        timeElement.after(container);
    };

    $("[itemtype='http://schema.org/Event']").addClass('vevent');
    $('h1[itemprop=name]').addClass('summary');
    $('[itemprop=description]').addClass('description');

    // TODO: Parse venues out of location data and mark them up using hCards
    //       See: http://microformats.org/wiki/hcalendar-brainstorming#hCard_locations
    $($('[itemprop=location]').parents().children('span')[1]).addClass('location');

    addTimeMarkup('start');
    addTimeMarkup('end');

    // Write out URL.
    $('.vevent .description').append('<a style="display: none;" class="url" href="' + window.location.href + '">Make FetLife Better.</a>');
};

FL_BETTER.processUser = function () {
    // Add hCard classes for markup that's done right.
    $('#profile').addClass('vcard');
    $('#profile .pan').addClass('photo');
    $('h2.bottom + p').addClass('adr');
    $($('h2.bottom + p a[href^="/cities"]')).addClass('locality');
    $($('h2.bottom + p a[href^="/administrative_areas"]')).addClass('region');
    $($('h2.bottom + p a[href^="/countries"]')).addClass('country-name');

    // Isolate name and add microformat markup.
    $($('h2.bottom').contents()[0]).wrap('<span class="fn" />');

    // Isolate "About me" content and add microformat markup.
    $($('h3.bottom::first-child').nextUntil('h3.bottom')).wrapAll('<div class="note" />')

    // Write out URL.
    $('#profile').append('<a style="display: none;" class="url" href="' + window.location.href + '">Make FetLife Better.</a>');

};