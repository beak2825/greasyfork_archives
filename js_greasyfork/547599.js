// ==UserScript==
// @name         SINTA Journal Pop-up
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Shows a pop-up with a compact, horizontally-scrolling table using the SINTA website's official default colors.
// @author       Gemini
// @match        https://sinta.kemdiktisaintek.go.id/journals/profile/*
// @match        https://sinta.kemdiktisaintek.go.id/journals/google/*
// @match        https://sinta.kemdikbud.go.id/journals/profile/*
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/547599/SINTA%20Journal%20Pop-up.user.js
// @updateURL https://update.greasyfork.org/scripts/547599/SINTA%20Journal%20Pop-up.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.addEventListener('load', function() {
        setTimeout(() => {
            try {
                // --- 1. Extract Basic Journal Info ---
                const journalName = document.querySelector('.univ-name h3 a').textContent.trim();
                const affiliation = document.querySelector('.univ-name .affil-loc').textContent.trim();

                let journalLink = 'Not Found';
                document.querySelectorAll('.affil-loc a').forEach(link => {
                    if (link.textContent.trim().toLowerCase() === 'website' || link.querySelector('.el-globe')) {
                        journalLink = link.href;
                    }
                });

                // --- 2. Find and Extract Accreditation Data ---
                const historyHeader = Array.from(document.querySelectorAll('p.text-center small'))
                                         .find(el => el.textContent.trim().toLowerCase() === 'history accreditation');
                if (!historyHeader) { return; }

                const originalTable = historyHeader.parentElement.nextElementSibling.querySelector('table.table-borderless');
                if (!originalTable) { return; }

                const rows = originalTable.querySelectorAll('tr');
                if (rows.length < 2) { return; }

                // --- 3. Build Data Array and Reverse It ---
                const yearCells = rows[0].querySelectorAll('td');
                const ratingCells = rows[1].querySelectorAll('td');

                let historyData = [];
                for (let i = 0; i < yearCells.length; i++) {
                    const year = yearCells[i].textContent.trim();
                    const colorClass = Array.from(ratingCells[i].classList).find(c => c.startsWith('bg-s'));
                    let rating = 'N/A';
                    if (colorClass) {
                        const ratingNumber = colorClass.replace('bg-s', '');
                        rating = 'S' + ratingNumber;
                    }
                    historyData.push({ year, rating, colorClass });
                }

                // **THE KEY CHANGE**: Reverse the array to show newest years first
                historyData.reverse();

                // --- 4. Build HTML from the Reversed Data ---
                let yearHTML = '<tr>';
                let ratingHTML = '<tr>';

                historyData.forEach(item => {
                    yearHTML += `<th>${item.year}</th>`;
                    ratingHTML += `<td class="rating-cell ${item.colorClass || ''}">${item.rating}</td>`;
                });

                yearHTML += '</tr>';
                ratingHTML += '</tr>';

                const historyTableHTML = `
                    <div class="table-container">
                        <table class="custom-sinta-table">
                            ${yearHTML}
                            ${ratingHTML}
                        </table>
                    </div>
                `;

                // --- 5. Define CSS Styles for all components ---
                GM_addStyle(`
                    #sinta-popup-overlay {
                        position: fixed; top: 0; left: 0; width: 100%; height: 100%;
                        background-color: rgba(0, 0, 0, 0.65); z-index: 10000;
                        display: flex; justify-content: center; align-items: center;
                        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
                    }
                    #sinta-popup-modal {
                        background-color: #ffffff; padding: 25px 30px; border-radius: 10px;
                        box-shadow: 0 5px 20px rgba(0, 0, 0, 0.4); width: 90%; max-width: 650px;
                        position: relative; animation: fadeIn 0.3s ease-in-out;
                    }
                    @keyframes fadeIn {
                        from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); }
                    }
                    #sinta-popup-close {
                        position: absolute; top: 10px; right: 15px; font-size: 28px;
                        font-weight: bold; color: #888; cursor: pointer; line-height: 1; transition: color 0.2s;
                    }
                    #sinta-popup-close:hover { color: #333; }
                    #sinta-popup-modal h2 {
                        margin-top: 0; margin-bottom: 25px; color: #2c3e50; font-size: 1.5em;
                        border-bottom: 2px solid #f0f0f0; padding-bottom: 10px; text-align: center;
                    }
                    .info-row { display: flex; align-items: flex-start; margin-bottom: 12px; font-size: 1em; line-height: 1.5; }
                    .info-label { flex-shrink: 0; width: 95px; font-weight: bold; color: #34495e; }
                    .info-value { word-break: break-word; }
                    .info-value a { color: #3498db; text-decoration: none; }
                    .info-value a:hover { text-decoration: underline; }
                    .table-container {
                        margin-top: 25px; overflow-x: auto; -webkit-overflow-scrolling: touch;
                        border: 1px solid #ddd; border-radius: 4px;
                    }
                    .custom-sinta-table { width: 100%; border-collapse: collapse; }
                    .custom-sinta-table th, .custom-sinta-table td {
                        padding: 10px 12px; text-align: center; border-left: 1px solid #ddd;
                    }
                    .custom-sinta-table th:first-child, .custom-sinta-table td:first-child { border-left: none; }
                    .custom-sinta-table th { background-color: #f8f9fa; color: #333; font-weight: bold; white-space: nowrap; }
                    .rating-cell {
                        font-weight: bold;
                        color: black;
                        text-shadow: -1px -1px 0 #fff, 1px -1px 0 #fff, -1px 1px 0 #fff, 1px 1px 0 #fff;
                    }
                `);

                // --- 6. Create and Display the Pop-up ---
                const overlay = document.createElement('div');
                overlay.id = 'sinta-popup-overlay';
                const modal = document.createElement('div');
                modal.id = 'sinta-popup-modal';

                modal.innerHTML = `
                    <span id="sinta-popup-close" title="Close">&times;</span>
                    <h2>Accreditation History</h2>
                    <div class="info-row">
                        <span class="info-label">Journal:</span>
                        <span class="info-value">${journalName}</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">Affiliation:</span>
                        <span class="info-value">${affiliation}</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">Website:</span>
                        <span class="info-value"><a href="${journalLink}" target="_blank" rel="noopener noreferrer">${journalLink}</a></span>
                    </div>
                    ${historyTableHTML}
                `;

                overlay.appendChild(modal);
                document.body.appendChild(overlay);

                // --- 7. Add Close Functionality ---
                document.getElementById('sinta-popup-close').addEventListener('click', () => document.body.removeChild(overlay));
                overlay.addEventListener('click', (e) => {
                    if (e.target.id === 'sinta-popup-overlay') { document.body.removeChild(overlay); }
                });

            } catch (error) {
                console.error("SINTA Pop-up Script Error:", error);
            }
        }, 500);
    });
})();