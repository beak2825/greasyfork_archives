// ==UserScript==
// @name         Codeforces: Export All Problems to PDF
// @namespace    https://github.com/AnonMiraj
// @author       ezzeldin
// @license      GPL3
// @description  Export all Codeforces contest problems to a printable PDF, styled like CPC contests.
// @match        https://codeforces.com/group/*/contest/*
// @match        https://codeforces.com/gym/*
// @match        https://codeforces.com/contest/*
// @grant        none
// @esversion 11
// @version 1.0
// @downloadURL https://update.greasyfork.org/scripts/536783/Codeforces%3A%20Export%20All%20Problems%20to%20PDF.user.js
// @updateURL https://update.greasyfork.org/scripts/536783/Codeforces%3A%20Export%20All%20Problems%20to%20PDF.meta.js
// ==/UserScript==

(function () {
    'use strict';

    if (!document.querySelector('table.datatable') && !document.querySelector('table.problems')) return;

    const container = document.querySelector('div[style*="text-align: right"] a[href*="/problems"]')?.parentElement;
    if (!container) return;
    const originalHTML = document.body.innerHTML;
    const pdfLink = document.createElement('a');
    pdfLink.textContent = '💾 Save All as PDF';
    pdfLink.href = '#';
    pdfLink.style.marginLeft = '15px';
    pdfLink.style.color = '#0066cc';
    pdfLink.style.textDecoration = 'none';
    pdfLink.style.cursor = 'pointer';
    container.appendChild(pdfLink);

    pdfLink.addEventListener('click', async (e) => {
        e.preventDefault();
        await exportPDF(pdfLink);
    });

    async function exportPDF(link) {
        const originalText = link.textContent;
        link.style.pointerEvents = 'none';
        link.textContent = 'Fetching…';

        const selectors = [
            'table.datatable tr td.id a',
            'table.datatable tr td.index a',
            'table.problems tr td.id a',
            'table.problems tr td.index a',
            'table.datatable tr a[href*="/problem/"]',
            'table.problems tr a[href*="/problem/"]'
        ];

        const anchors = Array.from(document.querySelectorAll(selectors.join(',')));
        const seen = new Set(), links = [];
        anchors.forEach(a => {
            if (!seen.has(a.href)) {
                seen.add(a.href);
                links.push(a.href);
            }
        });

        if (!links.length) return alert('No problem links found!');

        const problemsHTML = await Promise.all(
            links.map(url => fetchProblem(url))
        );

        document.body.innerHTML = problemsHTML
            .map((html, i) => html || `<div><h2>Problem ${links[i].split('/').pop()} failed to load.</h2></div>`);

        document.querySelectorAll('.test-example-line-even, .test-example-line-odd').forEach(el => {
            el.classList.remove('test-example-line-even', 'test-example-line-odd');
        });

        document.querySelectorAll('.problem-statement').forEach((prob, i, arr) => {
            const inputs = prob.querySelectorAll('.input');
            const outputs = prob.querySelectorAll('.output');
            if (inputs.length && outputs.length) {
                const table = document.createElement('table');
                table.className = 'samples-table';
                table.style.width = '100%';
                table.style.borderCollapse = 'collapse';
                table.style.marginBottom = '20px';

                const header = table.insertRow();
                ['Standard Input', 'Standard Output'].forEach(text => {
                    const th = document.createElement('th');
                    th.textContent = text;
                    th.style.border = '1px solid black';
                    th.style.padding = '8px';
                    th.style.textAlign = 'center';
                    th.style.width = '50%';
                    header.appendChild(th);
                });

                for (let j = 0; j < Math.min(inputs.length, outputs.length); j++) {
                    const row = table.insertRow();
                    [inputs[j], outputs[j]].forEach(el => {
                        const cell = row.insertCell();
                        cell.style.border = '1px solid black';
                        cell.style.padding = '8px';
                        cell.style.verticalAlign = 'top';
                        cell.appendChild(el);
                    });
                }

                const sample = prob.querySelector('.sample-tests') || prob.querySelector('.sample-test') || prob;
                sample?.parentNode?.insertBefore(table, sample.nextSibling);
                prob.querySelector('.sample-tests')?.remove();
                prob.querySelector('.sample-test')?.remove();
            }

            if (i < arr.length - 1) {
                const pageBreak = document.createElement('div');
                pageBreak.style.pageBreakBefore = 'always';
                prob.parentNode.insertBefore(pageBreak, prob.nextSibling);
            }
        });

        const style = document.createElement('style');
        style.textContent = `
            .samples-table th, .samples-table td {
                border: 1px solid black;
                padding: 8px;
                vertical-align: top;
                text-align: left;
            }
            .samples-table pre {
                white-space: pre-wrap;
                word-wrap: break-word;
                font-size: 12px;
                margin: 0;
            }
            @media print {
                .samples-table th, .samples-table td {
                    border: 1px solid black;
                    padding: 8px;
                }
            }
        `;
        document.head.appendChild(style);

        ['#MathJax_Message', '.status-bar', '#status', '.print-hide']
            .forEach(sel => document.querySelectorAll(sel).forEach(el => el.style.display = 'none'));

        const finalize = () => setTimeout(() => {
            document.getElementById('MathJax_Message')?.style.setProperty('display', 'none', 'important');
            window.print();

            setTimeout(() => {
                document.body.innerHTML = originalHTML;
                link.style.pointerEvents = '';
                link.textContent = originalText;
            }, 500);
        }, 500);

        if (window.MathJax) {
            try {
                if (MathJax.typesetPromise) {
                    await MathJax.typesetPromise([document.body]);
                    finalize();
                } else if (MathJax.Hub?.Queue) {
                    MathJax.Hub.Queue(["Typeset", MathJax.Hub, document.body], finalize);
                } else finalize();
            } catch (e) {
                finalize();
            }
        } else finalize();

        link.style.pointerEvents = '';
        link.textContent = originalText;
    }

    async function fetchProblem(url, retries = 2) {
        try {
            const res = await fetch(url);
            const txt = await res.text();
            const doc = new DOMParser().parseFromString(txt, 'text/html');
            const prob = doc.querySelector('.problem-statement');
            if (!prob) throw new Error('Missing problem-statement');

            prob.querySelectorAll('.input-output-copier').forEach(el => el.remove());

            const header = doc.querySelector('.header');
            let title = 'Unknown Problem';
            let inputFile = 'standard input';
            let outputFile = 'standard output';
            let timeLimit = 'N/A';
            let memoryLimit = 'N/A';

            if (header) {
                title = header.querySelector('.title')?.textContent.trim() || title;
                inputFile = header.querySelector('.input-file')?.textContent.replace('input', '').trim() || inputFile;
                outputFile = header.querySelector('.output-file')?.textContent.replace('output', '').trim() || outputFile;
                timeLimit = header.querySelector('.time-limit')?.textContent.replace('time limit per test', '').trim() || timeLimit;
                memoryLimit = header.querySelector('.memory-limit')?.textContent.replace('memory limit per test', '').trim() || memoryLimit;
                header.remove();
            }

            const h2 = document.createElement('h2');
            h2.textContent = title;
            h2.style.marginBottom = '0.2em';
            h2.style.textAlign = 'left';
            prob.insertBefore(h2, prob.firstChild);

            const metaDiv = document.createElement('div');
            metaDiv.className = 'problem-metadata';
            metaDiv.style.marginBottom = '1em';
metaDiv.innerHTML = `
    <pre style="font-family: monospace; margin-left: 20px; font-size: 14px;">
Input file:\t${inputFile}
Output file:\t${outputFile}
Time limit:\t${timeLimit}
Memory limit:\t${memoryLimit}
    </pre>
`;


            prob.insertBefore(metaDiv, prob.firstChild.nextSibling);

            prob.querySelectorAll('.input .title, .output .title').forEach(el => el.remove());
            return prob.outerHTML;

        } catch (err) {
            if (retries > 0) {
                await new Promise(r => setTimeout(r, 400));
                return fetchProblem(url, retries - 1);
            }
            return null;
        }
    }
})();


