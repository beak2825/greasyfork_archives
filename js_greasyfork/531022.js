// ==UserScript==
// @name         LinkedIn Job Filter Pro
// @namespace    http://tampermonkey.net/
// @version      3.5
// @description  Advanced filters to toggle promoted, normal, and viewed job listings on LinkedIn job search pages.
// @author       yange.xyz
// @match        https://www.linkedin.com/jobs/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/531022/LinkedIn%20Job%20Filter%20Pro.user.js
// @updateURL https://update.greasyfork.org/scripts/531022/LinkedIn%20Job%20Filter%20Pro.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const FILTERS = {
        SHOW_ALL: 'SHOW_ALL',
        SHOW_PROMOTED: 'SHOW_PROMOTED',
        SHOW_NORMAL: 'SHOW_NORMAL'
    };

    let activeFilter = FILTERS.SHOW_ALL;
    let onlyUnviewed = false;

    // === Create floating filter panel ===
    const filterPanel = document.createElement('div');
    filterPanel.style.position = 'fixed';
    filterPanel.style.top = '40px';
    filterPanel.style.right = '20px';
    filterPanel.style.zIndex = '10000';
    filterPanel.style.background = 'white';
    filterPanel.style.padding = '8px';
    filterPanel.style.border = '1px solid #ccc';
    filterPanel.style.borderRadius = '8px';
    filterPanel.style.boxShadow = '0 2px 8px rgba(0,0,0,0.15)';
    filterPanel.style.fontFamily = 'Arial, sans-serif';
    filterPanel.style.display = 'flex';
    filterPanel.style.flexDirection = 'column';
    filterPanel.style.gap = '4px';
    filterPanel.style.minWidth = '150px';
    document.body.appendChild(filterPanel);

    // === Create a toggle button to show/hide the whole panel ===
    const toggleBtn = document.createElement('button');
    toggleBtn.innerText = '⚙️';
    toggleBtn.style.position = 'fixed';
    toggleBtn.style.top = '10px'; // Higher than panel to avoid overlap
    toggleBtn.style.right = '20px';
    toggleBtn.style.zIndex = '10001';
    toggleBtn.style.padding = '6px 10px';
    toggleBtn.style.fontSize = '14px';
    toggleBtn.style.border = '1px solid #ccc';
    toggleBtn.style.borderRadius = '50%';
    toggleBtn.style.background = '#f3f3f3';
    toggleBtn.style.cursor = 'pointer';
    toggleBtn.style.boxShadow = '0 2px 6px rgba(0,0,0,0.2)';
    document.body.appendChild(toggleBtn);

    let panelVisible = true;
    toggleBtn.addEventListener('click', () => {
        panelVisible = !panelVisible;
        filterPanel.style.display = panelVisible ? 'flex' : 'none';
    });

    // === Helper to create filter buttons ===
    function createButton(label, onClick, isToggle = false) {
        const btn = document.createElement('button');
        btn.innerText = label;
        btn.style.padding = '6px 8px';
        btn.style.fontSize = '12px';
        btn.style.cursor = 'pointer';
        btn.style.border = '1px solid #0073b1';
        btn.style.borderRadius = '4px';
        btn.style.background = '#0073b1';
        btn.style.color = 'white';
        btn.style.fontWeight = 'bold';
        btn.style.minWidth = '100%';

        btn.addEventListener('click', () => {
            onClick(btn);
        });

        if (isToggle) {
            btn.setAttribute('data-toggle', 'off');
        }

        return btn;
    }

    // === Filter logic ===
    function applyFilter() {
        const cards = document.querySelectorAll('li');
        cards.forEach(card => {
            const text = card.innerText.toLowerCase();
            const isPromoted = text.includes('promoted');
            const isViewed = text.includes('viewed');
            let visible = true;

            if (onlyUnviewed && isViewed) visible = false;

            switch (activeFilter) {
                case FILTERS.SHOW_ALL:
                    visible = visible && true;
                    break;
                case FILTERS.SHOW_PROMOTED:
                    visible = visible && isPromoted;
                    break;
                case FILTERS.SHOW_NORMAL:
                    visible = visible && !isPromoted;
                    break;
            }

            card.style.display = visible ? '' : 'none';
        });
    }

    // === Create buttons ===
    filterPanel.appendChild(createButton('👁 Show All', () => {
        activeFilter = FILTERS.SHOW_ALL;
        applyFilter();
    }));

    filterPanel.appendChild(createButton('💼 Promoted Only', () => {
        activeFilter = FILTERS.SHOW_PROMOTED;
        applyFilter();
    }));

    filterPanel.appendChild(createButton('🔍 Normal Only', () => {
        activeFilter = FILTERS.SHOW_NORMAL;
        applyFilter();
    }));

    const unviewedBtn = createButton('🕵️ Only Unviewed: OFF', (btn) => {
        onlyUnviewed = !onlyUnviewed;
        btn.innerText = onlyUnviewed ? '🕵️ Only Unviewed: ON' : '🕵️ Only Unviewed: OFF';
        applyFilter();
    }, true);
    filterPanel.appendChild(unviewedBtn);

    // === React to dynamic content ===
    const observer = new MutationObserver(applyFilter);
    observer.observe(document.body, { childList: true, subtree: true });
    function highlightPromotedJobs() {
  const cards = document.querySelectorAll("li");

        cards.forEach(card => {
            const spans = card.querySelectorAll("span");
            spans.forEach(span => {
                if (span.textContent.trim().toLowerCase() === "promoted") {
                    span.style.fontWeight = "bold";
                    span.style.color = "red";
                    span.style.fontSize = "1.2em";
                }
            });
        });
    }

    highlightPromotedJobs();

    const sidebarObserver = new MutationObserver(highlightPromotedJobs);
    sidebarObserver.observe(document.body, { childList: true, subtree: true });


    applyFilter(); // Initial run
})();
