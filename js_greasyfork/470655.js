// ==UserScript==
// @name         Open in Goodreads
// @namespace    open-in-goodreads
// @version      3.1
// @description  Adds a button to Amazon book pages to redirect to Goodreads page based on ASIN/ISBN
// @match        https://*.amazon.com/*
// @match        https://*.amazon.co.uk/*
// @match        https://*.amazon.com.au/*
// @match        https://*.amazon.com.be/*
// @match        https://*.amazon.com.br/*
// @match        https://*.amazon.ca/*
// @match        https://*.amazon.cn/*
// @match        https://*.amazon.eg/*
// @match        https://*.amazon.fr/*
// @match        https://*.amazon.de/*
// @match        https://*.amazon.in/*
// @match        https://*.amazon.it/*
// @match        https://*.amazon.co.jp/*
// @match        https://*.amazon.com.mx/*
// @match        https://*.amazon.nl/*
// @match        https://*.amazon.pl/*
// @match        https://*.amazon.sa/*
// @match        https://*.amazon.sg/*
// @match        https://*.amazon.es/*
// @match        https://*.amazon.se/*
// @match        https://*.amazon.com.tr/*
// @match        https://*.amazon.ae/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/470655/Open%20in%20Goodreads.user.js
// @updateURL https://update.greasyfork.org/scripts/470655/Open%20in%20Goodreads.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // ASIN/ISBN DETECTION = Checks for ASIN/ISBN
    function extractASIN() {
        let asinElements = document.getElementsByName('ASIN');
        if (asinElements.length === 0)
            asinElements = document.getElementsByName('ASIN.0');

        if (asinElements.length > 0)
            return asinElements[0].value || null;

        return null;
    }

    // REDIRECT LOGIC - Uses ASIN/ISBN to open book page on Goodreads
    function redirectToGoodreads() {
        const asin = extractASIN();

        if (!asin) {
            alert("No ASIN or ISBN Found.");
            return;
        }

        let goodreadsUrl;

        if (/^\d+$/.test(asin)) {
            // ISBN
            goodreadsUrl = `http://www.goodreads.com/review/isbn/${asin}`;
        } else {
            // ASIN fallback
            goodreadsUrl = `https://www.goodreads.com/book/isbn?isbn=${asin}`;
        }

        window.open(goodreadsUrl, '_blank');
    }

    // CHECK IF PAGE IS A BOOK
    function isBookPage() {
        const pubKeywords = [
            "Publication date", "Published", "Date de publication",
            "Veröffentlichungsdatum", "Fecha de publicación",
            "Data di pubblicazione", "出版日"
        ];

        const containers = [
            document.querySelector('#detailBullets_feature_div'),
            document.querySelector('#productDetailsTable'),
            ...document.querySelectorAll('.a-section.a-spacing-small')
        ].filter(Boolean);

        for (let container of containers) {
            const text = container.innerText;
            if (pubKeywords.some(keyword => text.includes(keyword))) {
                return true;
            }
        }

        return false;
    }

    // BUTTON INSERTION - Adds Goodreads Button after Book Cover
    function addButton() {
        if (document.getElementById('open-in-goodreads-btn')) return;

        const imageBlock =
            document.getElementById('imageBlockNew_feature_div') ||
            document.getElementById('booksImageBlock_feature_div') ||
            document.getElementById('imageBlock_feature_div');

        if (!imageBlock) return;

        // Only add button if this is a book
        if (!isBookPage()) return;

        const button = document.createElement('button');
        button.id = 'open-in-goodreads-btn';
        button.innerText = 'Open in Goodreads';
        button.style.cssText = `
            margin: 10px auto;
            display: block;
            color: #ffffff;
            background-color: #377458;
            border: none;
            border-radius: 4px;
            padding: 8px 12px;
            font-family: Arial, sans-serif;
            font-size: 14px;
            font-weight: bold;
            cursor: pointer;
        `;

        button.onclick = redirectToGoodreads;

        const wrapper = document.createElement('div');
        wrapper.style.textAlign = 'center';
        wrapper.appendChild(button);

        imageBlock.parentNode.insertBefore(wrapper, imageBlock.nextSibling);
    }

    // OBSERVER - Detects when the target elements are available and then stops observing once the button is added
    const observer = new MutationObserver(() => {
        const found =
            document.getElementById('imageBlock_feature_div') ||
            document.getElementById('imageBlockNew_feature_div') ||
            document.getElementById('booksImageBlock_feature_div');

        if (found) {
            addButton();
            observer.disconnect();
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();
