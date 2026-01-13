// ==UserScript==
// @name          MediathekViewWeb - Single Click Download
// @description   Direct download of shows via single click
// @author        TheRealHawk
// @license       MIT
// @namespace     https://greasyfork.org/en/users/18936-therealhawk
// @match         https://mediathekviewweb.de/*
// @version       2.0
// @require       https://ajax.googleapis.com/ajax/libs/jquery/3.6.4/jquery.min.js
// @require       https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.30.1/moment.min.js
// @grant         GM_download
// @downloadURL https://update.greasyfork.org/scripts/438671/MediathekViewWeb%20-%20Single%20Click%20Download.user.js
// @updateURL https://update.greasyfork.org/scripts/438671/MediathekViewWeb%20-%20Single%20Click%20Download.meta.js
// ==/UserScript==

/* globals $, moment */

(function() {
    'use strict';

    const CONFIG = {
        hoverColor: '#0ce3ac',
        defaultColor: '#ffffff',
        pulsateDuration: 200,
        columnIndices: {
            channel: 0,
            topic: 1,
            title: 2,
            date: 4,
            actions: 7
        }
    };

    function sanitizeFilename(text) {
        return text
            .replace(/[\\\?\.\*<>]/g, '')
            .replace(/[\|:/]/g, ' - ')
            .replace(/"/g, '\'')
            .replace(/[\s]{2,}/g, ' ')
            .trim();
    }

    function extractVideoUrl(row) {
        const actionsCell = $(row).find('td').eq(CONFIG.columnIndices.actions);
        const videoLink = actionsCell.find('a[href*=".mp4"]').first();
        return videoLink.length ? videoLink.attr('href') : null;
    }

    function formatDate(dateString) {
        const parsed = moment(dateString, 'DD.MM.YYYY', true);
        return parsed.isValid() ? parsed.format('YYYY-MM-DD') : dateString;
    }

    function pulsateEffect(element) {
        const $el = $(element);
        const originalOpacity = $el.css('opacity');
        
        $el.stop(true, true)
           .animate({opacity: 0.3}, CONFIG.pulsateDuration / 2)
           .animate({opacity: originalOpacity}, CONFIG.pulsateDuration / 2);
    }

    function downloadVideo(url, filename) {
        if (!url) {
            console.error('No video URL found');
            return;
        }

        GM_download({
            url: url,
            name: filename,
            saveAs: true,
            onerror: function(error) {
                console.error('Download failed:', error);
            }
        });
    }

    function createClickHandler(row, filenameFormat) {
        return function(event) {
            event.preventDefault();
            event.stopPropagation();
            
            pulsateEffect(this);
            
            const $cells = $(row).find('td');
            const url = extractVideoUrl(row);
            
            if (!url) {
                console.warn('No download URL available');
                return;
            }

            const topic = $cells.eq(CONFIG.columnIndices.topic).text().trim();
            const title = $cells.eq(CONFIG.columnIndices.title).text().trim();
            const date = $cells.eq(CONFIG.columnIndices.date).text().trim();
            const formattedDate = formatDate(date);

            let filename;
            switch(filenameFormat) {
                case 'topic':
                    filename = `${formattedDate} - ${sanitizeFilename(topic)} - ${sanitizeFilename(title)}.mp4`;
                    break;
                case 'title':
                    filename = `${formattedDate} - ${sanitizeFilename(title)}.mp4`;
                    break;
                case 'date':
                    filename = `${formattedDate}.mp4`;
                    break;
                default:
                    filename = `${formattedDate} - ${sanitizeFilename(title)}.mp4`;
            }

            downloadVideo(url, filename);
        };
    }

    function attachClickHandlers() {
        const selector = 'table tbody tr.result-row:not([data-download-enabled])';
        const $rows = $(selector);

        if ($rows.length === 0) return;

        $rows.each(function() {
            const $row = $(this);
            const $cells = $row.find('td');

            if ($cells.length < 5) return;

            $row.attr('data-download-enabled', 'true');

            const $topicCell = $cells.eq(CONFIG.columnIndices.topic);
            const $titleCell = $cells.eq(CONFIG.columnIndices.title);
            const $dateCell = $cells.eq(CONFIG.columnIndices.date);

            $topicCell
                .css('cursor', 'pointer')
                .on('mouseenter', function() { $(this).css('color', CONFIG.hoverColor); })
                .on('mouseleave', function() { $(this).css('color', CONFIG.defaultColor); })
                .on('click', createClickHandler(this.parentElement, 'topic'));

            $titleCell
                .css('cursor', 'pointer')
                .on('mouseenter', function() { $(this).css('color', CONFIG.hoverColor); })
                .on('mouseleave', function() { $(this).css('color', CONFIG.defaultColor); })
                .on('click', createClickHandler(this.parentElement, 'title'));

            $dateCell
                .css('cursor', 'pointer')
                .on('mouseenter', function() { $(this).css('color', CONFIG.hoverColor); })
                .on('mouseleave', function() { $(this).css('color', CONFIG.defaultColor); })
                .on('click', createClickHandler(this.parentElement, 'date'));
        });
    }

    function initialize() {
        if ($('table tbody').length === 0) {
            setTimeout(initialize, 500);
            return;
        }

        attachClickHandlers();

        const observer = new MutationObserver(function(mutations) {
            let shouldUpdate = false;
            
            for (let mutation of mutations) {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    shouldUpdate = true;
                    break;
                }
            }
            
            if (shouldUpdate) {
                attachClickHandlers();
            }
        });

        const targetNode = $('table tbody')[0];
        if (targetNode) {
            observer.observe(targetNode, {
                childList: true,
                subtree: false
            });
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }
})();
