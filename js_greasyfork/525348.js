// ==UserScript==
// @name         Nautiljon EAN Barcode Generator
// @namespace    https://github.com/nitatemic
// @version      1.2
// @description  Génère automatiquement un code-barres pour l'EAN (ISBN) des mangas sur Nautiljon.
// @author       Nitatemic
// @license      GPL-3.0-only
// @match        https://www.nautiljon.com/mangas/*
// @require      https://cdn.jsdelivr.net/npm/jsbarcode@3.11.5/dist/JsBarcode.all.min.js
// @grant        GM_addStyle
// @homepageURL  https://github.com/nitatemic/Nautiljon-EAN-Barcode-Generator
// @supportURL   https://github.com/nitatemic/Nautiljon-EAN-Barcode-Generator/issues
// @downloadURL https://update.greasyfork.org/scripts/525348/Nautiljon%20EAN%20Barcode%20Generator.user.js
// @updateURL https://update.greasyfork.org/scripts/525348/Nautiljon%20EAN%20Barcode%20Generator.meta.js
// ==/UserScript==

(function () {
    'use strict';

    GM_addStyle(`
        #barcode-container {
            position: fixed;
            bottom: 20px;
            left: 20px;
            background: white;
            padding: 10px;
            border: 1px solid #ccc;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
            z-index: 9999;
        }
        #barcode-close {
            cursor: pointer;
            float: right;
            font-weight: bold;
            margin-left: 10px;
        }
    `);

    function extractEAN() {
        const isbnElement = document.querySelector('[itemprop="isbn"]');
        return isbnElement ? isbnElement.textContent.trim().replace(/[^0-9X]/gi, '') : null;
    }

    function createBarcode(eanCode) {
        const container = document.createElement('div');
        container.id = 'barcode-container';

        const closeButton = document.createElement('span');
        closeButton.id = 'barcode-close';
        closeButton.innerHTML = '×';
        closeButton.onclick = () => container.remove();

        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.id = 'barcode';

        container.appendChild(closeButton);
        container.appendChild(svg);
        document.body.appendChild(container);

        JsBarcode(svg, eanCode, {
            format: "EAN13",
            displayValue: true,
            fontSize: 12,
            margin: 5
        });
    }

    function init() {
        const eanCode = extractEAN();
        if (eanCode) {
            console.log('EAN trouvé:', eanCode);
            createBarcode(eanCode);
        }
    }

    window.addEventListener('load', init, false);
})();
