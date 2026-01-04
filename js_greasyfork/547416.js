// ==UserScript==
// @name         MattelB2B
// @namespace    http://tampermonkey.net/
// @version      2025-08-26
// @description  fetch catalogue and its product
// @author       You
// @match        https://mattelprod.my.site.com/MattelB2B/ccrz__ProductList*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=site.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/547416/MattelB2B.user.js
// @updateURL https://update.greasyfork.org/scripts/547416/MattelB2B.meta.js
// ==/UserScript==

(function () {
    'use strict';

    /** DOWNLOAD BUTTON */
    const columnElement = document.querySelector(".col-sm-3.cc_left_col")
    let downloadButton = document.createElement('button');
    downloadButton.innerText = 'Download Content';
    downloadButton.style.display = 'block';
    downloadButton.style.width = '100%';
    downloadButton.style.marginBottom = '20px';
    columnElement.insertBefore(downloadButton, columnElement.firstChild);

    /** LAST */
    let products = [];
    let lastRequestConfig = null;
    function jsonToCsv(items) {
        if (!items.length) return '';
        const headers = Object.keys(items[0]);
        const escape = (str) => `"${String(str).replace(/"/g, '""')}"`;
        const csvRows = [
            headers.join(','),
            ...items.map(row => headers.map(field => escape(row[field])).join(','))
        ];
        return csvRows.join('\r\n');
    }


    /** INJECTION */
    (async () => {
        const targetUrls = ['MattelB2B/apexremote'];

        const open = XMLHttpRequest.prototype.open;
        const send = XMLHttpRequest.prototype.send;

        XMLHttpRequest.prototype.open = function (method, url, ...rest) {
            this._intercepted = targetUrls.some(u => url.includes(u));
            this._url = url;
            this._method = method;
            return open.call(this, method, url, ...rest);
        };

        XMLHttpRequest.prototype.send = function (body) {
            if (this._intercepted) {
                console.log("💡 Intercepted XHR request:", this._url);

                this.addEventListener("load", function () {
                    let data = JSON.parse(this.responseText);

                    if (data[0].method == "findProducts") {
                        lastRequestConfig = {
                            method: this._method,
                            url: this._url,
                            body: body
                        };

                        console.log("✅ XHR response data:", data);
                    }
                });
            }
            return send.call(this, body);
        };
    })();

    downloadButton.addEventListener('click', async () => {
        // Show loading state
        downloadButton.disabled = true;
        const originalText = downloadButton.innerText;
        downloadButton.innerText = 'Loading...';

        if (lastRequestConfig) {
            const body = JSON.parse(lastRequestConfig.body)
            body.data[1] = JSON.stringify(Object.assign(JSON.parse(body.data[1]), { prodLimit: 10000 }))

            const response = await fetch(lastRequestConfig.url, {
                method: lastRequestConfig.method,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body)
            });

            const data = await response.json();

            if (data) {
                products = data[0].result.data.v.productList.v.map(product => {
                    return {
                        'SKU': product.v.SKU,
                        'NAME': product.v.sfdcName,
                        'PRICE': `$${product.v.price}`,
                        'BRAND': product.v.brand,
                        'QUANTITY': (product.v.productInventoryItemsS?.v?.[0]?.v?.qtyAvailable ?? 'None'),
                        'AVAILABLE FROM': Handlebars.helpers.getAvailabilityDates(product.v.SKU)  // eslint-disable-line
                    }
                })
            }
        }


        // Batch fetch product details in groups of 5
        const batchSize = 5;
        for (let i = 0; i < products.length; i += batchSize) {
            const batch = products.slice(i, i + batchSize);
            await Promise.all(batch.map(async (product, batchIndex) => {
                const globalIndex = i + batchIndex;
                downloadButton.innerText = `Loading... (${globalIndex + 1}/${products.length})`;
                const url = `https://mattelprod.my.site.com/MattelB2B/ccrz__ProductDetails?sku=${product.SKU}`;
                try {
                    const response = await fetch(url);
                    const html = await response.text();
                    const match = html.match(/CCRZ\.detailData\.jsonProductData\s*=\s*(\{[\s\S]*?\});/);
                    if (match && match[1]) {
                        const json = JSON.parse(match[1]);
                        products[globalIndex]['UPC'] = json.specifications?.["General"]?.find(x => x.name == "UPC")?.value || "N/A";
                        console.log("✅ Product Data from fetch:", json);
                    } else {
                        products[globalIndex]['UPC'] = "N/A";
                        console.log("⚠️ jsonProductData not found in HTML");
                    }
                } catch (err) {
                    products[globalIndex]['UPC'] = "N/A";
                    console.log("⚠️ Error fetching product details:", err);
                }
            }));
        }


        const csv = jsonToCsv(products);
        const csvBlob = new Blob([csv], { type: 'text/csv' });
        const csvUrl = URL.createObjectURL(csvBlob);
        const csvLink = document.createElement('a');
        csvLink.href = csvUrl;
        csvLink.download = 'mattel_portal.csv';
        document.body.appendChild(csvLink);
        csvLink.click();
        document.body.removeChild(csvLink);
        URL.revokeObjectURL(csvUrl);

        // Restore button state
        downloadButton.disabled = false;
        downloadButton.innerText = originalText;
    });

})();