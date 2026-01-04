// ==UserScript==
// @name         ShopGoodwill Shipping Estimator
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Automatically fetches and displays shipping costs on shopgoodwill.com item pages.
// @author       You
// @match        *://*.shopgoodwill.com/item/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/545620/ShopGoodwill%20Shipping%20Estimator.user.js
// @updateURL https://update.greasyfork.org/scripts/545620/ShopGoodwill%20Shipping%20Estimator.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('[ShopGoodwillShipping] Script loaded on:', location.href);

    // Utility: wait for an element to appear
    function waitForElement(selector, timeout = 10000) {
        return new Promise((resolve, reject) => {
            const interval = 100;
            let elapsed = 0;
            const timer = setInterval(() => {
                const el = document.querySelector(selector);
                if (el) {
                    clearInterval(timer);
                    resolve(el);
                } else if ((elapsed += interval) >= timeout) {
                    clearInterval(timer);
                    reject(new Error('Element not found: ' + selector));
                }
            }, interval);
        });
    }

    async function robustWaitForElement(selector, timeout = 10000) {
        console.log(`[ShopGoodwillShipping] Waiting for element: ${selector}`);
        let element = document.querySelector(selector);
        if (element) {
            console.log(`[ShopGoodwillShipping] Element found immediately: ${selector}`);
            return element;
        }

        return new Promise((resolve, reject) => {
            const observer = new MutationObserver((mutations) => {
                element = document.querySelector(selector);
                if (element) {
                    console.log(`[ShopGoodwillShipping] Element found via observer: ${selector}`);
                    observer.disconnect();
                    resolve(element);
                }
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true,
            });

            setTimeout(() => {
                observer.disconnect();
                console.log(`[ShopGoodwillShipping] Timeout waiting for: ${selector}`);
                reject(new Error(`Element with selector "${selector}" not found within ${timeout}ms`));
            }, timeout);
        });
    }

    // Click the "Estimate Shipping" link if present
    function clickEstimateShippingLink() {
        console.log('[ShopGoodwillShipping] Looking for estimate shipping link...');
        const allLinks = document.querySelectorAll('a');
        console.log(`[ShopGoodwillShipping] Found ${allLinks.length} total links on page`);

        const link = Array.from(document.querySelectorAll('a.text-decoration-underline.d-print-none'))
            .find(a => a.textContent.trim().toLowerCase().includes('estimate shipping'));

        if (link) {
            console.log('[ShopGoodwillShipping] Found and clicking estimate shipping link:', link.textContent);
            link.click();
            return true;
        } else {
            console.log('[ShopGoodwillShipping] Estimate shipping link not found, looking for alternatives...');
            // Try broader search
            const alternativeLink = Array.from(allLinks).find(a =>
                a.textContent.trim().toLowerCase().includes('estimate') ||
                a.textContent.trim().toLowerCase().includes('shipping')
            );
            if (alternativeLink) {
                console.log('[ShopGoodwillShipping] Found alternative link:', alternativeLink.textContent);
            }
            return false;
        }
    }

    // Fill in the zip code and click "Get Estimate"
    function fillZipAndGetEstimate(zip = '77019') {
        console.log('[ShopGoodwillShipping] Filling zip code and getting estimate...');

        // Find the input with placeholder "Zip/Postal Code"
        const allInputs = document.querySelectorAll('input');
        console.log(`[ShopGoodwillShipping] Found ${allInputs.length} input elements`);

        const zipInput = Array.from(document.querySelectorAll('input[placeholder="Zip/Postal Code"]'))
            .find(input => input.type === 'text');

        // Find the "Get Estimate" button
        const allButtons = document.querySelectorAll('button');
        console.log(`[ShopGoodwillShipping] Found ${allButtons.length} button elements`);

        const getEstimateBtn = Array.from(document.querySelectorAll('button.btn.btn-primary[type="submit"]'))
            .find(btn => btn.textContent.trim().toLowerCase().includes('get estimate'));

        if (zipInput) {
            console.log('[ShopGoodwillShipping] Found zip input, filling with:', zip);
            zipInput.value = zip;
            zipInput.dispatchEvent(new Event('input', { bubbles: true }));
            if (getEstimateBtn) {
                console.log('[ShopGoodwillShipping] Found get estimate button, clicking...');
                getEstimateBtn.click();
                return true;
            } else {
                console.log('[ShopGoodwillShipping] Get estimate button not found');
                // Log all button texts for debugging
                Array.from(allButtons).forEach((btn, index) => {
                    console.log(`[ShopGoodwillShipping] Button ${index}:`, btn.textContent.trim());
                });
            }
        } else {
            console.log('[ShopGoodwillShipping] Zip input not found');
            // Log all input placeholders for debugging
            Array.from(allInputs).forEach((input, index) => {
                console.log(`[ShopGoodwillShipping] Input ${index}:`, input.placeholder || 'no placeholder');
            });
        }
        return false;
    }

    // Extract shipping cost from the modal or estimate area
    function getShippingAndHandlingCost() {
        const boldTags = Array.from(document.querySelectorAll('b, strong'));
        const shippingTag = boldTags.find(tag => tag.textContent.includes('Total Shipping and Handling:'));
        if (shippingTag) {
            const match = shippingTag.textContent.match(/\$\d+(\.\d{2})?/);
            const cost = match ? match[0] : null;
            console.log('[ShopGoodwillShipping] Found shipping cost in modal:', cost);
            return cost;
        }
        console.log('[ShopGoodwillShipping] No shipping cost found in modal');
        return null;
    }

    function getPrecalculatedShipping() {
        console.log('[ShopGoodwillShipping] Checking for pre-calculated shipping...');

        // Debug: log page content to see what's available
        const pageText = document.body.textContent.toLowerCase();
        console.log('[ShopGoodwillShipping] Page contains "shipping":', pageText.includes('shipping'));
        console.log('[ShopGoodwillShipping] Page contains "pickup":', pageText.includes('pickup'));

        // New "catch-all" strategy for pickup only by looking for a container with both keywords.
        const rows = document.querySelectorAll('tr, .p-datatable-row, .row');
        console.log(`[ShopGoodwillShipping] Checking ${rows.length} potential rows for shipping info`);

        for (const row of rows) {
            const text = row.textContent.toLowerCase();
            if (text.includes('shipping') && text.includes('pickup only')) {
                // Heuristic to ensure we're looking at a small container, not the whole page body.
                if (text.length < 150) {
                    console.log('[ShopGoodwillShipping] Found pickup only in row:', text.trim());
                    return 'Pickup Only';
                }
            }
        }

        // Original strategy for extracting prices, with improved case-insensitivity.
        const selectors = ['th', 'p', 'span', 'b', 'strong'];
        for (const selector of selectors) {
            const labels = Array.from(document.querySelectorAll(selector));
            console.log(`[ShopGoodwillShipping] Checking ${labels.length} ${selector} elements`);

            const shippingLabel = labels.find(el => {
                const text = el.textContent.trim().toLowerCase();
                return text === 'shipping price:' || text === 'shipping:';
            });

            if (shippingLabel) {
                console.log('[ShopGoodwillShipping] Found shipping label:', shippingLabel.textContent);

                // Strategy 1: The value is in the next element sibling
                if (shippingLabel.nextElementSibling) {
                    const siblingText = shippingLabel.nextElementSibling.textContent.trim();
                    console.log('[ShopGoodwillShipping] Sibling text:', siblingText);
                    if (siblingText.toLowerCase().includes('pickup only')) {
                        console.log('[ShopGoodwillShipping] Found pickup only in sibling');
                        return 'Pickup Only';
                    }
                    const match = siblingText.match(/\$\d+(\.\d{2})?/);
                    if (match) {
                        console.log('[ShopGoodwillShipping] Found shipping cost in sibling:', match[0]);
                        return match[0];
                    }
                }

                // Strategy 2: The value is in the parent element (e.g., <p><b>Shipping:</b> $10</p>)
                const parent = shippingLabel.parentElement;
                if (parent) {
                    // To avoid matching a price inside the label itself, we'll remove the label's text from the parent's text.
                    const parentText = parent.textContent.replace(shippingLabel.textContent, '').trim();
                    console.log('[ShopGoodwillShipping] Parent text (without label):', parentText);
                    if (parentText.toLowerCase().includes('pickup only')) {
                        console.log('[ShopGoodwillShipping] Found pickup only in parent');
                        return 'Pickup Only';
                    }
                    const match = parentText.match(/\$\d+(\.\d{2})?/);
                    if (match) {
                        console.log('[ShopGoodwillShipping] Found shipping cost in parent:', match[0]);
                        return match[0];
                    }
                }
            }
        }
        console.log('[ShopGoodwillShipping] No pre-calculated shipping found');
        return null;
    }

    function getPriceInfo() {
        console.log('[ShopGoodwillShipping] Getting price info...');

        // Method 1: Check for "Buy It Now" structure (newer format)
        const strongElements = Array.from(document.querySelectorAll('strong'));
        const buyItNowPriceLabel = strongElements.find(strong => {
            const text = strong.textContent.trim();
            return text === 'Price:' || text === 'Price';
        });

        if (buyItNowPriceLabel) {
            console.log('[ShopGoodwillShipping] Found Buy It Now price label:', buyItNowPriceLabel.textContent);
            const parentP = buyItNowPriceLabel.closest('p');
            if (parentP) {
                const priceSpan = parentP.querySelector('span');
                if (priceSpan) {
                    const match = priceSpan.textContent.match(/\$\d+(\.\d{2})?/);
                    if (match) {
                        console.log('[ShopGoodwillShipping] Found Buy It Now price:', match[0]);
                        // Find the container div for insertion point
                        const priceContainer = parentP.closest('.d-flex.align-items-center.justify-content-between');
                        return { price: match[0], rowElement: priceContainer, isBuyItNow: true };
                    }
                }
            }
        }

        // Method 2: Check for auction structure - look for "Current Price:" text directly
        const allElements = Array.from(document.querySelectorAll('*'));
        let priceElement = null;
        let priceValue = null;

        // Look for "Current Price:" text
        for (const element of allElements) {
            const text = element.textContent.trim();
            if (text === 'Current Price:' && element.children.length === 0) { // Leaf element only
                console.log('[ShopGoodwillShipping] Found "Current Price:" element:', element.tagName);
                priceElement = element;
                break;
            }
        }

        if (priceElement) {
            // Look for the price value nearby
            const container = priceElement.closest('div, section, .container, .row') || priceElement.parentElement;
            console.log('[ShopGoodwillShipping] Looking for price in container:', container?.className);

            if (container) {
                // Search for price pattern in the container
                const priceText = container.textContent;
                const priceMatch = priceText.match(/\$\d+(\.\d{2})?/);
                if (priceMatch) {
                    priceValue = priceMatch[0];
                    console.log('[ShopGoodwillShipping] Found auction price:', priceValue);
                    console.log('[ShopGoodwillShipping] Using container as insertion point:', container.outerHTML.substring(0, 200) + '...');
                    return { price: priceValue, rowElement: container, isBuyItNow: false };
                }
            }
        }

        // Fallback: Method 3 - Look for h3 elements (original method)
        const h3s = Array.from(document.querySelectorAll('h3'));
        console.log(`[ShopGoodwillShipping] Fallback: Found ${h3s.length} h3 elements:`);
        h3s.forEach((h3, index) => {
            console.log(`[ShopGoodwillShipping] H3 ${index}:`, h3.textContent.trim());
        });

        const priceLabel = h3s.find(h3 => {
            const text = h3.textContent.trim();
            return text === 'Current Price:' || text === 'Buy It Now Price:';
        });

        if (priceLabel) {
            console.log('[ShopGoodwillShipping] Found auction price label via h3:', priceLabel.textContent);
            const priceRow = priceLabel.closest('.row');
            if (priceRow) {
                console.log('[ShopGoodwillShipping] Found price row via h3');
                const priceEl = priceRow.querySelector('.col-4.text-right h3');
                if (priceEl) {
                    console.log('[ShopGoodwillShipping] Found price element via h3:', priceEl.textContent);
                    const match = priceEl.textContent.match(/\$\d+(\.\d{2})?/);
                    if (match) {
                        console.log('[ShopGoodwillShipping] Found auction price via h3:', match[0]);
                        return { price: match[0], rowElement: priceRow, isBuyItNow: false };
                    }
                } else {
                    console.log('[ShopGoodwillShipping] Price element not found in expected location via h3');
                }
            } else {
                console.log('[ShopGoodwillShipping] Price row not found via h3');
            }
        } else {
            console.log('[ShopGoodwillShipping] No auction price label found via h3');
        }

        console.log('[ShopGoodwillShipping] No price info found in any format');
        return null;
    }

    function displayPickupOnlyMessage(priceRow, isBuyItNow = false) {
        console.log('[ShopGoodwillShipping] Displaying pickup only message for', isBuyItNow ? 'Buy It Now' : 'auction');
        if (document.getElementById('tamper-shipping-cost-row')) {
            console.log('[ShopGoodwillShipping] Already added pickup message');
            return; // Already added
        }
        if (!priceRow) return;

        let shippingRow;

        if (isBuyItNow) {
            // Create Buy It Now style row
            shippingRow = document.createElement('div');
            shippingRow.className = 'd-flex align-items-center justify-content-between mb-3';
            shippingRow.innerHTML = `
                <p class="lead mb-0">
                    <strong class="d-block">Shipping:</strong>
                    <span style="color: red; font-weight: bold;">Pickup Only</span>
                </p>
            `;
        } else {
            // Create auction style row
            shippingRow = document.createElement('div');
            shippingRow.className = 'row mb-2';
            shippingRow.innerHTML = `
                <div class="col-8"><h3 class="text-darkgrey" style="font-size: 1rem; font-weight: normal;">Shipping:</h3></div>
                <div class="col-4 text-right"><h3 style="font-size: 1rem; color: red; font-weight: bold;">Pickup Only</h3></div>
            `;
        }

        shippingRow.id = 'tamper-shipping-cost-row';
        priceRow.after(shippingRow);
        console.log('[ShopGoodwillShipping] Added pickup only message to page');
    }

    // Insert shipping cost near the current price
    function displayPriceSummary(shippingCostStr, currentPriceStr, priceRow, shippingLabel = 'Shipping & Handling:', isBuyItNow = false) {
        console.log('[ShopGoodwillShipping] Displaying price summary for', isBuyItNow ? 'Buy It Now' : 'auction', ':', shippingCostStr, currentPriceStr);
        console.log('[ShopGoodwillShipping] Insertion target element:', priceRow?.tagName, priceRow?.className);

        if (document.getElementById('tamper-shipping-cost-row')) {
            console.log('[ShopGoodwillShipping] Already added price summary');
            return; // Already added
        }

        if (!priceRow) {
            console.log('[ShopGoodwillShipping] No price row provided for insertion');
            return;
        }

        const shippingCost = parseFloat(shippingCostStr.replace('$', ''));
        const currentPrice = parseFloat(currentPriceStr.replace('$', ''));
        const total = currentPrice + shippingCost;

        let shippingRow, totalRow;

        if (isBuyItNow) {
            // Create Buy It Now style rows
            shippingRow = document.createElement('div');
            shippingRow.className = 'd-flex align-items-center justify-content-between mb-3';
            shippingRow.innerHTML = `
                <p class="lead mb-0">
                    <strong class="d-block">${shippingLabel}</strong>
                    <span>$${shippingCost.toFixed(2)}</span>
                </p>
            `;

            totalRow = document.createElement('div');
            totalRow.className = 'd-flex align-items-center justify-content-between mb-3';
            totalRow.innerHTML = `
                <p class="lead mb-0">
                    <strong class="d-block">Total with Shipping:</strong>
                    <span style="font-weight: bold;">$${total.toFixed(2)}</span>
                </p>
            `;
        } else {
            // Create simple, visible auction-style elements
            shippingRow = document.createElement('div');
            shippingRow.style.cssText = `
                background: #f0f8ff;
                border: 1px solid #007bff;
                padding: 10px;
                margin: 10px 0;
                border-radius: 5px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                font-size: 16px;
            `;
            shippingRow.innerHTML = `
                <span><strong>${shippingLabel}</strong></span>
                <span style="font-weight: bold; color: #007bff;">$${shippingCost.toFixed(2)}</span>
            `;

            totalRow = document.createElement('div');
            totalRow.style.cssText = `
                background: #d4edda;
                border: 2px solid #28a745;
                padding: 12px;
                margin: 10px 0;
                border-radius: 5px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                font-size: 18px;
                font-weight: bold;
            `;
            totalRow.innerHTML = `
                <span><strong>Total with Shipping:</strong></span>
                <span style="color: #28a745; font-size: 20px;">$${total.toFixed(2)}</span>
            `;
        }

        shippingRow.id = 'tamper-shipping-cost-row';
        totalRow.id = 'tamper-total-cost-row';

        // Try multiple insertion strategies
        try {
            console.log('[ShopGoodwillShipping] Attempting to insert elements after price row...');
            priceRow.after(totalRow);
            priceRow.after(shippingRow);
            console.log('[ShopGoodwillShipping] Successfully inserted via after()');
        } catch (error) {
            console.log('[ShopGoodwillShipping] after() failed, trying appendChild...');
            try {
                const parent = priceRow.parentElement;
                if (parent) {
                    parent.appendChild(shippingRow);
                    parent.appendChild(totalRow);
                    console.log('[ShopGoodwillShipping] Successfully inserted via appendChild()');
                }
            } catch (error2) {
                console.log('[ShopGoodwillShipping] appendChild() also failed:', error2);
            }
        }

        // Verify insertion
        setTimeout(() => {
            const addedShipping = document.getElementById('tamper-shipping-cost-row');
            const addedTotal = document.getElementById('tamper-total-cost-row');
            console.log('[ShopGoodwillShipping] Verification - Shipping element in DOM:', !!addedShipping);
            console.log('[ShopGoodwillShipping] Verification - Total element in DOM:', !!addedTotal);
            if (addedShipping) {
                console.log('[ShopGoodwillShipping] Shipping element visibility:', getComputedStyle(addedShipping).display !== 'none');
            }
            if (addedTotal) {
                console.log('[ShopGoodwillShipping] Total element visibility:', getComputedStyle(addedTotal).display !== 'none');
            }
        }, 100);

        console.log('[ShopGoodwillShipping] Added price summary to page');
    }

    function clickItemInfoTab() {
        console.log('[ShopGoodwillShipping] Looking for Item Info tab...');
        const tabs = Array.from(document.querySelectorAll('a.p-tabview-nav-link'));
        console.log(`[ShopGoodwillShipping] Found ${tabs.length} tabs`);

        const itemInfoTab = tabs.find(tab => tab.textContent.trim() === 'Item Info');
        if (itemInfoTab) {
            console.log('[ShopGoodwillShipping] Found and clicking Item Info tab');
            itemInfoTab.click();
        } else {
            console.log('[ShopGoodwillShipping] Item Info tab not found');
        }
    }

    function handlePickupOnly() {
        console.log('[ShopGoodwillShipping] Handling pickup only item');
        const bidInput = document.getElementById('currentBid');
        if (bidInput) {
            console.log('[ShopGoodwillShipping] Found bid input, replacing with pickup only message');
            const bidRow = bidInput.closest('.row');
            if (bidRow) {
                const pickupOnlyDiv = document.createElement('div');
                pickupOnlyDiv.className = 'row mb-3';
                pickupOnlyDiv.innerHTML = `<div class="col-12 text-center"><h3 style="color: red; font-weight: bold;">PICKUP ONLY</h3></div>`;
                bidRow.replaceWith(pickupOnlyDiv);
            }
        } else {
            console.log('[ShopGoodwillShipping] Bid input not found');
        }
    }

    function makeTitleSearchable() {
        console.log('[ShopGoodwillShipping] Making title searchable...');
        const titleElement = document.querySelector('h1[id]');
        if (titleElement && !titleElement.querySelector('a')) {
            console.log('[ShopGoodwillShipping] Found title element:', titleElement.textContent.trim());
            const titleText = titleElement.textContent.trim();
            const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(titleText)}`;

            const link = document.createElement('a');
            link.href = searchUrl;
            link.target = '_blank';
            link.rel = 'noopener noreferrer';
            link.textContent = titleText;
            link.style.color = 'inherit'; // Keep original color
            link.style.textDecoration = 'none'; // No underline by default

            // Add underline on hover to indicate it's clickable
            link.addEventListener('mouseover', () => {
                link.style.textDecoration = 'underline';
            });
            link.addEventListener('mouseout', () => {
                link.style.textDecoration = 'none';
            });

            titleElement.innerHTML = ''; // Clear the old text
            titleElement.appendChild(link); // Add the new link
            console.log('[ShopGoodwillShipping] Made title searchable');
        } else {
            console.log('[ShopGoodwillShipping] Title element not found or already has link');
        }
    }

    function getFullResImageUrls() {
        // Prefer thumbnails, fallback to gallery images
        const thumbnailImages = document.querySelectorAll('.ngx-gallery-thumbnail');
        const galleryImages = document.querySelectorAll('.ngx-gallery-image');
        const imagesToProcess = thumbnailImages.length > 0 ? thumbnailImages : galleryImages;
        const imageType = thumbnailImages.length > 0 ? 'thumbnails' : 'gallery images';
        const imageUrls = [];
        imagesToProcess.forEach((img) => {
            const style = img.getAttribute('style');
            if (style) {
                const urlMatch = style.match(/background-image:\s*url\(["']?([^"')]+)["']?\)/);
                if (urlMatch && urlMatch[1]) {
                    let imageUrl = urlMatch[1];
                    if (imageType === 'thumbnails') {
                        imageUrl = imageUrl
                            .replace(/t(\d+)\.jpeg?$/i, '$1.jpg')
                            .replace(/t(\d+)\.jpg$/i, '$1.jpg')
                            .replace(/t(\d+)\.png$/i, '$1.png')
                            .replace(/_thumb/i, '')
                            .replace(/thumbnail/i, '');
                    }
                    imageUrls.push(imageUrl);
                }
            }
        });
        return imageUrls;
    }

    function convertAuctionEndTime() {
        console.log('[ShopGoodwillShipping] Converting auction end time...');
        try {
            const thElements = Array.from(document.querySelectorAll('th'));
            console.log(`[ShopGoodwillShipping] Found ${thElements.length} th elements`);

            const endsOnTh = thElements.find(th => th.textContent.trim() === 'Ends On:');

            if (endsOnTh && endsOnTh.nextElementSibling) {
                console.log('[ShopGoodwillShipping] Found "Ends On" element');
                const td = endsOnTh.nextElementSibling;
                const originalText = td.textContent.trim();
                console.log('[ShopGoodwillShipping] Original end time text:', originalText);
                const match = originalText.match(/(\d{2}\/\d{2}\/\d{4})\s(\d{2}:\d{2}:\d{2}\s[AP]M)\s(PT|PST|PDT)/i);

                if (match) {
                    console.log('[ShopGoodwillShipping] Successfully parsed end time');
                    const datePart = match[1];
                    const timePart = match[2];

                    // Manually parse the date and time to avoid timezone issues with `new Date()`
                    const [month, day, year] = datePart.split('/');
                    const [time, ampm] = timePart.split(' ');
                    let [hours, minutes, seconds] = time.split(':').map(Number);

                    if (ampm.toLowerCase() === 'pm' && hours < 12) {
                        hours += 12;
                    }
                    if (ampm.toLowerCase() === 'am' && hours === 12) { // Midnight case: 12 AM is 00 hours
                        hours = 0;
                    }

                    // Create a date object that we can use to find the correct offset.
                    const tempDate = new Date(`${year}-${month}-${day}T${String(hours).padStart(2,'0')}:${String(minutes).padStart(2,'0')}:${String(seconds).padStart(2,'0')}`);

                    // Get the offset string for Pacific Time
                    const pacificTimeFormatter = new Intl.DateTimeFormat('en-US', {
                        timeZone: 'America/Los_Angeles',
                        timeZoneName: 'longOffset',
                    });
                    const formattedParts = pacificTimeFormatter.formatToParts(tempDate);
                    const offsetString = formattedParts.find(p => p.type === 'timeZoneName')?.value.replace('GMT', '');

                    if (!offsetString) {
                        console.error("[ShopGoodwillShipping] Could not determine Pacific Time offset.");
                        return;
                    }

                    // Construct a full ISO 8601 string with the correct timezone offset.
                    const isoString = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}T${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}${offsetString}`;
                    const correctDate = new Date(isoString);

                    // Format in Central Time
                    const centralTimeFormatter = new Intl.DateTimeFormat('en-US', {
                        timeZone: 'America/Chicago',
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                        hour12: true,
                    });

                    const centralTimeString = centralTimeFormatter.format(correctDate);
                    const displayedTime = `${centralTimeString.replace(',', '')} CT`;

                    // Create Google Calendar Link
                    const titleElement = document.querySelector('h1[id]');
                    const itemTitle = titleElement ? titleElement.textContent.trim() : 'Goodwill Auction Reminder';

                    const reminderStartDate = new Date(correctDate.getTime() - 5 * 60 * 1000);

                    const toGoogleISO = (date) => date.toISOString().replace(/-|:|\.\d{3}/g, '');
                    const datesParam = `${toGoogleISO(reminderStartDate)}/${toGoogleISO(correctDate)}`;
                    const pageUrl = location.href;

                    // Add image links to the description
                    const imageUrls = getFullResImageUrls();
                    let imagesText = '';
                    if (imageUrls.length > 0) {
                        imagesText = '\n\nITEM IMAGES:\n' + imageUrls.map((url, index) => `${index + 1}. ${url}`).join('\n');
                    }

                    const description = `Auction ends at this time.\n\nAuction URL: ${pageUrl}${imagesText}`;

                    const googleCalendarUrl = new URL('https://www.google.com/calendar/render');
                    googleCalendarUrl.searchParams.set('action', 'TEMPLATE');
                    googleCalendarUrl.searchParams.set('text', itemTitle);
                    googleCalendarUrl.searchParams.set('dates', datesParam);
                    googleCalendarUrl.searchParams.set('details', description);

                    // Make the TD clickable
                    td.innerHTML = '';
                    const link = document.createElement('a');
                    link.href = googleCalendarUrl.href;
                    link.target = '_blank';
                    link.rel = 'noopener noreferrer';
                    link.textContent = displayedTime;
                    link.style.cursor = 'pointer';
                    link.style.textDecoration = 'underline';
                    link.style.color = 'inherit';
                    link.title = 'Click to create a Google Calendar reminder (starts 5 mins before end, with image links)';

                    td.appendChild(link);
                    console.log('[ShopGoodwillShipping] Successfully converted auction end time');
                } else {
                    console.log('[ShopGoodwillShipping] Could not parse end time format');
                }
            } else {
                console.log('[ShopGoodwillShipping] "Ends On" element not found');
            }
        } catch (error) {
            console.error('[ShopGoodwillShipping] Could not convert auction end time.', error);
        }
    }

    function replaceStoreDetailWithImages() {
        console.log('[ShopGoodwillShipping] Replacing store detail section with full-resolution images...');
        try {
            // Find the store detail section
            const storeDetailSection = document.querySelector('.store-detail');
            if (!storeDetailSection) {
                console.log('[ShopGoodwillShipping] Store detail section not found');
                return;
            }

            // Find all thumbnail images first (more comprehensive)
            const thumbnailImages = document.querySelectorAll('.ngx-gallery-thumbnail');
            console.log(`[ShopGoodwillShipping] Found ${thumbnailImages.length} thumbnail images`);

            // If no thumbnails found, fall back to main gallery images
            const galleryImages = document.querySelectorAll('.ngx-gallery-image');
            console.log(`[ShopGoodwillShipping] Found ${galleryImages.length} main gallery images`);

            const imagesToProcess = thumbnailImages.length > 0 ? thumbnailImages : galleryImages;
            const imageType = thumbnailImages.length > 0 ? 'thumbnails' : 'gallery images';

            if (imagesToProcess.length === 0) {
                console.log('[ShopGoodwillShipping] No images found in either thumbnails or gallery');
                return;
            }

            console.log(`[ShopGoodwillShipping] Processing ${imagesToProcess.length} ${imageType}`);

            // Extract image URLs from background-image styles
            const imageUrls = [];
            imagesToProcess.forEach((img, index) => {
                const style = img.getAttribute('style');
                if (style) {
                    const urlMatch = style.match(/background-image:\s*url\(["']?([^"')]+)["']?\)/);
                    if (urlMatch && urlMatch[1]) {
                        let imageUrl = urlMatch[1];

                        // Convert thumbnail URLs to full-resolution URLs
                        if (imageType === 'thumbnails') {
                            // Replace 't1.jpeg', 't2.jpeg', etc. with '1.jpg', '2.jpg', etc.
                            // Also handle other thumbnail patterns
                            imageUrl = imageUrl
                                .replace(/t(\d+)\.jpeg?$/i, '$1.jpg')  // t1.jpeg -> 1.jpg
                                .replace(/t(\d+)\.jpg$/i, '$1.jpg')    // t1.jpg -> 1.jpg
                                .replace(/t(\d+)\.png$/i, '$1.png')    // t1.png -> 1.png
                                .replace(/_thumb/i, '')               // Remove _thumb
                                .replace(/thumbnail/i, '');          // Remove thumbnail
                        }

                        imageUrls.push(imageUrl);
                        console.log(`[ShopGoodwillShipping] Found image ${index + 1}:`, imageUrl);
                    }
                }
            });

            if (imageUrls.length === 0) {
                console.log('[ShopGoodwillShipping] No image URLs extracted');
                return;
            }

            // Create new content with full-resolution images
            const newContent = document.createElement('div');
            newContent.className = 'mt-4 full-resolution-images';
            newContent.style.cssText = `
                padding: 20px;
                background: #f8f9fa;
                border-radius: 8px;
                margin: 20px 0;
            `;

            // Add a title
            const title = document.createElement('h3');
            title.textContent = 'Full Resolution Images';
            title.style.cssText = `
                margin-bottom: 20px;
                color: #333;
                font-size: 1.5rem;
                border-bottom: 2px solid #007bff;
                padding-bottom: 10px;
            `;
            newContent.appendChild(title);

            // Create a container for full-resolution images
            const imageContainer = document.createElement('div');
            imageContainer.style.cssText = `
                display: flex;
                flex-direction: column;
                gap: 30px;
                margin-top: 20px;
            `;

            // Add each image at full resolution
            imageUrls.forEach((url, index) => {
                const imageWrapper = document.createElement('div');
                imageWrapper.style.cssText = `
                    border: 1px solid #dee2e6;
                    border-radius: 8px;
                    overflow: hidden;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                    background: white;
                    padding: 10px;
                `;

                // Add image title
                const imageTitle = document.createElement('h4');
                imageTitle.textContent = `Image ${index + 1}`;
                imageTitle.style.cssText = `
                    margin: 0 0 15px 0;
                    color: #333;
                    font-size: 1.2rem;
                    text-align: center;
                    padding: 10px;
                    background: #f8f9fa;
                    border-radius: 4px;
                `;

                const img = document.createElement('img');
                img.src = url;
                img.alt = `Item image ${index + 1}`;
                img.style.cssText = `
                    width: 100%;
                    height: auto;
                    display: block;
                    cursor: pointer;
                    max-width: none;
                    border-radius: 4px;
                `;

                // Add click handler to open image in new tab
                img.addEventListener('click', () => {
                    window.open(url, '_blank');
                });

                // Add hover effect for the image
                img.addEventListener('mouseenter', () => {
                    img.style.opacity = '0.9';
                    img.style.transform = 'scale(1.01)';
                    img.style.transition = 'all 0.2s ease';
                });
                img.addEventListener('mouseleave', () => {
                    img.style.opacity = '1';
                    img.style.transform = 'scale(1)';
                });

                imageWrapper.appendChild(imageTitle);
                imageWrapper.appendChild(img);
                imageContainer.appendChild(imageWrapper);
            });

            newContent.appendChild(imageContainer);

            // Add a note about clicking images
            const note = document.createElement('p');
            note.textContent = 'Click any image to open it at full resolution in a new tab';
            note.style.cssText = `
                margin-top: 15px;
                text-align: center;
                color: #6c757d;
                font-style: italic;
            `;
            newContent.appendChild(note);

            // Replace the store detail section
            storeDetailSection.replaceWith(newContent);
            console.log('[ShopGoodwillShipping] Successfully replaced store detail section with full-resolution images');

        } catch (error) {
            console.error('[ShopGoodwillShipping] Error replacing store detail with images:', error);
        }
    }

    // Main logic
    async function main() {
        console.log('[ShopGoodwillShipping] Starting main function');
        try {
            makeTitleSearchable();
            convertAuctionEndTime();
            replaceStoreDetailWithImages();

            // Path 1: Check for pre-calculated shipping first.
            const precalculatedShipping = getPrecalculatedShipping();
            if (precalculatedShipping) {
                console.log('[ShopGoodwillShipping] Found precalculated shipping:', precalculatedShipping);
                if (precalculatedShipping === 'Pickup Only') {
                    handlePickupOnly();
                    const priceInfo = getPriceInfo();
                    if (priceInfo) {
                        displayPickupOnlyMessage(priceInfo.rowElement, priceInfo.isBuyItNow);
                    }
                    return; // Job is done for pickup-only items.
                }

                const priceInfo = getPriceInfo();
                if (priceInfo) {
                    displayPriceSummary(precalculatedShipping, priceInfo.price, priceInfo.rowElement, 'Shipping:', priceInfo.isBuyItNow);
                }
                return; // Job is done, no need to estimate.
            }

            // Path 2: If not found, proceed with the estimation flow.
            console.log('[ShopGoodwillShipping] No precalculated shipping found, trying estimation...');
            const shippingLinkSelector = 'a.text-decoration-underline.d-print-none';
            await robustWaitForElement(shippingLinkSelector, 5000);

            if (!clickEstimateShippingLink()) {
                console.log('[ShopGoodwillShipping] Could not find or click estimate shipping link');
                return;
            }

            // Step 2: Wait for zip input and fill zip, then click "Get Estimate"
            const zipInputSelector = 'input[placeholder="Zip/Postal Code"]';
            await robustWaitForElement(zipInputSelector, 5000);

            if (!fillZipAndGetEstimate('77019')) {
                console.log('[ShopGoodwillShipping] Could not fill zip code or click estimate button');
                return;
            }

            // Step 3: Wait for shipping cost to appear
            await new Promise(resolve => setTimeout(resolve, 2000)); // Wait for calculation

            let shippingCost = null;
            for (let i = 0; i < 10; i++) {
                shippingCost = getShippingAndHandlingCost();
                if (shippingCost) {
                    break;
                }
                await new Promise(resolve => setTimeout(resolve, 500));
            }

            if (shippingCost) {
                console.log('[ShopGoodwillShipping] Found shipping cost:', shippingCost);
                const priceInfo = getPriceInfo();
                if (priceInfo) {
                    displayPriceSummary(shippingCost, priceInfo.price, priceInfo.rowElement, 'Shipping & Handling:', priceInfo.isBuyItNow);
                    clickItemInfoTab();
                }
            } else {
                console.log('[ShopGoodwillShipping] No shipping cost found after estimation');
            }

        } catch (error) {
            console.error('[ShopGoodwillShipping] Error in main function:', error);
        }
    }

    // --- Robust SPA/DOM Trigger System ---
    let lastRunUrl = '';
    let debounceTimer = null;

    function isItemPageReady() {
        // Check for key elements that indicate the item page is ready
        return (
            document.querySelector('h1[id]') ||
            document.querySelector('.store-detail') ||
            document.querySelector('.ngx-gallery-thumbnail') ||
            document.querySelector('.ngx-gallery-image')
        );
    }

    function runMainLogicDebounced() {
        if (debounceTimer) clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            if (location.href.includes('/item/') && isItemPageReady()) {
                if (lastRunUrl !== location.href) {
                    lastRunUrl = location.href;
                    main(); // Your main logic function
                }
            }
        }, 300); // 300ms debounce
    }

    // Observe DOM changes for new content
    const domObserver = new MutationObserver(() => {
        runMainLogicDebounced();
    });
    domObserver.observe(document.body, { childList: true, subtree: true });

    // Also run on URL change (SPA navigation)
    let currentUrl = location.href;
    setInterval(() => {
        if (location.href !== currentUrl) {
            currentUrl = location.href;
            runMainLogicDebounced();
        }
    }, 200);

    // Initial run in case everything is already loaded
    runMainLogicDebounced();
})();