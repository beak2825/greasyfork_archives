// ==UserScript==
// @name         트래더리 price sorting
// @namespace    http://tampermonkey.net/
// @version      2.4
// @description  Traderie price sorting
// @author       Gemini Analysis
// @match        https://traderie.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/545279/%ED%8A%B8%EB%9E%98%EB%8D%94%EB%A6%AC%20price%20sorting.user.js
// @updateURL https://update.greasyfork.org/scripts/545279/%ED%8A%B8%EB%9E%98%EB%8D%94%EB%A6%AC%20price%20sorting.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const style = document.createElement('style');
    style.textContent = `
        .traderie-sort-container {
            position: fixed !important; top: 10px !important; right: 10px !important; z-index: 9999 !important;
            background: rgba(40, 40, 40, 0.95) !important; border: 1px solid #666 !important; border-radius: 8px !important;
            padding: 10px !important; display: flex !important; flex-direction: column !important; gap: 8px !important;
            box-shadow: 0 4px 20px rgba(0,0,0,0.6) !important; backdrop-filter: blur(10px) !important; min-width: 180px !important;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
        }
        .traderie-sort-buttons { display: flex !important; gap: 5px !important; flex-wrap: wrap !important; }
        .traderie-sort-button {
            background: #4a90e2 !important; border: none !important; color: white !important; padding: 6px 12px !important;
            border-radius: 4px !important; cursor: pointer !important; font-size: 11px !important; font-weight: 500 !important;
            transition: all 0.2s ease !important; white-space: nowrap !important; flex: 1 !important; user-select: none !important;
        }
        .traderie-sort-button:hover { background: #5ba0f2 !important; transform: translateY(-1px) !important; }
        .traderie-sort-button:active { transform: translateY(0) !important; }
        .traderie-sort-button.active { background: #f39c12 !important; }
        .traderie-sort-label { color: #fff !important; font-weight: 500 !important; font-size: 12px !important; text-align: center !important; margin-bottom: 2px !important; }
        .traderie-sort-info { color: #bbb !important; font-size: 10px !important; text-align: center !important; margin-top: 2px !important; }
        @media (max-width: 768px) {
            .traderie-sort-container { bottom: 10px !important; top: auto !important; min-width: 160px !important; }
        }
    `;
    document.head.appendChild(style);

    let listingContainer = null;

    function createSortButtons() {
        const container = document.createElement('div');
        container.className = 'traderie-sort-container';
        container.innerHTML = `
            <div class="traderie-sort-label">하이룬밸류 정렬</div>
            <div class="traderie-sort-buttons">
                <button class="traderie-sort-button" id="sort-asc">낮은순 ↑</button>
                <button class="traderie-sort-button" id="sort-desc">높은순 ↓</button>
            </div>
            <button class="traderie-sort-button" id="sort-reset">원래 순서</button>
            <div class="traderie-sort-info">정렬: <span id="sorted-count">0</span>개</div>
        `;
        container.querySelector('#sort-asc').addEventListener('click', () => sortByPrice('asc'));
        container.querySelector('#sort-desc').addEventListener('click', () => sortByPrice('desc'));
        container.querySelector('#sort-reset').addEventListener('click', resetSort);
        return container;
    }

    function extractHighRuneValue(element) {
        const valueElement = element.querySelector('.listing-value span');
        if (!valueElement) return null;
        const text = valueElement.textContent.trim();
        const match = text.match(/High Rune Value:\s*([\d.]+)/);
        return match ? parseFloat(match[1]) : null;
    }

    // =================================================================
    // ## 변경점 ##
    // 아이템을 찾는 선택자를 정상 작동하던 '[class*="listing-row"]'로 되돌렸습니다.
    // =================================================================
    function getListingItemsAndContainer() {
        const items = document.querySelectorAll('[class*="listing-row"]');
        if (items.length === 0) {
            return { items: [], container: null };
        }
        const container = items[0].parentElement;
        return { items: Array.from(items), container: container };
    }

    function sortByPrice(direction) {
        const { items, container } = getListingItemsAndContainer();
        if (items.length === 0 || !container) {
            alert('정렬할 아이템을 찾을 수 없습니다.');
            return;
        }

        listingContainer = container;

        const itemsWithPrice = items.map(item => ({
            element: item,
            price: extractHighRuneValue(item)
        }));

        const validItems = itemsWithPrice.filter(item => item.price !== null);
        const invalidItems = itemsWithPrice.filter(item => item.price === null);

        if (validItems.length === 0 && invalidItems.length > 0) {
             alert('가격이 있는 아이템이 없어 정렬할 수 없습니다.');
             return;
        }

        validItems.sort((a, b) => {
            return direction === 'asc' ? a.price - b.price : b.price - a.price;
        });

        const allItemsSorted = [...validItems, ...invalidItems];

        allItemsSorted.forEach((item, index) => {
             item.element.style.order = index;
        });

        updateButtonStates(direction);
        document.getElementById('sorted-count').textContent = validItems.length;
    }

    function resetSort() {
        if (!listingContainer) return;
        const children = Array.from(listingContainer.children);
        children.forEach(child => {
            child.style.order = '';
        });
        updateButtonStates(null);
        document.getElementById('sorted-count').textContent = '0';
    }

    function updateButtonStates(activeSort) {
        document.querySelectorAll('.traderie-sort-button').forEach(btn => btn.classList.remove('active'));
        const activeBtnId = activeSort ? `sort-${activeSort}` : 'sort-reset';
        const activeBtn = document.getElementById(activeBtnId);
        if (activeBtn) activeBtn.classList.add('active');
    }

    function initialize() {
        if (document.querySelector('.traderie-sort-container')) {
            return;
        }
        // 이 부분의 선택자도 되돌렸습니다.
        if (document.querySelector('[class*="listing-row"]')) {
             const sortContainer = createSortButtons();
             document.body.appendChild(sortContainer);
        }
    }

    const observer = new MutationObserver(() => {
        // 이 부분의 선택자도 되돌렸습니다.
        if (document.querySelector('[class*="listing-row"]') && !document.querySelector('.traderie-sort-container')) {
             setTimeout(initialize, 500);
        }
    });

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => setTimeout(initialize, 1500));
    } else {
        setTimeout(initialize, 1500);
    }

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    console.log('트래더리 하이룬밸류 정렬 스크립트(v2.3)가 로드되었습니다.');
})();