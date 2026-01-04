// ==UserScript==
// @name         Scimago Quartile Pop-up
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Creates a pop-up with Publisher, Country, Type, URL, and a custom-built visual quartile table for a perfect layout.
// @author       Gemini
// @match        https://www.scimagojr.com/journalsearch.php*
// @grant        GM_addStyle
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/547598/Scimago%20Quartile%20Pop-up.user.js
// @updateURL https://update.greasyfork.org/scripts/547598/Scimago%20Quartile%20Pop-up.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.addEventListener('load', () => {
        // --- 1. EXTRACT ALL REQUIRED INFO FROM THE PAGE ---

        const getInfoFromGrid = (headingText) => {
            const h2Elements = Array.from(document.querySelectorAll('.journalgrid h2'));
            const targetH2 = h2Elements.find(h2 => h2.textContent.trim() === headingText);
            if (targetH2) {
                return targetH2.nextElementSibling?.querySelector('a')?.textContent.trim() || targetH2.nextElementSibling.textContent.trim();
            }
            return 'Not Found';
        };

        const journalTitle = document.querySelector('h1')?.innerText.trim() || 'Title Not Found';
        const homepageLink = document.querySelector('a#question_journal[href*="http"]');

        const publisher = getInfoFromGrid('Publisher');
        const country = getInfoFromGrid('Country');
        const publicationType = getInfoFromGrid('Publication type');

        const originalDataTable = document.querySelector('#svgquartiles')?.parentElement.querySelector('.cellslide:nth-child(2) table');

        if (!originalDataTable) {
            console.log("Scimago Pop-up: Quartile data not found.");
            return;
        }

        // --- 2. PARSE THE QUARTILE DATA ---
        const groupedData = {};
        const years = new Set();
        const rows = originalDataTable.querySelectorAll('tbody tr');

        rows.forEach(row => {
            const cells = row.querySelectorAll('td');
            if (cells.length !== 3) return;
            const category = cells[0].textContent.trim();
            const year = cells[1].textContent.trim();
            const quartile = cells[2].textContent.trim();
            if (!groupedData[category]) groupedData[category] = {};
            groupedData[category][year] = quartile;
            years.add(year);
        });

        // *** CHANGE: Sort years and then reverse for newest-to-oldest order ***
        const sortedYears = Array.from(years).sort().reverse();

        // --- 3. CREATE THE MODAL AND ITS HEADER ---
        const modalOverlay = document.createElement('div');
        modalOverlay.id = 'info-modal-overlay';
        const modalContainer = document.createElement('div');
        modalContainer.id = 'info-modal-container';
        const modalHeader = document.createElement('div');
        modalHeader.id = 'info-modal-header';
        const modalContent = document.createElement('div');
        modalContent.id = 'info-modal-content';
        const closeButton = document.createElement('span');
        closeButton.id = 'info-modal-close';
        closeButton.innerHTML = '&times;';

        modalHeader.innerHTML = `
            <h2>${journalTitle}</h2>
            <p><strong>Publisher:</strong> ${publisher}</p>
            <p><strong>Country:</strong> ${country}</p>
            <p><strong>Publication Type:</strong> ${publicationType}</p>
            ${homepageLink ? `<p><strong>Homepage:</strong> <a href="${homepageLink.href}" target="_blank" rel="noopener noreferrer">${homepageLink.href}</a></p>` : ''}
        `;

        // --- 4. BUILD THE NEW VISUAL TABLE FROM SCRATCH ---
        const visualTable = document.createElement('table');
        visualTable.className = 'visual-quartile-table';
        let headerHtml = '<thead><tr><th>Category</th>';
        sortedYears.forEach(year => { headerHtml += `<th>${year}</th>`; }); // Header now uses reversed years
        headerHtml += '</tr></thead>';
        visualTable.innerHTML = headerHtml;

        const tbody = document.createElement('tbody');
        for (const category in groupedData) {
            const tr = document.createElement('tr');
            let rowHtml = `<td>${category}</td>`;
            sortedYears.forEach(year => { // Data rows also use reversed years
                const quartile = groupedData[category][year] || '';
                const quartileClass = quartile.toLowerCase();
                rowHtml += `<td class="${quartileClass}">${quartile}</td>`;
            });
            tr.innerHTML = rowHtml;
            tbody.appendChild(tr);
        }
        visualTable.appendChild(tbody);
        modalContent.appendChild(visualTable);

        // --- 5. ASSEMBLE, ADD FUNCTIONALITY, AND STYLE ---
        modalContainer.append(closeButton, modalHeader, modalContent);
        modalOverlay.appendChild(modalContainer);
        document.body.appendChild(modalOverlay);

        const closeModal = () => modalOverlay.remove();
        closeButton.onclick = closeModal;
        modalOverlay.onclick = (e) => { if (e.target === modalOverlay) closeModal(); };
        document.addEventListener('keydown', (e) => { if (e.key === "Escape") closeModal(); });

        GM_addStyle(`
            #info-modal-overlay {
                position: fixed; top: 0; left: 0; width: 100%; height: 100%;
                background-color: rgba(0, 0, 0, 0.75); z-index: 10000;
                display: flex; justify-content: center; align-items: center;
                font-family: 'Roboto', sans-serif;
                /* --- CHANGE: Removed backdrop-filter for performance --- */
            }
            #info-modal-container {
                background-color: #ffffff; padding: 0; border-radius: 12px;
                box-shadow: 0 10px 40px rgba(0,0,0,0.3);
                position: relative; max-width: 800px; width: 95%;
                max-height: 90vh; overflow: hidden;
                display: flex; flex-direction: column;
                animation: fadeIn 0.3s ease-out;
            }
            @keyframes fadeIn {
                from { opacity: 0; transform: scale(0.95); }
                to { opacity: 1; transform: scale(1); }
            }
            #info-modal-header {
                padding: 20px 30px; border-bottom: 1px solid #eee; flex-shrink: 0;
            }
            #info-modal-header h2 { margin: 0 0 12px 0; color: #2c3e50; font-size: 1.5em; }
            #info-modal-header p { margin: 5px 0 0 0; color: #333; line-height: 1.4; }
            #info-modal-header a { color: #e77642; text-decoration: none; word-break: break-all; }
            #info-modal-header a:hover { text-decoration: underline; }

            #info-modal-content { overflow: auto; padding: 25px 30px; }
            .visual-quartile-table { width: 100%; border-collapse: collapse; border: 1px solid #ccc; }
            .visual-quartile-table th, .visual-quartile-table td {
                border: 1px solid #ccc; padding: 12px; text-align: center;
            }
            .visual-quartile-table th { background-color: #f2f2f2; font-weight: bold; }
            .visual-quartile-table td:first-child { text-align: left; font-weight: 500; }
            .visual-quartile-table td.q1 { background-color: #a4cf63; color: white; }
            .visual-quartile-table td.q2 { background-color: #e8d559; color: #333; }
            .visual-quartile-table td.q3 { background-color: #fba353; color: white; }
            .visual-quartile-table td.q4 { background-color: #dd5a4e; color: white; }
            .visual-quartile-table td { font-weight: bold; font-size: 1.1em; }

            #info-modal-close {
                position: absolute; top: 15px; right: 20px; font-size: 35px;
                font-weight: bold; color: #aaa; cursor: pointer;
                transition: all 0.2s; z-index: 10;
            }
            #info-modal-close:hover { color: #2c3e50; transform: rotate(90deg); }
        `);
    });
})();