// ==UserScript==
// @name         Torn — Sort items by value
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Sort items by value and show total value + Hide equipped items option
// @author       Charkel [3429133]
// @match        https://www.torn.com/item.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/545331/Torn%20%E2%80%94%20Sort%20items%20by%20value.user.js
// @updateURL https://update.greasyfork.org/scripts/545331/Torn%20%E2%80%94%20Sort%20items%20by%20value.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const TITLE_BAR_SELECTOR = '.title-black.hospital-dark.top-round.scroll-dark';
    const BUTTON_CONTAINER_CLASS = 'tm-sort-buttons';
    const TOTAL_ID = 'tm-total-value';
    const TOTAL_PLACEHOLDER = 'Total: (click a sort to calculate)';

    let itemsFullyLoaded = false;
    let hideEquipped = false;
    let hasSorted = false;
    let loadingOverlay;
    let btnToggle;
    let suppressGreenObserver = false;

    const style = document.createElement('style');
    style.textContent = `
        .tm-sort-btn {
            margin-left: 6px;
            padding: 3px 7px;
            background: #acea00;
            border: 1px solid #222;
            border-radius: 3px;
            cursor: pointer;
            font-size: 12px;
            font-weight: 700;
        }
        .tm-total {
            margin-left: 12px;
            font-size: 12px;
            font-weight: 700;
            color: #acea00;
        }
        .tm-loading-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: rgba(0,0,0,0.70);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9999;
            font-size: 48px;
            font-weight: bold;
            color: #fff;
            text-shadow:
                -2px -2px 4px rgba(0,0,0,0.9),
                 2px -2px 4px rgba(0,0,0,0.9),
                -2px  2px 4px rgba(0,0,0,0.9),
                 2px  2px 4px rgba(0,0,0,0.9);
            pointer-events: none;
        }
        .tm-hidden-green { display: none !important; }
    `;
    document.head.appendChild(style);

    function createButton(label, sortType) {
        const btn = document.createElement('button');
        btn.className = 'tm-sort-btn';
        btn.textContent = label + (sortType ? ' ↓' : '');
        if (sortType) btn.dataset.sortType = sortType;
        btn.dataset.order = 'desc';
        return btn;
    }

    function ensureTotalNode(parent) {
        let total = parent.querySelector('#' + TOTAL_ID);
        if (!total) {
            total = document.createElement('span');
            total.id = TOTAL_ID;
            total.className = 'tm-total';
            total.textContent = TOTAL_PLACEHOLDER;
            parent.appendChild(total);
        }
        return total;
    }

    function showLoadingOverlay() {
        if (!loadingOverlay) {
            loadingOverlay = document.createElement('div');
            loadingOverlay.className = 'tm-loading-overlay';
            loadingOverlay.textContent = 'Loading items, please wait…';
            document.body.appendChild(loadingOverlay);
        }
        loadingOverlay.style.display = 'flex';
    }
    function hideLoadingOverlay() {
        if (loadingOverlay) loadingOverlay.style.display = 'none';
    }

    async function loadAllItems() {
        if (itemsFullyLoaded) return;
        showLoadingOverlay();
        const start = Date.now(), MAX_MS = 25000;
        return new Promise(resolve => {
            let lastHeight = 0, sameHeightCount = 0, attempts = 0, maxAttempts = 120;
            function finish(){ itemsFullyLoaded = true; hideLoadingOverlay(); resolve(); }
            function scrollStep(){
                attempts++;
                window.scrollTo(0, document.body.scrollHeight);
                const newHeight = document.body.scrollHeight;
                if (newHeight === lastHeight) {
                    sameHeightCount++;
                    if (sameHeightCount > 5 || attempts > maxAttempts || (Date.now()-start)>MAX_MS) return finish();
                } else { sameHeightCount = 0; lastHeight = newHeight; }
                setTimeout(scrollStep, 300);
            }
            scrollStep();
        });
    }

    function parsePriceElem(priceElem) {
        if (!priceElem) return { single: 0, total: 0, qty: 0 };
        const rawText = priceElem.textContent.replace(/\u00A0/g, ' ').trim();
        if (/N\/A/i.test(rawText)) return { single: 0, total: 0, qty: 0 };
        const numTokens = (rawText.match(/\d[\d,]*/g) || []).map(s => parseInt(s.replace(/,/g, ''), 10));
        let qty = 0;
        const qtySpan = priceElem.querySelector('.tt-item-quantity');
        const qtyMatch = qtySpan?.textContent.match(/(\d+)/) || rawText.match(/(\d+)\s*x/i);
        if (qtyMatch) qty = parseInt(qtyMatch[1], 10);
        if (qty) {
            const total = numTokens[numTokens.length - 1] || 0;
            let single = numTokens.find(n => n !== qty && n !== total) || 0;
            if (!single && total && qty) single = Math.round(total / qty);
            return { single, total, qty };
        }
        if (!numTokens.length) return { single: 0, total: 0, qty: 0 };
        if (numTokens.length === 1) return { single: numTokens[0], total: numTokens[0], qty: 0 };
        const max = Math.max(...numTokens);
        const min = Math.min(...numTokens);
        if (max % min === 0 && (max / min) <= 1000) return { single: min, total: max, qty: Math.round(max / min) };
        return { single: numTokens[0], total: max, qty: 0 };
    }

    function isVisible(el) { return !!(el?.offsetWidth || el?.offsetHeight || el?.getClientRects().length); }

    function getVisibleItemContainers() {
        let containers = Array.from(document.querySelectorAll('.items-cont, .itemsList, ul.items-cont, ul.itemsList')).filter(isVisible);
        if (!containers.length) {
            containers = Array.from(document.querySelectorAll('ul')).filter(u => /-items$/.test(u.id) && isVisible(u));
        }
        return containers;
    }

    function sortVisibleLists(sortType, order) {
        const containers = getVisibleItemContainers();
        containers.forEach(container => {
            const items = Array.from(container.children).filter(el => el.tagName === 'LI');
            if (!items.length) return;
            const pairs = items.map((li, i) => {
                const priceElem = li.querySelector('.tt-item-price');
                const parsed = parsePriceElem(priceElem);
                const val = sortType === 'single' ? parsed.single : parsed.total;
                return { li, val, index: i };
            });
            pairs.sort((a, b) => a.val === b.val ? a.index - b.index : (order === 'desc' ? b.val - a.val : a.val - b.val));
            pairs.forEach(p => container.appendChild(p.li));
        });
    }

    function formatNum(n) { return n.toLocaleString('en-US'); }

    function isFactionItem(li) {
        return !!li.querySelector('.option-return-to-faction, .return, [data-action="return"], [data-type="armoury"], [data-armoryid]');
    }

    function computeTotalValue() {
        const containers = getVisibleItemContainers();
        let sum = 0;
        containers.forEach(container => {
            const items = Array.from(container.children).filter(el =>
                el.tagName === 'LI' &&
                isVisible(el) &&
                !el.classList.contains('tm-hidden-green') &&
                !isFactionItem(el)
            );
            items.forEach(li => {
                const priceElem = li.querySelector('.tt-item-price');
                const { total } = parsePriceElem(priceElem);
                if (Number.isFinite(total)) sum += total || 0;
            });
        });
        return sum;
    }

    function updateTotalDisplay() {
        const titleBar = document.querySelector(TITLE_BAR_SELECTOR);
        if (!titleBar) return;
        const host = titleBar.querySelector('.' + BUTTON_CONTAINER_CLASS);
        if (!host) return;
        const node = ensureTotalNode(host);
        if (!hasSorted) { if (node.textContent !== TOTAL_PLACEHOLDER) node.textContent = TOTAL_PLACEHOLDER; return; }
        const newText = `Total: $${formatNum(computeTotalValue())}`;
        if (node.textContent !== newText) node.textContent = newText;
    }

    function updateToggleLabel() {
        if (!btnToggle) return;
        btnToggle.textContent = hideEquipped ? 'Show Equipped' : 'Hide Equipped';
    }

    function applyGreenVisibility(scope=document) {
        suppressGreenObserver = true; // prevent observer echo
        const greens = scope.querySelectorAll('li.bg-green');
        greens.forEach(el => el.classList.toggle('tm-hidden-green', hideEquipped));
        suppressGreenObserver = false;
        updateToggleLabel();
        updateTotalDisplay();
    }

    function addSortButtonsOnce() {
        const titleBar = document.querySelector(TITLE_BAR_SELECTOR);
        if (!titleBar || titleBar.querySelector('.' + BUTTON_CONTAINER_CLASS)) return;

        const container = document.createElement('div');
        container.className = BUTTON_CONTAINER_CLASS;
        container.style.display = 'inline-block';
        container.style.marginLeft = '8px';

        const btnTotal = createButton('Total Value', 'total');
        const btnSingle = createButton('Single Value', 'single');
        btnToggle = createButton('Hide Equipped'); // first click hides

        function clickHandler(clickedBtn, otherBtn) {
            return async function () {
                const orderToUse = clickedBtn.dataset.order || 'desc';
                otherBtn.dataset.order = 'desc';
                otherBtn.textContent = otherBtn.textContent.replace(/↓|↑/, '↓');
                await loadAllItems();
                sortVisibleLists(clickedBtn.dataset.sortType, orderToUse);
                hasSorted = true;
                updateTotalDisplay();
                clickedBtn.dataset.order = orderToUse === 'desc' ? 'asc' : 'desc';
                clickedBtn.textContent = clickedBtn.textContent.replace(/↓|↑/, clickedBtn.dataset.order === 'desc' ? '↓' : '↑');
                window.scrollTo(0, 0);
            };
        }

        btnTotal.addEventListener('click', clickHandler(btnTotal, btnSingle));
        btnSingle.addEventListener('click', clickHandler(btnSingle, btnTotal));

        btnToggle.addEventListener('click', () => {
            hideEquipped = !hideEquipped;
            applyGreenVisibility(document);
        });

        container.appendChild(btnTotal);
        container.appendChild(btnSingle);
        container.appendChild(btnToggle);
        ensureTotalNode(container);
        titleBar.appendChild(container);

        updateToggleLabel();
        updateTotalDisplay();
    }

    // Debounced/filtered observers
    let totalRaf = 0;
    const main = document.querySelector('#mainContainer') || document.documentElement;

    const recomputeObserver = new MutationObserver(mutations => {
        if (mutations.every(m => {
            const tgt = m.target instanceof Element ? m.target : null;
            return tgt && (tgt.closest('.' + BUTTON_CONTAINER_CLASS) || tgt.id === TOTAL_ID);
        })) return;
        if (totalRaf) return;
        totalRaf = requestAnimationFrame(() => { totalRaf = 0; updateTotalDisplay(); });
    });
    recomputeObserver.observe(main, { childList: true, subtree: true, characterData: true });

    const buttonsObserver = new MutationObserver(mutations => {
        if (mutations.every(m => {
            const tgt = m.target instanceof Element ? m.target : null;
            return tgt && tgt.closest('.' + BUTTON_CONTAINER_CLASS);
        })) return;
        addSortButtonsOnce();
    });
    buttonsObserver.observe(main, { childList: true, subtree: true });

    // ONLY handle newly added nodes for green-hiding; avoid loops by skipping when we are the mutator.
    const greenObserver = new MutationObserver(mutations => {
        if (suppressGreenObserver || !hideEquipped) return;
        for (const m of mutations) {
            if (!m.addedNodes?.length) continue;
            m.addedNodes.forEach(node => {
                if (!(node instanceof Element)) return;
                if (node.matches && node.matches('li.bg-green')) {
                    applyGreenVisibility(node.parentElement || document);
                } else {
                    const innerGreens = node.querySelectorAll ? node.querySelectorAll('li.bg-green') : [];
                    if (innerGreens.length) applyGreenVisibility(node);
                }
            });
        }
    });
    greenObserver.observe(main, { childList: true, subtree: true });

    addSortButtonsOnce();
})();
