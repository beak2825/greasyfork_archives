// ==UserScript==
// @name         Dog tag helper
// @namespace    http://tampermonkey.net/
// @version      1.4.1
// @description  Displays an indicator if user has not lost a defend since dog tags began
// @author       cooksie
// @match        https://www.torn.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/392252/Dog%20tag%20helper.user.js
// @updateURL https://update.greasyfork.org/scripts/392252/Dog%20tag%20helper.meta.js
// ==/UserScript==


const dogTagIcon = '<svg xmlns="http://www.w3.org/2000/svg" class="default___3oPC0 " filter="url(#whiteFilter)" fill="url(#linear-gradient)" stroke="#d4d4d4" stroke-width="0" height="46" width="46" viewBox="-100 -100 700 500"><path d="m426.558594 37.441406c-22.632813-22.65625-52.960938-35.964844-84.957032-37.28125-1.839843-.0781248-3.679687-.160156-5.601562-.160156h-208c-70.691406 0-128 57.308594-128 128s57.308594 128 128 128h208c51.769531-.03125 98.429688-31.222656 118.246094-79.046875s8.890625-102.878906-27.6875-139.511719zm-370.558594 114.558594c-13.253906 0-24-10.746094-24-24s10.746094-24 24-24 24 10.746094 24 24-10.746094 24-24 24zm0 0"></path></svg>';
const invalidTagIcon = '<svg viewBox="0 0 500 500" width="46pt" xmlns="http://www.w3.org/2000/svg"><g><path d="m426.558594 37.441406c-22.632813-22.65625-52.960938-35.964844-84.957032-37.28125-1.839843-.0781248-3.679687-.160156-5.601562-.160156h-208c-70.691406 0-128 57.308594-128 128s57.308594 128 128 128h208c51.769531-.03125 98.429688-31.222656 118.246094-79.046875s8.890625-102.878906-27.6875-139.511719zm-370.558594 114.558594c-13.253906 0-24-10.746094-24-24s10.746094-24 24-24 24 10.746094 24 24-10.746094 24-24 24zm0 0" fill="#ff0000"/><path d="m464 128c0 70.691406-57.308594 128-128 128h-203.28125c70.882812-38.320312 157.359375-112.640625 208.882812-255.839844 68.492188 2.867188 122.511719 59.285156 122.398438 127.839844zm0 0" fill="#ff0000"/><path d="m336 48h-208c-22.269531.015625-43.527344 9.320312-58.640625 25.679688 25.03125 6.121093 42.640625 28.550781 42.640625 54.320312s-17.609375 48.199219-42.640625 54.320312c15.113281 16.359376 36.371094 25.667969 58.640625 25.679688h208c44.183594 0 80-35.816406 80-80s-35.816406-80-80-80zm0 0" fill="#ffffff" fill-opacity="1 "/><text x="130" y="180" font-family="Verdana" font-size="150" fill="red" >NO</text></g></svg>';
const validTagIcon = '<svg viewBox="0 0 500 500" width="46pt" xmlns="http://www.w3.org/2000/svg"><g><path d="m426.558594 37.441406c-22.632813-22.65625-52.960938-35.964844-84.957032-37.28125-1.839843-.0781248-3.679687-.160156-5.601562-.160156h-208c-70.691406 0-128 57.308594-128 128s57.308594 128 128 128h208c51.769531-.03125 98.429688-31.222656 118.246094-79.046875s8.890625-102.878906-27.6875-139.511719zm-370.558594 114.558594c-13.253906 0-24-10.746094-24-24s10.746094-24 24-24 24 10.746094 24 24-10.746094 24-24 24zm0 0" fill="#00ff00"/><path d="m464 128c0 70.691406-57.308594 128-128 128h-203.28125c70.882812-38.320312 157.359375-112.640625 208.882812-255.839844 68.492188 2.867188 122.511719 59.285156 122.398438 127.839844zm0 0" fill="#00ff00"/><path d="m336 48h-208c-22.269531.015625-43.527344 9.320312-58.640625 25.679688 25.03125 6.121093 42.640625 28.550781 42.640625 54.320312s-17.609375 48.199219-42.640625 54.320312c15.113281 16.359376 36.371094 25.667969 58.640625 25.679688h208c44.183594 0 80-35.816406 80-80s-35.816406-80-80-80zm0 0" fill="#ffffff" fill-opacity="1 "/><text x="110" y="180" font-family="Verdana" font-size="150" fill="#00FF00" >YES</text></g></svg>';

function parseCellData(cell) {
  return parseInt(cell.text().replace(/,/g, ''));
}

function checkTagValidity() {
    const dogTagStartDateCell = $('table').find('tr td:contains("Nov 5, 2020")');
    const startDateDefendCount = parseCellData($(dogTagStartDateCell.siblings()[1]));
    const newDateCells = $(dogTagStartDateCell).parent().prevAll();

    const parsedDateCellValues = newDateCells.map((i, dateCell) => {
        const defendsOnDateCell = $($(dateCell).find('td')[2]);
        return parseCellData($(defendsOnDateCell));
    });


    const highestDefendCountSinceStart = Math.max.apply(null, parsedDateCellValues);
    const iconStyles = 'position: absolute; margin-left: 10px; margin-top: -6px;';

    if (highestDefendCountSinceStart === startDateDefendCount) {
        $('.content-title h4').after(`<i style="${iconStyles}">${validTagIcon}</i>`);
        return false;
    } else {
        $('.content-title h4').after(`<i style="${iconStyles}">${invalidTagIcon}</i>`);
        return false;
    }
}

$(document).ready(function(){
    // add a delay because graphs load after page render
    // there's no visible way to hook into the onload event, so we just have to wait
    if (window.location.href.includes('profiles.php')) {
        setTimeout(() => {
            const personalStatsButton = $('.profile-button-personalStats');
            if (personalStatsButton) {
                const personalStatsHref = $(personalStatsButton).attr('href');
                const href = `${personalStatsHref}&stats=defendslost&from=1%20month`;
                $('.profile-button:last-of-type').after(`<a href="${href}" class="profile-button profile-button-personalStats active">${dogTagIcon}</a>`);
            }
        }, 1000);
        return;
    }

    if (window.location.href.includes('defendslost')) {
        setTimeout(() => {
            checkTagValidity();
        }, 1000);
    }
});
