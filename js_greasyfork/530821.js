// ==UserScript==
// @name         Bezas Bazaar
// @namespace    http://tampermonkey.net/
// @version      3.0.2
// @description  Manually set a price and highlight both item market and bazaar sellers accordingly in Torn.com.
// @author       JeffBezas[3408347]
// @match        https://www.torn.com/page.php?sid=ItemMarket*
// @match        https://www.torn.com/bazaar.php?*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/530821/Bezas%20Bazaar.user.js
// @updateURL https://update.greasyfork.org/scripts/530821/Bezas%20Bazaar.meta.js
// ==/UserScript==

(function () {
    'use strict';

    GM_addStyle(`
        .manual-highlight-good { background-color: #004d00 !important; color: white; }
        .manual-highlight-warning { background-color: #ffa500 !important; color: black; }
        .manual-highlight-bad { background-color: #8b0000 !important; color: white; }
        .manual-highlight-missing { background-color: #d3d3d3 !important; color: #000; }

        #manual-price-modal, #manual-price-manager {
            position: fixed;
            background: #1e1e1e;
            color: white;
            padding: 20px;
            border: 2px solid #888;
            border-radius: 10px;
            z-index: 9999;
        }

        #manual-price-modal {
            top: 30%;
            left: 50%;
            transform: translate(-50%, -30%);
            display: none;
        }

        #manual-price-modal input {
            width: 100px;
            padding: 5px;
            font-size: 14px;
        }

        #manual-price-modal button,
        #manual-price-manager button {
            margin-left: 10px;
            padding: 5px 10px;
            background: #444;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
        }
    `);

    const storage = typeof GM_getValue === 'function' ? {
        get: GM_getValue,
        set: GM_setValue
    } : {
        get: key => JSON.parse(localStorage.getItem(key)),
        set: (key, value) => localStorage.setItem(key, JSON.stringify(value))
    };

    const modal = document.createElement("div");
    modal.id = "manual-price-modal";
    modal.innerHTML = `
        <label>Manual price: $<input type="number" id="manual-price-input" /></label>
        <button id="manual-price-save">Save</button>
        <button id="manual-price-cancel">Cancel</button>
    `;
    document.body.appendChild(modal);

    const priceInput = document.getElementById("manual-price-input");
    const saveBtn = document.getElementById("manual-price-save");
    const cancelBtn = document.getElementById("manual-price-cancel");

    let currentItemId = null;

    const manager = document.createElement("div");
    manager.id = "manual-price-manager";
    manager.style.bottom = "10px";
    manager.style.right = "10px";
    manager.style.maxHeight = "300px";
    manager.style.overflowY = "auto";
    document.body.appendChild(manager);

    const refreshButton = document.createElement("button");
    refreshButton.textContent = "📋 View Manual Prices";
    refreshButton.style = "position: fixed; bottom: 10px; left: 10px; z-index: 10000;";
    refreshButton.onclick = () => {
        manager.innerHTML = "<b>📋 Saved Prices:</b><br/><br/>";
        let found = false;
        for (let key in localStorage) {
            if (key.startsWith("manual_price_")) {
                found = true;
                const itemId = key.split("_").pop();
                const val = storage.get(key);
                if (val) {
                    manager.innerHTML += `Item ID ${itemId}: $${Number(val).toLocaleString()}
                        <button data-del="${key}" style="margin-left: 10px;">❌ Delete</button><br/>`;
                }
            }
        }
        if (!found) manager.innerHTML += "No saved prices.";
    };
    document.body.appendChild(refreshButton);

    manager.addEventListener("click", (e) => {
        if (e.target.dataset.del) {
            storage.set(e.target.dataset.del, null);
            e.target.parentElement.remove();
        }
    });

    function getPageType() {
    const url = window.location.href;
    if (url.includes("page.php?sid=ItemMarket")) return "itemmarket";
    if (url.includes("bazaar.php")) return "bazaar";
    return null;
}



    function makeDraggable(element) {
    let isDragging = false;
    let offsetX = 0;
    let offsetY = 0;

    element.addEventListener("mousedown", function (e) {
        // Prevent drag if interacting with input, textarea, or button
        if (["INPUT", "TEXTAREA", "BUTTON"].includes(e.target.tagName)) return;

        isDragging = true;
        offsetX = e.clientX - element.offsetLeft;
        offsetY = e.clientY - element.offsetTop;
        e.preventDefault();
    });

    document.addEventListener("mouseup", () => isDragging = false);
    document.addEventListener("mousemove", function (e) {
        if (isDragging) {
            element.style.left = e.clientX - offsetX + 'px';
            element.style.top = e.clientY - offsetY + 'px';
            element.style.right = 'auto';
            element.style.bottom = 'auto';
        }
    });
}


    makeDraggable(modal);
    makeDraggable(manager);

    saveBtn.onclick = () => {
        const value = parseInt(priceInput.value);
        if (value > 0 && currentItemId) {
            storage.set(`manual_price_${currentItemId}`, value);
            modal.style.display = "none";

            const observer = new MutationObserver(() => {
                const sellerRows = document.querySelectorAll('li[class*="rowWrapper___"]');
                if (sellerRows.length > 0) {
                    observer.disconnect();
                    highlightSellerRows(currentItemId, value);
                }
            });

            observer.observe(document.body, { childList: true, subtree: true });
            waitForBazaarPrices(currentItemId, value);
        }
    };

    cancelBtn.onclick = () => modal.style.display = "none";

    function highlightSellerRows(itemId, manualPrice) {
        const rows = document.querySelectorAll('li[class*="rowWrapper___"]');
        rows.forEach(row => {
            const priceEl = row.querySelector('div[class*="price___"]');
            if (!priceEl) return;
            const match = priceEl.textContent.match(/\$([\d,]+)/);
            if (!match) return;
            const listed = parseInt(match[1].replace(/,/g, ''));
            const diffPercent = ((listed - manualPrice) / manualPrice) * 100;
            row.classList.remove('manual-highlight-good', 'manual-highlight-warning', 'manual-highlight-bad');
            if (listed <= manualPrice) {
                row.classList.add('manual-highlight-good');
            } else if (diffPercent <= 5) {
                row.classList.add('manual-highlight-warning');
            } else {
                row.classList.add('manual-highlight-bad');
            }
            addPercentIndicator(priceEl, diffPercent);
        });
    }

    function addPercentIndicator(el, diffPercent) {
        if (el.querySelector('.manual-price-diff')) return;
        const span = document.createElement('span');
        span.className = 'manual-price-diff';
        span.style.marginLeft = '6px';
        span.style.fontSize = '12px';
        span.style.fontWeight = 'bold';
        span.style.color = 'black';
        span.style.backgroundColor = 'rgba(255,255,255,0.6)';
        span.style.padding = '1px 4px';
        span.style.borderRadius = '4px';
        const sign = diffPercent > 0 ? '+' : '';
        span.textContent = `(${sign}${diffPercent.toFixed(1)}%)`;
        el.appendChild(span);
    }

    function highlightBazaarPrices(priceLinks, manualPrice) {
        priceLinks.forEach(link => {
            if (link.dataset.manualChecked === "true") return;
            const match = link.textContent.match(/\$([\d,]+)/);
            if (!match) return;
            const listed = parseInt(match[1].replace(/,/g, ''));
            const diff = ((listed - manualPrice) / manualPrice) * 100;
            link.dataset.manualChecked = "true";
            link.style.padding = "2px 4px";
            link.style.borderRadius = "4px";
            link.style.fontWeight = "bold";
            if (listed <= manualPrice) {
                link.style.backgroundColor = "#004d00";
                link.style.color = "#fff";
            } else if (diff <= 5) {
                link.style.backgroundColor = "#ffa500";
                link.style.color = "#000";
            } else {
                link.style.backgroundColor = "#8b0000";
                link.style.color = "#fff";
            }
            addPercentIndicator(link, diff);
        });
    }

    function waitForBazaarPrices(itemId, manualPrice) {
        const listingsView = document.querySelector('#fullListingsView');
        if (!listingsView) return;
        const observer = new MutationObserver(() => {
            const noItem = listingsView.textContent.includes("No item selected");
            const priceLinks = listingsView.querySelectorAll('a[href*="bazaar.php?userID="]:not([data-checked])');
            if (!noItem && priceLinks.length > 0) {
                observer.disconnect();
                highlightBazaarPrices(priceLinks, manualPrice);
            }
        });
        observer.observe(listingsView, { childList: true, subtree: true, characterData: true });
    }

    function extractItemIdFromButton(button) {
        const container = button.closest('.itemTile___cbw7w');
        const img = container?.querySelector('img.torn-item');
        const match = img?.src?.match(/\/items\/(\d+)\//);
        return match ? match[1] : null;
    }

    function setupBuyButtonListeners() {
        document.querySelectorAll('.actionButton___pb_Da').forEach(btn => {
            if (btn.dataset.boundManual === "true") return;
            btn.dataset.boundManual = "true";
            btn.addEventListener('click', () => {
                const itemId = extractItemIdFromButton(btn);
                if (!itemId) return;
                currentItemId = itemId;
                const saved = storage.get(`manual_price_${itemId}`);
                priceInput.value = saved || "";
                modal.style.display = "block";
                if (saved) {
                    const observer = new MutationObserver(() => {
                        const sellerRows = document.querySelectorAll('li[class*="rowWrapper___"]');
                        if (sellerRows.length > 0) {
                            observer.disconnect();
                            highlightSellerRows(itemId, parseInt(saved));
                        }
                    });
                    observer.observe(document.body, { childList: true, subtree: true });
                    waitForBazaarPrices(itemId, parseInt(saved));
                }
            });
        });
    }

    function highlightItemTilesFromSavedPrices() {
        document.querySelectorAll('.itemTile___cbw7w').forEach(tile => {
            if (tile.dataset.checkedManual === "true") return;
            tile.dataset.checkedManual = "true";
            const img = tile.querySelector('img.torn-item');
            const priceSpan = tile.querySelector('.priceAndTotal___eEVS7 span');
            if (!img || !priceSpan) return;
            const match = img.src.match(/\/items\/(\d+)\//);
            if (!match) return;
            const itemId = match[1];
            const priceText = priceSpan.textContent.trim();
            const priceMatch = priceText.match(/\$([\d,]+)/);
            if (!priceMatch) return;
            const listedPrice = parseInt(priceMatch[1].replace(/,/g, ''));
            const savedPrice = storage.get(`manual_price_${itemId}`);
            tile.classList.remove('manual-highlight-good', 'manual-highlight-warning', 'manual-highlight-bad', 'manual-highlight-missing');
            if (savedPrice) {
                const diffPercent = ((listedPrice - savedPrice) / savedPrice) * 100;
                if (listedPrice <= savedPrice) {
                    tile.classList.add('manual-highlight-good');
                } else if (diffPercent <= 5) {
                    tile.classList.add('manual-highlight-warning');
                } else {
                    tile.classList.add('manual-highlight-bad');
                }
                addPercentIndicator(priceSpan, diffPercent);
            } else {
                tile.classList.add('manual-highlight-missing');
            }
        });
    }

    setInterval(setupBuyButtonListeners, 1000);
    setInterval(highlightItemTilesFromSavedPrices, 1000);
    const pageType = getPageType();
    console.log(`[ManualPrice] Detected page: ${pageType}`);
    alert(`ManualPrice] Detected page: ${pageType}`)

if (pageType === "itemmarket") {
    // Run Item Market-specific logic
} else if (pageType === "bazaar") {
    // Setup Bazaar-specific logic (next step)
}


    window.addEventListener('keydown', (e) => {
        if (e.key === "Escape") modal.style.display = "none";
    });
})();