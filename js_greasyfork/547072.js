// ==UserScript==
// @name         Simpli-Applied
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Tracks applied jobs and highlights them in the Simplify Github page
// @author       Agni
// @match        https://github.com/SimplifyJobs/New-Grad-Positions*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/547072/Simpli-Applied.user.js
// @updateURL https://update.greasyfork.org/scripts/547072/Simpli-Applied.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('script running');

    const APPLIED_JOBS = 'appliedJobs';

    function getAppliedJobs() {
        const stored = localStorage.getItem(APPLIED_JOBS);
        return stored ? JSON.parse(stored) : [];
    }

    function saveAppliedJob(trHTML) {
        const appliedJobs = getAppliedJobs();
        if (!appliedJobs.includes(trHTML)) {
            appliedJobs.push(trHTML);
            localStorage.setItem(APPLIED_JOBS, JSON.stringify(appliedJobs));
        }
    }

    function removeAppliedJob(trElement) {
        const appliedJobs = getAppliedJobs();
        const hrefToRemove = trElement.querySelector('a[href]')?.href;

        const filtered = appliedJobs.filter(jobHTML => {
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = jobHTML;
            const jobHref = tempDiv.querySelector('a[href]')?.href;
            return jobHref !== hrefToRemove;
        });

        localStorage.setItem(APPLIED_JOBS, JSON.stringify(filtered));
    }

    function getTrHTMLWithoutCheckbox(tr) {
        const clone = tr.cloneNode(true);
        const checkbox = clone.querySelector('.applied-checkbox');
        if (checkbox) {
            checkbox.parentElement.remove();
        }
        return clone.outerHTML;
    }

    function highlightAppliedJobs(allTrs) {
        const appliedJobs = getAppliedJobs();
        allTrs.forEach(tr => {
            const trHTMLWithoutCheckbox = getTrHTMLWithoutCheckbox(tr);
            if (appliedJobs.includes(trHTMLWithoutCheckbox)) {
                tr.style.backgroundColor = 'green';
                const checkbox = tr.querySelector('.applied-checkbox');
                if (checkbox) checkbox.checked = true;
            }
        });
    }

    function addColumn(thead) {
        if (thead.querySelector('th:first-child')?.textContent === 'Applied') return;

        const tr = thead.querySelector('tr');
        const newTh = document.createElement('th');
        newTh.textContent = 'Applied';
        tr.insertBefore(newTh, tr.firstChild);
    }

    function addMarkAsAppliedCheckbox(allTrs, thead) {
        addColumn(thead);

        allTrs.forEach(tr => {
            if (tr.querySelector('.applied-checkbox')) return;

            const newTd = document.createElement('td');
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.className = 'applied-checkbox';
            checkbox.style.transform = 'scale(1.2)';

            checkbox.addEventListener('change', () => {
                const trHTML = getTrHTMLWithoutCheckbox(tr);
                if (checkbox.checked) {
                    saveAppliedJob(trHTML);
                    tr.style.backgroundColor = 'green';
                } else {
                    removeAppliedJob(tr);
                    tr.style.backgroundColor = '';
                }
            });

            newTd.appendChild(checkbox);
            newTd.style.textAlign = 'center';
            tr.insertBefore(newTd, tr.firstChild);

            const links = tr.querySelectorAll('a[href]');
            links.forEach(link => {
                link.addEventListener('click', () => {
                    const trHTML = getTrHTMLWithoutCheckbox(tr);
                    saveAppliedJob(trHTML);
                    tr.style.backgroundColor = 'green';
                    const checkbox = tr.querySelector('.applied-checkbox');
                    if (checkbox) checkbox.checked = true;
                });
            });
        });
    }

    function markApplied() {
        const article = document.querySelector('article.markdown-body');
        if (!article) return;

        const thead = article.querySelector('thead');
        const tbody = article.querySelector('tbody');
        if (!tbody) return;

        const allTrs = [...tbody.querySelectorAll('tr')];

        addMarkAsAppliedCheckbox(allTrs, thead);
        highlightAppliedJobs(allTrs);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', markApplied);
    } else {
        markApplied();
    }

})();