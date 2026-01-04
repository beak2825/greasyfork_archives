// ==UserScript==
// @name         FFLogs Diff Column
// @namespace    https://greasyfork.org/en/users/1317382
// @version      1.2
// @description  Add a diff column to FFLogs events table
// @author       aya
// @match        https://www.fflogs.com/reports/*
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/497819/FFLogs%20Diff%20Column.user.js
// @updateURL https://update.greasyfork.org/scripts/497819/FFLogs%20Diff%20Column.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let diffMode = 'all';
    let observer = null;
    let controlStripObserver = null;

    function waitForDependencies(callback) {
        if (typeof jQuery !== 'undefined') {
            callback();
        } else {
            setTimeout(() => waitForDependencies(callback), 100);
        }
    }

    function formatDiff(diff) {
        return diff.toFixed(3).replace(/(\.0+|0+)$/, '');
    }

    function timeToMilliseconds(timeStr) {
        const [minutes, seconds] = timeStr.replace('-', '').split(':').map(parseFloat);
        return (timeStr.startsWith('-') ? -1 : 1) * (minutes * 60000 + seconds * 1000);
    }

    function addDiffColumn() {
        if (!$(".events-table thead th").length || $(".events-table thead th.diff-column").length) return;
        $(".events-table thead th").first().after("<th class='ui-state-default sorting_disabled diff-column'>Diff</th>");
        let lastRelevantTime = null;
        $(".events-table tbody tr").each(function() {
            const $row = $(this);
            const $timeCell = $row.find('.main-table-number');
            if ($row.find('td.diff-column').length) return;
            let isRelevantRow = true;
            if (diffMode === 'subset') {
                const $eventCell = $row.find('.event-ability-cell');
                isRelevantRow = !$eventCell.hasClass('indented-cell');
            }
            const current = timeToMilliseconds($timeCell.text());
            let diffText = '-';
            if (isRelevantRow) {
                if (lastRelevantTime !== null) {
                    diffText = formatDiff((current - lastRelevantTime) / 1000);
                }
                lastRelevantTime = current;
            }
            $timeCell.after("<td class='diff-column' style='width:2em'>" + diffText + "</td>");
        });
    }

    function urlHasEventsAndCastsParams() {
        const url = window.location.href;
        return url.includes("&view=events") && url.includes("&type=casts");
    }

    function handleUrlChange() {
        if (observer) observer.disconnect();
        if (controlStripObserver) controlStripObserver.disconnect();

        if (urlHasEventsAndCastsParams()) {
            observer = new MutationObserver((mutations) => {
                if (mutations.some(mutation => mutation.addedNodes.length && document.querySelector('.events-table'))) {
                    addDiffColumn();
                }
            });

            observer.observe(document.body, { childList: true, subtree: true });
            waitForDependencies(addDiffColumn);

            controlStripObserver = new MutationObserver((mutations) => {
                if (document.querySelector('.events-view-control-strip')) {
                    addDiffModeToggle();
                }
            });

            controlStripObserver.observe(document.body, { childList: true, subtree: true });
        } else {
            diffMode = 'all';
            $('#toggle-diff-mode').text('Diff: All Events');
        }
    }

    function toggleDiffMode() {
        diffMode = (diffMode === 'all') ? 'subset' : 'all';
        $('#toggle-diff-mode').text(diffMode === 'all' ? 'Diff: All Events' : 'Diff: GCDs only');
        $('.diff-column').remove();
        addDiffColumn();
    }

    function addDiffModeToggle() {
        if (!$('#toggle-diff-mode').length) {
            const $toggleOption = $('<div/>', {
                id: 'toggle-diff-mode',
                class: 'events-view-control',
                text: 'Diff: All Events',
                click: toggleDiffMode
            });
            $('.events-view-control-strip').append($toggleOption);
        }
    }

    $(document).ready(function() {
        handleUrlChange();
        window.addEventListener('popstate', handleUrlChange);

        function proxyHistoryMethod(method) {
            return new Proxy(method, {
                apply(target, thisArg, argArray) {
                    target.apply(thisArg, argArray);
                    window.dispatchEvent(new Event('popstate'));
                }
            });
        }

        history.pushState = proxyHistoryMethod(history.pushState);
        history.replaceState = proxyHistoryMethod(history.replaceState);
    });

})();