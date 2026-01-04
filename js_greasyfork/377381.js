// ==UserScript==
// @name        rarbg-visual-ordering-opinionated
// @namespace   https://gitlab.com/aspootarya
// @version     2022.04.22
// @description Colors cells to classify them
// @author      aspootarya
// @contributor darkred
// @license     MIT
// @include     /^(https?:)?\/\/(www\.)?(rarbg|rbg(\.(bypassed|unblockall|unblocked))?|rarbgaccess(ed)?|rarbgget|rarbgmirror(ed)?|rarbgproxy|rarbgproxied|rarbgprx|rarbgs|rarbgto|rarbgunblock|proxyrarbg|unblocktorrent)\.(to|com|org|is|xyz|lol|vc|link)\/(rarbg-proxy-unblock\/)?(torrents\.php.*|catalog\/.*|tv\/.*|top10)$/
// @grant       none
// @require     https://cdnjs.cloudflare.com/ajax/libs/arrive/2.4.1/arrive.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.24.0/moment.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/moment-timezone/0.5.6/moment-timezone-with-data-2010-2020.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/jstimezonedetect/1.0.6/jstz.min.js
// @run-at      document-idle
// @downloadURL https://update.greasyfork.org/scripts/406946/rarbg-visual-ordering-opinionated.user.js
// @updateURL https://update.greasyfork.org/scripts/406946/rarbg-visual-ordering-opinionated.meta.js
// ==/UserScript==

/* global jstz, moment */
function addAndModifyColumns() {

    var titleCells = document.querySelectorAll('.lista2t > tbody > tr[class="lista2"] > td:nth-child(2)'); // the column 'Title'
    var sizeCells = document.querySelectorAll('.lista2t > tbody > tr[class="lista2"] > td:nth-child(4)'); // the column 'Size'
    var seedCells = document.querySelectorAll('.lista2t > tbody > tr[class="lista2"] > td:nth-child(5)'); // the column 'Seeds'

    for (let i = 0; i < sizeCells.length; i++) {
        sizeCells[i].setAttribute("style", getColorByFileSize(getFileSize(sizeCells[i].innerText)));
        seedCells[i].innerHTML = `${seedCells[i].textContent}`;
        seedCells[i].setAttribute("style", getColorBySeeds(Number(seedCells[i].innerText)));
        if (titleCells[i].innerText.match(/(?:\.SD|480p|\sSD)/i)) {
            titleCells[i].setAttribute("style", getColorByRarity('Legendary'));
        }
    }
}

// Customize the strings in the locale to display "1 minute ago" instead of "a minute ago" (https://github.com/moment/moment/issues/3764#issuecomment-279928245)
moment.updateLocale('en', {
    relativeTime: {
        future: 'in %s',
        past: '%s ago',
        s: 'seconds',
        m: '1 minute',
        mm: '%d minutes',
        h: '1 hour',
        hh: '%d hours',
        d: '1 day',
        dd: '%d days',
        M: '1 month',
        MM: '%d months',
        y: '1 year',
        yy: '%d years'
    }
});

function convertToLocalTimezone(timestamps) {
    const localTimezone = jstz.determine().name();
    const serverTimezone = 'Europe/Berlin';		// GMT+1
    for (let i = 0; i < timestamps.length; i++) {
        const initialTimestamp = timestamps[i].textContent;
        if (moment(initialTimestamp, 'YYYY-MM-DD HH:mm:ss', true).isValid()) {		// As of moment.js v2.3.0, you may specify a boolean for the last argument to make Moment use strict parsing. Strict parsing requires that the format and input match exactly, including delimeters.
            const convertedToLocalTimezone = moment.tz(initialTimestamp, serverTimezone).tz(localTimezone);
            timestamps[i].textContent = convertedToLocalTimezone.fromNow();
            const format = 'YYYY-MM-DD HH:mm:ss';
            timestamps[i].title = convertedToLocalTimezone.format(format);
            const diffInDays = moment().diff(convertedToLocalTimezone, 'days');
            timestamps[i].setAttribute("style", getColorByRarity(getRarityByDateDiff(diffInDays)));
        }
    }

    // recalculate the relative times every 10 sec
    (function () {
        for (let i = 0; i < timestamps.length; i++) {
            timestamps[i].textContent = moment(timestamps[i].title).fromNow();
        }
        setTimeout(arguments.callee, 1 * 60 * 1000);
    })();

}

function getRarityByDateDiff(diffInDays) {
    if (diffInDays < 7) {
        return 'Legendary';
    }
    if (diffInDays < 30) {
        return 'Epic';
    }
    if (diffInDays < 90) {
        return 'Rare';
    }
    if (diffInDays < 180) {
        return 'Uncommon';
    }
    return 'Common';
}

function getColorBySeeds(seeds) {
    if (seeds > 50) {
        return getColorByRarity('Legendary');
    }
    if (seeds > 20) {
        return getColorByRarity('Epic');
    }
    if (seeds > 10) {
        return getColorByRarity('Rare');
    }
    if (seeds > 3) {
        return getColorByRarity('Uncommon');
    }
    return getColorByRarity('Common');
}

function getColorByFileSize(fileSize) {
    const MB = 1000000;
    if (fileSize > 120 * MB && fileSize < 1000 * MB) {
        return getColorByRarity('Legendary');
    }
    if (fileSize > 100 * MB && fileSize < 2000 * MB) {
        return getColorByRarity('Epic');
    }
    if (fileSize > 80 * MB && fileSize < 4000 * MB) {
        return getColorByRarity('Rare');
    }
    if (fileSize > 60 * MB && fileSize < 6000 * MB) {
        return getColorByRarity('Uncommon');
    }
    return getColorByRarity('Common');
}

function getColorByRarity(rarity) {
    if (rarity === 'Legendary') {
        return "background-color: #ffc107;"; // material amber 500
    }
    if (rarity === 'Epic') {
        return "color: white; background-color: #9c27b0;"; // material purple 500
    }
    if (rarity === 'Rare') {
        return "color: white; background-color: #3f51b5;"; // material indigo 500
    }
    if (rarity === 'Uncommon') {
        return "background-color: #4caf50;"; // material green 500
    }
    if (rarity === 'Common') {
        return "color: #546e7a; background-color: #eeeeee;"
    }
    return "";
}

function getFileSize(text) {
    let fileSize = text.replace(" ", "");
    if (fileSize.indexOf("MB") != -1) {
        fileSize = fileSize.replace("MB", "");
        fileSize = Number(fileSize);
        fileSize *= 1000000;
    } else if (fileSize.indexOf("GB") != -1) {
        fileSize = fileSize.replace("GB", "");
        fileSize = Number(fileSize);
        fileSize *= 1000000000;
    } else {
        fileSize = 0;
    }
    return fileSize;
}

const timestamps = document.querySelectorAll('td[width="150px"]');
convertToLocalTimezone(timestamps);
addAndModifyColumns();
