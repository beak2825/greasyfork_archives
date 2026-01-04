// ==UserScript==
// @name         Nyaa MyAnimeList Search Button
// @namespace    https://greasyfork.org/users/whitewriter
// @version      1.3
// @description  Adds a quick MyAnimeList (MAL) search button to Nyaa.si posts (during search and inside posts) for Anime, Manga, and Light Novels.
// @author       WhiteWriter
// @match        https://nyaa.si/*
// @license      MIT
// @icon         https://nyaa.si/static/favicon.png
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/530193/Nyaa%20MyAnimeList%20Search%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/530193/Nyaa%20MyAnimeList%20Search%20Button.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Check if we're inside a post (/view/ in the url) or the main/search page
    const isViewPage = window.location.pathname.startsWith('/view/');

    if (isViewPage) {
        // Handle individual post page
        processViewPage();
    } else {
        // Handle main/search page
        processMainPage();
    }

    // Function to process main/search page
    function processMainPage() {
        // Select all post rows (any <tr> inside <tbody>)
        const rows = document.querySelectorAll('tbody tr');
        rows.forEach(row => {
            // Get category from first <td>
            const categoryTd = row.children[0];
            if (!categoryTd) return;
            const categoryA = categoryTd.querySelector('a');
            if (!categoryA) return;
            const categoryTitle = categoryA.getAttribute('title').toLowerCase();

            // Determine contentType (literature counts for both manga and light novel)
            let contentType;
            if (categoryTitle.includes('anime')) {
                contentType = 'anime';
            } else if (categoryTitle.includes('literature')) {
                contentType = 'manga';
            }
            if (!contentType) return;

            // Get title from second <td>, skipping comments if present
            const titleTd = row.children[1];
            if (!titleTd) return;
            const titleA = Array.from(titleTd.querySelectorAll('a')).find(a => !a.classList.contains('comments'));
            if (!titleA) return;
            const title = titleA.getAttribute('title');

            // Clean title and proceed. contentName is the best approximation to the
            // content's title in order to search on MAL (doesn't need to be exact)
            const contentName = cleanTitle(title);
            if (contentName) {
                addMalButton(row.children[2], contentType, contentName);
            }
        });
    }

    // Function to process individual view page (inside a post)
    function processViewPage() {
        // Get title from <h3 class="panel-title">
        const titleElement = document.querySelector('div.panel-heading h3.panel-title');
        if (!titleElement) return;
        const title = titleElement.textContent;

        // Get category from <div class="col-md-5"> <a>
        const categoryElement = document.querySelector('div.panel-body div.row div.col-md-5 a');
        if (!categoryElement) return;
        const categoryText = categoryElement.textContent.toLowerCase();

        // Determine contentType
        let contentType;
        if (categoryText.includes('anime')) {
            contentType = 'anime';
        } else if (categoryText.includes('literature')) {
            contentType = 'manga';
        }
        if (!contentType) return;

        // Clean title
        const contentName = cleanTitle(title);
        if (contentName) {
            // Add button to panel-footer
            const footer = document.querySelector('div.panel-footer.clearfix');
            if (footer) {
                addMalButton(footer, contentType, contentName);
            }
        }
    }

    // Function to add the MAL button
    function addMalButton(container, contentType, contentName) {
        const baseUrl = contentType === 'anime'
            ? 'https://myanimelist.net/anime.php'
            : 'https://myanimelist.net/manga.php';
        const params = new URLSearchParams();
        params.append('q', contentName);
        const malUrl = `${baseUrl}?${params.toString()}`;

        const buttonHtml = `<a href="${malUrl}" target="_blank" style="display: inline-block; padding: 5px 10px; background-color: #337ab7; color: white; text-decoration: none; border-radius: 3px; margin-left: 5px;">MAL</a>`;
        container.insertAdjacentHTML('beforeend', buttonHtml);
    }

    // Function to clean the title and extract contentName
    function cleanTitle(title) {
        // Remove text within brackets (may sacrifice the button on posts with the content title within brackets)
        let cleaned = title
            .replace(/\[.*?\]/g, '')
            .replace(/\([^()]*?\)/g, '')
            .replace(/\{.*?\}/g, '');

        // Remove specific keywords with optional punctuation
        const keywords = [
            '1080p', '2160p', '720p', '480p', '360p', 'Multi-Audio', 'Multi Audio', '10bit',
            'AV1', 'MP4', 'AAC', 'EAC3', 'E-AC3', 'AC3', 'DTS', 'DTS-HD', 'UHD', 'HDR',
            'English Dub', 'Dual-Audio', 'Dual Audio', 'x264', 'x265', 'h.264', 'h.265',
            'Opus', 'AVI', 'WMV', 'VFVOSTFR', 'BDRip', 'BluRay', 'BD', 'WEB', 'Eng Sub',
            'Subbed', 'FLAC', '10-bit', 'Batch', 'HD', 'HorribleSubs', 'Horrible-Subs',
            'Multi-Subs', 'VOSTFR', 'FLAC2.0', 'FLAC5.1', 'FLAC7.1', 'MPEG', 'WebRip',
            'HEVC', '8bit', 'Web-DL', 'AAC2.0', 'AAC5.1', 'Multi-Sub',
            'Multi Audio', 'CR', 'DDP'
        ];
        const regex = new RegExp(
            '(?<!\\w)(?:' + keywords.join('|') + ')(?:[.,|-])?(?!\\w)',
            'gi'
        );
        cleaned = cleaned.replace(regex, '');

        // Trim and normalize spaces, remove leftover punctuation
        cleaned = cleaned
            .trim()
            .replace(/\s+/g, ' ')
            .replace(/^[.,|-]+|[.,|-]+$/g, '');

        return cleaned;
    }
})();