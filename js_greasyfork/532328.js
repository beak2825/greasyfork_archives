// ==UserScript==
// @name         Cuddlyoctopus Uncensored
// @namespace    http://flatkyubu.com/
// @version      2025-04-08-alpha-001
// @description  Reveal products on cuddlyoctopus.com that were hidden due to censorship, and preview mix-n-match products.
// @author       Flat Kyubu
// @match        https://cuddlyoctopus.com/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/532328/Cuddlyoctopus%20Uncensored.user.js
// @updateURL https://update.greasyfork.org/scripts/532328/Cuddlyoctopus%20Uncensored.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const CO_PAGELOADED_CHECK_REFRESH = 200;
    const CO_PAGELOADED_CHECK_TRIES = 5;

    function co_decensor_product()
    {
        // Add back the buttons to select the censored versions of the products on product pages
        // The buttons are not included on the server, so add them manually.

        let variants = JSON.parse(document.querySelector("form.variations_form")?.getAttribute("data-product_variations")??"[]");
        if (variants.length === 0) {
            return;
        }
        let productId = document.querySelector("form.variations_form").getAttribute('data-product_id');

        let variantHolderDOM = document.querySelector(".attribute-pa_variant").querySelector(".value");
        let existingVariantNames = Array.from(variantHolderDOM.querySelectorAll("div>input"), e => e.getAttribute('value'));
        variants.forEach(variantData => {
            let variantName = variantData.attributes.attribute_pa_variant;
            if (existingVariantNames.includes(variantName)) {
                return;
            }
            let newId = `pa_variant_v_${variantName}${productId}`;
            let newInput = Object.assign(document.createElement('input'), {
                'type': 'radio',
                'name': 'attribute_pa_variant',
                'value': variantName,
                'id': newId,
            });
            let newLabel = document.createElement('label');
            newLabel.setAttribute('for', newId);
            let newLabelText = document.createElement('span');
            newLabelText.innerText = `👁️‍🗨️ ${variantName}`;
            newLabel.appendChild(newLabelText);
            let newSelector = document.createElement('div');
            newSelector.appendChild(newInput);
            newSelector.appendChild(newLabel);
            variantHolderDOM.appendChild(newSelector);
        });
    }

    function co_inject_mixnmatch_styles() {
        GM_addStyle(`
        .co-mixnmatchplus-wrapper {
            float: left;
            position: relative;
        }
        .co-mixnmatchplus-originalimg {
            width: 100%;
            height: auto;
            max-width: 100%;
        }
    `);
    }


    function co_show_mixnmatch_cart(retries = 0)
    {
        let cartDOM = document.querySelector('.wc-block-cart-items');
        if (cartDOM == null) {
            if (retries < CO_PAGELOADED_CHECK_TRIES) {
                setTimeout(() => co_show_mixnmatch_cart(retries + 1), CO_PAGELOADED_CHECK_REFRESH);
            }
            return;
        }

        co_inject_mixnmatch_styles();
        let productsInCartDOM = document.querySelectorAll('.wc-block-cart-items__row');

        productsInCartDOM.forEach(productDOM => {
            let productName = productDOM.querySelector('.wc-block-components-product-name').innerText;
            if (productName !== 'Mix-and-Match') {
                return;
            }
            let productDetailsDOM = productDOM.querySelector('.wc-block-components-product-metadata');
            let side1skus = productDetailsDOM.querySelector(
                '.wc-block-components-product-details__side-1 .wc-block-components-product-details__value').innerText;
            let side2skus = productDetailsDOM.querySelector(
                '.wc-block-components-product-details__side-2 .wc-block-components-product-details__value').innerText;
            let side1uri = `https://cuddlyoctopus.com/wp-content/uploads/daki-thumbnails/${side1skus}.jpg`;
            let side2uri = `https://cuddlyoctopus.com/wp-content/uploads/daki-thumbnails/${side2skus}.jpg`;
            let productImageDOM = productDOM.querySelector('.wc-block-cart-item__image');

            let wrapperDOM = document.createElement('div');
            wrapperDOM.className = "co-mixnmatchplus-wrapper";
            let image1DOM = document.createElement('img');
            image1DOM.src = side1uri;
            image1DOM.classList.add('mix-preview', 'mix-a');
            let image2DOM = document.createElement('img');
            image2DOM.src = side2uri;
            image2DOM.classList.add('mix-preview', 'mix-b');
            let existingImageDOM = productImageDOM.querySelector('img');
            existingImageDOM.classList.add('co-mixnmatchplus-originalimg');

            wrapperDOM.appendChild(image2DOM);
            wrapperDOM.appendChild(image1DOM);
            wrapperDOM.appendChild(existingImageDOM);
            productImageDOM.appendChild(wrapperDOM);
        });
    }

    function co_show_mixnmatch_wishlist(retries=0)
    {
        let wishlistDOMcheck = document.querySelector('.wishlist_item');
        if (wishlistDOMcheck == null) {
            if (retries < CO_PAGELOADED_CHECK_TRIES) {
                setTimeout(() => co_show_mixnmatch_wishlist(retries+1), CO_PAGELOADED_CHECK_REFRESH);
            }
            return;
        }

        co_inject_mixnmatch_styles();
        let productsInCartDOM = document.querySelectorAll('.wishlist_item');

        productsInCartDOM.forEach(productDOM => {
            let productDetailsDOM = productDOM.querySelector('.product-name');
            if (productDetailsDOM.firstChild?.nodeValue?.trim() !== 'Mix-and-Match') {
                return;
            }
            let side1skus = productDetailsDOM.querySelector('dd.variation-mix-side-a').innerText;
            let side2skus = productDetailsDOM.querySelector('dd.variation-mix-side-b').innerText;
            let side1uri = `https://cuddlyoctopus.com/wp-content/uploads/daki-thumbnails/${side1skus}.jpg`;
            let side2uri = `https://cuddlyoctopus.com/wp-content/uploads/daki-thumbnails/${side2skus}.jpg`;
            let productImageDOM = productDOM.querySelector('.kw-prodimage');

            let wrapperDOM = document.createElement('div');
            wrapperDOM.className = "co-mixnmatchplus-wrapper";
            let image1DOM = document.createElement('img');
            image1DOM.src = side1uri;
            image1DOM.classList.add('mix-preview', 'mix-a');
            let image2DOM = document.createElement('img');
            image2DOM.src = side2uri;
            image2DOM.classList.add('mix-preview', 'mix-b');
            let existingImageDOM = productImageDOM.querySelector('img');
            existingImageDOM.classList.add('co-mixnmatchplus-originalimg');

            wrapperDOM.appendChild(image2DOM);
            wrapperDOM.appendChild(image1DOM);
            wrapperDOM.appendChild(existingImageDOM);
            productImageDOM.appendChild(wrapperDOM);
        });
    }

    function co_decensor_shop()
    {
        // Two concerns here:
        // 1. Show products that were unlisted completely as a result of censorship.
        //   Some products have been completely removed (thier original link now gives a 404), eg the original racing miku.
        //   However they are still accessible if saved to the wishlist.
        //   Similarly some blankets/tapestries are completely missing.
        // 2. Show the nsfw variants of products in the listing page when nsfw is turned on.

        // Currently, I don't see how to do either easily without making our own database.
        // Perhaps some JSON data embedded in this script would work.
    }


    function co_fix_mixnmatch_page()
    {
        // Two issues that need fixed:
        // 1. Some images don't load because they aren't available at the requested URLs on the server
        // 2. 'add to wishlist' is broken if you already have any mixnmatch added

        // Again we might need our own data lookup for (1), and more research is needed for (2).
    }

    function is_all_ages()
    {
        return document.querySelector('#sfwSwitcher .sfw-btn')?.classList?.contains('aa-on') ?? true;
    }

    function co_decensor()
    {
        if (!!location.href.startsWith("https://cuddlyoctopus.com/product/mix-and-match")) {
            co_fix_mixnmatch_page();
        }
        else if (!!location.href.startsWith("https://cuddlyoctopus.com/product")) {
            if (!is_all_ages()) {
                co_decensor_product();
            }
        }
        else if (!!location.href.startsWith("https://cuddlyoctopus.com/shop")) {
            if (!is_all_ages()) {
                co_decensor_shop();
            }
        }
        else if (!!location.href.startsWith("https://cuddlyoctopus.com/cart")) {
            co_show_mixnmatch_cart();
        }
        else if (!!location.href.startsWith("https://cuddlyoctopus.com/wishlist")) {
            co_show_mixnmatch_wishlist();
        }
    }

    co_decensor();
})();
