// ==UserScript==
// @name         Routine Navigator
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  One-click navigation through your routine!
// @author       J4C
// @match        https://www.torn.com/*
// @match        https://www.torn.com/item.php*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/546078/Routine%20Navigator.user.js
// @updateURL https://update.greasyfork.org/scripts/546078/Routine%20Navigator.meta.js
// ==/UserScript==

(() => {
    'use strict';

    const ROUTINE = [
        { name: 'Graffiti', url: 'https://www.torn.com/page.php?sid=crimes#/graffiti' },
        { name: 'Faction Armory', url: 'https://www.torn.com/factions.php?step=your&type=1#/tab=armoury&start=0&sub=medical' },
        { name: 'Inventory', url: 'https://www.torn.com/item.php#drugs-items' },
        { name: 'Gym', url: 'https://www.torn.com/gym.php' },
        { name: 'Wheels', url: 'https://www.torn.com/page.php?sid=spinTheWheel' },
        { name: 'Roulette', url: 'https://www.torn.com/page.php?sid=roulette' },
        { name: 'Slots', url: 'https://www.torn.com/page.php?sid=slots' },
        { name: 'Blackjack', url: 'https://www.torn.com/page.php?sid=blackjack' },
        { name: 'Travel', url: 'https://www.torn.com/page.php?sid=travel' }
    ];

    GM_addStyle(`
        @keyframes glow-pulse {
            0% { box-shadow: 0 0 5px #00ff00, 0 0 10px #00ff00; }
            50% { box-shadow: 0 0 20px #00ff00, 0 0 30px #00ff00; }
            100% { box-shadow: 0 0 5px #00ff00, 0 0 10px #00ff00; }
        }
        .highlight-item {
            animation: glow-pulse 2s infinite;
            border-radius: 5px;
            position: relative;
            z-index: 1000;
        }
        .highlight-item::after {
            content: '';
            position: absolute;
            top: -2px;
            left: -2px;
            right: -2px;
            bottom: -2px;
            border: 2px solid #00ff00;
            border-radius: 7px;
            pointer-events: none;
            z-index: 999;
        }
        #routineNavFloat {
            position: fixed;
            top: 120px;
            left: 10px;
            z-index: 999999;
            background: #333;
            color: #fff;
            border-radius: 8px;
            padding: 8px;
            box-shadow: 0 2px 6px rgba(0,0,0,0.3);
            font-family: Arial, sans-serif;
            font-size: 14px;
            display: flex;
            flex-direction: column;
            align-items: center;
            cursor: grab;
            user-select: none;
        }
        #routineNavFloat button {
            margin: 4px 0;
            padding: 6px 12px;
            background: #3498db;
            border: none;
            border-radius: 4px;
            color: white;
            font-weight: bold;
            cursor: pointer;
        }
        #routineNavFloat button:hover {
            background: #217dbb;
        }
        #routineCounter {
            margin-bottom: 6px;
        }
    `);

    let index = +localStorage.getItem('routineIndex') || 0;

    if (location.pathname === '/index.php') {
        index = 0;
        localStorage.setItem('routineIndex', index);
    }

    const container = document.createElement('div');
    container.id = 'routineNavFloat';
    container.innerHTML = `
        <div id="routineCounter">${index + 1} / ${ROUTINE.length}</div>
        <button id="routineReset">1. First Page</button>
        <button id="routinePrev">2. Previous Page</button>
        <button id="routineNext">3. Next Page</button>
    `;
    document.body.appendChild(container);

    const counter = document.getElementById('routineCounter');

    const openStep = i => {
        if (i < 0 || i >= ROUTINE.length) return;
        index = i;
        localStorage.setItem('routineIndex', index);
        counter.textContent = `${index + 1} / ${ROUTINE.length}`;
        window.location.href = ROUTINE[index].url;
    };

    document.getElementById('routineNext')
        .addEventListener('click', () => openStep((index + 1) % ROUTINE.length));

    document.getElementById('routinePrev')
        .addEventListener('click', () => openStep((index - 1 + ROUTINE.length) % ROUTINE.length));

    document.getElementById('routineReset')
        .addEventListener('click', () => openStep(0));

    let isDragging = false, startX, startY, startLeft, startTop;

    container.addEventListener('mousedown', e => {
        if (e.target.tagName === 'BUTTON') return;
        isDragging = true;
        startX = e.clientX;
        startY = e.clientY;
        const rect = container.getBoundingClientRect();
        startLeft = rect.left;
        startTop = rect.top;
        container.style.cursor = 'grabbing';
        e.preventDefault();
    });

    document.addEventListener('mousemove', e => {
        if (!isDragging) return;
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;
        container.style.left = `${startLeft + dx}px`;
        container.style.top = `${startTop + dy}px`;
    });

    document.addEventListener('mouseup', () => {
        if (isDragging) {
            isDragging = false;
            container.style.cursor = 'grab';

            const rect = container.getBoundingClientRect();
            localStorage.setItem('routineNavPosition', JSON.stringify({x: rect.left, y: rect.top}));
        }
    });

    const savedPos = JSON.parse(localStorage.getItem('routineNavPosition'));
    if (savedPos?.x !== undefined && savedPos?.y !== undefined) {
        container.style.left = `${savedPos.x}px`;
        container.style.top = `${savedPos.y}px`;
    }

    function highlightItems() {
        // Check if on the armory page
        if (window.location.href.includes('factions.php?step=your&type=1#/tab=armoury')) {
            // Check for medical tab (Empty Blood Bag)
            if (window.location.href.includes('sub=medical')) {
                highlightSpecificItem('Empty Blood Bag', ['.item-desc', '.name', '.item-name', '.item']);
            }
            // Check for drugs tab (Xanax)
            else if (window.location.href.includes('sub=drugs')) {
                highlightSpecificItem('Xanax', ['.item-desc', '.name', '.item-name', '.item']);
            }
        }
        else if (window.location.href.includes('item.php#drugs-items')) {
            highlightInventoryItem('Xanax');
        }
    }

    function highlightInventoryItem(itemName) {
        // Only highlight if already on the drugs tab
        const drugsTab = document.querySelector('a[href="#drugs-items"]');
        if (drugsTab && !drugsTab.classList.contains('active')) {
            return;
        }

        const items = document.querySelectorAll('.items-list-item, .item');
        let found = false;

        items.forEach(item => {
            const nameElement = item.querySelector('.name, .item-name, .item-desc');
            if (nameElement && nameElement.textContent.includes(itemName)) {
                item.classList.add('highlight-item');
                found = true;
            }
        });

        if (!found) {
            setTimeout(() => highlightInventoryItem(itemName), 500);
        }
    }

    function highlightSpecificItem(itemName, selectors) {
        let found = false;

        selectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => {
                if (element.textContent.includes(itemName)) {
                    const container = element.closest('.item-cont') ||
                                    element.closest('.item') ||
                                    element.closest('.items-list-item') ||
                                    element.parentElement;

                    if (container && !container.classList.contains('highlight-item')) {
                        container.classList.add('highlight-item');
                        found = true;
                    }
                }
            });
        });

        return found;
    }

    function initializeHighlighter() {
        // Clear any existing highlights
        document.querySelectorAll('.highlight-item').forEach(el => {
            el.classList.remove('highlight-item');
        });

        // Apply new highlights
        highlightItems();

        setTimeout(highlightItems, 1000);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeHighlighter);
    } else {
        initializeHighlighter();
    }

    let lastUrl = location.href;
    const observer = new MutationObserver(() => {
        if (location.href !== lastUrl) {
            lastUrl = location.href;
            setTimeout(initializeHighlighter, 250);
        }
    });
    observer.observe(document, { subtree: true, childList: true });

})();