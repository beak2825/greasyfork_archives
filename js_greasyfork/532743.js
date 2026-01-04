// ==UserScript==
// @name         IMVU Product Minimal Revision Viewer
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Adds a CFL revision dropdown next to the creator's name on IMVU product pages, styled with better spacing and size.
// @author       heapsofjoy
// @match        *://*.imvu.com/shop/product.php?products_id=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/532743/IMVU%20Product%20Minimal%20Revision%20Viewer.user.js
// @updateURL https://update.greasyfork.org/scripts/532743/IMVU%20Product%20Minimal%20Revision%20Viewer.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('products_id');
    if (!productId) return;

    const baseUrl = `https://userimages-akm.imvu.com/productdata/${productId}`;
    const authorElement = document.querySelector('h2 a[href*="manufacturers_id"]');
    if (!authorElement) return;

    const wrapper = document.createElement('div');
    wrapper.style.display = 'flex';
    wrapper.style.flexDirection = 'column';
    wrapper.style.marginTop = '6px';

    const toggleButton = document.createElement('button');
    toggleButton.textContent = 'contents.json';
    toggleButton.style.background = '#eee';
    toggleButton.style.border = '1px solid #ccc';
    toggleButton.style.borderRadius = '3px';
    toggleButton.style.padding = '4px 8px';
    toggleButton.style.fontSize = '12px';
    toggleButton.style.cursor = 'pointer';
    toggleButton.style.alignSelf = 'flex-start';

    const dropdown = document.createElement('div');
    dropdown.style.display = 'none';
    dropdown.style.position = 'absolute';
    dropdown.style.background = '#fff';
    dropdown.style.border = '1px solid #ccc';
    dropdown.style.padding = '8px';
    dropdown.style.borderRadius = '4px';
    dropdown.style.boxShadow = '0 2px 8px rgba(0,0,0,0.15)';
    dropdown.style.maxHeight = '240px';
    dropdown.style.overflowY = 'auto';
    dropdown.style.fontSize = '13px';
    dropdown.style.minWidth = '85px';
    dropdown.style.zIndex = '999';

    toggleButton.addEventListener('click', () => {
        dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
    });

    function checkRevision(revision, misses = 0, maxMisses = 10) {
        const url = `${baseUrl}/${revision}/_contents.json`;
        fetch(url, { method: 'HEAD' })
            .then((response) => {
                if (response.ok) {
                    const link = document.createElement('a');
                    link.href = url;
                    link.textContent = `Revision ${revision}`;
                    link.target = '_blank';
                    link.style.display = 'block';
                    link.style.color = '#007bff';
                    link.style.textDecoration = 'none';
                    link.style.margin = '6px 0';
                    link.style.padding = '4px 6px';
                    link.style.borderRadius = '3px';
                    link.addEventListener('mouseover', () => link.style.background = '#f0f0f0');
                    link.addEventListener('mouseout', () => link.style.background = 'transparent');
                    dropdown.appendChild(link);
                    checkRevision(revision + 1, 0, maxMisses);
                } else {
                    if (misses < maxMisses) {
                        checkRevision(revision + 1, misses + 1, maxMisses);
                    }
                }
            })
            .catch(() => {
                if (misses < maxMisses) {
                    checkRevision(revision + 1, misses + 1, maxMisses);
                }
            });
    }

    checkRevision(1, 0, 10);

    setTimeout(() => {
        if (dropdown.children.length === 0) {
            const msg = document.createElement('div');
            msg.textContent = 'No revisions found.';
            msg.style.color = '#666';
            dropdown.appendChild(msg);
        }
    }, 2000);

    const container = document.createElement('div');
    container.style.position = 'relative';
    container.appendChild(toggleButton);
    container.appendChild(dropdown);

    wrapper.appendChild(container);
    authorElement.parentNode.appendChild(wrapper);
})();
