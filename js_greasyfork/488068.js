// ==UserScript==
// @name         Adoption Status Indicator
// @namespace    https://anthelion.me/torrents.php*
// @version      1.1
// @description  Adds an "Up for Adoption" column with indicators to torrent listings.
// @author       EnigmaticBacon
// @match        https://anthelion.me/torrents.php?id=*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/488068/Adoption%20Status%20Indicator.user.js
// @updateURL https://update.greasyfork.org/scripts/488068/Adoption%20Status%20Indicator.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to insert the "Up for Adoption" column header
    const insertColumnHeader = () => {
        const headerRow = document.querySelector('.torrent_table.details > tbody > tr.colhead_dark');
        const adoptionHeader = document.createElement('td');
        adoptionHeader.className = 'sign adoption'; // Set class
        adoptionHeader.innerHTML = `
        <a><svg width="15" height="15" fill="white" class="tooltip" alt="Adoption" viewBox="0 0 15 15">
            <path d="M7.5,0 L0,5 L0,15 L15,15 L15,5 L7.5,0 M5,12 L5,8 L10,8 L10,12 L5,12 Z"></path>
        </svg></a>
    `;
        headerRow.appendChild(adoptionHeader);
    };

    // Function to check adoption status and insert indicators
    const insertAdoptionIndicators = () => {
        const torrentRows = document.querySelectorAll('.torrent_row');
        torrentRows.forEach(row => {
            const adoptionCell = document.createElement('td');
            adoptionCell.style.textAlign = 'center';
            // Assuming the details are in the next sibling for simplicity
            const detailsSection = row.nextElementSibling;
            if (detailsSection) {
                const bountyText = detailsSection.textContent.match(/bounty of ([\d,]+)/i);
                if (bountyText && bountyText.length > 1) {
                    const bountyValue = parseInt(bountyText[1].replace(/,/g, ''), 10); // Parse the bounty amount, removing commas
                    const bountyInThousands = Math.round(bountyValue / 1000); // Round to nearest thousand
                    const bountyDisplay = `${bountyInThousands}k`; // Append "k" to indicate thousands
                    adoptionCell.innerHTML = `<span style="color: green;">${bountyDisplay}</span>`;
                } else {
                    adoptionCell.innerHTML = '<span style="color: red;">N</span>';
                }
            } else {
                adoptionCell.innerHTML = '<span style="color: red;">N</span>';
            }
            row.appendChild(adoptionCell);
        });
    };

    insertColumnHeader();
    insertAdoptionIndicators();
})();
