// ==UserScript==
// @name         Google Timeline Durations
// @version      1.1
// @description  Calculates and displays the durations per point in history
// @author       Colja Carls
// @match        https://www.google.com/maps/timeline*
// @require      https://code.jquery.com/jquery-3.4.1.slim.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.24.0/moment.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.24.0/locale/de.js
// @grant        none
// @namespace https://greasyfork.org/users/316810
// @downloadURL https://update.greasyfork.org/scripts/387375/Google%20Timeline%20Durations.user.js
// @updateURL https://update.greasyfork.org/scripts/387375/Google%20Timeline%20Durations.meta.js
// ==/UserScript==

(function($) {
    'use strict';

    const TIMEFORMAT = 'HH:mm';

    const calculateDurations = () => {
        console.log('Google Timeline Durations: Calculating durations');
        const $timelineItems = $('.place-history-moment-outer');
        const $durationTexts = $timelineItems.find('.duration-text');
        const $durationsFiltered = $durationTexts.filter(function(index) {
            return $($durationTexts[index]).find('.segment-duration-part').length === 2;
        });
        $('.gtd-durations').remove();
        $durationsFiltered.each(function() {
            const $span = $(this);
            const segments = $span.find('.segment-duration-part')
            .map(function() {
                return $(this).text();
            })
            .get();
            const start = moment(segments[0], TIMEFORMAT);
            const end = moment(segments[1], TIMEFORMAT);
            const minutes = +end.diff(start, 'minutes');

            let span;
            if (minutes >= 0) {
                const spanHours = Math.floor(minutes / 60);
                const spanMinutes = minutes % 60 < 10 ? `0${minutes % 60}` : minutes % 60;
                span = `${spanHours}:${spanMinutes}`;
            } else {
                span = '---';
            }

            $span.append(`<span class="gtd-durations"><br><span>(${span})</span></span>`);
        });
    };

    calculateDurations();

    const $histogram = $('.histogram').eq(0);
    $histogram.on('click', () => {
        setTimeout(() => calculateDurations(), 800)
    });
})(jQuery);