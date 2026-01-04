// ==UserScript==
// @name         FMP Player Stats Summary (Red Styled)
// @namespace    https://osama.dev
// @version      1.7
// @description  Show totals & average rating in red, auto-update on competition change
// @match        https://footballmanagerproject.com/Team/Player?id=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/537896/FMP%20Player%20Stats%20Summary%20%28Red%20Styled%29.user.js
// @updateURL https://update.greasyfork.org/scripts/537896/FMP%20Player%20Stats%20Summary%20%28Red%20Styled%29.meta.js
// ==/UserScript==

(function () {
    function parseNum(txt) {
        const n = parseFloat(txt);
        return isNaN(n) ? 0 : n;
    }

    function addStatsSummary() {
        const recordsSection = document.querySelector('#Records');
        if (!recordsSection) return;

        const table = recordsSection.querySelector('table.recordstable');
        if (!table) return;

        // Remove previous summary row
        const oldSummary = table.querySelector('tr[data-summary]');
        if (oldSummary) oldSummary.remove();

        const rows = Array.from(table.querySelectorAll('tr')).filter(r => r.children.length >= 9);
        if (!rows.length) return;

        let totals = { matches: 0, goals: 0, assists: 0, yellow: 0, red: 0, rating: 0 };
        let ratingCount = 0;

        rows.forEach(row => {
            const cells = row.querySelectorAll('td');
            if (cells.length >= 9) {
                totals.matches += parseNum(cells[3].innerText);
                totals.goals += parseNum(cells[4].innerText);
                totals.assists += parseNum(cells[5].innerText);
                totals.yellow += parseNum(cells[6].innerText);
                totals.red += parseNum(cells[7].innerText);
                const rate = parseNum(cells[8].innerText);
                if (rate > 0) {
                    totals.rating += rate;
                    ratingCount++;
                }
            }
        });

        const avgRating = ratingCount ? (totals.rating / ratingCount).toFixed(2) : '0.00';

        const summaryRow = document.createElement('tr');
        summaryRow.setAttribute('data-summary', 'true');
        summaryRow.style.backgroundColor = '#330000';
        summaryRow.style.color = '#FF4444';
        summaryRow.style.fontWeight = 'bold';
        summaryRow.style.fontFamily = 'monospace';
        summaryRow.style.borderTop = '2px solid #A00';

        summaryRow.innerHTML =
            `<td colspan="3" style="text-align:left;">📊 Summary</td>` +
            `<td>${totals.matches}</td>` +
            `<td>${totals.goals}</td>` +
            `<td>${totals.assists}</td>` +
            `<td>${totals.yellow}</td>` +
            `<td>${totals.red}</td>` +
            `<td>${avgRating}</td>` +
            `<td></td>`;

        table.appendChild(summaryRow);
    }

    function observeTableChanges() {
        const target = document.querySelector('#Records');
        if (!target) return;

        const observer = new MutationObserver(() => {
            setTimeout(addStatsSummary, 300);
        });

        observer.observe(target, {
            childList: true,
            subtree: true
        });
    }

    window.addEventListener('load', () => {
        setTimeout(() => {
            addStatsSummary();
            observeTableChanges();
        }, 1000);
    });
})();
