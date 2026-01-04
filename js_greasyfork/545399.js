// ==UserScript==
// @name         Sefaria Source Sheet Newline Cleaner
// @namespace    http://binjomin.hu/
// @version      0.2
// @license      MIT
// @description  Remove blank lines from all Sefaria source texts on Source Sheet, button at top
// @author       Binjomin Szanto-Varnagy
// @match        https://*.sefaria.org/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/545399/Sefaria%20Source%20Sheet%20Newline%20Cleaner.user.js
// @updateURL https://update.greasyfork.org/scripts/545399/Sefaria%20Source%20Sheet%20Newline%20Cleaner.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function hasBlankLines(text) {
        const lines = text.split('\n');
        return lines.some(line => line.trim() === '');
    }

    function sourcesHaveBlankLines() {
        const textSpans = document.querySelectorAll('.sourceContentText span[data-slate-string="true"]');
        for (const span of textSpans) {
            if (hasBlankLines(span.textContent)) {
                return true;
            }
        }
        return false;
    }

    function cleanAllSources() {
        const containers = document.querySelectorAll('.sourceContentText');
        let cleanedCount = 0;

        for (const container of containers) {
            const textSpans = container.querySelectorAll('span[data-slate-string="true"]');
            for (const span of textSpans) {
                let lines = span.textContent.split('\n');
                const before = lines.length;
                lines = lines.filter(line => line.trim().length > 0);
                if (lines.length !== before) {
                    span.textContent = lines.join('\n');
                    cleanedCount++;
                }
            }
        }
        return cleanedCount;
    }

    function createButton() {
        if (document.getElementById('sefaria-clean-btn')) return;

        const btn = document.createElement('button');
        btn.id = 'sefaria-clean-btn';
        btn.textContent = 'Remove Blank Lines from All Sources';
        btn.style.position = 'fixed';
        btn.style.top = '10px';
        btn.style.left = '10px';
        btn.style.zIndex = '9999';
        btn.style.padding = '8px 12px';
        btn.style.fontSize = '14px';
        btn.style.backgroundColor = '#007bff';
        btn.style.color = 'white';
        btn.style.border = 'none';
        btn.style.borderRadius = '4px';
        btn.style.cursor = 'pointer';
        btn.style.boxShadow = '0 2px 6px rgba(0,0,0,0.2)';
        btn.title = 'Click to remove blank lines from all Sefaria sources';

        btn.addEventListener('click', () => {
            const count = cleanAllSources();
            if (count > 0) {
                btn.textContent = `Blank Lines Removed (${count} spans)`;
                btn.style.backgroundColor = '#28a745';
                setTimeout(() => {
                    btn.textContent = 'Remove Blank Lines from All Sources';
                    btn.style.backgroundColor = '#007bff';
                }, 2000);
            } else {
                btn.textContent = 'No Blank Lines Found';
                btn.style.backgroundColor = '#6c757d';
                setTimeout(() => {
                    btn.textContent = 'Remove Blank Lines from All Sources';
                    btn.style.backgroundColor = '#007bff';
                }, 2000);
            }
        });

        document.body.appendChild(btn);
    }

    function init() {
        if (sourcesHaveBlankLines()) {
            createButton();
        } else {
            // Always show the button so user can retry after reload
            createButton();
        }
    }

    setTimeout(init, 1500);

    const observer = new MutationObserver(() => {
        createButton(); // Ensure button exists even after reloads
    });
    observer.observe(document.body, { childList: true, subtree: true });

})();
