// ==UserScript==
// @name         IMVU Product Not Found / Hidden Product Page Viewer
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Replaces 'Product Not Found' pages with a styled box using meta tag data (no cart/maturity).
// @author       heapsofjoy
// @match        https://www.imvu.com/shop/product.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/532947/IMVU%20Product%20Not%20Found%20%20Hidden%20Product%20Page%20Viewer.user.js
// @updateURL https://update.greasyfork.org/scripts/532947/IMVU%20Product%20Not%20Found%20%20Hidden%20Product%20Page%20Viewer.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Only run if the product-not-found box exists
    const productNotFoundBox = document.querySelector('#also h3');
    if (!productNotFoundBox || productNotFoundBox.textContent.trim() !== 'Product Not Found') return;

    // Get product ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('products_id') || 'unknown';

    // Get info from meta tags and title
    const productName = document.querySelector('meta[property="og:title"]')?.content || 'Unknown Product';
    const productImage = document.querySelector('meta[property="og:image"]')?.content ||
                         'https://webasset-akm.imvu.com/catalog/web_images/icon_no_image.gif';

    const titleMatch = document.title.match(/by\s(.+)$/i);
    const creatorName = titleMatch ? titleMatch[1].trim() : 'Unknown';

    // Create replacement product box
    const replacementBox = document.createElement('div');
    replacementBox.className = 'jello-box';
    replacementBox.id = 'product';

    replacementBox.innerHTML = `
        <div class="hd">
            <div class="bg">
                <h3>Product Information</h3>
            </div>
        </div>
        <div class="bd" style="overflow:visible">
            <div id="product-details">
                <div style="position:relative;float:left;margin-right:15px;">
                    <img id="product-image" src="${productImage}" width="100" height="80" alt="Product Image" style="border:1px solid #ccc;">
                </div>

                <h1 class="notranslate" style="margin-top: 0;">${productName}</h1>

                <h2>
                    By <a class="notranslate" href="/shop/web_search.php?keywords=${encodeURIComponent(creatorName)}&within=creator_name">${creatorName}</a>
                </h2>

                <div id="product-try" style="margin-top: 10px;">
                    <a id="try-on-link" href="imvu:DressUp?productId=${productId}">
                        <img height="26" width="62" src="/catalog/web_images/tryitminibutton_gold.gif" alt="Try It">
                    </a>
                    <a href="imvu:TakeOff?productId=${productId}">Remove</a>
                </div>

            <div id="product-links" style="margin-top: 10px;">
              <span class="links">
                <a href="https://www.imvu.com/shop/derivation_tree.php?products_id=${productId}" target="_blank">Derivation Tree</a> |
                <a href="javascript:void(0);">Add to wishlist</a> |
                <a href="javascript:void(0);">Add to giftlist</a> |
                <a href="javascript:void(0);">Gift</a> |
                <a href="/catalog/wishlist.php">My Wishlist</a> |
                <a href="/catalog/web_flag_product_new.php?products_id=${productId}">
                <img src="/common/img/icon_16px_flag_blue.png"><font style="text-decoration:underline">Flag</font>
                </a>
            </span>
        </div>


                <div id="product-disclaimer" style="margin-top: 15px;">
                    This product was not found in the catalog. It may have been removed or set to hidden by
                    <a class="notranslate" href="/shop/web_search.php?keywords=${encodeURIComponent(creatorName)}&within=creator_name">${creatorName}</a>.
                </div>
            </div>
        </div>
    `;

    // Replace the original box
    const originalBox = document.querySelector('.jello-box#also');
    if (originalBox) {
        originalBox.replaceWith(replacementBox);
    }
})();
