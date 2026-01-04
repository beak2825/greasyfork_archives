// ==UserScript==
// @name         Add Pdf, Doc, Ppt Tabs to Google search
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  Adds PDF, DOC, and PPT tabs to Google search results
// @author       Bui Quoc Dung 
// @match        *://www.google.com/search*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/527238/Add%20Pdf%2C%20Doc%2C%20Ppt%20Tabs%20to%20Google%20search.user.js
// @updateURL https://update.greasyfork.org/scripts/527238/Add%20Pdf%2C%20Doc%2C%20Ppt%20Tabs%20to%20Google%20search.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const fileTabs = [
        { label: 'Pdf', query: 'filetype:pdf' },
        { label: 'Doc', query: '(filetype:doc OR filetype:docx)' },
        { label: 'Ppt', query: '(filetype:ppt OR filetype:pptx)' },
    ];

    const filetypeRegex = /\s*(\(filetype:(doc|docx|ppt|pptx)\s*(OR\s*filetype:(doc|docx|ppt|pptx))*\)|filetype:(pdf|doc|docx|ppt|pptx))/gi;

    function executeModification() {
        const tabContainer = document.querySelector('div[role="list"]');
        if (!tabContainer) return;

        const currentQuery = new URLSearchParams(window.location.search).get('q') || '';
        if (!currentQuery) return;

        const baseQuery = currentQuery.replace(filetypeRegex, '').trim();
        if (!baseQuery) return;

        if (filetypeRegex.test(currentQuery)) {
            const originalTabLinks = tabContainer.querySelectorAll('div[role="listitem"]:not(.custom-file-tab) a');
            originalTabLinks.forEach(a => {
                try {
                    const tabUrl = new URL(a.href);
                    if (tabUrl.pathname === '/search') {
                        tabUrl.searchParams.set('q', baseQuery);
                        a.href = tabUrl.toString();
                    }
                } catch (e) {
                    console.warn('Could not parse tab URL:', a.href);
                }
            });
        }

        tabContainer.querySelectorAll('.custom-file-tab').forEach(e => e.remove());

        const tabItems = [...tabContainer.querySelectorAll('div[role="listitem"]')];
        const baseTabToClone = tabItems.length > 2 ? tabItems[2] : tabItems[0];
        if (!baseTabToClone) return;

        fileTabs.forEach(({ label, query: filetypeQuery }) => {
            const newItem = baseTabToClone.cloneNode(true);
            newItem.classList.add('custom-file-tab');

            const a = newItem.querySelector('a');
            if (!a) return;

            const textElement = a.querySelector('div > span') || a.querySelector('div');
            if (!textElement) return;

            const newSearchQuery = `${baseQuery} ${filetypeQuery}`;
            a.href = `/search?q=${encodeURIComponent(newSearchQuery)}`;
            textElement.textContent = label;

            const isSelectedRegex = new RegExp(filetypeQuery.replace(/[()|]/g, '\\$&'), 'i');
            const isSelected = isSelectedRegex.test(currentQuery);
            newItem.setAttribute('aria-selected', isSelected.toString());

            a.style.color = '';
            newItem.style.borderBottom = '';
            const innerDiv = a.querySelector('div');
            if (innerDiv) {
                innerDiv.style.borderBottom = '';
            }

            tabContainer.appendChild(newItem);
        });
    }

    const observer = new MutationObserver(() => {
        observer.disconnect();
        executeModification();
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    setTimeout(executeModification, 500);
})();