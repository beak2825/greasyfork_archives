// ==UserScript==
// @name     EZTV Simplified Thumbnail View
// @version  1.0
// @namespace    https://eztvx.to/
// @author       George K
// @grant    none
// @description    This is a script that transforms the table layout on EZTV to a thumbnail / cards layout and removes multiple instances of the same show.
// @match        https://*.eztvx.to/*
// @license    MIT
// @downloadURL https://update.greasyfork.org/scripts/521292/EZTV%20Simplified%20Thumbnail%20View.user.js
// @updateURL https://update.greasyfork.org/scripts/521292/EZTV%20Simplified%20Thumbnail%20View.meta.js
// ==/UserScript==

(function() {
    console.log('Checking page URL.');

    // Check if the current page URL matches any specified patterns
    const urlPatterns = [
        /^https:\/\/eztvx\.to\/ep\//,
        /^https:\/\/eztvx\.to\/calendar\//,
        /^https:\/\/eztvx\.to\/search\//,
        /^https:\/\/eztvx\.to\/shows\//,
        /^https:\/\/eztvx\.to\/forum\//,
        /^https:\/\/eztvx\.to\/showlist\//,
        /^https:\/\/eztvx\.to\/faq\//,
        /^https:\/\/eztvx\.to\/myshows\//,
        /^https:\/\/eztvx\.to\/profile\//,
        /^https:\/\/eztvx\.to\/news\//,
        /^https:\/\/eztvx\.to\/countdown\//
    ];

    if (urlPatterns.some(pattern => window.location.href.match(pattern))) {
        console.log('URL pattern matched. Skipping transformation.');
        return;
    }

    console.log('URL pattern not matched. Proceeding with transformation.');

    function transformTable(table) {
        const rows = Array.from(table.getElementsByTagName('tr'));
        const titlesSeen = new Set();
        const shows = rows
            .map(row => {
                // Check if the row is a heading
                const headingCell = row.querySelector('.section_post_header, .forum_space_border, .most-seeded-header');
                if (headingCell) {
                    return createHeading(row);
                }
                return extractShowInfo(row, titlesSeen);
            })
            .filter(show => show !== null);

        if (shows.length === 0) return null;

        const grid = document.createElement('div');
        grid.className = 'show-grid';

        shows.forEach(show => {
            if (show.isHeading) {
                grid.appendChild(show.element);
            } else {
                grid.appendChild(createShowCard(show));
            }
        });

        return grid;
    }

    function transformPage() {
        const tables = document.querySelectorAll('table');
        tables.forEach((table, index) => {
            console.log(`Transforming table ${index}...`);
            const grid = transformTable(table);
            if (grid) {
                table.style.display = 'none'; // Hide the original table
                table.parentNode.insertBefore(grid, table);
                console.log(`Table ${index} transformed.`);
            } else {
                console.log(`No valid shows found in table ${index}.`);
            }
        });
    }

    function createHeading(row) {
        const heading = document.createElement('div');
        heading.className = 'heading-card'; // Use the heading card style
        heading.innerHTML = row.innerHTML; // Retain the original HTML content
        return {
            isHeading: true,
            element: heading
        };
    }

    function extractShowInfo(row, titlesSeen) {
        const cells = row.getElementsByTagName('td');
        console.log(`Extracting info from row with ${cells.length} cells.`);
        
        if (cells.length < 6) {
            console.log('Not enough cells in row.');
            return null;
        }

        const homeShowCell = cells[0];
        const homeShowLink = homeShowCell.querySelector('a');
        if (!homeShowLink) {
            console.log('No home show link found.');
            return null;
        }

        const homeShowUrl = homeShowLink.href;
        const matchHomeUrl = homeShowUrl.match(/https:\/\/(?:www\.)?eztvx\.to\/shows\/(\d+)\/([^\/]+)\/?/);
        if (!matchHomeUrl) {
            console.log('Home show URL pattern did not match.');
            return null;
        }

        // Extract show name from URL
        const showSlug = matchHomeUrl[2];
        const showName = showSlug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
        if (titlesSeen.has(showName)) {
            console.log(`Duplicate title found: ${showName}. Skipping.`);
            return null;
        }
        titlesSeen.add(showName);
        const showId = matchHomeUrl[1];
        const thumbnailUrl = `https://eztvx.to/ezimg/thumbs/${showSlug}-${showId}.jpg`;

        console.log(`Extracted show: ${showName}, ${thumbnailUrl}`);

        return {
            name: showName,
            homeShowUrl: homeShowUrl,
            thumbnailUrl: thumbnailUrl
        };
    }

    function createShowCard(show) {
        const card = document.createElement('div');
        card.className = 'show-card';

        const thumbnail = document.createElement('div');
        thumbnail.className = 'show-thumbnail';

        const img = document.createElement('img');
        img.src = show.thumbnailUrl;
        img.alt = `${show.name} Thumbnail`;
        thumbnail.appendChild(img);

        const title = document.createElement('div');
        title.className = 'show-title';
        const titleLink = document.createElement('a');
        titleLink.href = show.homeShowUrl;
        titleLink.textContent = show.name;
        titleLink.className = 'grey-link'; // Ensure this class is applied correctly
        title.appendChild(titleLink);

        card.append(thumbnail, title);
        return card;
    }

// Add styles for the card layout
const styles = `
    .show-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(225px, 1fr)); /* Adjusted card width */
        gap: 20px;
        padding: 20px;
    }
    
    .show-card {
        background: #2a2a2a;
        border-radius: 8px;
        padding: 15px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        transition: transform 0.2s;
    }
    
    .show-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 4px 8px rgba(0,0,0,0.3);
    }

    .heading-card {
        background: #2a2a2a; /* Same grey background for headings */
        color: #999; /* Light grey text color */
        font-size: 14px; /* Same font size for headings */
        display: flex;
        align-items: center; /* Center vertically */
        justify-content: center; /* Center horizontally */
        text-align: center;
        height: auto; /* Ensure it has the same height as other cards */
        padding: 15px; /* Same padding as other cards */
        border-radius: 8px; /* Same border radius as other cards */
        box-shadow: 0 2px 4px rgba(0,0,0,0.2); /* Same box-shadow as other cards */
        transition: transform 0.2s; /* Same transition as other cards */
        flex-direction: column; /* Align text vertically */
    }

    .heading-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 4px 8px rgba(0,0,0,0.3);
    }

    .heading-card h1, .heading-card h2, .heading-card i {
        font-size: 14px; /* Ensure heading font size matches title font size */
        font-weight: bold; /* Ensure heading font weight matches title font weight */
        color: #999; /* Ensure heading font color matches title font color */
        margin: 0; /* Remove default margins */
        font-style: normal; /* Remove italic style */
    }

    .heading-card a {
        font-size: 14px; /* Ensure hyperlink font size matches title font size */
        font-weight: bold; /* Ensure hyperlink font weight matches title font weight */
        color: #999; /* Ensure hyperlink color matches title font color */
        text-decoration: none;
    }

    .heading-card a:visited {
        color: #999; /* Maintain grey color when visited */
    }

    .heading-card a:hover {
        text-decoration: underline;
    }

    .show-thumbnail {
        width: 100%;
        height: auto; /* Allow the image to retain its original height */
        background-color: #3a3a3a;
        border-radius: 4px;
        margin-bottom: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 14px;
        color: #666;
        overflow: hidden;
    }

    .show-thumbnail img {
        width: 100%;
        height: auto;
        object-fit: cover;
    }
    
    .show-title {
        font-size: 14px;
        font-weight: bold;
        margin-bottom: 8px;
        color: #999;
    }

    .show-title a {
        font-size: 14px; /* Ensure Title hyperlink is larger */
        font-weight: bold; /* Ensure Title hyperlink is bold */
        color: #999;
        text-decoration: none;
    }

    .show-title a:visited {
        color: #999; /* Maintain grey color when visited */
    }

    .show-title a:hover {
        text-decoration: underline;
    }

    .show-info, .grey-text {
        font-size: 12px; /* Reduce font size for Details (Size and Date) */
        color: #999; /* Ensure grey color */
    }

    .grey-link, .grey-link:visited {
        color: #999; /* Grey */
        text-decoration: none;
        font-size: 12px; /* Reduce font size for Full Episode Title */
    }
    
    .grey-link:hover {
        text-decoration: underline;
    }

    .dark-blue-link {
        color: #0044cc; /* Darker blue */
        text-decoration: none;
        display: inline-block; /* Ensure proper left alignment */
        font-size: 12px; /* Make magnet text smaller */
    }

    .dark-blue-link:hover {
        text-decoration: underline;
    }

    .show-magnet {
        margin-top: 10px;
        display: flex;
        gap: 5px;
        justify-content: flex-start; /* Ensure left alignment */
    }
`;

const styleSheet = document.createElement('style');
styleSheet.textContent = styles;
document.head.appendChild(styleSheet);

console.log('Styles added.');

    // Execute the transformation
    transformPage();
})();