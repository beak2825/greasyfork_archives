// ==UserScript==
// @name         Motherless.com - Sort Videos by Views Across All Pages
// @namespace    http://tampermonkey.net/
// @version      1.11
// @description  Sorts videos on motherless.com by views across all pages with a loading indicator
// @author       Grok (xAI)
// @match        *://*.motherless.com/*
// @require      http://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/529138/Motherlesscom%20-%20Sort%20Videos%20by%20Views%20Across%20All%20Pages.user.js
// @updateURL https://update.greasyfork.org/scripts/529138/Motherlesscom%20-%20Sort%20Videos%20by%20Views%20Across%20All%20Pages.meta.js
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

    // Sort videos in a specific container
    function sortVideos($container, $items) {
        let videoData = [];

        console.log('Sorting video items:', $items.length);

        $items.each(function() {
            let $this = $(this);
            let $viewsElement = $this.find('*').filter(function() {
                return $(this).text().trim().match(/^\d+(\.\d+)?[km]?$/i);
            }).first();

            let viewsText = $viewsElement.length ? $viewsElement.text() : 'Not found';
            let views = viewsText !== 'Not found' ? parseViews(viewsText) : 0;

            console.log('Video:', $this.find('a').attr('href'), 'Views Text:', viewsText, 'Parsed Views:', views);

            videoData.push({ element: $this, views: views });
        });

        if (videoData.length === 0) {
            console.log('No videos found.');
            return;
        }

        // Sort by views in descending order
        videoData.sort((a, b) => b.views - a.views);

        // Clear and re-append all sorted videos
        $container.empty();
        videoData.forEach(item => $container.append(item.element));
        console.log('Sorting complete! All videos displayed.');
        $('#loading-indicator').remove(); // Remove loading indicator when done
    }

    // Fetch and sort videos from all pages
    function sortAllPages($container, $initialVideos) {
        // Add loading indicator
        let $loadingIndicator = $('<div id="loading-indicator">Loading...</div>')
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

        // Find the highest page number
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
            console.log('Pagination elements found:', $pageLinks.length);
            console.log('Highest page detected:', totalPages);
            console.log('Sample pagination element:', $pageLinks.last().prop('outerHTML'));
        } else {
            console.log('No pagination elements found.');
        }

        let baseUrl = window.location.href.split('?')[0];
        let allVideos = $initialVideos.clone();

        console.log('Total pages detected:', totalPages);
        console.log('Initial videos:', $initialVideos.length);

        if (totalPages <= 1) {
            console.log('Only one page detected or pagination not found, sorting current videos only.');
            sortVideos($container, allVideos);
            return;
        }

        let pagesFetched = 1;

        function fetchPage(page) {
            if (page > totalPages) {
                console.log('All pages fetched. Total videos collected:', allVideos.length);
                sortVideos($container, allVideos);
                return;
            }

            console.log('Fetching page:', page);
            $.get(`${baseUrl}?page=${page}`, function(data) {
                let $pageContent = $(data);
                let $videos = $pageContent.find('.thumb.video, .media-item, .thumb-container');
                console.log('Videos from page', page, ':', $videos.length);
                allVideos = allVideos.add($videos);
                pagesFetched++;
                fetchPage(page + 1);
            }).fail(function(xhr, status, error) {
                console.log('Failed to fetch page:', page, 'Status:', status, 'Error:', error);
                pagesFetched++;
                fetchPage(page + 1);
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

            console.log('Container found:', $container.length);
            console.log('Videos found:', $videos.length);

            if ($videos.length > 0 && $container.length > 0) {
                let sortButton = $('<button>Sort All Pages by Views</button>')
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
                        sortAllPages($container, $videos);
                    });

                $('body').append(sortButton);

                if ($videos.length > 0) {
                    console.log('HTML of first video item:', $videos.first().prop('outerHTML'));
                }
            } else {
                console.log('No video gallery detected on this page.');
            }
        });
    });

})(jQuery);