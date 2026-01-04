// ==UserScript==
// @name         SRE book Footnote Preview
// @namespace    https://sre.google/
// @version      1.0
// @description  Show footnote preview on hover
// @match        https://sre.google/sre-book/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/536430/SRE%20book%20Footnote%20Preview.user.js
// @updateURL https://update.greasyfork.org/scripts/536430/SRE%20book%20Footnote%20Preview.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const tooltip = document.createElement('div');
    tooltip.style.position = 'absolute';
    tooltip.style.background = '#fefefe';
    tooltip.style.border = '1px solid #ccc';
    tooltip.style.padding = '6px 10px';
    tooltip.style.boxShadow = '2px 2px 6px rgba(0,0,0,0.2)';
    tooltip.style.zIndex = '9999';
    tooltip.style.maxWidth = '300px';
    tooltip.style.display = 'none';
    tooltip.style.fontSize = '14px';
    tooltip.style.lineHeight = '1.4';
    document.body.appendChild(tooltip);

    function showTooltip(event, content) {
        tooltip.innerHTML = content;
        tooltip.style.left = event.pageX + 10 + 'px';
        tooltip.style.top = event.pageY + 10 + 'px';
        tooltip.style.display = 'block';
    }

    function hideTooltip() {
        tooltip.style.display = 'none';
    }

    document.querySelectorAll('a.jumptarget[data-type="noteref"]').forEach(link => {
        const href = link.getAttribute('href');
        if (!href || !href.startsWith('#')) return;

        const footnote = document.querySelector(`p[data-type="footnote"]${href}`);
        if (!footnote) return;

        // Extract content (excluding back-reference <sup>)
        const clone = footnote.cloneNode(true);
        const sup = clone.querySelector('sup');
        if (sup) sup.remove();
        const content = clone.innerHTML.trim();

        link.addEventListener('mouseover', (e) => showTooltip(e, content));
        link.addEventListener('mousemove', (e) => {
            tooltip.style.left = e.pageX + 10 + 'px';
            tooltip.style.top = e.pageY + 10 + 'px';
        });
        link.addEventListener('mouseout', hideTooltip);
    });
})();
