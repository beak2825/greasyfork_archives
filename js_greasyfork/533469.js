// ==UserScript==
// @name         Torn City - Toggle Locked & Expensive Bazaar Item Remover
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Toggle removal of locked or expensive ($2+) bazaar items in Torn City via draggable button, with state persistence
// @author       You
// @match        https://www.torn.com/bazaar.php*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/533469/Torn%20City%20-%20Toggle%20Locked%20%20Expensive%20Bazaar%20Item%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/533469/Torn%20City%20-%20Toggle%20Locked%20%20Expensive%20Bazaar%20Item%20Remover.meta.js
// ==/UserScript==


(function () {
    'use strict';

    let filterEnabled = localStorage.getItem('filterEnabled') === 'true';

    function removeLockedOrExpensiveItems() {
        if (!filterEnabled) return;

        const items = document.querySelectorAll('.item___GYCYJ.item___khvF6');
        items.forEach(item => {
            const description = item.querySelector('.itemDescription___j4EfE');
            if (!description) return;

            const lockDiv = description.querySelector('#isBlockedForBuyingTooltip.lockContainer___iCLqC');
            const svg = lockDiv?.querySelector('svg[viewBox="0 0 24 30"]');
            const path = svg?.querySelector('path');
            const isLocked = path?.getAttribute('d') === 'M18,10V6A6,6,0,0,0,6,6v4H3V24H21V10ZM8,10V6a4,4,0,0,1,8,0v4Z';

            const priceText = description.querySelector('.price___dJqda')?.textContent;
            const price = parseFloat(priceText?.replace(/[^\d.]/g, ''));
            const isExpensive = price > 2;

            if (isLocked || isExpensive) {
                item.remove();
            }
        });
    }

    const observer = new MutationObserver(() => {
        removeLockedOrExpensiveItems();
    });

    function setupObserver() {
        observer.observe(document.body, { childList: true, subtree: true });
    }

    function clamp(value, min, max) {
        return Math.max(min, Math.min(max, value));
    }

    function createToggleButton() {
        const btn = document.createElement('div');
        btn.id = 'lockFilterToggle';

        // Load saved position
        let savedTop = parseInt(localStorage.getItem('filterButtonTop'));
        let savedLeft = parseInt(localStorage.getItem('filterButtonLeft'));
        const maxLeft = window.innerWidth - 160;
        const maxTop = window.innerHeight - 60;

        if (isNaN(savedTop)) savedTop = 100;
        else savedTop = clamp(savedTop, 0, maxTop);

        if (isNaN(savedLeft)) savedLeft = 100;
        else savedLeft = clamp(savedLeft, 0, maxLeft);

        // Style
        btn.style.position = 'fixed';
        btn.style.top = `${savedTop}px`;
        btn.style.left = `${savedLeft}px`;
        btn.style.zIndex = '9999';
        btn.style.background = '#292d3e';
        btn.style.color = '#fff';
        btn.style.padding = '8px 14px';
        btn.style.borderRadius = '8px';
        btn.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)';
        btn.style.cursor = 'move';
        btn.style.fontSize = '13px';
        btn.style.fontFamily = 'Arial, sans-serif';
        btn.style.userSelect = 'none';
        btn.style.transition = 'background 0.3s';
        btn.style.maxWidth = '200px';
        btn.style.whiteSpace = 'nowrap';
        btn.innerText = `Hide Locked/$2+ Items: ${filterEnabled ? 'ON' : 'OFF'}`;

        // Hover effect
        btn.addEventListener('mouseenter', () => {
            btn.style.background = '#3c445c';
        });
        btn.addEventListener('mouseleave', () => {
            btn.style.background = '#292d3e';
        });

        let isDragging = false;
        let offsetX = 0;
        let offsetY = 0;
        let startX = 0;
        let startY = 0;
        let dragged = false;

        btn.addEventListener('mousedown', function (e) {
            isDragging = true;
            dragged = false;
            offsetX = e.clientX - btn.getBoundingClientRect().left;
            offsetY = e.clientY - btn.getBoundingClientRect().top;
            startX = e.clientX;
            startY = e.clientY;
            e.preventDefault();
        });

        document.addEventListener('mousemove', function (e) {
            if (isDragging) {
                const dx = e.clientX - startX;
                const dy = e.clientY - startY;
                if (Math.abs(dx) > 5 || Math.abs(dy) > 5) dragged = true;

                const left = clamp(e.clientX - offsetX, 0, maxLeft);
                const top = clamp(e.clientY - offsetY, 0, maxTop);
                btn.style.left = `${left}px`;
                btn.style.top = `${top}px`;
                localStorage.setItem('filterButtonLeft', left);
                localStorage.setItem('filterButtonTop', top);
            }
        });

        document.addEventListener('mouseup', function () {
            isDragging = false;
        });

        btn.addEventListener('click', function () {
            if (dragged) return; // Don't toggle if it was just dragged
            filterEnabled = !filterEnabled;
            localStorage.setItem('filterEnabled', filterEnabled);
            btn.innerText = `Hide Locked/$2+ Items: ${filterEnabled ? 'ON' : 'OFF'}`;
            removeLockedOrExpensiveItems();
        });

        document.body.appendChild(btn);
    }

    window.addEventListener('load', () => {
        setTimeout(() => {
            createToggleButton();
            removeLockedOrExpensiveItems();
            setupObserver();
        }, 1000);
    });
})();
