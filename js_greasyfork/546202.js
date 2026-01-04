// ==UserScript==
// @name         HaulFans++
// @namespace    http://tampermonkey.net/
// @version      1
// @description  malada scriptas
// @match        *://haulfans.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/546202/HaulFans%2B%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/546202/HaulFans%2B%2B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let itemData = {};
    let isScrolling = false;

    let processedItems = new Set();

    function monitorPriceChanges() {
        setInterval(() => {
            document.querySelectorAll('.product-price .discount-price').forEach(el => {
                let priceText = el.innerText.match(/\d+/);
                if (priceText && !el.dataset.converted) {
                    let points = parseInt(priceText[0], 10);
                    let euros = (points / 3500).toFixed(2);
                    el.innerHTML = `${euros} <span>Euros</span>`;
                    el.dataset.euroValue = euros;
                    el.dataset.converted = "true";
                }
            });
        }, 1000);
    }

    function sortByEuros() {
        let container = document.querySelector('.product-container .n-grid');
        if (!container) return;

        let items = Array.from(container.children);
        items.sort((a, b) => {
            let priceA = parseFloat(a.querySelector('.discount-price')?.dataset.euroValue || "999999");
            let priceB = parseFloat(b.querySelector('.discount-price')?.dataset.euroValue || "999999");
            return priceA - priceB;
        });

        items.forEach(item => container.appendChild(item));
    }

    function processHarFile(file) {
        let reader = new FileReader();
        reader.onload = function(event) {
            let harData;
            try {
                harData = JSON.parse(event.target.result);
            } catch (e) {
                alert("Invalid HAR file.");
                return;
            }

            let entries = harData.log.entries;
            entries.forEach(entry => {
                if (entry.request.url.includes("haulfans.com/buffet/open/redeem/mall/list-items")) {
                    let responseData;
                    try {
                        responseData = JSON.parse(entry.response.content.text);
                    } catch (e) {
                        return;
                    }

                    if (responseData && responseData.data && responseData.data.list) {
                        responseData.data.list.forEach(item => {
                            if (item.firstImage && item.id) {
                                itemData[item.firstImage.split('?')[0]] = item.id;
                            }
                        });
                    }
                }
            });

            if (Object.keys(itemData).length === 0) {
                alert("No matching items found in HAR file.");
            }
        };
        reader.readAsText(file);
    }

    function addNewTabLinks() {
        document.querySelectorAll('.n-card').forEach(card => {
            if (card.querySelector('.open-new-tab-btn')) {
                return;
            }

            let img = card.querySelector('.n-card-cover img');

            if (img && img.src) {
                let imageUrl = img.src.split('?')[0];
                let itemId = itemData[imageUrl];

                if (itemId && !processedItems.has(itemId)) {
                    let productUrl = `https://haulfans.com/detail?id=${itemId}`;

                    let linkBtn = document.createElement('a');
                    linkBtn.innerText = "Open in New Tab";
                    linkBtn.href = productUrl;
                    linkBtn.target = "_blank";
                    linkBtn.classList.add('open-new-tab-btn');
                    linkBtn.style.display = 'block';
                    linkBtn.style.marginTop = '10px';
                    linkBtn.style.padding = '8px';
                    linkBtn.style.textAlign = 'center';
                    linkBtn.style.background = '#28a745';
                    linkBtn.style.color = 'white';
                    linkBtn.style.border = 'none';
                    linkBtn.style.borderRadius = '3px';
                    linkBtn.style.textDecoration = 'none';

                    card.parentNode.insertBefore(linkBtn, card.nextSibling);

                    processedItems.add(itemId);
                }
            }
        });
    }

    function startScroll() {
        function scrollDown() {
            if (!isScrolling) return;
            window.scrollTo(0, document.body.scrollHeight);
            setTimeout(checkForLoadingSpinner, 0);
        }
        scrollDown();
    }

    function checkForLoadingSpinner() {
        let spinner = document.querySelector('.n-spin-content');
        if (spinner && spinner.classList.contains('n-spin-content--spinning')) {
            setTimeout(checkForLoadingSpinner, 0);
        } else {
            setTimeout(startScroll, 3000);
        }
    }

    function toggleScroll() {
        isScrolling = !isScrolling;
        if (isScrolling) {
            startScroll();
        }
    }

    function createUI() {
        let container = document.createElement('div');
        container.style.position = 'fixed';
        container.style.top = '10px';
        container.style.right = '10px';
        container.style.background = 'rgba(0,0,0,0.8)';
        container.style.color = 'white';
        container.style.padding = '10px';
        container.style.borderRadius = '5px';
        container.style.zIndex = '9999';

        function createButton(id, text, callback) {
            let btn = document.createElement('button');
            btn.id = id;
            btn.innerText = text;
            btn.style.display = 'block';
            btn.style.margin = '5px';
            btn.style.padding = '8px';
            btn.style.cursor = 'pointer';
            btn.style.background = '#fc7777';
            btn.style.color = 'white';
            btn.style.border = 'none';
            btn.style.borderRadius = '3px';
            btn.onclick = callback;
            return btn;
        }

        let fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = '.har';
        fileInput.style.display = 'block';
        fileInput.style.margin = '5px';
        fileInput.style.padding = '8px';
        fileInput.style.background = '#007bff';
        fileInput.style.color = 'white';
        fileInput.style.border = 'none';
        fileInput.style.borderRadius = '3px';
        fileInput.onchange = function(event) {
            if (event.target.files.length > 0) {
                processHarFile(event.target.files[0]);
            }
        };

        let sortButton = createButton("sort-btn", "Sort by Price (Low to High)", sortByEuros);
        let addLinksButton = createButton("add-links-btn", "Add 'Open in New Tab' Links", addNewTabLinks);
        let scrollButton = createButton("scroll-btn", "Toggle Auto-Scroll", toggleScroll);

        container.appendChild(fileInput);
        container.appendChild(sortButton);
        container.appendChild(addLinksButton);
        container.appendChild(scrollButton);

        document.body.appendChild(container);
    }

    monitorPriceChanges();
    createUI();
    addNewTabLinks();

})();
