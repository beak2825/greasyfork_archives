// ==UserScript==
// @name         Motherless.com - Sort Videos by Views with Pagination
// @namespace    http://tampermonkey.net/
// @version      1.13
// @description  Sorts all videos on motherless.com by views and paginates every 2500 videos
// @author       Grok (xAI)
// @match        *://*.motherless.com/*
// @require      http://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/529241/Motherlesscom%20-%20Sort%20Videos%20by%20Views%20with%20Pagination.user.js
// @updateURL https://update.greasyfork.org/scripts/529241/Motherlesscom%20-%20Sort%20Videos%20by%20Views%20with%20Pagination.meta.js
// ==/UserScript==

(function($) {
    'use strict';

    // Parse view counts (e.g., 78.4K -> 78400, 1.2M -> 1200000)
    function parseViews(text) {
        text = text.trim().toLowerCase();
        let multiplier = 1;
        if (text.includes('k')) multiplier = 1000;
        if (text.includes('m')) multiplier = 1000000;
        let number = parseFloat(text.replace(/[^0-9.]/g, ''));
        return isNaN(number) ? 0 : Math.round(number * multiplier);
    }

    // Display videos for a specific page
    function displayPage($container, videoData, page, videosPerPage) {
        $container.empty();
        const start = (page - 1) * videosPerPage;
        const end = Math.min(start + videosPerPage, videoData.length);
        for (let i = start; i < end; i++) {
            $container.append(videoData[i].element);
        }
        console.log(`Displayed page ${page}: videos ${start + 1} to ${end}`);
        updatePaginationControls($container, videoData, page, videosPerPage);
    }

    // Update pagination controls
    function updatePaginationControls($container, videoData, currentPage, videosPerPage) {
        const totalVideos = videoData.length;
        const totalPages = Math.ceil(totalVideos / videosPerPage);
        let $pagination = $('#pagination-controls');
        if ($pagination.length) $pagination.remove();

        $pagination = $('<div id="pagination-controls"></div>').css({
            position: 'fixed',
            bottom: '10px',
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: '#ffffff',
            padding: '10px',
            border: '1px solid #000000',
            zIndex: 9999,
            textAlign: 'center'
        });

        if (totalPages <= 1) {
            $pagination.text(`Total videos: ${totalVideos}`);
            $('body').append($pagination);
            return;
        }

        const $prev = $('<button>Previous</button>').css({ margin: '0 5px', cursor: 'pointer' });
        const $next = $('<button>Next</button>').css({ margin: '0 5px', cursor: 'pointer' });
        const $pageInfo = $('<span></span>').text(` Page ${currentPage} of ${totalPages} (${totalVideos} videos) `);

        if (currentPage === 1) $prev.prop('disabled', true);
        if (currentPage === totalPages) $next.prop('disabled', true);

        $prev.click(() => displayPage($container, videoData, currentPage - 1, videosPerPage));
        $next.click(() => displayPage($container, videoData, currentPage + 1, videosPerPage));

        $pagination.append($prev, $pageInfo, $next);
        $('body').append($pagination);
    }

    // Fetch and sort all videos, then paginate
    function sortAndPaginate($container, $initialVideos) {
        let $loadingIndicator = $('<div id="loading-indicator">Loading page 1...</div>')
            .css({
                position: 'fixed',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                color: '#ffffff',
                padding: '20px',
                borderRadius: '5px',
                zIndex: 10000,
                fontSize: '20px'
            });
        $('body').append($loadingIndicator);

        // Detect total pages
        let $pageLinks = $('a[href*="page="], .page, .page-item').filter(function() {
            return $(this).text().match(/^\d+$/) || $(this).attr('href')?.match(/page=(\d+)/);
        });
        let totalPages = 1;
        if ($pageLinks.length) {
            let maxPage = 0;
            $pageLinks.each(function() {
                let pageNum = parseInt($(this).text()) || parseInt($(this).attr('href')?.match(/page=(\d+)/)?.[1]);
                if (pageNum && pageNum > maxPage) maxPage = pageNum;
            });
            totalPages = maxPage;
            console.log('Total pages detected:', totalPages);
        }

        let baseUrl = window.location.href.split('?')[0];
        let videoData = [];
        const videosPerPage = 2500;

        // Add initial page videos
        $initialVideos.each(function() {
            let $this = $(this);
            let viewsText = $this.find('*').filter(function() {
                return $(this).text().trim().match(/^\d+(\.\d+)?[km]?$/i);
            }).first().text() || '0';
            videoData.push({ element: $this.clone(), views: parseViews(viewsText) });
        });
        console.log('Initial videos:', videoData.length);

        if (totalPages <= 1) {
            videoData.sort((a, b) => b.views - a.views);
            $loadingIndicator.remove();
            displayPage($container, videoData, 1, videosPerPage);
            return;
        }

        let pagesFetched = 1;
        function fetchPage(page) {
            if (page > totalPages) {
                console.log('All pages fetched. Total videos:', videoData.length);
                $loadingIndicator.text('Sorting...');
                videoData.sort((a, b) => b.views - a.views);
                $loadingIndicator.remove();
                displayPage($container, videoData, 1, videosPerPage);
                return;
            }

            $loadingIndicator.text(`Loading page ${page} of ${totalPages}...`);
            console.log('Fetching page:', page);
            $.get(`${baseUrl}?page=${page}`, function(data) {
                let $pageContent = $(data);
                let $videos = $pageContent.find('.thumb.video, .media-item, .thumb-container');
                console.log('Videos from page', page, ':', $videos.length);

                $videos.each(function() {
                    let $this = $(this);
                    let viewsText = $this.find('*').filter(function() {
                        return $(this).text().trim().match(/^\d+(\.\d+)?[km]?$/i);
                    }).first().text() || '0';
                    videoData.push({ element: $this.clone(), views: parseViews(viewsText) });
                });

                pagesFetched++;
                fetchPage(page + 1);
            }).fail(function(xhr, status, error) {
                console.log('Failed to fetch page:', page, 'Error:', error);
                pagesFetched++;
                fetchPage(page + 1); // Continue on failure
            });
        }

        fetchPage(2);
    }

    // Wait for videos to load
    function waitForVideos(callback) {
        let attempts = 0;
        const maxAttempts = 10;
        const interval = setInterval(function() {
            let $videos = $('.thumb.video, .media-item, .thumb-container');
            if ($videos.length > 0 || attempts >= maxAttempts) {
                clearInterval(interval);
                callback($videos);
            }
            attempts++;
        }, 500);
    }

    $(document).ready(function() {
        waitForVideos(function($videos) {
            let $container = $videos.parent('.thumbs, .media-list, .video-list');
            if ($container.length === 0) $container = $videos.parent();

            if ($videos.length > 0 && $container.length > 0) {
                let sortButton = $('<button>Sort All Videos with Pagination</button>')
                    .css({
                        position: 'fixed',
                        top: '10px',
                        right: '10px',
                        zIndex: 9999,
                        backgroundColor: '#ffffff',
                        color: '#000000',
                        padding: '5px 10px',
                        border: '1px solid #000000',
                        cursor: 'pointer'
                    })
                    .click(function() {
                        sortAndPaginate($container, $videos);
                    });

                $('body').append(sortButton);
            } else {
                console.log('No video gallery detected.');
            }
        });
    });

})(jQuery);