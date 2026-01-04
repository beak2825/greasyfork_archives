// ==UserScript==
// @name         Torn Race Data Button
// @namespace    underko.torn.scripts.racing
// @version      1.2
// @author       underko[3362751]
// @description  Copy race data as CSV from racing log page
// @match        https://www.torn.com/loader.php?sid=racing*
// @match        https://www.torn.com/page.php?sid=racing*
// @grant        GM.setClipboard
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/541948/Torn%20Race%20Data%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/541948/Torn%20Race%20Data%20Button.meta.js
// ==/UserScript==

/* global $ */

(function () {
    'use strict';

    const observer = new MutationObserver(() => {
        if (document.querySelector('#racingdetails') && allRequiredDataPresent() && !document.querySelector('#copyRaceCsvBtn')) {
            addButton();
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    function allRequiredDataPresent() {
        const skillText = $('.skill').first().text().trim();
        const hasSkill = /^([\d.]+).*Last gain:\s*([\d.]+)/.test(skillText);

        const hasPosition = $('#racingdetails .pd-position').length > 0;
        const hasLap = $('#racingdetails .pd-lap').length > 0;
        const hasTime = $('#racingdetails .pd-completion').length > 0;

        const titles = $('.properties .title').toArray().map(el => $(el).text().trim());
        const hasTrack = titles.some(t => t.startsWith('Track:'));
        const hasType = titles.some(t => t.startsWith('Type:'));

        return hasSkill && hasPosition && hasLap && hasTime && hasTrack && hasType;
    }

    function addButton() {
        const button = $('<button id="copyRaceCsvBtn">')
            .text('Copy Race CSV')
            .css({
                marginLeft: '10px',
                padding: '4px 8px',
                background: '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                float: 'inline-end'
            })
            .click(copyRaceDataToClipboard);

        $('.title___rhtB4').first().prepend(button);
    }

    function formatCompletionTime(completionTime) {
        const parts = completionTime.split(':');

        if (parts.length === 2) {
            // Format is MM:SS.ms → prepend "00:"
            return `00:${completionTime.padStart(8, '0')}`;
        } else if (parts.length === 3) {
            // Format is HH:MM:SS.ms → normalize with leading zeros
            const [h, m, s] = parts;
            const [sec, ms = '00'] = s.split('.');
            return `${h.padStart(2, '0')}:${m.padStart(2, '0')}:${sec.padStart(2, '0')}.${ms.padEnd(2, '0')}`;
        } else {
            return '00:00:00.00'; // fallback for invalid formats
        }
    }

    function copyRaceDataToClipboard() {
        const skillText = $('.skill').first().text().trim();
        const skillMatch = skillText.match(/^([\d.]+).*Last gain:\s*([\d.]+)/);
        const currentRS = skillMatch ? skillMatch[1] : '';
        const rsGain = skillMatch ? skillMatch[2] : '';

        const posText = $('#racingdetails .pd-position').text().trim();
        const lapText = $('#racingdetails .pd-lap').text().trim();
        const completionTime = $('#racingdetails .pd-completion').text().trim();

        const [position, racers] = posText.split('/').map(x => x.trim());
        const [_, totalLaps] = lapText.split('/').map(x => x.trim());
        const timeFormatted = formatCompletionTime(completionTime);

        const titles = $('.properties .title').toArray().map(el => $(el).text().trim());
        const typeText = titles.find(t => t.startsWith('Type:'))?.replace('Type:', '').trim() || '';
        const trackText = titles.find(t => t.startsWith('Track:'))?.replace('Track:', '').trim() || '';

        const dateTime = new Date().toISOString().slice(0, 19).replace('T', ' ');

        const csv = `${dateTime},${trackText},${totalLaps},${typeText},${racers},${position},${currentRS},${rsGain},${timeFormatted}`;
        GM.setClipboard(csv);
        console.log('Copied CSV:', csv);
    }
})();
