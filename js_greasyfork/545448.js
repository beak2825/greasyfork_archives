// ==UserScript==
// @name         Format Dates and Times in Lichess4545
// @namespace    http://tampermonkey.net/
// @version      2025-09-12
// @description  Format's the dates and times in the Lichess4545 Lonewolf league's website to use the user's timezone and preferences. Might work with other Lichess4545 webpages, but I'm to lazy to check.
// @author       Charles Moxey
// @match        https://www.lichess4545.com/lonewolf/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=lichess4545.com
// @require      https://cdn.jsdelivr.net/npm/luxon@3.7.1/build/global/luxon.min.js
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/545448/Format%20Dates%20and%20Times%20in%20Lichess4545.user.js
// @updateURL https://update.greasyfork.org/scripts/545448/Format%20Dates%20and%20Times%20in%20Lichess4545.meta.js
// ==/UserScript==

const DateTime = luxon.DateTime;

// "Borrowed" from user "funky-future" on Stack Overflow (https://stackoverflow.com/a/50537862/16080090)
function replaceInText(element, pattern, replacement) {
    for (let node of element.childNodes) {
        switch (node.nodeType) {
        case Node.ELEMENT_NODE:
            replaceInText(node, pattern, replacement);
            break;
        case Node.TEXT_NODE:
            node.textContent = node.textContent.replace(pattern, replacement);
            break;
        case Node.DOCUMENT_NODE:
            replaceInText(node, pattern, replacement);
        }
    }
}

function formatDateTime(isoDateTime) {
    let dt = DateTime.fromISO(isoDateTime).setLocale('en-US');

    const today = DateTime.now();

    let time_str = dt.toLocaleString(DateTime.TIME_SIMPLE);
    let date_str;

    let daysAwayFromToday = dt.startOf('day').diff(today.startOf('day'), 'days').days

    if (-3 <= daysAwayFromToday && daysAwayFromToday <= -2)
        date_str = `${Math.abs(daysAwayFromToday)} days ago @ `
    else if (daysAwayFromToday === -1)
        date_str = 'Yesterday @ '
    else if (daysAwayFromToday === 0)
        date_str = 'Today @ ';
    else if (daysAwayFromToday === 1)
        date_str = 'Tomorrow @ ';
    else
        date_str = dt.toFormat('EEE, MMM d @ ');

    return date_str + time_str
}


function sortPairings() {
    const $tbody = $('#table-lone-pairings tbody')
    const $rows = $tbody.find('tr')

    $rows.sort(function(a, b) {
        const timeA = $(a).find('time').attr('datetime')
        const timeB = $(b).find('time').attr('datetime')

        const dateA = timeA ? luxon.DateTime.fromISO(timeA) : luxon.DateTime.invalid('no date')
        const dateB = timeB ? luxon.DateTime.fromISO(timeB) : luxon.DateTime.invalid('no date')

        // invalid dates go last
        if (!dateA.isValid && !dateB.isValid) return 0
        if (!dateA.isValid) return 1
        if (!dateB.isValid) return -1

        return dateA.toMillis() - dateB.toMillis()
    })

    $tbody.append($rows)
}



(function() {
    'use strict';

    // Make time elements more readable
    let timeTags = document.querySelectorAll('time');
    timeTags.forEach( (tag) => {
        let formattedDateTime = formatDateTime(tag.getAttribute('datetime'))
        console.log(formattedDateTime)
        tag.innerHTML = formattedDateTime

        replaceInText(tag.parentElement, /UTC/, DateTime.local().offsetNameShort)
    })

    $(window).on('load', sortPairings)
}
)();
