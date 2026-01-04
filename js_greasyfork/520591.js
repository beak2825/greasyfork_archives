// ==UserScript==
// @name     EZTV Thumbnail View
// @version  1.9
// @namespace    https://eztvx.to/
// @author       George K
// @grant    none
// @description    This is a script that transforms the table layout on EZTV to a thumbnail / cards layout
// @match        https://*.eztvx.to/*
// @license    MIT
// @downloadURL https://update.greasyfork.org/scripts/520591/EZTV%20Thumbnail%20View.user.js
// @updateURL https://update.greasyfork.org/scripts/520591/EZTV%20Thumbnail%20View.meta.js
// ==/UserScript==

(function() {
    console.log('Checking page URL.');

    // Check if the current page URL matches either of the specified patterns
    if (window.location.href.match(/^https:\/\/eztvx\.to\/ep\//) || window.location.href.match(/^https:\/\/eztvx\.to\/calendar\//) || window.location.href.match(/^https:\/\/eztvx\.to\/search\//) || window.location.href.match(/^https:\/\/eztvx\.to\/shows\//) || window.location.href.match(/^https:\/\/eztvx\.to\/forum\//) || window.location.href.match(/^https:\/\/eztvx\.to\/showlist\//) || window.location.href.match(/^https:\/\/eztvx\.to\/faq\//) || window.location.href.match(/^https:\/\/eztvx\.to\/myshows\//) || window.location.href.match(/^https:\/\/eztvx\.to\/profile\//) || window.location.href.match(/^https:\/\/eztvx\.to\/news\//) || window.location.href.match(/^https:\/\/eztvx\.to\/countdown\//)) {
        console.log('URL pattern matched. Skipping transformation.');
        return;
    }

    console.log('URL pattern not matched. Proceeding with transformation.');

    function transformTable(table) {
        const rows = Array.from(table.getElementsByTagName('tr'));
        const shows = rows
            .map(row => {
                // Check if the row is a heading
                const headingCell = row.querySelector('.section_post_header, .forum_space_border, .most-seeded-header');
                if (headingCell) {
                    return createHeading(row);
                }
                return extractShowInfo(row);
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

    function extractShowInfo(row) {
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
        const showId = matchHomeUrl[1];
        const thumbnailUrl = `https://eztvx.to/ezimg/thumbs/${showSlug}-${showId}.jpg`;

        // Extract full episode title
        const showCell = cells[1];
        const showLink = showCell.querySelector('a');
        const fullTitle = showLink ? showLink.textContent.trim() : '';

        // Extract remaining information from the row
        const magnetLink = cells[2].querySelector('a[href^="magnet:"]');
        const size = cells[3] ? cells[3].textContent.trim() : '';
        const date = cells[4] ? cells[4].textContent.trim() : '';
        const seeds = cells[5] ? cells[5].textContent.trim() : '';

        console.log(`Extracted show: ${showName}, ${fullTitle}, ${size}, ${date}, ${seeds}, ${thumbnailUrl}`);

        return {
            name: showName,
            fullTitle: fullTitle,
            showUrl: showLink ? showLink.href : '',
            homeShowUrl: homeShowUrl,
            magnetLink: magnetLink ? magnetLink.href : '',
            size: size,
            date: date,
            seeds: seeds,
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

        const episodeTitle = document.createElement('div');
        episodeTitle.className = 'show-info';
        const episodeLink = document.createElement('a');
        episodeLink.href = show.showUrl;
        episodeLink.textContent = show.fullTitle;
        episodeLink.className = 'grey-link'; // Ensure this class is applied correctly
        episodeTitle.appendChild(episodeLink);

        const details = document.createElement('div');
        details.className = 'show-info grey-text'; // Ensure this class is applied correctly
        details.textContent = `${show.size} | ${show.date}`;

        const seeds = document.createElement('div');
        seeds.className = 'show-info grey-text'; // Ensure this class is applied correctly
        seeds.textContent = `Seeds: ${show.seeds}`;

        const magnetDiv = document.createElement('div');
        magnetDiv.className = 'show-magnet';
        if (show.magnetLink) {
            const magnetLink = document.createElement('a');
            magnetLink.href = show.magnetLink;
            magnetLink.textContent = 'Download Magnet';
            magnetLink.className = 'dark-blue-link'; // Ensure this class is applied correctly
            magnetDiv.appendChild(magnetLink);
        }

        card.append(thumbnail, title, episodeTitle, details, seeds, magnetDiv);
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
        height: 200px; /* Adjusted height for portrait aspect ratio */
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
        height: 100%;
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