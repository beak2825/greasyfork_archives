// ==UserScript==
// @name         Tridmo Ripper
// @version      0.1
// @description  Tridmo Ripper (Download 3D Models and Interiors For Free)
// @author       hoosnick
// @license MIT
// @include      /^https:\/\/(www\.)?tridmo\.com\/.*/
// @run-at       document-end
// @grant        GM_xmlhttpRequest
// @grant        GM_openInTab
// @namespace https://greasyfork.org/users/1213259
// @downloadURL https://update.greasyfork.org/scripts/487624/Tridmo%20Ripper.user.js
// @updateURL https://update.greasyfork.org/scripts/487624/Tridmo%20Ripper.meta.js
// ==/UserScript==


(function () {
    'use strict';
    let bearerToken = '';

    // Function to process network responses
    function processNetworkResponse(response) {
        if (response.url.includes('https://api.tridmo.com/api/interiors/') && response.response) {
            addDownloadButtons();
        };
        if (response.url.includes('https://api.tridmo.com/api/models/') && response.response) {
            addDownloadButtons();
        };
        if (response.url.includes('https://api.tridmo.com/api/auth/signin') && response.response) {
            const data = JSON.parse(response.response);
            if (data.success && data.data && data.data.token && data.data.token.accessToken) {
                bearerToken = data.data.token.accessToken;
            }
        };
    }

    // MutationObserver API to wait for changes in the DOM
    function waitForElement(selector, callback) {
        const targetNode = document.body;
        const config = { childList: true, subtree: true };

        const observer = new MutationObserver((mutationsList, observer) => {
            for (const mutation of mutationsList) {
                if (mutation.type === 'childList') {
                    const elements = document.querySelectorAll(selector);
                    if (elements.length > 0) {
                        observer.disconnect();
                        callback(elements);
                        return;
                    }
                }
            }
        });

        observer.observe(targetNode, config);
    }

    // Function to add download button if product found
    function addDownloadButtons() {
        const selector = '.MuiGrid-item [href^="/interiors/"], .MuiGrid-item [href^="/products/"]';

        waitForElement(selector, (elements) => {
            console.log('Elements found:', elements);
            downloadButton(elements);
        });

    };

    // Function to extract slug from products and add download button
    function downloadButton(products) {
        products.forEach(product => {
            const parentDiv = product.closest('.MuiGrid-item');

            const href = product.getAttribute('href');
            const slugMatch = href.match(/\/(products|interiors)\/([^/]+)/);
            const category = slugMatch[1];
            const slug = slugMatch[2];

            const oldDownloadBtn = parentDiv.querySelector('button');
            const downloadBtn = document.createElement('button');

            downloadBtn.textContent = 'Download';
            downloadBtn.addEventListener('click', () => {productInfo(slug, category);});

            if (oldDownloadBtn) {
                oldDownloadBtn.remove();
            }
            parentDiv.appendChild(downloadBtn);
        });
    }

    // Function to get Bearer Token and set to global variable
    function getToken() {
        const data = JSON.stringify(
            {
                email: "ridadiw301@trackden.com",
                password: "PuE-W3W-jvC-Fz8"
            }
        );

        GM_xmlhttpRequest({
            method: 'POST',
            url: 'https://api.tridmo.com/api/auth/signin',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer null`,
                'X-Requested-With': 'XMLHttpRequest',
            },
            data: data,
            contentType: 'application/json',
            overrideMimeType: 'application/json',
            onload: function(response) {
                const responseData = JSON.parse(response.responseText);
                if (responseData.success) {
                    bearerToken = responseData.data.token.accessToken;
                }
            }
        });
    }

    // Function to get product info from API data
    function productInfo(slug, category) {
        GM_xmlhttpRequest({
            method: 'GET',
            url: `https://api.tridmo.com/api/products/${slug}?type=slug`,
            headers: {
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
            },
            contentType: 'application/json',
            overrideMimeType: 'application/json',
            onload: function(response) {
                const responseData = JSON.parse(response.responseText);
                if (responseData.success) {
                    downloadProduct(responseData.data.id);
                }
            }
        });
    }

    // Function to retrieve the download url and open it in new Tab
    function downloadProduct(productId) {
        const postUrl = `https://api.tridmo.com/api/products/download/${productId}`;
        const data = JSON.stringify({});

        GM_xmlhttpRequest({
            method: 'POST',
            url: postUrl,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${bearerToken}`,
                'X-Requested-With': 'XMLHttpRequest',
            },
            data: data,
            contentType: 'application/json',
            overrideMimeType: 'application/json',
            onload: function(response) {
                const responseData = JSON.parse(response.responseText);
                if (responseData.success) {
                    GM_openInTab(responseData.data.url);
                }
                else {
                    getToken();
                    downloadProduct(productId);
                }
            }
        });
    }

    // Intercept network responses
    const open = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(method, url) {
        this.addEventListener('loadend', function() {
            processNetworkResponse({
                url: url,
                response: this.responseText
            });
        });
        open.apply(this, arguments);
    };
})();
