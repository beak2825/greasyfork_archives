// ==UserScript==
// @name         Sefaria Sheet TOC from Source Refs
// @namespace    http://tampermonkey.net/
// @version      1.2
// @license MIT
// @description  Adds a TOC to Sefaria Source Sheets
// @match        https://www.sefaria.org/sheets/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/544844/Sefaria%20Sheet%20TOC%20from%20Source%20Refs.user.js
// @updateURL https://update.greasyfork.org/scripts/544844/Sefaria%20Sheet%20TOC%20from%20Source%20Refs.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function waitForAll(conditionFns, callback, interval = 300, timeout = 10000) {
        const start = Date.now();
        const check = () => {
            const allReady = conditionFns.every(fn => fn());
            if (allReady) {
                callback();
            } else if (Date.now() - start < timeout) {
                setTimeout(check, interval);
            }
        };
        check();
    }

    waitForAll([
        () =>
            window.DJANGO_VARS &&
            window.DJANGO_VARS.props &&
            window.DJANGO_VARS.props.initialPanels &&
            window.DJANGO_VARS.props.initialPanels.length > 0 &&
            window.DJANGO_VARS.props.initialPanels[0].sheet &&
            Array.isArray(window.DJANGO_VARS.props.initialPanels[0].sheet.sources),
        () => document.querySelectorAll('.boxedSheetItem').length > 0
    ], () => {
        const sources = window.DJANGO_VARS.props.initialPanels[0].sheet.sources;
        const renderedSources = document.querySelectorAll('.boxedSheetItem');

        if (!sources.length || !renderedSources.length) return;

        // Add correct IDs to .boxedSheetItem elements
        renderedSources.forEach((el, idx) => {
            el.id = `boxedSheetItem_${idx + 1}`; // 1-based
        });

        // Create floating TOC container
        const tocContainer = document.createElement('div');
        Object.assign(tocContainer.style, {
            position: 'fixed',
            top: '80px',
            right: '20px',
            width: '240px',
            maxHeight: '80vh',
            overflowY: 'auto',
            backgroundColor: '#f9f9f9',
            border: '2px solid #ccc',
            padding: '10px',
            fontSize: '13px',
            lineHeight: '1.5em',
            boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
            zIndex: '9999',
            borderRadius: '8px'
        });

        const title = document.createElement('h3');
        title.textContent = '📚 TOC';
        title.style.marginTop = '0';
        tocContainer.appendChild(title);

        const list = document.createElement('ol');
        let count = 1;

        sources.forEach(source => {
            if (!source.ref) return;

            const item = document.createElement('li');
            const anchor = document.createElement('a');
            anchor.textContent = source.ref;
            anchor.href = `#boxedSheetItem_${count}`;
            item.appendChild(anchor);
            list.appendChild(item);
            count++;
        });

        tocContainer.appendChild(list);

        document.body.appendChild(tocContainer);
    });
})();
